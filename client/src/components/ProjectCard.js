import React from "react";
import { motion } from "framer-motion";

export default function ProjectCard({ project, index }) {
  const {
    title,
    description,
    tags = [],
    githubLink,
    demoLink,
    image,
    techStack = [],
  } = project;

  return (
    <motion.div
      className="bg-white dark:bg-gray-700 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      {/* Project Image */}
      {image && (
        <div className="h-48 bg-gray-200 dark:bg-gray-600 overflow-hidden">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}

      <div className="p-6">
        {/* Project Title */}
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
          {title}
        </h3>

        {/* Project Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-4 line-clamp-3">
          {description}
        </p>

        {/* Tech Stack Tags */}
        {(tags.length > 0 || techStack.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {(tags.length > 0 ? tags : techStack).map((tag, tagIndex) => (
              <span
                key={`${title}-tag-${tagIndex}`}
                className="px-3 py-1 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 text-sm rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Project Links */}
        <div className="flex gap-3">
          {githubLink && (
            <a
              href={githubLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-gray-900 dark:bg-gray-600 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-gray-800 dark:hover:bg-gray-500 transition-colors"
            >
              GitHub
            </a>
          )}
          {demoLink && (
            <a
              href={demoLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg text-center font-medium hover:bg-blue-600 transition-colors"
            >
              Live Demo
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
