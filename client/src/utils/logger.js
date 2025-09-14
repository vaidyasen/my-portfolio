/**
 * Logger utility following Single Responsibility Principle
 */

class Logger {
  constructor(context = "App") {
    this.context = context;
    this.isDevelopment = process.env.NODE_ENV === "development";
  }

  formatMessage(level, message) {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}] [${this.context}]`;
    return `${prefix} ${message}`;
  }

  info(message, data = null) {
    if (this.isDevelopment) {
      if (data) {
        console.info(this.formatMessage("info", message), data);
      } else {
        console.info(this.formatMessage("info", message));
      }
    }
  }

  warn(message, data = null) {
    if (data) {
      console.warn(this.formatMessage("warn", message), data);
    } else {
      console.warn(this.formatMessage("warn", message));
    }
  }

  error(message, error = null) {
    const errorData = error
      ? {
          message: error.message,
          stack: error.stack,
          ...(error.response && { response: error.response.data }),
        }
      : null;

    console.error(this.formatMessage("error", message), errorData);

    // In production, you might want to send this to an error tracking service
    if (!this.isDevelopment && typeof window !== "undefined") {
      // Example: Send to error tracking service
      // errorTrackingService.captureError(message, errorData);
    }
  }

  debug(message, data = null) {
    if (this.isDevelopment) {
      if (data) {
        console.debug(this.formatMessage("debug", message), data);
      } else {
        console.debug(this.formatMessage("debug", message));
      }
    }
  }
}

// Create logger instances for different contexts
export const apiLogger = new Logger("API");
export const uiLogger = new Logger("UI");
export const authLogger = new Logger("AUTH");

export default Logger;
