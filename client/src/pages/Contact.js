import React from "react";
import { motion } from "framer-motion";
import ContactForm from "../components/ContactForm";
import ApiService from "../services/ApiService";

export default function Contact() {
 const handleSubmit = (formData) => ApiService.post("/api/contact", formData);

 const contactInfo = [
  {
   label: "Email",
   value: "ritikvaidyasen@gmail.com",
   icon: "📧",
   link: "mailto:ritikvaidyasen@gmail.com",
  },
  {
   label: "LinkedIn",
   value: "linkedin.com/in/vaidyasen",
   icon: "💼",
   link: "https://www.linkedin.com/in/vaidyasen/",
  },
  {
   label: "GitHub",
   value: "github.com/vaidyasen",
   icon: "🐙",
   link: "https://github.com/vaidyasen",
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
      <div className="bg-gray-100 dark:bg-gray-800 p-8 rounded-xl shadow-lg">
       <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
        Send me a message
       </h2>
       <ContactForm onSubmit={handleSubmit} />
      </div>
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
