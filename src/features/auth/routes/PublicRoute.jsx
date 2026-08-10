import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../context/auth.context";

export default function PublicRoute() {
  const { user } = useContext(AuthContext);

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
