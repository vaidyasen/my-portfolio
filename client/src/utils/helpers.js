/**
 * Utility functions for common operations
 * Follows Single Responsibility Principle
 */

/**
 * Format date to readable string
 * @param {string|Date} dateString
 * @param {Object} options
 */
export const formatDate = (dateString, options = {}) => {
  const defaultOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  };

  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", defaultOptions);
};

/**
 * Debounce function calls
 * @param {Function} func
 * @param {number} wait
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Validate email format
 * @param {string} email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Sanitize HTML content
 * @param {string} html
 */
export const sanitizeHtml = (html) => {
  const div = document.createElement("div");
  div.textContent = html;
  return div.innerHTML;
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substring(2);
};

/**
 * Deep clone object
 * @param {Object} obj
 */
export const deepClone = (obj) => {
  if (obj === null || obj === undefined) {
    return obj;
  }
  return JSON.parse(JSON.stringify(obj));
};

/**
 * Capitalize first letter of string
 * @param {string} str
 */
export const capitalize = (str) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

/**
 * Format array to comma-separated string
 * @param {Array} array
 * @param {string} conjunction
 */
export const formatArrayToString = (array, conjunction = "and") => {
  if (array.length === 0) return "";
  if (array.length === 1) return array[0];
  if (array.length === 2) return `${array[0]} ${conjunction} ${array[1]}`;

  const lastItem = array[array.length - 1];
  const otherItems = array.slice(0, -1).join(", ");
  return `${otherItems}, ${conjunction} ${lastItem}`;
};
