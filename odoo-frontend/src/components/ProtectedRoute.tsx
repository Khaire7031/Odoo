import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "@/contexts/AuthContext";
import Loader from "./Loader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, hasRole } = useAuth();

  if (isLoading) return <Loader text="Checking authentication..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !hasRole(allowedRoles)) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
