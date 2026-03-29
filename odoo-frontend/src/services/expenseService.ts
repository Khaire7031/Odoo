import apiClient from "./api";

export interface ExpensePayload {
  amount: number;
  currency: string;
  category: string;
  description: string;
  date: string;
  receipt?: File;
}

class ExpenseService {
  async getAll(id: number) {
    const { data } = await apiClient.get(`/expenses/${id}`);
    return data;
  }

  async getById(id: string) {
    const { data } = await apiClient.get(`/expenses/${id}`);
    return data;
  }

  async create(payload: ExpensePayload) {
    const { data } = await apiClient.post("/expenses", payload);
    return data;
  }

  async approve(id: string, comment?: string) {
    const { data } = await apiClient.patch(`/expenses/${id}/approve`, { comment });
    return data;
  }

  async reject(id: string, comment?: string) {
    const { data } = await apiClient.patch(`/expenses/${id}/reject`, { comment });
    return data;
  }
}

export default new ExpenseService();
