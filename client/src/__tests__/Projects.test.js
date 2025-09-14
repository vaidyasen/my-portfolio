import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import axios from "axios";
import Projects from "../pages/Projects";

jest.mock("axios");
const mockedAxios = axios;

describe("Projects Component", () => {
 const mockProjects = [
  {
   id: 1,
   title: "React Project",
   description: "A React-based web application",
   technologies: ["React", "JavaScript", "CSS"],
   github_url: "https://github.com/test/react-project",
   live_url: "https://react-project.com",
   featured: true,
   image: "react-project.jpg",
  },
  {
   id: 2,
   title: "Node.js API",
   description: "RESTful API built with Node.js",
   technologies: ["Node.js", "Express", "MongoDB"],
   github_url: "https://github.com/test/nodejs-api",
   live_url: "https://nodejs-api.com",
   featured: false,
   image: "nodejs-api.jpg",
  },
  {
   id: 3,
   title: "Python Script",
   description: "Data analysis script in Python",
   technologies: ["Python", "Pandas", "NumPy"],
   github_url: "https://github.com/test/python-script",
   live_url: null,
   featured: false,
   image: null,
  },
 ];

 beforeEach(() => {
  jest.clearAllMocks();
  mockedAxios.get.mockResolvedValue({ data: mockProjects });
 });

 test("renders projects page title", () => {
  render(<Projects />);

  expect(screen.getByText("My Projects")).toBeInTheDocument();
 });

 test("fetches and displays projects", async () => {
  render(<Projects />);

  await waitFor(() => {
   expect(mockedAxios.get).toHaveBeenCalledWith("/api/projects");
  });

  await waitFor(() => {
   expect(screen.getByText("React Project")).toBeInTheDocument();
   expect(screen.getByText("Node.js API")).toBeInTheDocument();
   expect(screen.getByText("Python Script")).toBeInTheDocument();
  });
 });

 test("displays project details correctly", async () => {
  render(<Projects />);

  await waitFor(() => {
   const reactProject = screen.getByText("React Project");
   expect(reactProject).toBeInTheDocument();
  });

  // Check project description
  expect(
   screen.getByText("A React-based web application")
  ).toBeInTheDocument();

  // Check technologies
  expect(screen.getByText("React")).toBeInTheDocument();
  expect(screen.getByText("JavaScript")).toBeInTheDocument();
  expect(screen.getByText("CSS")).toBeInTheDocument();
 });

 test("filters projects by technology", async () => {
  const user = userEvent.setup();
  render(<Projects />);

  await waitFor(() => {
   expect(screen.getByText("React Project")).toBeInTheDocument();
  });

  // Find and click React filter button
  const reactFilter = screen.getByText("React");
  await user.click(reactFilter);

  // Should show only React project
  expect(screen.getByText("React Project")).toBeInTheDocument();
  expect(screen.queryByText("Node.js API")).not.toBeInTheDocument();
  expect(screen.queryByText("Python Script")).not.toBeInTheDocument();
 });

 test('shows all projects when "All" filter is selected', async () => {
  const user = userEvent.setup();
  render(<Projects />);

  await waitFor(() => {
   expect(screen.getByText("React Project")).toBeInTheDocument();
  });

  // Click on a specific technology filter first
  const reactFilter = screen.getByText("React");
  await user.click(reactFilter);

  // Then click "All" to show all projects
  const allFilter = screen.getByText("All");
  await user.click(allFilter);

  // Should show all projects
  expect(screen.getByText("React Project")).toBeInTheDocument();
  expect(screen.getByText("Node.js API")).toBeInTheDocument();
  expect(screen.getByText("Python Script")).toBeInTheDocument();
 });

 test("displays project links correctly", async () => {
  render(<Projects />);

  await waitFor(() => {
   expect(screen.getByText("React Project")).toBeInTheDocument();
  });

  // Check GitHub links
  const githubLinks = screen.getAllByText(/github/i);
  expect(githubLinks.length).toBeGreaterThan(0);

  // Check Live Demo links (should only be 2 since Python Script has no live URL)
  const liveDemoLinks = screen.getAllByText(/live demo/i);
  expect(liveDemoLinks).toHaveLength(2);
 });

 test("handles API error gracefully", async () => {
  mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

  // Suppress console.error for this test
  const consoleSpy = jest
   .spyOn(console, "error")
   .mockImplementation(() => {});

  render(<Projects />);

  await waitFor(() => {
   expect(consoleSpy).toHaveBeenCalled();
  });

  consoleSpy.mockRestore();
 });

 test("shows loading state initially", () => {
  // Mock a delayed response
  mockedAxios.get.mockImplementation(() =>
   Promise.resolve({ data: mockProjects })
  );

  render(<Projects />);

  // Should show loading indicator
  expect(screen.getByText(/loading/i)).toBeInTheDocument();
 });

 test("handles empty projects list", async () => {
  mockedAxios.get.mockResolvedValueOnce({ data: [] });

  render(<Projects />);

  await waitFor(() => {
   expect(screen.getByText(/no projects found/i)).toBeInTheDocument();
  });
 });

 test("displays featured badge for featured projects", async () => {
  render(<Projects />);

  await waitFor(() => {
   expect(screen.getByText("React Project")).toBeInTheDocument();
  });

  // Only React Project is featured in our mock data
  const featuredBadges = screen.getAllByText(/featured/i);
  expect(featuredBadges).toHaveLength(1);
 });
});
