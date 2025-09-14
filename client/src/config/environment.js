/**
 * Environment configuration utility
 * Follows Single Responsibility Principle
 */

class Environment {
  constructor() {
    this.env = process.env.NODE_ENV || "development";
  }

  isDevelopment() {
    return this.env === "development";
  }

  isProduction() {
    return this.env === "production";
  }

  isTest() {
    return this.env === "test";
  }

  getApiUrl() {
    if (this.isProduction()) {
      return process.env.REACT_APP_API_URL || "https://api.yourdomain.com";
    }
    return process.env.REACT_APP_API_URL || "http://localhost:8080";
  }

  getFeatureFlags() {
    return {
      enableAnalytics: this.isProduction(),
      enableDebugMode: this.isDevelopment(),
      enableErrorTracking: this.isProduction(),
      enableServiceWorker: this.isProduction(),
    };
  }

  getLogLevel() {
    if (this.isProduction()) return "error";
    if (this.isTest()) return "silent";
    return "debug";
  }
}

export default new Environment();
