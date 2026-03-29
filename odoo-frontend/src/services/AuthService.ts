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
    const { data } = await apiClient.post<LoginResponse>("/auth/login", payload);
    console.log("Login Data : ", data);
    const token = localStorage.setItem("auth_token", data.token);
    const email = localStorage.setItem("auth_email", data.user.email);
    const role = localStorage.setItem("auth_role", data.role);
    const name = localStorage.setItem("auth_name", data.name);
    const userId = localStorage.setItem("userId", data.userId.toString());
    return data;
  }

  async logout(): Promise<void> {
    try {
      await apiClient.post("/auth/logout");
    } catch {
      // Silently fail - we clear local state regardless
    }
  }
}

export default new AuthService();
