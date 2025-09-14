/**
 * Call-to-action buttons component - Single Responsibility
 */
import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PropTypes from "prop-types";

const CTAButtons = () => {
  return (
    <motion.div
      className="flex flex-col sm:flex-row gap-6 justify-center mb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1 }}
    >
      <PrimaryButton to="/projects" text="View My Work" />
      <SecondaryButton to="/contact" text="Get In Touch" />
    </motion.div>
  );
};

const PrimaryButton = ({ to, text }) => (
  <Link
    to={to}
    className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-2xl overflow-hidden transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-2xl"
  >
    <span className="relative z-10">{text}</span>
    <motion.div
      className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600"
      initial={{ x: "100%" }}
      whileHover={{ x: "0%" }}
      transition={{ duration: 0.3 }}
    />
  </Link>
);

const SecondaryButton = ({ to, text }) => (
  <Link
    to={to}
    className="group px-8 py-4 border-2 border-blue-600 dark:border-blue-400 text-blue-600 dark:text-blue-400 font-bold rounded-2xl hover:bg-blue-600 hover:text-white dark:hover:bg-blue-400 dark:hover:text-gray-900 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-2xl"
  >
    {text}
  </Link>
);

PrimaryButton.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

SecondaryButton.propTypes = {
  to: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default CTAButtons;
