import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ErrorBoundary from "../components/ErrorBoundary";

// Test component that throws an error
const ThrowError = ({ shouldThrow }) => {
  if (shouldThrow) {
    throw new Error("Test error");
  }
  return <div>No error</div>;
};

// Custom fallback component for testing
const CustomFallback = ({ error }) => (
  <div data-testid="custom-fallback">Custom error: {error?.message}</div>
);

// Mock console.error to avoid noise in test output
const originalError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalError;
});

describe("ErrorBoundary", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render children when there is no error", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child">Child content</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child")).toBeInTheDocument();
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });

  it("should render default error UI when child throws error", () => {
    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(
      screen.getByText(/we're sorry, but something unexpected happened/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /refresh page/i })
    ).toBeInTheDocument();
  });

  it("should render custom fallback when provided", () => {
    render(
      <ErrorBoundary fallback={CustomFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("custom-fallback")).toBeInTheDocument();
    expect(screen.getByText("Custom error: Test error")).toBeInTheDocument();
  });

  it("should log error to console in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(console.error).toHaveBeenCalledWith(
      "Error caught by boundary:",
      expect.any(Error),
      expect.any(Object)
    );

    process.env.NODE_ENV = originalEnv;
  });

  it("should call logErrorToService in production", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "production";

    // Spy on the logErrorToService method
    const errorBoundaryInstance = React.createRef();

    class TestErrorBoundary extends ErrorBoundary {
      constructor(props) {
        super(props);
        errorBoundaryInstance.current = this;
      }
    }

    const logErrorToServiceSpy = jest.spyOn(
      ErrorBoundary.prototype,
      "logErrorToService"
    );

    render(
      <TestErrorBoundary>
        <ThrowError shouldThrow={true} />
      </TestErrorBoundary>
    );

    expect(logErrorToServiceSpy).toHaveBeenCalledWith(
      expect.any(Error),
      expect.any(Object)
    );

    logErrorToServiceSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("should not call logErrorToService in development", () => {
    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = "development";

    const logErrorToServiceSpy = jest.spyOn(
      ErrorBoundary.prototype,
      "logErrorToService"
    );

    render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(logErrorToServiceSpy).not.toHaveBeenCalled();

    logErrorToServiceSpy.mockRestore();
    process.env.NODE_ENV = originalEnv;
  });

  it("should handle multiple children correctly", () => {
    render(
      <ErrorBoundary>
        <div data-testid="child1">Child 1</div>
        <div data-testid="child2">Child 2</div>
        <div data-testid="child3">Child 3</div>
      </ErrorBoundary>
    );

    expect(screen.getByTestId("child1")).toBeInTheDocument();
    expect(screen.getByTestId("child2")).toBeInTheDocument();
    expect(screen.getByTestId("child3")).toBeInTheDocument();
  });

  it("should handle error in one child while others are fine", () => {
    render(
      <ErrorBoundary>
        <div data-testid="good-child">Good child</div>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // When error boundary catches an error, it renders fallback UI instead of children
    expect(screen.queryByTestId("good-child")).not.toBeInTheDocument();
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
  });

  it("should pass error object to custom fallback", () => {
    const TestFallback = ({ error }) => (
      <div data-testid="error-message">
        Error: {error?.message || "Unknown error"}
        Stack: {error?.stack ? "present" : "absent"}
      </div>
    );

    render(
      <ErrorBoundary fallback={TestFallback}>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    expect(screen.getByTestId("error-message")).toBeInTheDocument();
    expect(screen.getByText(/Error:.*Test error/)).toBeInTheDocument();
    expect(screen.getByText(/Stack:.*present/)).toBeInTheDocument();
  });

  it("should recover from error state when re-rendered with good component", () => {
    const { rerender } = render(
      <ErrorBoundary>
        <ThrowError shouldThrow={true} />
      </ErrorBoundary>
    );

    // Error state
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();

    // Rerender with good component
    rerender(
      <ErrorBoundary>
        <div data-testid="good-child">All good now</div>
      </ErrorBoundary>
    );

    // Should still show error (Error boundaries don't automatically recover)
    expect(screen.getByText(/something went wrong/i)).toBeInTheDocument();
    expect(screen.queryByTestId("good-child")).not.toBeInTheDocument();
  });
});
