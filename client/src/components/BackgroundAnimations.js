/**
 * Background animation component - Single Responsibility
 */
import React from "react";
import { motion } from "framer-motion";

const BackgroundAnimations = () => {
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
  );
};

export default BackgroundAnimations;
