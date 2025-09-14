/**
 * Hero section component - Single Responsibility
 */
import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";
import { useTypingAnimation } from "../hooks/useTypingAnimation";

const HeroSection = ({
  roles = [
    "Full Stack Developer",
    "React Enthusiast",
    "Go Developer",
    "Problem Solver",
  ],
}) => {
  const typedText = useTypingAnimation(roles);

  return (
    <motion.div
      className="max-w-6xl mx-auto text-center"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1 }}
    >
      {/* Profile Section */}
      <ProfileAvatar />

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
      <TypingDisplay text={typedText} />

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
    </motion.div>
  );
};

const ProfileAvatar = () => (
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
);

const TypingDisplay = ({ text }) => (
  <motion.div
    className="h-16 mb-8"
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ duration: 1, delay: 0.6 }}
  >
    <p className="text-2xl md:text-3xl text-gray-700 dark:text-gray-300 font-medium">
      I'm a{" "}
      <span className="text-blue-600 dark:text-blue-400 font-bold">
        {text}
        <motion.span
          className="inline-block w-0.5 h-8 bg-blue-600 dark:bg-blue-400 ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
        />
      </span>
    </p>
  </motion.div>
);

HeroSection.propTypes = {
  roles: PropTypes.arrayOf(PropTypes.string),
};

TypingDisplay.propTypes = {
  text: PropTypes.string.isRequired,
};

export default HeroSection;
