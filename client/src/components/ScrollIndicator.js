/**
 * Scroll indicator component - Single Responsibility
 */
import React from "react";
import { motion } from "framer-motion";

const ScrollIndicator = () => {
  return (
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
  );
};

export default ScrollIndicator;
