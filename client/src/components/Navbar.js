import React from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-800 shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Ritik
        </h1>
        <div className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-700 dark:hover:text-gray-300">
            Home
          </Link>
          <Link
            to="/projects"
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Projects
          </Link>
          <Link
            to="/contact"
            className="hover:text-gray-700 dark:hover:text-gray-300"
          >
            Contact
          </Link>
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
