import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ProjectCard from "../components/ProjectCard";
import { refreshDatabase } from "../data/projects";

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden";
    document.body.style.paddingRight = "0px"; // Prevent layout shift
    document.documentElement.style.overflow = "hidden";
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProject(null);
    // Restore body scroll when modal is closed
    document.body.style.overflow = "";
    document.body.style.paddingRight = "";
    document.documentElement.style.overflow = "";
  };

  // Handle escape key to close modal
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape" && showModal) {
        closeModal();
      }
    };

    if (showModal) {
      document.addEventListener("keydown", handleEscape);
      return () => {
        document.removeEventListener("keydown", handleEscape);
      };
    }
  }, [showModal]);

  // Clean up on component unmount
  useEffect(() => {
    return () => {
      // Restore scroll when component unmounts
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
      document.documentElement.style.overflow = "";
    };
  }, []);

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
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  // Function to fetch projects from database file
  const fetchProjects = () => {
    setLoading(true);
    console.log("🔄 Loading projects from database (localStorage + static)...");

    const projects = refreshDatabase();
    setProjects(projects);
    setError(null);

    console.log("✅ Loaded", projects.length, "projects from database");
    setLoading(false);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // Refresh data when the page becomes visible again (user switches back to tab)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log("Page became visible, refreshing projects...");
        fetchProjects();
      }
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
              Loading projects...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <p className="text-red-600 dark:text-red-400 text-lg">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4 pb-32">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text">My Projects</span>
        </motion.h1>
        <motion.p
          className="text-xl text-gray-600 dark:text-gray-300 text-center mb-16 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          A collection of projects showcasing my skills in web development,
          machine learning, and software engineering. Each project represents a
          unique challenge and learning experience.
        </motion.p>
        {/* Filter buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {filterOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => setFilter(option.value)}
              className={`px-6 py-3 rounded-full font-medium transition-all duration-300 border-2 ${
                filter === option.value
                  ? "bg-blue-600 text-white border-blue-600 shadow-lg transform scale-105"
                  : "bg-white dark:bg-gray-700 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400"
              }`}
            >
              {option.label}
              <span className="ml-2 text-sm opacity-75">({option.count})</span>
            </button>
          ))}
        </motion.div>
        {/* Projects grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8"
        >
          {filteredProjects.map((project) => (
            <motion.div key={project.id} variants={itemVariants} layout>
              <ProjectCard
                project={project}
                onClick={() => handleProjectClick(project)}
              />
            </motion.div>
          ))}
          {filteredProjects.length === 0 && (
            <motion.div
              variants={itemVariants}
              className="col-span-full text-center py-12"
            >
              <div className="text-gray-400 dark:text-gray-500">
                <svg
                  className="w-16 h-16 mx-auto mb-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
                <p className="text-xl font-medium">No projects found</p>
                <p className="text-sm mt-2">
                  Try adjusting your filter criteria
                </p>
              </div>
            </motion.div>
          )}
        </motion.div>
        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
          className="text-center bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-xl"
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Interested in collaborating?
          </h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6 max-w-2xl mx-auto">
            I'm always excited to work on new and challenging projects. Let's
            discuss how we can bring your ideas to life.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.a
              href="mailto:your-email@example.com"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-colors duration-300 shadow-lg"
            >
              Get In Touch
            </motion.a>
            <motion.a
              href="/contact"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-8 py-3 bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-full font-medium hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300"
            >
              View Resume
            </motion.a>
          </div>
        </motion.div>
      </div>

      {/* Project Detail Modal */}
      {showModal && selectedProject && (
        <AnimatePresence>
          <div
            className="fixed inset-0 bg-black bg-opacity-70 z-[9999] flex items-center justify-center p-2 sm:p-4 overflow-y-auto"
            onClick={closeModal}
            style={{
              backdropFilter: "blur(5px)",
              WebkitBackdropFilter: "blur(5px)",
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 50 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 50 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full max-w-4xl"
            >
              <div
                className="bg-white dark:bg-gray-800 max-w-4xl w-full max-h-[90vh] shadow-2xl relative flex flex-col mx-2 sm:mx-4"
                onClick={(e) => e.stopPropagation()}
                style={{
                  borderRadius: "1rem",
                  overflow: "hidden",
                }}
              >
                {/* Close button */}
                <button
                  onClick={closeModal}
                  className="absolute top-4 right-4 z-10 w-10 h-10 bg-black bg-opacity-20 hover:bg-opacity-30 rounded-full flex items-center justify-center text-white hover:text-gray-200 transition-all duration-200"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>

                {/* Project image */}
                <div className="relative h-64 sm:h-80 flex-shrink-0">
                  <img
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />

                  {/* Project status badge */}
                  <div className="absolute top-4 left-4">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        selectedProject.status === "Completed"
                          ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
                          : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                      }`}
                    >
                      {selectedProject.status}
                    </span>
                  </div>

                  {/* Featured badge */}
                  {selectedProject.featured && (
                    <div className="absolute top-4 right-16">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium">
                        Featured
                      </span>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-6 sm:p-8 overflow-y-auto">
                  <div className="mb-6">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedProject.title}
                    </h2>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                      <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                        {selectedProject.category}
                      </span>
                    </div>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-base sm:text-lg">
                      {selectedProject.description}
                    </p>
                  </div>

                  {/* Technologies */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">
                      Technologies Used
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedProject.technologies.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {selectedProject.github && (
                      <motion.a
                        href={selectedProject.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center px-6 py-3 bg-gray-900 dark:bg-gray-700 text-white rounded-lg font-medium hover:bg-gray-800 dark:hover:bg-gray-600 transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                        </svg>
                        View Code
                      </motion.a>
                    )}
                    {selectedProject.live && (
                      <motion.a
                        href={selectedProject.live}
                        target="_blank"
                        rel="noopener noreferrer"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center justify-center px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors duration-300"
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                          />
                        </svg>
                        Live Demo
                      </motion.a>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </AnimatePresence>
      )}
    </section>
  );
}
