import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import ContactForm from "../components/ContactForm";
import { schemas } from "../utils/validation";
import { useAsyncOperation } from "../hooks/useApiData";

// Mock the validation schemas
jest.mock("../utils/validation", () => ({
  schemas: {
    contact: {
      validate: jest.fn(),
    },
  },
}));

// Mock the useAsyncOperation hook
jest.mock("../hooks/useApiData", () => ({
  useAsyncOperation: jest.fn(),
}));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    form: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <form {...props}>{children}</form>,
    div: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <button {...props}>{children}</button>,
    p: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <p {...props}>{children}</p>,
    input: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <input {...props}>{children}</input>,
    textarea: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <textarea {...props}>{children}</textarea>,
    label: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      ...props
    }) => <label {...props}>{children}</label>,
  },
}));

// Mock Loading component
jest.mock("../components/Loading", () => ({
  LoadingSpinner: () => <div data-testid="loading-spinner">Loading...</div>,
}));

describe("ContactForm", () => {
  const mockExecute = jest.fn();
  const mockOnSubmit = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock implementation for useAsyncOperation
    useAsyncOperation.mockReturnValue({
      execute: mockExecute,
      loading: false,
      error: null,
    });

    // Default mock implementation for validation
    schemas.contact.validate.mockReturnValue({
      isValid: true,
      errors: {},
    });
  });

  it("should render form fields", () => {
    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  it("should update form data when user types", async () => {
    const user = userEvent.setup();
    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Hello world");

    expect(nameInput).toHaveValue("John Doe");
    expect(emailInput).toHaveValue("john@example.com");
    expect(messageInput).toHaveValue("Hello world");
  });

  it("should validate form on submit", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({
      success: false,
      error: "Validation failed",
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(schemas.contact.validate).toHaveBeenCalledWith({
      name: "",
      email: "",
      message: "",
    });
  });

  it("should display validation errors", async () => {
    const user = userEvent.setup();
    const mockErrors = {
      name: "Name is required",
      email: "Email is invalid",
    };

    schemas.contact.validate.mockReturnValue({
      isValid: false,
      errors: mockErrors,
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Email is invalid")).toBeInTheDocument();
  });

  it("should clear validation error when user starts typing", async () => {
    const user = userEvent.setup();
    const mockErrors = {
      name: "Name is required",
    };

    // First submission with validation errors
    schemas.contact.validate.mockReturnValueOnce({
      isValid: false,
      errors: mockErrors,
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const submitButton = screen.getByRole("button", { name: /send message/i });
    const nameInput = screen.getByLabelText(/name/i);

    // Submit form to trigger validation errors
    await user.click(submitButton);
    expect(screen.getByText("Name is required")).toBeInTheDocument();

    // Start typing to clear error
    await user.type(nameInput, "John");
    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
  });

  it("should submit form with valid data", async () => {
    const user = userEvent.setup();
    const formData = {
      name: "John Doe",
      email: "john@example.com",
      message: "Hello world",
    };

    // Mock execute to call the function passed to it and return success
    mockExecute.mockImplementation(async (fn) => {
      await fn();
      return { success: true };
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill form
    await user.type(screen.getByLabelText(/name/i), formData.name);
    await user.type(screen.getByLabelText(/email/i), formData.email);
    await user.type(screen.getByLabelText(/message/i), formData.message);

    // Submit form
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(mockExecute).toHaveBeenCalledWith(expect.any(Function));
    expect(mockOnSubmit).toHaveBeenCalledWith(formData);
  });

  it("should show loading state during submission", () => {
    useAsyncOperation.mockReturnValue({
      execute: mockExecute,
      loading: true,
      error: null,
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(screen.getByTestId("loading-spinner")).toBeInTheDocument();
    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should display submit error", () => {
    const errorMessage = "Failed to send message";
    useAsyncOperation.mockReturnValue({
      execute: mockExecute,
      loading: false,
      error: errorMessage,
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    expect(screen.getByText(errorMessage)).toBeInTheDocument();
  });

  it("should show success message after successful submission", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({ success: true });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/message sent successfully/i)
      ).toBeInTheDocument();
    });
  });

  it("should reset form after successful submission", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({ success: true });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const messageInput = screen.getByLabelText(/message/i);

    // Fill form
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(messageInput, "Hello world");

    // Submit form
    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    await waitFor(() => {
      expect(nameInput).toHaveValue("");
      expect(emailInput).toHaveValue("");
      expect(messageInput).toHaveValue("");
    });
  });

  it("should handle form submission failure", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({
      success: false,
      error: "Submission failed",
    });

    render(<ContactForm onSubmit={mockOnSubmit} />);

    // Fill and submit form
    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    // Form should not reset on failure
    expect(screen.getByLabelText(/name/i)).toHaveValue("John Doe");
    expect(screen.getByLabelText(/email/i)).toHaveValue("john@example.com");
    expect(screen.getByLabelText(/message/i)).toHaveValue("Hello world");
  });

  it("should not call onSubmit if not provided", async () => {
    const user = userEvent.setup();
    mockExecute.mockResolvedValue({ success: true });

    render(<ContactForm />);

    await user.type(screen.getByLabelText(/name/i), "John Doe");
    await user.type(screen.getByLabelText(/email/i), "john@example.com");
    await user.type(screen.getByLabelText(/message/i), "Hello world");

    const submitButton = screen.getByRole("button", { name: /send message/i });
    await user.click(submitButton);

    expect(mockExecute).toHaveBeenCalled();
    // No error should be thrown
  });
});
