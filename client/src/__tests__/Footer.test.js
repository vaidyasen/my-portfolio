import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer Component", () => {
  test("renders footer content", () => {
    render(<Footer />);

    // Check for copyright text
    expect(screen.getByText(/© 2024 Ritik/i)).toBeInTheDocument();
    expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
  });

  test("renders social media links", () => {
    render(<Footer />);

    // Check for social media links (adjust based on your actual implementation)
    const socialLinks = screen.getAllByRole("link");
    expect(socialLinks.length).toBeGreaterThan(0);
  });

  test("has proper footer structure", () => {
    render(<Footer />);

    const footer = screen.getByRole("contentinfo");
    expect(footer).toBeInTheDocument();
  });

  test("contains developer name", () => {
    render(<Footer />);

    expect(screen.getByText(/ritik/i)).toBeInTheDocument();
  });
});
