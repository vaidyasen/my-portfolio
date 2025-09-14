import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";
import { useAuth } from "../contexts/AuthContext";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

const AdminDashboard = () => {
  const { token } = useAuth();
  const [stats, setStats] = useState({
    projects: 0,
    skills: 0,
    blogs: 0,
  });
  const [loading, setLoading] = useState(true);

  const getAuthHeaders = () => ({
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/admin/dashboard`,
        getAuthHeaders()
      );
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
    {
      title: "Contact Messages",
      value: stats.contacts,
      icon: "📧",
      color: "from-orange-500 to-orange-600",
      link: "/admin/contacts",
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
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold text-black mb-3">Dashboard</h1>
              <p className="text-black text-xl font-medium">
                Welcome to your portfolio administration panel
              </p>
            </div>
            <motion.a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center space-x-3 p-4 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors border-2 border-gray-300"
              whileHover={{ scale: 1.02 }}
            >
              <span className="text-2xl">👁️</span>
              <span className="font-bold text-black text-lg">View Site</span>
            </motion.a>
          </div>
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
                className={`bg-gradient-to-r ${card.color} rounded-xl p-6 text-black shadow-lg`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-black/80 text-sm font-medium">
                      {card.title}
                    </p>
                    <p className="text-3xl font-bold text-black">
                      {card.value}
                    </p>
                  </div>
                  <div className="text-4xl opacity-80">{card.icon}</div>
                </div>
              </div>
            </motion.a>
          ))}
        </div>

        {/* System Status */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
          <h2 className="text-3xl font-bold mb-6 text-black">System Status</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="text-black font-bold text-xl">API Server</span>
              </div>
              <span className="text-green-800 font-bold bg-green-200 px-4 py-2 rounded-full text-lg">
                Running
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg border-2 border-green-300">
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-green-500 rounded-full"></span>
                <span className="text-black font-bold text-xl">Database</span>
              </div>
              <span className="text-green-800 font-bold bg-green-200 px-4 py-2 rounded-full text-lg">
                Connected
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg border-2 border-blue-300">
              <div className="flex items-center space-x-3">
                <span className="w-5 h-5 bg-blue-500 rounded-full"></span>
                <span className="text-black font-bold text-xl">
                  Last Backup
                </span>
              </div>
              <span className="text-blue-800 font-bold bg-blue-200 px-4 py-2 rounded-full text-lg">
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
