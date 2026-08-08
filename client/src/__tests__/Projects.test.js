import React from "react";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import Projects from "../pages/Projects";

import { refreshDatabase } from "../data/projects";

// Mock the projects data module
jest.mock("../data/projects", () => ({
  refreshDatabase: jest.fn(),
}));

// Mock the ProjectCard component
jest.mock("../components/ProjectCard", () => ({ project, onClick }) => (
  <div data-testid="project-card" onClick={() => onClick?.(project)}>
    <h3>{project.title}</h3>
    <p>{project.description}</p>
    {/* Render technologies */}
    {project.technologies &&
      project.technologies.map((tech, index) => (
        <span key={index}>{tech}</span>
      ))}
    {/* Render links */}
    {project.github_url && <a href={project.github_url}>GitHub</a>}
    {project.live_url && <a href={project.live_url}>Live Demo</a>}
  </div>
));

// Mock framer-motion
jest.mock("framer-motion", () => ({
  motion: {
    section: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <section {...props}>{children}</section>,
    div: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <div {...props}>{children}</div>,
    button: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <button {...props}>{children}</button>,
    h1: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <h1 {...props}>{children}</h1>,
    p: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <p {...props}>{children}</p>,
    a: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <a {...props}>{children}</a>,
    span: ({
      children,
      whileHover,
      whileTap,
      animate,
      initial,
      transition,
      variants,
      ...props
    }) => <span {...props}>{children}</span>,
  },
  AnimatePresence: ({ children }) => <>{children}</>,
}));

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
      status: "Completed",
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
      status: "Completed",
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
      status: "In Progress",
      image: null,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    // Mock the refreshDatabase function to return our test data
    refreshDatabase.mockReturnValue(mockProjects);
  });

  test("renders projects page title", () => {
    render(<Projects />);

    expect(screen.getByText("My Projects")).toBeInTheDocument();
  });

  test("fetches and displays projects", async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(refreshDatabase).toHaveBeenCalled();
    });

    await waitFor(() => {
      expect(screen.getByText("React Project")).toBeInTheDocument();
    });
    expect(screen.getByText("Node.js API")).toBeInTheDocument();
    expect(screen.getByText("Python Script")).toBeInTheDocument();
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

  test("filters projects by status", async () => {
    const user = userEvent.setup();
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getAllByText("React Project")).toBeTruthy();
    });

    // Find and click "Completed" filter button
    const completedFilter = screen.getByText("Completed");
    await user.click(completedFilter);

    // Should show only completed projects (React Project and Node.js API are completed)
    expect(screen.getAllByText("React Project").length).toBeGreaterThan(0);
    expect(screen.getByText("Node.js API")).toBeInTheDocument();
    expect(screen.queryByText("Python Script")).not.toBeInTheDocument(); // Python Script is "In Progress"
  });
  test('shows all projects when "All Projects" filter is selected', async () => {
    const user = userEvent.setup();
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getAllByText("React Project")).toBeTruthy();
    });

    // Click on a specific technology filter first
    const reactFilter = screen.getByText("React");
    await user.click(reactFilter);

    // Then click "All Projects" to show all projects
    const allFilter = screen.getByText("All Projects");
    await user.click(allFilter);

    // Should show all projects
    expect(screen.getAllByText("React Project").length).toBeGreaterThan(0);
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

  test("handles empty projects list", async () => {
    refreshDatabase.mockReturnValue([]);

    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("All Projects")).toBeInTheDocument();
    });

    // Should show no projects
    expect(screen.queryByText("React Project")).not.toBeInTheDocument();
  });

  test("displays filter buttons", () => {
    render(<Projects />);

    expect(screen.getByText("All Projects")).toBeInTheDocument();
    expect(screen.getByText("Featured")).toBeInTheDocument();
    expect(screen.getByText("Completed")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
  });

  test("filters projects by featured status", async () => {
    render(<Projects />);

    const featuredButton = screen.getByText("Featured");
    await userEvent.click(featuredButton);

    await waitFor(() => {
      expect(screen.getByText("React Project")).toBeInTheDocument();
    });
    expect(screen.queryByText("Node.js API")).not.toBeInTheDocument();
    expect(screen.queryByText("Python Script")).not.toBeInTheDocument();
  });

  test("renders project titles and descriptions", async () => {
    render(<Projects />);

    await waitFor(() => {
      expect(screen.getByText("React Project")).toBeInTheDocument();
    });
    expect(screen.getByText("Node.js API")).toBeInTheDocument();
    expect(screen.getByText("Python Script")).toBeInTheDocument();

    // Check descriptions are rendered
    expect(
      screen.getByText(/A React-based web application/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/RESTful API built with Node.js/)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Data analysis script in Python/)
    ).toBeInTheDocument();
  });
});
