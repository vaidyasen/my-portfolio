/**
 * Validation utilities following Single Responsibility Principle
 */

export class ValidationError extends Error {
  constructor(message, field) {
    super(message);
    this.name = "ValidationError";
    this.field = field;
  }
}

export const validators = {
  required: (value, fieldName) => {
    if (!value || (typeof value === "string" && value.trim() === "")) {
      throw new ValidationError(`${fieldName} is required`, fieldName);
    }
    return true;
  },

  email: (value, fieldName = "Email") => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      throw new ValidationError(
        `${fieldName} must be a valid email address`,
        fieldName
      );
    }
    return true;
  },

  minLength: (minLength) => (value, fieldName) => {
    if (value && value.length < minLength) {
      throw new ValidationError(
        `${fieldName} must be at least ${minLength} characters long`,
        fieldName
      );
    }
    return true;
  },

  maxLength: (maxLength) => (value, fieldName) => {
    if (value && value.length > maxLength) {
      throw new ValidationError(
        `${fieldName} must be no more than ${maxLength} characters long`,
        fieldName
      );
    }
    return true;
  },

  url: (value, fieldName = "URL") => {
    try {
      if (value) {
        new URL(value);
      }
      return true;
    } catch {
      throw new ValidationError(`${fieldName} must be a valid URL`, fieldName);
    }
  },

  array: (value, fieldName = "Array") => {
    if (value && !Array.isArray(value)) {
      throw new ValidationError(`${fieldName} must be an array`, fieldName);
    }
    return true;
  },
};

export class Validator {
  constructor(schema) {
    this.schema = schema;
  }

  validate(data) {
    const errors = {};
    let isValid = true;

    for (const [field, rules] of Object.entries(this.schema)) {
      try {
        const value = data[field];

        for (const rule of rules) {
          rule(value, field);
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          errors[field] = error.message;
          isValid = false;
        } else {
          throw error;
        }
      }
    }

    return {
      isValid,
      errors,
    };
  }
}

// Pre-defined schemas
export const schemas = {
  contact: new Validator({
    name: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(100),
    ],
    email: [validators.required, validators.email],
    message: [
      validators.required,
      validators.minLength(10),
      validators.maxLength(1000),
    ],
  }),

  project: new Validator({
    title: [
      validators.required,
      validators.minLength(3),
      validators.maxLength(100),
    ],
    description: [
      validators.required,
      validators.minLength(10),
      validators.maxLength(500),
    ],
    technologies: [validators.required, validators.array],
    github: [validators.url],
    live: [validators.url],
  }),

  skill: new Validator({
    name: [
      validators.required,
      validators.minLength(2),
      validators.maxLength(50),
    ],
    category: [validators.required],
    level: [validators.required],
  }),

  auth: new Validator({
    username: [
      validators.required,
      validators.minLength(3),
      validators.maxLength(50),
    ],
    password: [validators.required, validators.minLength(6)],
  }),
};
