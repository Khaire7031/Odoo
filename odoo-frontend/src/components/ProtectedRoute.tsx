import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import Loader from "./Loader";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <Loader text="Checking authentication..." />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  return <>{children}</>;
};

export default ProtectedRoute;
