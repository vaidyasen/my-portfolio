import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Home() {
  const [typedText, setTypedText] = useState("");
  const [currentRole, setCurrentRole] = useState(0);

  const roles = [
    "Full Stack Developer",
    "React Enthusiast",
    "Go Developer",
    "Problem Solver",
  ];

  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/ritikvaidyasen",
      icon: "🐙",
      color: "hover:text-gray-800 dark:hover:text-gray-200",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/ritikvaidyasen",
      icon: "💼",
      color: "hover:text-blue-600 dark:hover:text-blue-400",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/ritikvaidyasen",
      icon: "🐦",
      color: "hover:text-sky-500 dark:hover:text-sky-400",
    },
    {
      name: "Email",
      url: "mailto:ritik@example.com",
      icon: "📧",
      color: "hover:text-red-500 dark:hover:text-red-400",
    },
  ];

  // Typing animation effect
  useEffect(() => {
    let isMounted = true;

    const typeText = async () => {
      if (!isMounted) return;

      const currentRoleText = roles[currentRole];

      // Type the text
      for (let i = 0; i <= currentRoleText.length; i++) {
        if (!isMounted) return;
        setTypedText(currentRoleText.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      // Pause at the end
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Delete the text
      for (let i = currentRoleText.length; i >= 0; i--) {
        if (!isMounted) return;
        setTypedText(currentRoleText.slice(0, i));
        await new Promise((resolve) => setTimeout(resolve, 50));
      }

      // Move to next role
      if (isMounted) {
        setCurrentRole((prev) => (prev + 1) % roles.length);
      }
    };

    typeText();

    return () => {
      isMounted = false;
    };
  }, [currentRole]);

  // Floating animation for background elements
  const floatingVariants = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 5, 0],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30"
          variants={floatingVariants}
          animate="animate"
        />
        <motion.div
          className="absolute top-40 right-10 w-96 h-96 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 2 }}
        />
        <motion.div
          className="absolute -bottom-20 left-1/2 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-overlay filter blur-xl opacity-30"
          variants={floatingVariants}
          animate="animate"
          transition={{ delay: 4 }}
        />
      </div>

      <div className="relative z-10 min-h-screen flex flex-col justify-center items-center text-center px-4">
        <motion.div
          className="max-w-6xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          {/* Profile Section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="w-32 h-32 mx-auto mb-6 relative">
              <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-4xl font-bold shadow-2xl">
                R
              </div>
              <motion.div
                className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full opacity-20"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </div>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            className="text-6xl md:text-8xl font-black text-gray-900 dark:text-white mb-6 leading-tight"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.4 }}
          >
            Hi, I'm{" "}
            <span className="bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Ritik
            </span>
          </motion.h1>

          {/* Typing Animation */}
          <motion.div
            className="h-16 mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.6 }}
          >
            <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-medium">
              I'm a{" "}
              <span className="text-blue-600 dark:text-blue-400 font-bold">
                {typedText}
                <motion.span
                  className="inline-block w-0.5 h-8 bg-blue-600 dark:bg-blue-400 ml-1"
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                />
              </span>
            </p>
          </motion.div>

          {/* Description */}
          <motion.p
            className="text-xl md:text-2xl text-gray-600 dark:text-gray-400 max-w-4xl mx-auto mb-12 leading-relaxed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            I build{" "}
            <span className="font-semibold text-purple-600 dark:text-purple-400">
              beautiful
            </span>{" "}
            and{" "}
            <span className="font-semibold text-blue-600 dark:text-blue-400">
              scalable
            </span>{" "}
            web applications that solve real-world problems with modern
            technologies.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 }}
          >
            <Link
              to="/projects"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
            >
              <span className="relative z-10">View My Work</span>
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
                initial={{ x: "100%" }}
                whileHover={{ x: "0%" }}
                transition={{ duration: 0.3 }}
              />
            </Link>
            <Link
              to="/contact"
              className="group px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold rounded-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
            >
              Get In Touch
            </Link>
          </motion.div>

          {/* Social Links */}
          <motion.div
            className="flex justify-center space-x-8"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.2 }}
          >
            {socialLinks.map((link, index) => (
              <motion.a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`group flex flex-col items-center space-y-2 text-gray-600 dark:text-gray-400 ${link.color} transition-all duration-300`}
                whileHover={{ scale: 1.1, y: -5 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.2 + index * 0.1 }}
              >
                <div className="text-3xl group-hover:scale-110 transition-transform duration-300">
                  {link.icon}
                </div>
                <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {link.name}
                </span>
              </motion.a>
            ))}
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1.5 }}
          >
            <motion.div
              className="w-6 h-10 border-2 border-gray-400 dark:border-gray-600 rounded-full flex justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 1.5, repeat: Infinity }}
            >
              <motion.div
                className="w-1 h-3 bg-gray-400 dark:bg-gray-600 rounded-full mt-2"
                animate={{ y: [0, 12, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
