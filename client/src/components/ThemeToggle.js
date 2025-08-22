import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
  const [dark, setDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);

  const toggleTheme = () => {
    setDark(!dark);
  };

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-14 h-8 bg-gray-200 dark:bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="w-6 h-6 bg-white dark:bg-gray-900 rounded-full shadow-lg flex items-center justify-center"
        animate={{
          x: dark ? 24 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.span
          className="text-xs"
          animate={{ rotate: dark ? 360 : 0 }}
          transition={{ duration: 0.5 }}
        >
          {dark ? "🌙" : "☀️"}
        </motion.span>
      </motion.div>

      {/* Background icons */}
      <motion.div
        className="absolute inset-0 flex items-center justify-between px-2 pointer-events-none"
        initial={false}
      >
        <motion.span
          className="text-xs"
          animate={{
            opacity: dark ? 0 : 1,
            scale: dark ? 0.8 : 1,
          }}
          transition={{ duration: 0.2 }}
        >
          ☀️
        </motion.span>
        <motion.span
          className="text-xs"
          animate={{
            opacity: dark ? 1 : 0,
            scale: dark ? 1 : 0.8,
          }}
          transition={{ duration: 0.2 }}
        >
          🌙
        </motion.span>
      </motion.div>
    </motion.button>
  );
}
