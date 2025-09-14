/**
 * Centralized API service following dependency inversion principle
 * Provides abstraction layer for all API interactions
 */
import axios from "axios";
import { apiLogger } from "../utils/logger";

class ApiService {
  constructor(baseURL = process.env.REACT_APP_API_URL || "") {
    this.client = axios.create({
      baseURL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  setupInterceptors() {
    // Request interceptor for auth
    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(new Error(error))
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          localStorage.removeItem("admin_token");
          window.location.href = "/admin/login";
        }
        return Promise.reject(new Error(error.message));
      }
    );
  }

  // Generic request methods
  async get(endpoint, config = {}) {
    try {
      const response = await this.client.get(endpoint, config);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async post(endpoint, data, config = {}) {
    try {
      const response = await this.client.post(endpoint, data, config);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async put(endpoint, data, config = {}) {
    try {
      const response = await this.client.put(endpoint, data, config);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  async delete(endpoint, config = {}) {
    try {
      const response = await this.client.delete(endpoint, config);
      return { data: response.data, success: true };
    } catch (error) {
      return this.handleError(error);
    }
  }

  handleError(error) {
    const message =
      error.response?.data?.error || error.message || "An error occurred";
    apiLogger.error("API request failed", error);

    return {
      success: false,
      error: message,
      status: error.response?.status,
    };
  }
}

// Singleton instance
export default new ApiService();
