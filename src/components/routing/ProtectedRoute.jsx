import { Navigate, Outlet } from "react-router-dom";
import { getAuthUser } from "../../utils/authStorage";

export default function ProtectedRoute() {
  return getAuthUser() ? <Outlet /> : <Navigate to="/auth" replace />;
}
