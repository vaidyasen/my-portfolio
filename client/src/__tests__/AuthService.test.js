// Mock axios to prevent ApiService initialization issues
jest.mock("axios", () => ({
  create: jest.fn(),
  default: {
    create: jest.fn(),
  },
}));

// Mock logger
jest.mock("../utils/logger", () => ({
  apiLogger: {
    log: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock ApiService before importing
jest.mock("../services/ApiService");

import AuthService, {
  AuthService as AuthServiceClass,
} from "../services/AuthService";
import ApiService from "../services/ApiService";

const mockedApiService = ApiService;

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe("AuthService", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe("login", () => {
    it("should login successfully and store token", async () => {
      const mockResponse = {
        success: true,
        data: {
          token: "test-token",
          user: { id: 1, username: "testuser" },
        },
      };

      mockedApiService.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login("testuser", "password");

      expect(mockedApiService.post).toHaveBeenCalledWith("/auth/login", {
        username: "testuser",
        password: "password",
      });
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        "admin_token",
        "test-token"
      );
      expect(result).toEqual({
        success: true,
        user: { id: 1, username: "testuser" },
        token: "test-token",
      });
    });

    it("should handle login failure", async () => {
      const mockResponse = {
        success: false,
        error: "Invalid credentials",
      };

      mockedApiService.post.mockResolvedValue(mockResponse);

      const result = await AuthService.login("testuser", "wrongpassword");

      expect(mockedApiService.post).toHaveBeenCalledWith("/auth/login", {
        username: "testuser",
        password: "wrongpassword",
      });
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
      expect(result).toEqual(mockResponse);
    });
  });

  describe("logout", () => {
    it("should logout successfully and remove token", async () => {
      const result = await AuthService.logout();

      expect(localStorageMock.removeItem).toHaveBeenCalledWith("admin_token");
      expect(result).toEqual({ success: true });
    });
  });

  describe("isAuthenticated", () => {
    it("should return true when token exists", () => {
      localStorageMock.getItem.mockReturnValue("test-token");

      const result = AuthService.isAuthenticated();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("admin_token");
      expect(result).toBe(true);
    });

    it("should return false when token doesn't exist", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = AuthService.isAuthenticated();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("admin_token");
      expect(result).toBe(false);
    });

    it("should return false when token is empty string", () => {
      localStorageMock.getItem.mockReturnValue("");

      const result = AuthService.isAuthenticated();

      expect(result).toBe(false);
    });
  });

  describe("getToken", () => {
    it("should return token from localStorage", () => {
      const token = "test-token";
      localStorageMock.getItem.mockReturnValue(token);

      const result = AuthService.getToken();

      expect(localStorageMock.getItem).toHaveBeenCalledWith("admin_token");
      expect(result).toBe(token);
    });

    it("should return null when no token exists", () => {
      localStorageMock.getItem.mockReturnValue(null);

      const result = AuthService.getToken();

      expect(result).toBe(null);
    });
  });

  describe("AuthService class instantiation", () => {
    it("should be able to create new instance", () => {
      const authService = new AuthServiceClass();
      expect(authService).toBeInstanceOf(AuthServiceClass);
    });
  });
});
