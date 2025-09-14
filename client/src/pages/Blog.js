import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export default function Blog() {
 const [blogs, setBlogs] = useState([]);
 const [loading, setLoading] = useState(true);
 const [currentPage, setCurrentPage] = useState(1);
 const [pagination, setPagination] = useState({});

 // Fetch blogs from API
 useEffect(() => {
  const fetchBlogs = async () => {
   try {
    setLoading(true);
    const response = await axios.get(
     `${API_BASE_URL}/api/blogs?page=${currentPage}&limit=6`
    );

    if (response.data.blogs) {
     setBlogs(response.data.blogs);
     setPagination(response.data.pagination || {});
    }
   } catch (error) {
    console.error("Failed to fetch blogs:", error);
    setBlogs([]);
   } finally {
    setLoading(false);
   }
  };

  fetchBlogs();
 }, [currentPage]);

 const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
   year: "numeric",
   month: "long",
   day: "numeric",
  });
 };

 const truncateText = (text, maxLength = 150) => {
  if (!text) return "";
  return text.length > maxLength
   ? text.substring(0, maxLength) + "..."
   : text;
 };

 return (
  <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
   <div className="max-w-6xl mx-auto">
    <motion.h1
     className="text-5xl md:text-6xl font-bold text-center mb-6"
     initial={{ opacity: 0, y: -50 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6 }}
    >
     <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
      Blog
     </span>
    </motion.h1>

    <motion.p
     className="text-xl text-gray-600 dark:text-gray-300 text-center mb-16 max-w-3xl mx-auto"
     initial={{ opacity: 0, y: 20 }}
     animate={{ opacity: 1, y: 0 }}
     transition={{ duration: 0.6, delay: 0.2 }}
    >
     Thoughts, experiences, and insights from my development journey
    </motion.p>

    {loading ? (
     // Loading skeleton
     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {Array.from({ length: 6 }, (_, index) => (
       <div
        key={`loading-${index}`}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden animate-pulse"
       >
        <div className="h-48 bg-gray-200 dark:bg-gray-700" />
        <div className="p-6">
         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-4" />
         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded mb-2" />
         <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        </div>
       </div>
      ))}
     </div>
    ) : blogs.length > 0 ? (
     <>
      {/* Blog Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
       {blogs.map((blog, index) => (
        <motion.article
         key={blog.id}
         className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
         initial={{ opacity: 0, y: 20 }}
         animate={{ opacity: 1, y: 0 }}
         transition={{ duration: 0.6, delay: index * 0.1 }}
         whileHover={{ y: -5 }}
        >
         {blog.image && (
          <div className="h-48 overflow-hidden">
           <img
            src={blog.image}
            alt={blog.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
           />
          </div>
         )}

         <div className="p-6">
          <div className="flex items-center justify-between mb-4">
           <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
            {formatDate(blog.published_at || blog.created_at)}
           </span>
           <span className="text-sm text-gray-500 dark:text-gray-400">
            {blog.view_count || 0} views
           </span>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-3 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
           {blog.title}
          </h2>

          <p className="text-gray-600 dark:text-gray-300 mb-4 leading-relaxed">
           {truncateText(blog.excerpt || blog.content)}
          </p>

          {blog.tags && blog.tags.length > 0 && (
           <div className="flex flex-wrap gap-2 mb-4">
            {blog.tags.slice(0, 3).map((tag, tagIndex) => (
             <span
              key={`${blog.id}-tag-${tagIndex}`}
              className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded-full"
             >
              {tag}
             </span>
            ))}
           </div>
          )}

          <button className="text-blue-600 dark:text-blue-400 font-medium hover:text-blue-800 dark:hover:text-blue-200 transition-colors">
           Read More →
          </button>
         </div>
        </motion.article>
       ))}
      </div>

      {/* Pagination */}
      {pagination.total_pages > 1 && (
       <motion.div
        className="flex justify-center mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
       >
        <div className="flex space-x-2">
         {currentPage > 1 && (
          <button
           onClick={() => setCurrentPage(currentPage - 1)}
           className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-md transition-shadow"
          >
           Previous
          </button>
         )}

         {Array.from(
          { length: pagination.total_pages },
          (_, i) => i + 1
         ).map((page) => (
          <button
           key={page}
           onClick={() => setCurrentPage(page)}
           className={`px-4 py-2 rounded-lg shadow transition-all ${
            currentPage === page
             ? "bg-blue-600 text-white"
             : "bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:shadow-md"
           }`}
          >
           {page}
          </button>
         ))}

         {currentPage < pagination.total_pages && (
          <button
           onClick={() => setCurrentPage(currentPage + 1)}
           className="px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg shadow hover:shadow-md transition-shadow"
          >
           Next
          </button>
         )}
        </div>
       </motion.div>
      )}
     </>
    ) : (
     // No blogs message
     <motion.div
      className="text-center py-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
     >
      <div className="text-6xl mb-6">📝</div>
      <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
       No Blog Posts Yet
      </h3>
      <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
       Stay tuned! I'll be sharing my thoughts and experiences here soon.
      </p>
     </motion.div>
    )}
   </div>
  </div>
 );
}
