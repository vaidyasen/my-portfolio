// Original static database of projects - baseline data
const originalProjectsDatabase = [
  {
    id: 1,
    title: "Personal Portfolio Website",
    description:
      "Modern portfolio website built with React frontend and Go backend. Features responsive design, dark/light theme toggle, admin dashboard, contact form with email integration, project showcase with filtering, and smooth animations using Framer Motion.",
    image:
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=500&h=300&fit=crop",
    technologies: [
      "React",
      "Go",
      "TailwindCSS",
      "Framer Motion",
      "SQLite",
      "Gin",
      "GORM",
    ],
    github: "https://github.com/vaidyasen/my-portfolio",
    live: "https://github.com/vaidyasen/my-portfolio",
    category: "Full Stack",
    status: "Completed",
    featured: true,
  },
  {
    id: 2,
    title: "React Todo Application",
    description:
      "Feature-rich todo application demonstrating React best practices. Includes add/edit/delete tasks, mark as complete, filter by status, local storage persistence, responsive design, and clean user interface with smooth transitions.",
    image:
      "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
    technologies: [
      "React",
      "JavaScript",
      "CSS3",
      "HTML5",
      "Local Storage",
      "Responsive Design",
    ],
    github: "https://github.com/vaidyasen/react-todo",
    live: "https://github.com/vaidyasen/react-todo",
    category: "Web Development",
    status: "Completed",
    featured: false,
  },
  {
    id: 3,
    title: "Weather App",
    description:
      "Interactive weather application using OpenWeatherMap API. Features current weather conditions, 5-day forecast, location search, geolocation support, temperature unit conversion, and beautiful weather icons with responsive design.",
    image:
      "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
    technologies: [
      "JavaScript",
      "HTML5",
      "CSS3",
      "OpenWeatherMap API",
      "Geolocation API",
      "Responsive Design",
    ],
    github: "https://github.com/vaidyasen/weather-app",
    live: "https://github.com/vaidyasen/weather-app",
    category: "Web Development",
    status: "Completed",
    featured: false,
  },
  {
    id: 4,
    title: "E-commerce Shopping Cart",
    description:
      "Modern e-commerce frontend with shopping cart functionality. Features product listing, cart management, quantity updates, price calculations, responsive design, and integration ready for backend APIs.",
    image:
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
    technologies: [
      "React",
      "Redux",
      "CSS3",
      "React Router",
      "Context API",
      "Local Storage",
    ],
    github: "https://github.com/vaidyasen/ecommerce-platform",
    live: "https://github.com/vaidyasen/ecommerce-platform",
    category: "Web Development",
    status: "Completed",
    featured: false,
  },
  {
    id: 5,
    title: "Task Management Dashboard",
    description:
      "Comprehensive task management application with drag-and-drop functionality. Features project organization, team collaboration, deadline tracking, progress visualization, and real-time updates for efficient project management.",
    image:
      "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=500&h=300&fit=crop",
    technologies: [
      "React",
      "Node.js",
      "Express",
      "MongoDB",
      "Socket.io",
      "JWT",
      "Material-UI",
    ],
    github: "https://github.com/vaidyasen/task-manager",
    live: null,
    category: "Full Stack",
    status: "In Progress",
    featured: true,
  },
  {
    id: 6,
    title: "Cryptocurrency Tracker",
    description:
      "Real-time cryptocurrency price tracking application. Features live price updates, portfolio management, price alerts, market trends visualization, and detailed coin information using CoinGecko API.",
    image:
      "https://images.unsplash.com/photo-1640340434855-6084b1f4901c?w=500&h=300&fit=crop",
    technologies: [
      "React",
      "TypeScript",
      "Chart.js",
      "CoinGecko API",
      "Context API",
      "TailwindCSS",
    ],
    github: "https://github.com/vaidyasen/crypto-tracker",
    live: "https://github.com/vaidyasen/crypto-tracker",
    category: "Web Development",
    status: "Completed",
    featured: false,
  },
];

// Function to get all projects
export const getAllProjects = () => {
  return projectsDatabase;
};

// Function to get project by ID
export const getProjectById = (id) => {
  return projectsDatabase.find((project) => project.id === id);
};

// Function to get featured projects
export const getFeaturedProjects = () => {
  return projectsDatabase.filter((project) => project.featured);
};

// Function to get projects by category
export const getProjectsByCategory = (category) => {
  return projectsDatabase.filter((project) => project.category === category);
};

// Function to get projects by status
export const getProjectsByStatus = (status) => {
  return projectsDatabase.filter((project) => project.status === status);
};

// Database modification functions
export const addProject = (projectData) => {
  const newProject = {
    ...projectData,
    id: Math.max(...projectsDatabase.map((p) => p.id), 0) + 1,
    technologies: Array.isArray(projectData.technologies)
      ? projectData.technologies
      : projectData.technologies.split(",").map((tech) => tech.trim()),
  };

  projectsDatabase.push(newProject);
  saveProjectsToLocalStorage();
  console.log("✅ Added new project:", newProject.title);
  return newProject;
};

export const updateProject = (id, projectData) => {
  const index = projectsDatabase.findIndex(
    (project) => project.id === parseInt(id)
  );
  if (index === -1) {
    console.error("❌ Project not found:", id);
    return null;
  }

  const updatedProject = {
    ...projectsDatabase[index],
    ...projectData,
    id: parseInt(id),
    technologies: Array.isArray(projectData.technologies)
      ? projectData.technologies
      : projectData.technologies.split(",").map((tech) => tech.trim()),
  };

  projectsDatabase[index] = updatedProject;
  saveProjectsToLocalStorage();
  console.log("✅ Updated project:", updatedProject.title);
  return updatedProject;
};

export const deleteProject = (id) => {
  const index = projectsDatabase.findIndex(
    (project) => project.id === parseInt(id)
  );
  if (index === -1) {
    console.error("❌ Project not found:", id);
    return false;
  }

  const deletedProject = projectsDatabase.splice(index, 1)[0];
  saveProjectsToLocalStorage();
  console.log("✅ Deleted project:", deletedProject.title);
  return true;
};

// localStorage persistence functions
const STORAGE_KEY = "portfolio_projects_data";

const saveProjectsToLocalStorage = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(projectsDatabase));
    console.log("💾 Projects saved to localStorage");
  } catch (error) {
    console.error("❌ Error saving to localStorage:", error);
  }
};

const loadProjectsFromLocalStorage = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsedData = JSON.parse(stored);
      console.log("📱 Loaded", parsedData.length, "projects from localStorage");
      return parsedData;
    }
  } catch (error) {
    console.error("❌ Error loading from localStorage:", error);
  }
  return null;
};

// Initialize the working database
let projectsDatabase = [];

const initializeDatabase = () => {
  const storedProjects = loadProjectsFromLocalStorage();
  if (storedProjects && storedProjects.length > 0) {
    projectsDatabase = storedProjects;
    console.log("✅ Using stored projects from localStorage");
  } else {
    projectsDatabase = [...originalProjectsDatabase];
    console.log("✅ Using original static projects data");
  }
};

// Refresh database from localStorage (useful when data might have changed in another tab)
export const refreshDatabase = () => {
  initializeDatabase();
  return projectsDatabase;
};

// Reset database to original state (useful for testing/debugging)
export const resetDatabase = () => {
  localStorage.removeItem(STORAGE_KEY);
  projectsDatabase = [...originalProjectsDatabase];
  console.log("🔄 Database reset to original state");
  return projectsDatabase;
};

// Initialize on module load
initializeDatabase();
