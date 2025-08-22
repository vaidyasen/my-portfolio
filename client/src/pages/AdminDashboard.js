import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get("/admin/dashboard");
      setStats(response.data.stats);
    } catch (error) {
      console.error("Error fetching stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      title: "Projects",
      value: stats.projects,
      icon: "🚀",
      color: "from-blue-500 to-blue-600",
      link: "/admin/projects",
    },
    {
      title: "Skills",
      value: stats.skills,
      icon: "⚡",
      color: "from-green-500 to-green-600",
      link: "/admin/skills",
    },
    {
      title: "Blog Posts",
      value: stats.blogs,
      icon: "📝",
      color: "from-purple-500 to-purple-600",
      link: "/admin/blog",
    },
  ];

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold gradient-text mb-2">Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome to your portfolio administration panel
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {statCards.map((card, index) => (
            <motion.a
              key={card.title}
              href={card.link}
              className="block"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
            >
              <div
                className={`bg-gradient-to-r ${card.color} rounded-xl p-6 text-white shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/80 text-sm font-medium">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold">{card.value}</p>
                  </div>
                  <div className="text-4xl opacity-80">{card.icon}</div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.a
              href="/admin/projects"
              className="flex items-center space-x-3 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">➕</span>
              <span className="font-medium text-blue-700 dark:text-blue-300">
                Add Project
              </span>
            </motion.a>

            <motion.a
              href="/admin/skills"
              className="flex items-center space-x-3 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">🎯</span>
              <span className="font-medium text-green-700 dark:text-green-300">
                Manage Skills
              </span>
            </motion.a>

            <motion.a
              href="/admin/blog"
              className="flex items-center space-x-3 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/30 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">✍️</span>
              <span className="font-medium text-purple-700 dark:text-purple-300">
                Write Blog
              </span>
            </motion.a>

            <motion.a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">👁️</span>
              <span className="font-medium text-gray-700 dark:text-gray-300">
                View Site
              </span>
            </motion.a>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">
            System Status
          </h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 dark:text-green-300 font-medium">
                  API Server
                </span>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm">
                Running
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-green-500 rounded-full"></span>
                <span className="text-green-700 dark:text-green-300 font-medium">
                  Database
                </span>
              </div>
              <span className="text-green-600 dark:text-green-400 text-sm">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-center space-x-3">
                <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  Last Backup
                </span>
              </div>
              <span className="text-blue-600 dark:text-blue-400 text-sm">
                Today
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
