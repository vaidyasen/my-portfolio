import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function Footer() {
  const socialLinks = [
    {
      name: "GitHub",
      url: "https://github.com/ritikvaidyasen",
      icon: "🐙",
    },
    {
      name: "LinkedIn",
      url: "https://linkedin.com/in/ritikvaidyasen",
      icon: "💼",
    },
    {
      name: "Twitter",
      url: "https://twitter.com/ritikvaidyasen",
      icon: "🐦",
    },
    {
      name: "Email",
      url: "mailto:ritik@example.com",
      icon: "📧",
    },
  ];

  const quickLinks = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Projects", path: "/projects" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <footer className="bg-gray-900 dark:bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <motion.div
              className="flex items-center space-x-3 mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                R
              </div>
              <div>
                <h3 className="text-2xl font-bold">Ritik Vaidyasen</h3>
                <p className="text-gray-400">Full Stack Developer</p>
              </div>
            </motion.div>
            <motion.p
              className="text-gray-400 mb-6 max-w-md leading-relaxed"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Passionate about building modern web applications that make a
              difference. Always learning, always creating.
            </motion.p>
            <motion.div
              className="flex space-x-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {socialLinks.map((link) => (
                <motion.a
                  key={link.name}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 bg-gray-800 hover:bg-gradient-to-br hover:from-blue-500 hover:to-purple-600 rounded-full flex items-center justify-center transition-all duration-300"
                  whileHover={{ scale: 1.1, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="text-lg">{link.icon}</span>
                </motion.a>
              ))}
            </motion.div>
          </div>

          {/* Quick Links */}
          <div>
            <motion.h4
              className="text-lg font-semibold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Quick Links
            </motion.h4>
            <motion.ul
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.path}
                    className="text-gray-400 hover:text-white transition-colors duration-200"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </motion.ul>
          </div>

          {/* Contact Info */}
          <div>
            <motion.h4
              className="text-lg font-semibold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              viewport={{ once: true }}
            >
              Get In Touch
            </motion.h4>
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <p className="text-gray-400">
                <span className="block font-medium text-white">Email</span>
                ritik@example.com
              </p>
              <p className="text-gray-400">
                <span className="block font-medium text-white">Location</span>
                Your City, Country
              </p>
            </motion.div>
          </div>
        </div>

        {/* Bottom Bar */}
        <motion.div
          className="border-t border-gray-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <p className="text-gray-400 text-sm mb-4 md:mb-0">
            © 2025 Ritik Vaidyasen. All rights reserved. Built with ❤️ using
            React & Go.
          </p>
          <div className="flex items-center space-x-4 text-sm text-gray-400">
            <button className="hover:text-white transition-colors">
              Privacy Policy
            </button>
            <span>•</span>
            <button className="hover:text-white transition-colors">
              Terms of Service
            </button>
          </div>
        </motion.div>
      </div>

      {/* Background Pattern */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent opacity-30"></div>
    </footer>
  );
}
