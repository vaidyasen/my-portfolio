import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    excerpt: "",
    status: "draft",
    tags: "",
    featured_image: "",
  });

  const statusOptions = ["draft", "published", "archived"];

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await axios.get("/admin/blogs", {
        params: {
          search: searchTerm,
          status: statusFilter,
        },
      });
      setBlogs(response.data.blogs || []);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayedSearch = setTimeout(() => {
      fetchBlogs();
    }, 300);

    return () => clearTimeout(delayedSearch);
  }, [searchTerm, statusFilter]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const blogData = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter((tag) => tag),
      };

      if (editingBlog) {
        await axios.put(`/admin/blogs/${editingBlog.id}`, blogData);
      } else {
        await axios.post("/admin/blogs", blogData);
      }
      fetchBlogs();
      resetForm();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving blog:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this blog post?")) {
      try {
        await axios.delete(`/admin/blogs/${id}`);
        fetchBlogs();
      } catch (error) {
        console.error("Error deleting blog:", error);
      }
    }
  };

  const handleEdit = (blog) => {
    setEditingBlog(blog);
    setFormData({
      title: blog.title,
      content: blog.content,
      excerpt: blog.excerpt,
      status: blog.status,
      tags: blog.tags ? blog.tags.join(", ") : "",
      featured_image: blog.featured_image || "",
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      title: "",
      content: "",
      excerpt: "",
      status: "draft",
      tags: "",
      featured_image: "",
    });
    setEditingBlog(null);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "published":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300";
      case "archived":
        return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300";
      default:
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

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
              Blog Management
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Create and manage your blog posts
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
            + New Post
          </motion.button>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="search-blogs"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Search Posts
              </label>
              <input
                id="search-blogs"
                type="text"
                placeholder="Search by title or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label
                htmlFor="filter-status"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Filter by Status
              </label>
              <select
                id="filter-status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="">All Status</option>
                {statusOptions.map((status) => (
                  <option key={status} value={status}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Blog Posts */}
        <div className="space-y-4">
          <AnimatePresence>
            {blogs.map((blog, index) => (
              <motion.div
                key={blog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                        {blog.title}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          blog.status
                        )}`}
                      >
                        {blog.status}
                      </span>
                    </div>

                    {blog.excerpt && (
                      <p className="text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                        {blog.excerpt}
                      </p>
                    )}

                    <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                      <span>📅 {formatDate(blog.created_at)}</span>
                      {blog.updated_at !== blog.created_at && (
                        <span>✏️ Updated {formatDate(blog.updated_at)}</span>
                      )}
                      {blog.tags && blog.tags.length > 0 && (
                        <div className="flex items-center space-x-1">
                          <span>🏷️</span>
                          <div className="flex space-x-1">
                            {blog.tags.slice(0, 3).map((tag, tagIndex) => (
                              <span
                                key={tagIndex}
                                className="px-2 py-1 bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-300 rounded text-xs"
                              >
                                {tag}
                              </span>
                            ))}
                            {blog.tags.length > 3 && (
                              <span className="text-gray-500">
                                +{blog.tags.length - 3}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-2 ml-4">
                    <button
                      onClick={() => handleEdit(blog)}
                      className="p-2 text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Edit"
                    >
                      ✏️
                    </button>
                    <button
                      onClick={() => handleDelete(blog.id)}
                      className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {blogs.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No blog posts found
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm || statusFilter
                ? "Try adjusting your search or filter criteria"
                : "Start by creating your first blog post"}
            </p>
            <motion.button
              onClick={() => {
                resetForm();
                setShowModal(true);
              }}
              className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200 font-medium"
              whileHover={{ scale: 1.05 }}
            >
              Create Your First Post
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
                className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
                  {editingBlog ? "Edit Blog Post" : "Create New Blog Post"}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label
                        htmlFor="blog-title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Title *
                      </label>
                      <input
                        id="blog-title"
                        type="text"
                        required
                        value={formData.title}
                        onChange={(e) =>
                          setFormData({ ...formData, title: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Enter blog post title..."
                      />
                    </div>

                    <div>
                      <label
                        htmlFor="blog-status"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Status *
                      </label>
                      <select
                        id="blog-status"
                        required
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      >
                        {statusOptions.map((status) => (
                          <option key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label
                        htmlFor="blog-tags"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Tags
                      </label>
                      <input
                        id="blog-tags"
                        type="text"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="tag1, tag2, tag3..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="blog-featured-image"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Featured Image URL
                      </label>
                      <input
                        id="blog-featured-image"
                        type="url"
                        value={formData.featured_image}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            featured_image: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="blog-excerpt"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Excerpt
                      </label>
                      <textarea
                        id="blog-excerpt"
                        value={formData.excerpt}
                        onChange={(e) =>
                          setFormData({ ...formData, excerpt: e.target.value })
                        }
                        rows={3}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Brief description of the blog post..."
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label
                        htmlFor="blog-content"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Content *
                      </label>
                      <textarea
                        id="blog-content"
                        required
                        value={formData.content}
                        onChange={(e) =>
                          setFormData({ ...formData, content: e.target.value })
                        }
                        rows={12}
                        className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="Write your blog post content here... (Markdown supported)"
                      />
                    </div>
                  </div>

                  <div className="flex space-x-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all duration-200"
                    >
                      {editingBlog ? "Update Post" : "Create Post"}
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

export default AdminBlog;
