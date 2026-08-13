// api/auth.api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/",
  withCredentials: true,
  // timeout: 10000,
});
export async function registerAPI({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
}) {
  const response = await api.post("api/auth/register", {
    firstname: firstName,
    lastname: lastName,
    username: userName,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
  });

  return response.data;
}

export async function loginAPI({ email, password }) {
  const response = await api.post("api/auth/login", {
    email,
    password,
  });

  const { accessToken } = response.data;
  localStorage.setItem("accessToken", accessToken);

  return response.data;
}

export async function logoutAPI() {
  const response = await api.post("api/auth/logout");
  return response.data;
}

export async function getMeAPI() {
  const response = await api.get("api/auth/get-me");
  return response.data;
}

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only refresh if token expired
    if (
      error.response?.status === 401 &&
      error.response?.data?.message === "Access token expired" &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
