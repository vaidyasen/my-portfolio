/**
 * Application configuration constants
 * Follows Single Responsibility Principle
 */

export const API_CONFIG = {
  BASE_URL: process.env.REACT_APP_API_URL || "",
  TIMEOUT: 10000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

export const APP_CONFIG = {
  NAME: "Ritik Portfolio",
  VERSION: "1.0.0",
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 50,
  },
  VALIDATION: {
    MAX_FILE_SIZE: 5 * 1024 * 1024, // 5MB
    ALLOWED_IMAGE_TYPES: ["image/jpeg", "image/png", "image/webp"],
    MAX_MESSAGE_LENGTH: 1000,
    MIN_PASSWORD_LENGTH: 6,
  },
};

export const ANIMATION_CONFIG = {
  TYPING_SPEED: 100,
  TYPING_PAUSE: 2000,
  DELETE_SPEED: 50,
  TRANSITION_DURATION: 0.3,
  STAGGER_DELAY: 0.1,
};

export const THEME_CONFIG = {
  COLORS: {
    PRIMARY: "blue",
    SECONDARY: "purple",
    SUCCESS: "green",
    WARNING: "yellow",
    ERROR: "red",
  },
  BREAKPOINTS: {
    SM: "640px",
    MD: "768px",
    LG: "1024px",
    XL: "1280px",
  },
};

export const ROUTES = {
  HOME: "/",
  ABOUT: "/about",
  PROJECTS: "/projects",
  BLOG: "/blog",
  CONTACT: "/contact",
  ADMIN: {
    LOGIN: "/admin/login",
    DASHBOARD: "/admin/dashboard",
    PROJECTS: "/admin/projects",
    SKILLS: "/admin/skills",
    BLOG: "/admin/blog",
    CONTACTS: "/admin/contacts",
  },
};
