import React from "react";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col justify-center items-center text-center px-4">
      <motion.h1
        className="text-5xl font-extrabold text-gray-900 dark:text-white mb-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        Hi, I'm Ritik
      </motion.h1>
      <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl">
        I'm a Full Stack Engineer. I build web systems using React and Go. Check
        out my work or connect with me!
      </p>
    </div>
  );
}
