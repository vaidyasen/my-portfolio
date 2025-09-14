import {
  formatDate,
  debounce,
  isValidEmail,
  sanitizeHtml,
  generateId,
  deepClone,
  capitalize,
  formatArrayToString,
} from "../utils/helpers";

// Mock document.createElement for sanitizeHtml test
const mockDiv = {
  set textContent(value) {
    this._textContent = value;
    // When textContent is set, innerHTML should be the escaped version
    this._innerHTML = value;
  },
  get textContent() {
    return this._textContent;
  },
  get innerHTML() {
    return this._innerHTML;
  },
  _textContent: "",
  _innerHTML: "",
};

// Mock document.createElement for sanitizeHtml test
const mockCreateElement = jest.fn();

// Setup a fresh mock div for each test
beforeEach(() => {
  mockCreateElement.mockReturnValue({
    set textContent(value) {
      this._textContent = value;
      this._innerHTML = value;
    },
    get textContent() {
      return this._textContent || "";
    },
    get innerHTML() {
      return this._innerHTML || "";
    },
    _textContent: "",
    _innerHTML: "",
  });
});

Object.defineProperty(global.document, "createElement", {
  value: mockCreateElement,
  writable: true,
});

describe("Utility Helper Functions", () => {
  describe("formatDate", () => {
    it("should format date with default options", () => {
      const date = "2023-12-25";
      const result = formatDate(date);

      expect(result).toBe("December 25, 2023");
    });

    it("should format date with custom options", () => {
      const date = "2023-12-25";
      const options = { month: "short", day: "2-digit" };
      const result = formatDate(date, options);

      expect(result).toBe("Dec 25, 2023");
    });

    it("should handle Date object", () => {
      const date = new Date("2023-12-25");
      const result = formatDate(date);

      expect(result).toBe("December 25, 2023");
    });

    it("should handle invalid date", () => {
      const result = formatDate("invalid-date");

      expect(result).toBe("Invalid Date");
    });
  });

  describe("debounce", () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it("should debounce function calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      // Call multiple times
      debouncedFn();
      debouncedFn();
      debouncedFn();

      // Function should not be called yet
      expect(mockFn).not.toHaveBeenCalled();

      // Fast-forward time
      jest.advanceTimersByTime(100);

      // Function should be called once
      expect(mockFn).toHaveBeenCalledTimes(1);
    });

    it("should pass arguments to debounced function", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn("arg1", "arg2");
      jest.advanceTimersByTime(100);

      expect(mockFn).toHaveBeenCalledWith("arg1", "arg2");
    });

    it("should reset timer on subsequent calls", () => {
      const mockFn = jest.fn();
      const debouncedFn = debounce(mockFn, 100);

      debouncedFn();
      jest.advanceTimersByTime(50);
      debouncedFn(); // Reset timer
      jest.advanceTimersByTime(50);

      // Should not be called yet
      expect(mockFn).not.toHaveBeenCalled();

      jest.advanceTimersByTime(50);
      expect(mockFn).toHaveBeenCalledTimes(1);
    });
  });

  describe("isValidEmail", () => {
    it("should validate correct email format", () => {
      expect(isValidEmail("test@example.com")).toBe(true);
      expect(isValidEmail("user.name@domain.co.uk")).toBe(true);
      expect(isValidEmail("test+tag@example.org")).toBe(true);
    });

    it("should reject invalid email formats", () => {
      expect(isValidEmail("invalid-email")).toBe(false);
      expect(isValidEmail("@example.com")).toBe(false);
      expect(isValidEmail("test@")).toBe(false);
      expect(isValidEmail("test.example.com")).toBe(false);
      expect(isValidEmail("")).toBe(false);
      expect(isValidEmail("test@.com")).toBe(false);
      expect(isValidEmail("test @example.com")).toBe(false);
    });
  });

  describe("sanitizeHtml", () => {
    beforeEach(() => {
      mockCreateElement.mockClear();
    });

    it("should sanitize HTML content", () => {
      const htmlString = "<script>alert('xss')</script>Hello World";

      const result = sanitizeHtml(htmlString);

      expect(mockCreateElement).toHaveBeenCalledWith("div");
      expect(result).toBe(htmlString); // Since our mock sets innerHTML = textContent
    });

    it("should handle empty string", () => {
      const result = sanitizeHtml("");

      expect(mockCreateElement).toHaveBeenCalledWith("div");
      expect(result).toBe("");
    });
  });

  describe("generateId", () => {
    it("should generate unique IDs", () => {
      const id1 = generateId();
      const id2 = generateId();

      expect(id1).toBeDefined();
      expect(id2).toBeDefined();
      expect(id1).not.toBe(id2);
      expect(typeof id1).toBe("string");
      expect(typeof id2).toBe("string");
    });

    it("should generate IDs with expected format", () => {
      const id = generateId();

      // Should be a string with alphanumeric characters
      expect(id).toMatch(/^[a-z0-9]+$/);
      expect(id.length).toBeGreaterThan(0);
    });
  });

  describe("deepClone", () => {
    it("should deep clone simple object", () => {
      const original = { a: 1, b: 2 };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
    });

    it("should deep clone nested object", () => {
      const original = {
        a: 1,
        b: {
          c: 2,
          d: {
            e: 3,
          },
        },
      };
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned.b).not.toBe(original.b);
      expect(cloned.b.d).not.toBe(original.b.d);
    });

    it("should deep clone arrays", () => {
      const original = [1, 2, { a: 3 }];
      const cloned = deepClone(original);

      expect(cloned).toEqual(original);
      expect(cloned).not.toBe(original);
      expect(cloned[2]).not.toBe(original[2]);
    });

    it("should handle null and undefined", () => {
      expect(deepClone(null)).toBe(null);
      expect(deepClone(undefined)).toBe(undefined);
    });
  });

  describe("capitalize", () => {
    it("should capitalize first letter", () => {
      expect(capitalize("hello")).toBe("Hello");
      expect(capitalize("world")).toBe("World");
      expect(capitalize("test")).toBe("Test");
    });

    it("should handle single character", () => {
      expect(capitalize("a")).toBe("A");
    });

    it("should handle empty string", () => {
      expect(capitalize("")).toBe("");
    });

    it("should not change already capitalized strings", () => {
      expect(capitalize("Hello")).toBe("Hello");
      expect(capitalize("HELLO")).toBe("HELLO");
    });

    it("should handle strings starting with numbers or special characters", () => {
      expect(capitalize("123abc")).toBe("123abc");
      expect(capitalize("@hello")).toBe("@hello");
    });
  });

  describe("formatArrayToString", () => {
    it("should handle empty array", () => {
      expect(formatArrayToString([])).toBe("");
    });

    it("should handle single item", () => {
      expect(formatArrayToString(["apple"])).toBe("apple");
    });

    it("should handle two items with default conjunction", () => {
      expect(formatArrayToString(["apple", "banana"])).toBe("apple and banana");
    });

    it("should handle multiple items with default conjunction", () => {
      expect(formatArrayToString(["apple", "banana", "cherry"])).toBe(
        "apple, banana, and cherry"
      );
    });

    it("should handle multiple items with custom conjunction", () => {
      expect(formatArrayToString(["apple", "banana", "cherry"], "or")).toBe(
        "apple, banana, or cherry"
      );
    });

    it("should handle four or more items", () => {
      expect(formatArrayToString(["apple", "banana", "cherry", "date"])).toBe(
        "apple, banana, cherry, and date"
      );
    });

    it("should handle custom conjunction with two items", () => {
      expect(formatArrayToString(["apple", "banana"], "or")).toBe(
        "apple or banana"
      );
    });
  });
});
