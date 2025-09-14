import axios from "axios";

// Mock axios before importing ApiService
jest.mock("axios", () => {
  const mockAxiosInstance = {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    interceptors: {
      request: {
        use: jest.fn(),
      },
      response: {
        use: jest.fn(),
      },
    },
  };

  return {
    create: jest.fn(() => mockAxiosInstance),
    default: {
      create: jest.fn(() => mockAxiosInstance),
    },
  };
});

// Mock logger to avoid import issues
jest.mock("../utils/logger", () => ({
  apiLogger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

import ApiService from "../services/ApiService";

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock window.location
delete window.location;
window.location = { href: "" };

describe("ApiService", () => {
  let apiService;
  let mockAxiosInstance;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Reset localStorage mock
    localStorageMock.getItem.mockReturnValue(null);

    // Get the singleton ApiService instance
    apiService = ApiService;

    // Get the mock axios instance
    mockAxiosInstance = axios.create.mock.results[0].value;
  });

  describe("constructor", () => {
    it("should create axios instance with default config", () => {
      expect(axios.create).toHaveBeenCalledWith({
        baseURL: "",
        timeout: 10000,
      });
    });

    it("should setup interceptors", () => {
      expect(mockAxiosInstance.interceptors.request.use).toHaveBeenCalled();
      expect(mockAxiosInstance.interceptors.response.use).toHaveBeenCalled();
    });
  });

  describe("request interceptor", () => {
    let requestInterceptor;

    beforeEach(() => {
      // Get the request interceptor function
      requestInterceptor =
        mockAxiosInstance.interceptors.request.use.mock.calls[0][0];
    });

    it("should add Authorization header when token exists", () => {
      const mockToken = "test-token";
      localStorageMock.getItem.mockReturnValue(mockToken);

      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(localStorageMock.getItem).toHaveBeenCalledWith("admin_token");
      expect(result.headers.Authorization).toBe(`Bearer ${mockToken}`);
    });

    it("should not add Authorization header when token doesn't exist", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const config = { headers: {} };
      const result = requestInterceptor(config);

      expect(result.headers.Authorization).toBeUndefined();
    });
  });

  describe("response interceptor", () => {
    let responseInterceptor;
    let errorHandler;

    beforeEach(() => {
      // Get the response interceptor functions
      const interceptorCall =
        mockAxiosInstance.interceptors.response.use.mock.calls[0];
      responseInterceptor = interceptorCall[0];
      errorHandler = interceptorCall[1];
    });

    it("should pass through successful responses", () => {
      const response = { data: { test: "data" } };
      const result = responseInterceptor(response);
      expect(result).toBe(response);
    });

    it("should redirect to login on 401 error", () => {
      const error = {
        response: { status: 401 },
      };

      // Mock window.location assignment
      const originalLocation = window.location;
      delete window.location;
      window.location = { href: "" };

      errorHandler(error);

      expect(window.location.href).toBe("/admin/login");

      // Restore original location
      window.location = originalLocation;
    });

    it("should reject non-401 errors", () => {
      const error = {
        response: { status: 500 },
      };

      expect(() => errorHandler(error)).toThrow();
    });
  });

  describe("HTTP methods", () => {
    describe("get", () => {
      it("should make GET request and return success response", async () => {
        const mockData = { id: 1, name: "test" };
        mockAxiosInstance.get.mockResolvedValue({ data: mockData });

        const result = await apiService.get("/test");

        expect(mockAxiosInstance.get).toHaveBeenCalledWith("/test", {});
        expect(result).toEqual({ data: mockData, success: true });
      });

      it("should handle errors and return error response", async () => {
        const error = new Error("Network Error");
        mockAxiosInstance.get.mockRejectedValue(error);

        // Mock the handleError method
        const mockErrorResponse = { success: false, error: "Network Error" };
        jest
          .spyOn(apiService, "handleError")
          .mockReturnValue(mockErrorResponse);

        const result = await apiService.get("/test");

        expect(result).toBe(mockErrorResponse);
        expect(apiService.handleError).toHaveBeenCalledWith(error);
      });
    });

    describe("post", () => {
      it("should make POST request with data", async () => {
        const mockData = { id: 1, name: "created" };
        const postData = { name: "test" };
        mockAxiosInstance.post.mockResolvedValue({ data: mockData });

        const result = await apiService.post("/test", postData);

        expect(mockAxiosInstance.post).toHaveBeenCalledWith(
          "/test",
          postData,
          {}
        );
        expect(result).toEqual({ data: mockData, success: true });
      });
    });

    describe("put", () => {
      it("should make PUT request with data", async () => {
        const mockData = { id: 1, name: "updated" };
        const putData = { name: "test" };
        mockAxiosInstance.put.mockResolvedValue({ data: mockData });

        const result = await apiService.put("/test/1", putData);

        expect(mockAxiosInstance.put).toHaveBeenCalledWith(
          "/test/1",
          putData,
          {}
        );
        expect(result).toEqual({ data: mockData, success: true });
      });
    });

    describe("delete", () => {
      it("should make DELETE request", async () => {
        const mockData = { success: true };
        mockAxiosInstance.delete.mockResolvedValue({ data: mockData });

        const result = await apiService.delete("/test/1");

        expect(mockAxiosInstance.delete).toHaveBeenCalledWith("/test/1", {});
        expect(result).toEqual({ data: mockData, success: true });
      });
    });
  });

  describe("error handling", () => {
    it("should handle network errors", () => {
      const error = new Error("Network Error");
      const result = apiService.handleError(error);

      expect(result).toEqual({
        success: false,
        error: "Network Error",
        status: undefined,
      });
    });

    it("should handle HTTP errors with response", () => {
      const error = {
        response: {
          status: 404,
          data: { message: "Not Found" },
        },
      };

      const result = apiService.handleError(error);

      expect(result).toEqual({
        success: false,
        error: "Not Found",
        status: 404,
      });
    });

    it("should handle HTTP errors without message", () => {
      const error = {
        response: {
          status: 500,
          data: {},
        },
      };

      const result = apiService.handleError(error);

      expect(result).toEqual({
        success: false,
        error: "Request failed with status 500",
        status: 500,
      });
    });
  });
});
