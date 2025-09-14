import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import AdminLayout from "../components/AdminLayout";
import SkillService from "../services/SkillService";

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingSkill, setEditingSkill] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    icon: "",
    description: "",
  });
  const skillCategories = [
    "Frontend",
    "Backend",
    "Database",
    "DevOps",
    "Mobile",
    "Design",
    "Tools",
    "Other",
  ];

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      console.log(
        "🔑 Fetching skills with token:",
        localStorage.getItem("admin_token") ? "✅ Present" : "❌ Missing"
      );

      const response = await SkillService.getAdminSkills({
        search: searchTerm,
        category: categoryFilter,
      });

      console.log("📊 Skills response:", response);

      if (response.success) {
        setSkills(response.data.skills || []);
        console.log("✅ Skills loaded:", response.data.skills?.length || 0);
      } else {
        console.error("❌ Error fetching skills:", response.error);
      }
    } catch (error) {
      console.error("💥 Exception fetching skills:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchSkills();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, categoryFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let response;
      if (editingSkill) {
        response = await SkillService.updateSkill(editingSkill.id, formData);
      } else {
        response = await SkillService.createSkill(formData);
      }

      if (response.success) {
        fetchSkills();
        resetForm();
        setShowModal(false);
      } else {
        console.error("Error saving skill:", response.error);
      }
    } catch (error) {
      console.error("Error saving skill:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this skill?")) {
      try {
        const response = await SkillService.deleteSkill(id);
        if (response.success) {
          fetchSkills();
        } else {
          console.error("Error deleting skill:", response.error);
        }
      } catch (error) {
        console.error("Error deleting skill:", error);
      }
    }
  };

  const handleEdit = (skill) => {
    setEditingSkill(skill);
    setFormData({
      name: skill.name,
      category: skill.category,
      icon: skill.icon,
      description: skill.description,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      icon: "",
      description: "",
    });
    setEditingSkill(null);
  };

  const getCategoryColor = (category) => {
    const colors = {
      Frontend: "bg-blue-100 text-blue-800/20",
      Backend: "bg-purple-100 text-purple-800/20",
      Database: "bg-indigo-100 text-indigo-800/20",
      DevOps: "bg-gray-100 text-gray-800",
      Mobile: "bg-pink-100 text-pink-800/20",
      Design: "bg-cyan-100 text-cyan-800/20",
      Tools: "bg-emerald-100 text-emerald-800/20",
      Other: "bg-slate-100 text-slate-800",
    };
    return colors[category] || colors.Other;
  };

  const uniqueCategories = [...new Set(skills.map((skill) => skill.category))];

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
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold gradient-text">
              Skills Management
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your technical skills and expertise
            </p>
          </div>
          <motion.button
            onClick={() => {
              resetForm();
              setShowModal(true);
            }}
            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            + Add Skill
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search-skills"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Search Skills
              </label>
              <input
                id="search-skills"
                type="text"
                placeholder="Search by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              />
            </div>
            <div>
              <label
                htmlFor="category-filter"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Filter by Category
              </label>
              <select
                id="category-filter"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">All Categories</option>
                {uniqueCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {skills.map((skill, index) => (
              <motion.div
                key={skill.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {skill.icon && (
                      <span className="text-2xl">{skill.icon}</span>
                    )}
                    <div>
                      <h3 className="font-semibold text-gray-900">
                        {skill.name}
                      </h3>
                      <div className="flex space-x-2 mt-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(
                            skill.category
                          )}`}
                        >
                          {skill.category}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(skill)}
                      className="p-2 text-blue-500 hover:bg-blue-50:bg-blue-900/20 rounded-lg transition-colors"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(skill.id)}
                      className="p-2 text-red-500 hover:bg-red-50:bg-red-900/20 rounded-lg transition-colors"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
                {skill.description && (
                  <p className="text-gray-600 text-sm">{skill.description}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {skills.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🎯</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No skills found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || categoryFilter
                ? "Try adjusting your search or filter criteria"
                : "Start by adding your first skill"}
            </p>
            <motion.button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Add Your First Skill
            </motion.button>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
              onClick={() => setShowModal(false)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900">
                  {editingSkill ? "Edit Skill" : "Add New Skill"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="skill-name"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Skill Name *
                    </label>
                    <input
                      id="skill-name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="e.g., React.js"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skill-category"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Category *
                    </label>
                    <select
                      id="skill-category"
                      required
                      value={formData.category}
                      onChange={(e) =>
                        setFormData({ ...formData, category: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                    >
                      <option value="">Select Category</option>
                      {skillCategories.map((category) => (
                        <option key={category} value={category}>
                          {category}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="skill-icon"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Icon (Emoji)
                    </label>
                    <input
                      id="skill-icon"
                      type="text"
                      value={formData.icon}
                      onChange={(e) =>
                        setFormData({ ...formData, icon: e.target.value })
                      }
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="⚛️ (optional)"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="skill-description"
                      className="block text-sm font-medium text-gray-700 mb-2"
                    >
                      Description
                    </label>
                    <textarea
                      id="skill-description"
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900"
                      placeholder="Brief description of your experience with this skill..."
                    />
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      {editingSkill ? "Update" : "Create"}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </AdminLayout>
  );
};

export default AdminSkills;
