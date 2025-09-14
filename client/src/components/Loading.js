/**
 * Loading component with different variants
 * Follows Single Responsibility Principle
 */
import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const LoadingSpinner = ({ size = "medium", color = "blue" }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  };

  const colorClasses = {
    blue: "border-blue-500",
    white: "border-white",
    gray: "border-gray-500",
  };

  return (
    <motion.div
      className={`${sizeClasses[size]} border-4 ${colorClasses[color]} border-t-transparent rounded-full`}
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
    />
  );
};

const LoadingCard = () => (
  <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
    <div className="h-4 bg-gray-200 rounded w-2/3"></div>
  </div>
);

const LoadingPage = ({ message = "Loading..." }) => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="large" />
      <p className="mt-4 text-gray-600">{message}</p>
    </div>
  </div>
);

LoadingSpinner.propTypes = {
  size: PropTypes.oneOf(["small", "medium", "large"]),
  color: PropTypes.oneOf(["blue", "white", "gray"]),
};

LoadingPage.propTypes = {
  message: PropTypes.string,
};

export { LoadingSpinner, LoadingCard, LoadingPage };
