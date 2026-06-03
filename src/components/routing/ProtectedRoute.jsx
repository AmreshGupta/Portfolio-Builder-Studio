import { Navigate, Outlet } from "react-router-dom";
import { clearAuthUser, getAuthUser } from "../../utils/authStorage";

export default function ProtectedRoute() {
  const authUser = getAuthUser();

  if (!authUser?.token) {
    clearAuthUser();
    return <Navigate to="/auth" replace />;
  }

  return <Outlet />;
}
