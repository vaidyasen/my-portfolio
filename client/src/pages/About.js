import React from "react";
import { motion } from "framer-motion";

export default function About() {
  const skills = [
    "JavaScript",
    "React",
    "Node.js",
    "Go",
    "Python",
    "PostgreSQL",
    "MongoDB",
    "Docker",
    "AWS",
    "Git",
    "TailwindCSS",
    "REST APIs",
  ];

  const education = [
    {
      degree: "Bachelor of Computer Science",
      institution: "University Name",
      year: "2020-2024",
      gpa: "3.8/4.0",
    },
  ];

  const experience = [
    {
      position: "Full Stack Developer",
      company: "Tech Company",
      duration: "2023 - Present",
      description:
        "Developed scalable web applications using React and Go, improving system performance by 40%.",
    },
    {
      position: "Software Engineer Intern",
      company: "Startup Inc",
      duration: "Summer 2022",
      description:
        "Built REST APIs and implemented database optimizations, reducing query time by 25%.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text">About Me</span>
        </motion.h1>

        {/* Bio Section */}
        <motion.div
          className="bg-gray-100 dark:bg-gray-800 rounded-xl p-8 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Who I Am
          </h2>
          <p className="text-gray-600 dark:text-gray-300 text-lg leading-relaxed">
            I'm a passionate Full Stack Developer with expertise in modern web
            technologies. I love building scalable applications that solve
            real-world problems. With a strong foundation in both frontend and
            backend development, I enjoy creating seamless user experiences
            backed by robust server-side architecture.
          </p>
        </motion.div>

        {/* Skills Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Technical Skills
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {skills.map((skill, index) => (
              <motion.div
                key={skill}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg text-center font-medium"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                whileHover={{ scale: 1.05 }}
              >
                {skill}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Experience Section */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Experience
          </h2>
          <div className="space-y-6">
            {experience.map((exp, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {exp.position}
                </h3>
                <p className="text-blue-500 font-medium mb-2">
                  {exp.company} • {exp.duration}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Education Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            Education
          </h2>
          <div className="space-y-4">
            {education.map((edu, index) => (
              <div
                key={index}
                className="bg-gray-100 dark:bg-gray-800 rounded-xl p-6"
              >
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {edu.degree}
                </h3>
                <p className="text-blue-500 font-medium">
                  {edu.institution} • {edu.year}
                </p>
                <p className="text-gray-600 dark:text-gray-300">
                  GPA: {edu.gpa}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
