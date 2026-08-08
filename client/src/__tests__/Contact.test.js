import React from "react";
import { act, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Contact from "../pages/Contact";
import ApiService from "../services/ApiService";

jest.mock("../services/ApiService", () => ({
 __esModule: true,
 default: {
  post: jest.fn(),
 },
}));

describe("Contact Component", () => {
 beforeEach(() => {
  jest.clearAllMocks();
 });

 test("renders contact form", () => {
  render(<Contact />);

  expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
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
  });
  expect(screen.getByText(/email is required/i)).toBeInTheDocument();
  expect(screen.getByText(/message is required/i)).toBeInTheDocument();
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
    screen.getByText(/email must be a valid email address/i)
   ).toBeInTheDocument();
  });
 });

 test("submits form with valid data", async () => {
  const user = userEvent.setup();
  ApiService.post.mockResolvedValueOnce({
   success: true,
   data: { message: "Message received successfully" },
  });

  render(<Contact />);

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole("button", { name: /send message/i });

  // Fill form with valid data
  await user.type(nameInput, "John Doe");
  await user.type(emailInput, "john@example.com");
  await user.type(messageInput, "Test message content");

  await user.click(submitButton);

  await waitFor(() => {
   expect(ApiService.post).toHaveBeenCalledWith("/api/contact", {
    name: "John Doe",
    email: "john@example.com",
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
  ApiService.post.mockResolvedValueOnce({
   success: false,
   error: "Failed to send message",
  });

  render(<Contact />);

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole("button", { name: /send message/i });

  // Fill form with valid data
  await user.type(nameInput, "John Doe");
  await user.type(emailInput, "john@example.com");
  await user.type(messageInput, "Test message content");

  await user.click(submitButton);

  await waitFor(() => {
   expect(screen.getByText(/failed to send message/i)).toBeInTheDocument();
  });

 });

 test("disables submit button while sending", async () => {
  const user = userEvent.setup();
  let resolveRequest;
  ApiService.post.mockReturnValueOnce(
   new Promise((resolve) => {
    resolveRequest = resolve;
   })
  );

  render(<Contact />);

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole("button", { name: /send message/i });

  // Fill form
  await user.type(nameInput, "John Doe");
  await user.type(emailInput, "john@example.com");
  await user.type(messageInput, "Test message content");

  await user.click(submitButton);

  // Button should be disabled while sending
  await waitFor(() => expect(submitButton).toBeDisabled());
  expect(screen.getByText(/sending/i)).toBeInTheDocument();

  await act(async () => {
   resolveRequest({ success: true, data: {} });
  });

  // Wait for completion
  await waitFor(() => {
   expect(submitButton).not.toBeDisabled();
  });
 });

 test("clears form after successful submission", async () => {
  const user = userEvent.setup();
  ApiService.post.mockResolvedValueOnce({
   success: true,
   data: { message: "Message received successfully" },
  });

  render(<Contact />);

  const nameInput = screen.getByLabelText(/name/i);
  const emailInput = screen.getByLabelText(/email/i);
  const messageInput = screen.getByLabelText(/message/i);
  const submitButton = screen.getByRole("button", { name: /send message/i });

  // Fill and submit form
  await user.type(nameInput, "John Doe");
  await user.type(emailInput, "john@example.com");
  await user.type(messageInput, "Test message content");

  await user.click(submitButton);

  // Wait for success message and form reset
  await waitFor(() => {
   expect(nameInput.value).toBe("");
  });
  expect(emailInput.value).toBe("");
  expect(messageInput.value).toBe("");
 });
});
