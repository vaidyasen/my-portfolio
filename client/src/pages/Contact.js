import React, { useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_BASE_URL = process.env.REACT_APP_API_URL || "";

export default function Contact() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await axios.post(`${API_BASE_URL}/api/contact`, form);
      setSubmitStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Error sending message:", error);
      setSubmitStatus({
        type: "error",
        message:
          "Failed to send message. Please try again or contact me directly.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      label: "Email",
      value: "ritik@example.com",
      icon: "📧",
      link: "mailto:ritik@example.com",
    },
    {
      label: "LinkedIn",
      value: "linkedin.com/in/ritikvaidyasen",
      icon: "💼",
      link: "https://linkedin.com/in/ritikvaidyasen",
    },
    {
      label: "GitHub",
      value: "github.com/ritikvaidyasen",
      icon: "🐙",
      link: "https://github.com/ritikvaidyasen",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.h1
          className="text-5xl md:text-6xl font-bold text-center mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="gradient-text">Get In Touch</span>
        </motion.h1>

        <motion.p
          className="text-center text-gray-600 dark:text-gray-300 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          I'm always open to discussing new opportunities, interesting projects,
          or just having a conversation about technology and development.
        </motion.p>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <form
              onSubmit={handleSubmit}
              className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg"
            >
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                Send me a message
              </h2>

              {submitStatus && (
                <motion.div
                  className={`mb-6 p-4 rounded-lg ${
                    submitStatus.type === "success"
                      ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-700"
                      : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 border border-red-300 dark:border-red-700"
                  }`}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  {submitStatus.message}
                </motion.div>
              )}

              <div className="space-y-6">
                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Name *
                  </label>
                  <input
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Email *
                  </label>
                  <input
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-vertical"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </button>
              </div>
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
                  Let's connect
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-8">
                  I'm always interested in hearing about new projects and
                  opportunities. Whether you're a company looking to hire, a
                  fellow developer wanting to collaborate, or someone who just
                  wants to say hello, feel free to reach out!
                </p>
              </div>

              <div className="space-y-6">
                {contactInfo.map((info, index) => (
                  <motion.a
                    key={info.label}
                    href={info.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="text-3xl">{info.icon}</span>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {info.label}
                      </p>
                      <p className="text-gray-600 dark:text-gray-300 group-hover:text-blue-500 transition-colors">
                        {info.value}
                      </p>
                    </div>
                  </motion.a>
                ))}
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-xl text-white">
                <h3 className="text-xl font-semibold mb-2">Quick Response</h3>
                <p className="text-blue-100">
                  I typically respond to messages within 24 hours. Looking
                  forward to hearing from you!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
