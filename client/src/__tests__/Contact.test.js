import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import Contact from "../pages/Contact";

jest.mock("axios");
const mockedAxios = axios;

describe("Contact Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders contact form", () => {
    render(<Contact />);

    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/subject/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/message/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /send message/i })
    ).toBeInTheDocument();
  });

  test("validates required fields", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Try to submit empty form
    await user.click(submitButton);

    // Check for validation messages
    await waitFor(() => {
      expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      expect(screen.getByText(/email is required/i)).toBeInTheDocument();
      expect(screen.getByText(/subject is required/i)).toBeInTheDocument();
      expect(screen.getByText(/message is required/i)).toBeInTheDocument();
    });
  });

  test("validates email format", async () => {
    const user = userEvent.setup();
    render(<Contact />);

    const emailInput = screen.getByLabelText(/email/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Enter invalid email
    await user.type(emailInput, "invalid-email");
    await user.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/please enter a valid email/i)
      ).toBeInTheDocument();
    });
  });

  test("submits form with valid data", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "Message received successfully" },
    });

    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Fill form with valid data
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "Test message content");

    await user.click(submitButton);

    await waitFor(() => {
      expect(mockedAxios.post).toHaveBeenCalledWith("/api/contact", {
        name: "John Doe",
        email: "john@example.com",
        subject: "Test Subject",
        message: "Test message content",
      });
    });

    await waitFor(() => {
      expect(
        screen.getByText(/message sent successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("handles form submission error", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockRejectedValueOnce(new Error("Network Error"));

    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Fill form with valid data
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "Test message content");

    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
    });

    consoleSpy.mockRestore();
  });

  test("disables submit button while sending", async () => {
    const user = userEvent.setup();
    // Mock a delayed response
    mockedAxios.post.mockImplementation(() =>
      Promise.resolve({ data: { message: "Message received successfully" } })
    );

    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Fill form
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "Test message content");

    await user.click(submitButton);

    // Button should be disabled while sending
    expect(submitButton).toBeDisabled();
    expect(screen.getByText(/sending/i)).toBeInTheDocument();

    // Wait for completion
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  test("clears form after successful submission", async () => {
    const user = userEvent.setup();
    mockedAxios.post.mockResolvedValueOnce({
      data: { message: "Message received successfully" },
    });

    render(<Contact />);

    const nameInput = screen.getByLabelText(/name/i);
    const emailInput = screen.getByLabelText(/email/i);
    const subjectInput = screen.getByLabelText(/subject/i);
    const messageInput = screen.getByLabelText(/message/i);
    const submitButton = screen.getByRole("button", { name: /send message/i });

    // Fill and submit form
    await user.type(nameInput, "John Doe");
    await user.type(emailInput, "john@example.com");
    await user.type(subjectInput, "Test Subject");
    await user.type(messageInput, "Test message content");

    await user.click(submitButton);

    // Wait for success message and form reset
    await waitFor(() => {
      expect(nameInput.value).toBe("");
      expect(emailInput.value).toBe("");
      expect(subjectInput.value).toBe("");
      expect(messageInput.value).toBe("");
    });
  });
});
