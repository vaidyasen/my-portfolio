import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import ThemeToggle from "../components/ThemeToggle";

describe("ThemeToggle Component", () => {
 beforeEach(() => {
  // Reset theme before each test
  document.documentElement.classList.remove("dark");
  localStorage.removeItem("theme");
 });

 test("renders theme toggle button", () => {
  render(<ThemeToggle />);

  const toggleButton = screen.getByRole("button");
  expect(toggleButton).toBeInTheDocument();
 });

 test("toggles theme when clicked", () => {
  render(<ThemeToggle />);

  const toggleButton = screen.getByRole("button");

  // Initially should be light mode
  expect(document.documentElement.classList.contains("dark")).toBe(false);

  // Click to toggle to dark mode
  fireEvent.click(toggleButton);
  expect(document.documentElement.classList.contains("dark")).toBe(true);

  // Click again to toggle back to light mode
  fireEvent.click(toggleButton);
  expect(document.documentElement.classList.contains("dark")).toBe(false);
 });

 test("saves theme preference to localStorage", () => {
  render(<ThemeToggle />);

  const toggleButton = screen.getByRole("button");

  // Toggle to dark mode
  fireEvent.click(toggleButton);
  expect(localStorage.getItem("theme")).toBe("dark");

  // Toggle back to light mode
  fireEvent.click(toggleButton);
  expect(localStorage.getItem("theme")).toBe("light");
 });

 test("loads theme from localStorage on mount", () => {
  // Set dark theme in localStorage
  localStorage.setItem("theme", "dark");

  render(<ThemeToggle />);

  // Should apply dark theme from localStorage
  expect(document.documentElement.classList.contains("dark")).toBe(true);
 });

 test("respects system preference when no localStorage theme", () => {
  // Mock matchMedia for system preference
  Object.defineProperty(window, "matchMedia", {
   writable: true,
   value: jest.fn().mockImplementation((query) => ({
    matches: query === "(prefers-color-scheme: dark)",
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
   })),
  });

  render(<ThemeToggle />);

  // Should apply dark theme based on system preference
  expect(document.documentElement.classList.contains("dark")).toBe(true);
 });
});
