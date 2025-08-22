import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  // Enhanced fallback projects data
  const fallbackProjects = [
    {
      id: 1,
      title: "Portfolio Website",
      description:
        "A modern, responsive portfolio website built with React and Go. Features dark/light theme toggle, smooth animations, and a contact form with backend integration.",
      image:
        "https://images.unsplash.com/photo-1467232004584-a241de8bcf5d?w=500&h=300&fit=crop",
      technologies: ["React", "Go", "TailwindCSS", "Framer Motion", "SQLite"],
      github: "https://github.com/ritik/portfolio",
      live: "https://ritik-portfolio.vercel.app",
      category: "Web Development",
      status: "Completed",
      featured: true,
    },
    {
      id: 2,
      title: "E-Commerce API",
      description:
        "RESTful API for an e-commerce platform with user authentication, product management, order processing, and payment integration using Stripe.",
      image:
        "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500&h=300&fit=crop",
      technologies: ["Go", "PostgreSQL", "JWT", "Stripe API", "Docker"],
      github: "https://github.com/ritik/ecommerce-api",
      category: "API",
      status: "Completed",
      featured: true,
    },
    {
      id: 3,
      title: "Task Management App",
      description:
        "A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.",
      image:
        "https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500&h=300&fit=crop",
      technologies: ["React", "Node.js", "Socket.io", "MongoDB", "Material-UI"],
      github: "https://github.com/ritik/task-manager",
      live: "https://task-manager-ritik.netlify.app",
      category: "Web Development",
      status: "Completed",
      featured: false,
    },
    {
      id: 4,
      title: "Weather Forecast App",
      description:
        "Mobile weather application with location-based forecasts, interactive maps, and severe weather alerts using React Native.",
      image:
        "https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=500&h=300&fit=crop",
      technologies: ["React Native", "OpenWeather API", "Maps", "Firebase"],
      github: "https://github.com/ritik/weather-app",
      category: "Mobile App",
      status: "In Progress",
      featured: false,
    },
    {
      id: 5,
      title: "Code Formatter CLI",
      description:
        "A command-line tool for formatting and beautifying code across multiple programming languages with customizable style configurations.",
      image:
        "https://images.unsplash.com/photo-1629904853893-c2c8981a1dc5?w=500&h=300&fit=crop",
      technologies: ["Go", "CLI", "AST Parsing", "Multiple Languages"],
      github: "https://github.com/ritik/code-formatter",
      category: "Tool",
      status: "Completed",
      featured: false,
    },
    {
      id: 6,
      title: "Image Classification ML",
      description:
        "Machine learning model for image classification using TensorFlow, deployed as a web service with real-time prediction capabilities.",
      image:
        "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500&h=300&fit=crop",
      technologies: ["Python", "TensorFlow", "Flask", "Docker", "AWS"],
      github: "https://github.com/ritik/image-classifier",
      live: "https://image-classifier-demo.herokuapp.com",
      category: "Machine Learning",
      status: "In Progress",
      featured: true,
    },
  ];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE_URL}/api/projects`);
      setProjects(response.data.projects || fallbackProjects);
      setError(null);
    } catch (err) {
      console.warn("Error fetching projects, using fallback data:", err);
      setProjects(fallbackProjects);
      setError(null);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((project) => {
    if (filter === "all") return true;
    if (filter === "featured") return project.featured;
    if (filter === "completed") return project.status === "Completed";
    if (filter === "in-progress") return project.status === "In Progress";
    return true;
  });

  const filterOptions = [
    { value: "all", label: "All Projects", count: projects.length },
    {
      value: "featured",
      label: "Featured",
      count: projects.filter((p) => p.featured).length,
    },
    {
      value: "completed",
      label: "Completed",
      count: projects.filter((p) => p.status === "Completed").length,
    },
    {
      value: "in-progress",
      label: "In Progress",
      count: projects.filter((p) => p.status === "In Progress").length,
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="loading-dots mx-auto mb-4">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
          <p className="text-gray-600 dark:text-gray-300 text-lg">
            Loading projects...
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-6">
            <span className="gradient-text">My Projects</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            A showcase of my technical journey through various projects. Each
            one represents a unique challenge, innovative solution, and
            continuous learning experience in software development.
          </p>
        </motion.div>

        {/* Filter Buttons */}
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          {filterOptions.map((option) => (
            <motion.button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`group relative px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                filter === option.value
                  ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                  : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 shadow-md"
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <span className="flex items-center gap-2">
                {option.label}
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    filter === option.value
                      ? "bg-white bg-opacity-20 text-white"
                      : "bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-400"
                  }`}
                >
                  {option.count}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>

        {error && (
          <motion.div
            className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-200 px-6 py-4 rounded-xl mb-8 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-xl">⚠️</span>
              <span>{error}</span>
            </div>
          </motion.div>
        )}

        {/* Projects Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="hidden"
            className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          >
            {filteredProjects.length > 0 ? (
              filteredProjects.map((project, index) => (
                <motion.div key={project.id} variants={itemVariants} layout>
                  <ProjectCard project={project} index={index} />
                </motion.div>
              ))
            ) : (
              <motion.div
                className="col-span-full text-center py-20"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">
                  No projects found
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Try selecting a different filter or check back later for new
                  projects.
                </p>
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Stats Section */}
        <motion.div
          className="mt-20 grid grid-cols-1 md:grid-cols-4 gap-6"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Total Projects
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-3xl font-bold gradient-text mb-2">
              {new Set(projects.flatMap((p) => p.technologies || [])).size}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Technologies
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.filter((p) => p.status === "Completed").length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Completed
            </div>
          </div>
          <div className="text-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-xl">
            <div className="text-3xl font-bold gradient-text mb-2">
              {projects.filter((p) => p.featured).length}
            </div>
            <div className="text-gray-600 dark:text-gray-400 text-sm">
              Featured
            </div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div
          className="text-center mt-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.0 }}
        >
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-12 shadow-2xl">
            <h3 className="text-3xl font-bold gradient-text mb-4">
              Let's Build Something Amazing Together
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
              Interested in collaborating on a project or learning more about my
              work? I'm always excited to discuss new opportunities and
              innovative ideas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.a
                href="/contact"
                className="btn-primary inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>💬</span>
                <span>Get In Touch</span>
              </motion.a>
              <motion.a
                href="https://github.com/ritik"
                target="_blank"
                rel="noopener noreferrer"
                className="btn-secondary inline-flex items-center justify-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span>🔗</span>
                <span>View on GitHub</span>
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
