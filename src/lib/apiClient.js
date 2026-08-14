import axios from "axios";

export const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  timeout: 10000,
});

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// If a token refresh is already in flight, every other failed request waits
// on the same promise instead of firing its own refresh call. This matters
// most on the Dashboard, which fires off the user's info and the user's
// projects at almost the same time - without this, both would 401 and both
// would try to refresh separately.
let refreshPromise = null;

function refreshAccessToken() {
  if (!refreshPromise) {
    refreshPromise = api
      .post("api/auth/refresh-token")
      .then((res) => {
        const newAccessToken = res.data.accessToken;
        localStorage.setItem("accessToken", newAccessToken);
        return newAccessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }
  return refreshPromise;
}

// authUser middleware always responds with 401 for a missing, expired, or
// invalid access token - checking the status code alone is enough and is
// far more reliable than matching on the exact error message text.
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // refresh token is missing/expired/invalid - nothing left to do
        // but send the user back to login, once
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);