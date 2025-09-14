/**
 * Authentication service following Single Responsibility Principle
 */
import ApiService from "./ApiService";

export class AuthService {
  async login(username, password) {
    const result = await ApiService.post("/auth/login", { username, password });

    if (result.success) {
      const { token, user } = result.data;
      localStorage.setItem("admin_token", token);
      return { success: true, user, token };
    }

    return result;
  }

  async logout() {
    localStorage.removeItem("admin_token");
    return { success: true };
  }

  isAuthenticated() {
    const token = localStorage.getItem("admin_token");
    return !!token;
  }

  getToken() {
    return localStorage.getItem("admin_token");
  }
}

export default new AuthService();
