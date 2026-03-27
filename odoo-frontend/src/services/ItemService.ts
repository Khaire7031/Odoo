import apiClient from "./api";

export interface Item {
  id: string;
  title: string;
  description: string;
}

class ItemService {
  async getAll(): Promise<Item[]> {
    const { data } = await apiClient.get<Item[]>("/items");
    return data;
  }

  async getById(id: string): Promise<Item> {
    const { data } = await apiClient.get<Item>(`/items/${id}`);
    return data;
  }

  async create(item: Omit<Item, "id">): Promise<Item> {
    const { data } = await apiClient.post<Item>("/items", item);
    return data;
  }
}

export default new ItemService();
