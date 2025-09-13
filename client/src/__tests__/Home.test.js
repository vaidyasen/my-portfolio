import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import axios from "axios";
import Home from "../pages/Home";

jest.mock("axios");
const mockedAxios = axios;

const HomeWithRouter = () => (
  <BrowserRouter>
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

    expect(screen.getByText("View Projects")).toBeInTheDocument();
    expect(screen.getByText("Get In Touch")).toBeInTheDocument();
  });

  test("fetches and displays featured projects", async () => {
    const mockProjects = [
      {
        id: 1,
        title: "Test Project 1",
        description: "Test description 1",
        technologies: ["React", "Node.js"],
        github_url: "https://github.com/test1",
        live_url: "https://test1.com",
        featured: true,
      },
      {
        id: 2,
        title: "Test Project 2",
        description: "Test description 2",
        technologies: ["Vue", "Python"],
        github_url: "https://github.com/test2",
        live_url: "https://test2.com",
        featured: true,
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockProjects });

    render(<HomeWithRouter />);

    await waitFor(() => {
      expect(screen.getByText("Featured Projects")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("Test Project 1")).toBeInTheDocument();
      expect(screen.getByText("Test Project 2")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/projects?featured=true");
  });

  test("displays skills section", async () => {
    const mockSkills = [
      {
        id: 1,
        name: "JavaScript",
        category: "Frontend",
        level: 90,
        icon: "js-icon",
      },
      {
        id: 2,
        name: "React",
        category: "Frontend",
        level: 85,
        icon: "react-icon",
      },
    ];

    mockedAxios.get.mockResolvedValueOnce({ data: mockSkills });

    render(<HomeWithRouter />);

    await waitFor(() => {
      expect(screen.getByText("Skills & Technologies")).toBeInTheDocument();
    });

    await waitFor(() => {
      expect(screen.getByText("JavaScript")).toBeInTheDocument();
      expect(screen.getByText("React")).toBeInTheDocument();
    });

    expect(mockedAxios.get).toHaveBeenCalledWith("/api/skills");
  });

  test("handles API errors gracefully", async () => {
    mockedAxios.get.mockRejectedValueOnce(new Error("API Error"));

    // Suppress console.error for this test
    const consoleSpy = jest
      .spyOn(console, "error")
      .mockImplementation(() => {});

    render(<HomeWithRouter />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalled();
    });

    consoleSpy.mockRestore();
  });

  test("renders about section", () => {
    render(<HomeWithRouter />);

    expect(screen.getByText("About Me")).toBeInTheDocument();
    expect(
      screen.getByText(/passionate full-stack developer/i)
    ).toBeInTheDocument();
  });
});
