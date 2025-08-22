import React from "react";
import { motion } from "framer-motion";
import { useAuth } from "../contexts/AuthContext";

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: "Dashboard", path: "/admin", icon: "📊" },
    { name: "Projects", path: "/admin/projects", icon: "🚀" },
    { name: "Skills", path: "/admin/skills", icon: "⚡" },
    { name: "Blog", path: "/admin/blog", icon: "📝" },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = "/admin/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Top Navigation */}
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold gradient-text">
                  Portfolio Admin
                </h1>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <span className="text-gray-700 dark:text-gray-300">
                Welcome, {user?.username}
              </span>
              <motion.button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Logout
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-white dark:bg-gray-800 shadow-lg min-h-screen">
          <div className="p-6">
            <nav className="space-y-2">
              {navItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.path}
                  className="flex items-center space-x-3 px-4 py-3 text-gray-700 dark:text-gray-300 hover:bg-blue-50 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400 rounded-lg transition-colors"
                  whileHover={{ x: 5 }}
                >
                  <span className="text-xl">{item.icon}</span>
                  <span className="font-medium">{item.name}</span>
                </motion.a>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
};

export default AdminLayout;
