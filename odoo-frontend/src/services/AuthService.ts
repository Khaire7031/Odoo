import { UserRole } from "@/contexts/AuthContext";
import apiClient from "./api";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: { email: string };
  name: string;
  userId: number;
  role: UserRole;
}

class AuthService {
  async login(payload: LoginPayload): Promise<LoginResponse> {
    const { data } = await apiClient.post<LoginResponse>("/api/public/signin", payload);
    localStorage.setItem("auth_token", data.token);
    localStorage.setItem("auth_email", data.user.email);
    localStorage.setItem("auth_role", data.role);
    localStorage.setItem("auth_name", data.name);
    localStorage.setItem("userId", data.userId.toString());
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/api/public/logout");
    } catch {
    }
  }
}

export default new AuthService();
