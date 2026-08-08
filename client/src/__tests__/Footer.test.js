import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Footer from "../components/Footer";

describe("Footer Component", () => {
 const renderFooter = () => render(
  <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
   <Footer />
  </BrowserRouter>
 );

 test("renders footer content", () => {
  renderFooter();

  // Check for copyright text
  expect(screen.getByText(new RegExp(`© ${new Date().getFullYear()} Ritik`, "i"))).toBeInTheDocument();
  expect(screen.getByText(/all rights reserved/i)).toBeInTheDocument();
 });

 test("renders social media links", () => {
  renderFooter();

  // Check for social media links (adjust based on your actual implementation)
  const socialLinks = screen.getAllByRole("link");
  expect(socialLinks.length).toBeGreaterThan(0);
 });

 test("has proper footer structure", () => {
  renderFooter();

  const footer = screen.getByRole("contentinfo");
  expect(footer).toBeInTheDocument();
 });

 test("contains developer name", () => {
  renderFooter();

  expect(
   screen.getByRole("heading", { name: "Ritik Vaidyasen" })
  ).toBeInTheDocument();
 });
});
