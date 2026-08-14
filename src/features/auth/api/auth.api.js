// api/auth.api.js
import { api } from "../../../lib/apiClient";

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