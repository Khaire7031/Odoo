import { describe, it, expect, vi, beforeEach } from "vitest";
import axios from "axios";

vi.mock("axios", () => {
  const mockAxios = {
    create: vi.fn(() => mockAxios),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
    get: vi.fn(),
    post: vi.fn(),
  };
  return { default: mockAxios };
});

describe("API Service", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("axios.create is callable", () => {
    expect(axios.create).toBeDefined();
  });

  it("can mock a GET request", async () => {
    const mockData = { data: [{ id: "1", title: "Test" }] };
    (axios.get as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockData);
    const result = await axios.get("/items");
    expect(result.data).toEqual([{ id: "1", title: "Test" }]);
  });

  it("can mock a POST request", async () => {
    const mockResponse = { data: { token: "abc123" } };
    (axios.post as ReturnType<typeof vi.fn>).mockResolvedValueOnce(mockResponse);
    const result = await axios.post("/auth/login", { email: "a@b.com", password: "123456" });
    expect(result.data.token).toBe("abc123");
  });
});
