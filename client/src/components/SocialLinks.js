/**
 * Social links component - Single Responsibility
 */
import React from "react";
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const SocialLinks = ({
  links = [
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
  ],
}) => {
  return (
    <motion.div
      className="flex justify-center space-x-8"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 1.2 }}
    >
      {links.map((link, index) => (
        <SocialLink key={link.name} link={link} index={index} />
      ))}
    </motion.div>
  );
};

const SocialLink = ({ link, index }) => (
  <motion.a
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
);

const linkShape = PropTypes.shape({
  name: PropTypes.string.isRequired,
  url: PropTypes.string.isRequired,
  icon: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
});

SocialLinks.propTypes = {
  links: PropTypes.arrayOf(linkShape),
};

SocialLink.propTypes = {
  link: linkShape.isRequired,
  index: PropTypes.number.isRequired,
};

export default SocialLinks;
