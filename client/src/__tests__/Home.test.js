import React from "react";
import { render, screen } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Home from "../pages/Home";

jest.mock("../hooks/useTypingAnimation", () => ({
 useTypingAnimation: () => "Full Stack Developer",
}));

const HomeWithRouter = () => (
 <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
  <Home />
 </BrowserRouter>
);

describe("Home Component", () => {
 beforeEach(() => {
  jest.clearAllMocks();
 });

 test("renders hero section with name and title", () => {
  render(<HomeWithRouter />);

  expect(screen.getByText("Ritik")).toBeInTheDocument();
  expect(screen.getByText(/Full Stack Developer/i)).toBeInTheDocument();
 });

 test("renders navigation buttons", () => {
  render(<HomeWithRouter />);

  expect(screen.getByText("View My Work")).toBeInTheDocument();
  expect(screen.getByText("Get In Touch")).toBeInTheDocument();
 });

 test("links to projects and contact pages", () => {
  render(<HomeWithRouter />);

  expect(screen.getByRole("link", { name: /view my work/i })).toHaveAttribute(
   "href",
   "/projects"
  );
  expect(screen.getByRole("link", { name: /get in touch/i })).toHaveAttribute(
   "href",
   "/contact"
  );
 });

 test("renders social links", () => {
  render(<HomeWithRouter />);

  expect(screen.getByRole("link", { name: /github/i })).toHaveAttribute(
   "href",
   "https://github.com/ritikvaidyasen"
  );
  expect(screen.getByRole("link", { name: /linkedin/i })).toHaveAttribute(
   "href",
   "https://linkedin.com/in/ritikvaidyasen"
  );
 });
});
