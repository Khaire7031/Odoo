import apiClient from "./api";
import type { UserRole } from "@/contexts/AuthContext";

export interface CreateUserPayload {
  name: string;
  email: string;
  role: UserRole;
  managerId?: string;
}

class UserService {
  async getAll() {
    const { data } = await apiClient.get("/users");
    return data;
  }

  async create(payload: CreateUserPayload) {
    const { data } = await apiClient.post("/users", payload);
    return data;
  }

  async updateRole(userId: string, role: UserRole) {
    const { data } = await apiClient.patch(`/users/${userId}/role`, { role });
    return data;
  }

  async assignManager(userId: string, managerId: string) {
    const { data } = await apiClient.patch(`/users/${userId}/manager`, { managerId });
    return data;
  }
}

export default new UserService();
