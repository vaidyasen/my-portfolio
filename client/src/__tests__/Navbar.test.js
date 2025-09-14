import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Navbar from "../components/Navbar";

// Mock the ThemeToggle component
jest.mock("../components/ThemeToggle", () => {
 return function MockThemeToggle() {
  return <button data-testid="theme-toggle">Toggle Theme</button>;
 };
});

const NavbarWithRouter = () => (
 <BrowserRouter>
  <Navbar />
 </BrowserRouter>
);

describe("Navbar Component", () => {
 test("renders navigation links", () => {
  render(<NavbarWithRouter />);

  expect(screen.getByText("Ritik")).toBeInTheDocument();
  expect(screen.getByText("Home")).toBeInTheDocument();
  expect(screen.getByText("Projects")).toBeInTheDocument();
  expect(screen.getByText("Contact")).toBeInTheDocument();
 });

 test("renders theme toggle button", () => {
  render(<NavbarWithRouter />);

  const themeToggleButtons = screen.getAllByTestId("theme-toggle");
  expect(themeToggleButtons.length).toBeGreaterThan(0);
 });
 test("mobile menu toggle works", () => {
  render(<NavbarWithRouter />);

  // Find mobile menu button
  const mobileMenuButton = screen.getByRole("button", { name: /menu/i });
  expect(mobileMenuButton).toBeInTheDocument();

  // Click to open mobile menu
  fireEvent.click(mobileMenuButton);

  // Check if mobile menu items are visible
  const mobileNavLinks = screen.getAllByText("Home");
  expect(mobileNavLinks.length).toBeGreaterThan(1); // Desktop + mobile versions
 });

 test("navigation links have correct href attributes", () => {
  render(<NavbarWithRouter />);

  const homeLink = screen.getByRole("link", { name: "Home" });
  const projectsLink = screen.getByRole("link", { name: "Projects" });
  const contactLink = screen.getByRole("link", { name: "Contact" });

  expect(homeLink).toHaveAttribute("href", "/");
  expect(projectsLink).toHaveAttribute("href", "/projects");
  expect(contactLink).toHaveAttribute("href", "/contact");
 });
});
