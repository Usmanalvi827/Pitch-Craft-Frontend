// handlers/auth.handler.js
import { loginAPI, registerAPI, logoutAPI } from "../api/auth.api";

export async function handleRegister({
  firstName,
  lastName,
  userName,
  email,
  password,
  confirmPassword,
}) {
  const data = await registerAPI({
    firstName,
    lastName,
    userName,
    email,
    password,
    confirmPassword,
  });
  return data;
}

export async function handleLogin({ email, password }) {
  const data = await loginAPI({
    email,
    password,
  });
  return data;
}

export async function handleLogout() {
  const data = await logoutAPI();
  return data;
}
