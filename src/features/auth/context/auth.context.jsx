import { createContext, useEffect, useState } from "react";
import { getMeAPI } from "../api/auth.api";

export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [loadingBtn, setLoadingBtn] = useState(false);
  const [loadingPage, setLoadingPage] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    async function rehydrateUser() {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        setUser(null);
        setLoadingPage(false);
        return;
      }
      try {
        const data = await getMeAPI();
        setUser(data);
      } catch (error) {
        localStorage.removeItem("accessToken");
        setUser(null);
      } finally {
        setLoadingPage(false);
      }
    }
    rehydrateUser();

    // 🔑 Expose setAccessToken globally for interceptor
    window.setAccessToken = (token) => {
      localStorage.setItem("accessToken", token);
      getMeAPI().then(setUser).catch(() => setUser(null));
    };
  }, []);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider
      value={{
        loadingBtn,
        setLoadingBtn,
        loadingPage,
        setLoadingPage,
        user,
        setUser,
        isAuthenticated,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
