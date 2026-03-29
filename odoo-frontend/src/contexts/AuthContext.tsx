import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";

export type UserRole = "admin" | "manager" | "employee";

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: AuthUser | null;
  login: (email: string, token: string, role?: UserRole, name?: string) => void;
  logout: () => void;
  isLoading: boolean;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    const email = localStorage.getItem("auth_email");
    const role = localStorage.getItem("auth_role") as UserRole | null;
    const name = localStorage.getItem("auth_name");
    if (token && email) {
      setUser({ email, role: role || "employee", name: name || email.split("@")[0] });
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, token: string, role: UserRole = "employee", name?: string) => {
    localStorage.setItem("auth_token", token);
    localStorage.setItem("auth_email", email);
    localStorage.setItem("auth_role", role);
    localStorage.setItem("auth_name", name || email.split("@")[0]);
    setUser({ email, role, name: name || email.split("@")[0] });
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("auth_email");
    localStorage.removeItem("auth_role");
    localStorage.removeItem("auth_name");
    setUser(null);
  }, []);

  const hasRole = useCallback((roles: UserRole[]) => {
    return !!user && roles.includes(user.role);
  }, [user]);

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout, isLoading, hasRole }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
