import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

function AccessLoading({ children = "Checking your account..." }) {
  return <div className="grid min-h-screen place-items-center bg-[#0c0b12] text-sm text-[#9995a8]">{children}</div>;
}

export default function ProtectedRoute() {
  const { user, loading } = useAuth();
  const location = useLocation();
  if (loading) return <AccessLoading />;
  return user ? <Outlet /> : <Navigate to="/login" state={{ from: location }} replace />;
}

export function SpecialistRoute({ specialist }) {
  const { user, loading } = useAuth();
  if (loading) return <AccessLoading>Checking your AI access...</AccessLoading>;
  return user?.specialists?.includes(specialist) ? <Outlet /> : <Navigate to="/workspace" replace />;
}

export function AdminRoute() {
  const { user, loading } = useAuth();
  if (loading) return <AccessLoading>Checking administrator access...</AccessLoading>;
  return user?.is_admin ? <Outlet /> : <Navigate to="/workspace" replace />;
}
