/**
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';
import { schemas } from '../utils/validation';
import { useAsyncOperation } from '../hooks/useApiData';
import { LoadingSpinner } from './Loading';ntact form component with proper validation and error handling
 * Follows Single Responsibility and Interface Segregation principles
 */
import React, { useState } from "react";
import { motion } from "framer-motion";
import { schemas } from "../utils/validation";
import { useAsyncOperation } from "../hooks/useApiData";
import { LoadingSpinner } from "./Loading";

const ContactForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [validationErrors, setValidationErrors] = useState({});
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const { execute, loading, error } = useAsyncOperation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear validation error for this field
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitSuccess(false);

    // Validate form data
    const validation = schemas.contact.validate(formData);

    if (!validation.isValid) {
      setValidationErrors(validation.errors);
      return;
    }

    setValidationErrors({});

    // Submit form
    const result = await execute(() => onSubmit(formData));

    if (result.success) {
      setSubmitSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    }
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {submitSuccess && (
        <motion.div
          className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          Message sent successfully! I'll get back to you soon.
        </motion.div>
      )}

      {error && (
        <motion.div
          className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          {error}
        </motion.div>
      )}

      <FormField
        label="Name"
        name="name"
        type="text"
        value={formData.name}
        onChange={handleChange}
        error={validationErrors.name}
        required
      />

      <FormField
        label="Email"
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        error={validationErrors.email}
        required
      />

      <FormField
        label="Message"
        name="message"
        type="textarea"
        rows={5}
        value={formData.message}
        onChange={handleChange}
        error={validationErrors.message}
        required
      />

      <motion.button
        type="submit"
        disabled={loading}
        className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
      >
        {loading ? (
          <>
            <LoadingSpinner size="small" color="white" />
            <span className="ml-2">Sending...</span>
          </>
        ) : (
          "Send Message"
        )}
      </motion.button>
    </motion.form>
  );
};

const FormField = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  error,
  required = false,
  rows,
  ...props
}) => {
  const fieldId = `field-${name}`;

  return (
    <div className="space-y-2">
      <label
        htmlFor={fieldId}
        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
      >
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {type === "textarea" ? (
        <textarea
          id={fieldId}
          name={name}
          value={value}
          onChange={onChange}
          rows={rows}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none transition-colors ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          } dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
          {...props}
        />
      ) : (
        <input
          id={fieldId}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
            error
              ? "border-red-300 bg-red-50"
              : "border-gray-300 bg-white hover:border-gray-400"
          } dark:bg-gray-800 dark:border-gray-600 dark:text-white`}
          {...props}
        />
      )}

      {error && (
        <motion.p
          className="text-sm text-red-600"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
};

ContactForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
};

FormField.propTypes = {
  label: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.string,
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string,
  required: PropTypes.bool,
  rows: PropTypes.number,
};

export default ContactForm;
