import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import AdminLayout from "../components/AdminLayout";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0,
  });
  const [selectedContact, setSelectedContact] = useState(null);
  const [showContactModal, setShowContactModal] = useState(false);

  useEffect(() => {
    fetchContacts();
  }, [pagination.page]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("admin_token");
      console.log("Fetching contacts with token:", token);
      console.log("Axios default headers:", axios.defaults.headers.common);

      // Ensure token is set for this request
      if (token) {
        axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      }

      const response = await axios.get(
        `/admin/contacts?page=${pagination.page}&limit=${pagination.limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Contacts response:", response.data);
      setContacts(response.data.contacts || []);
      setPagination(
        response.data.pagination || {
          page: 1,
          limit: 10,
          total: 0,
          pages: 0,
        }
      );
    } catch (error) {
      console.error("Error fetching contacts:", error);
      console.error("Error status:", error.response?.status);
      console.error("Error details:", error.response?.data);
      alert("Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (contactId, read) => {
    try {
      await axios.put(`/admin/contacts/${contactId}/read`, { read });
      setContacts(
        contacts.map((contact) =>
          contact.ID === contactId ? { ...contact, read } : contact
        )
      );
    } catch (error) {
      console.error("Error updating contact:", error);
      alert("Failed to update contact");
    }
  };

  const deleteContact = async (contactId) => {
    if (
      !window.confirm("Are you sure you want to delete this contact message?")
    ) {
      return;
    }

    try {
      await axios.delete(`/admin/contacts/${contactId}`);
      setContacts(contacts.filter((contact) => contact.ID !== contactId));
      alert("Contact deleted successfully!");
    } catch (error) {
      console.error("Error deleting contact:", error);
      alert("Failed to delete contact");
    }
  };

  const openContactModal = (contact) => {
    setSelectedContact(contact);
    setShowContactModal(true);
    if (!contact.read) {
      markAsRead(contact.ID, true);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const nextPage = () => {
    if (pagination.page < pagination.pages) {
      setPagination((prev) => ({ ...prev, page: prev.page + 1 }));
    }
  };

  const prevPage = () => {
    if (pagination.page > 1) {
      setPagination((prev) => ({ ...prev, page: prev.page - 1 }));
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500"></div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-6"
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Contact Messages
            </h1>
            <p className="text-gray-600">Manage contact form submissions</p>
          </div>
          <div className="text-sm text-gray-500 flex-shrink-0 ml-4">
            Total: {pagination.total} messages
          </div>
        </div>

        {/* Contact Messages List */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          {contacts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500">No contact messages yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Message Preview
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {contacts.map((contact) => (
                    <tr
                      key={contact.ID}
                      className={`hover:bg-gray-50:bg-gray-700 cursor-pointer ${
                        !contact.read ? "bg-blue-50/20" : ""
                      }`}
                      onClick={() => openContactModal(contact)}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span
                          className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            contact.read
                              ? "bg-gray-100 text-gray-800"
                              : "bg-blue-100 text-blue-800"
                          }`}
                        >
                          {contact.read ? "Read" : "Unread"}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-medium text-gray-900">
                          {contact.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-gray-900">{contact.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900 truncate max-w-xs">
                          {contact.message}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDate(contact.CreatedAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            markAsRead(contact.ID, !contact.read);
                          }}
                          className="text-blue-600 hover:text-blue-900:text-blue-300 mr-4"
                        >
                          {contact.read ? "Mark Unread" : "Mark Read"}
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            deleteContact(contact.ID);
                          }}
                          className="text-red-600 hover:text-red-900:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing page {pagination.page} of {pagination.pages}
            </div>
            <div className="flex space-x-2">
              <button
                onClick={prevPage}
                disabled={pagination.page === 1}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>
              <button
                onClick={nextPage}
                disabled={pagination.page === pagination.pages}
                className="px-4 py-2 text-sm font-medium text-gray-500 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </motion.div>

      {/* Contact Details Modal */}
      {showContactModal && selectedContact && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-2xl font-bold text-gray-900">
                  Contact Message
                </h2>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="text-gray-400 hover:text-gray-600:text-gray-300"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Name
                  </label>
                  <p className="text-gray-900">{selectedContact.name}</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <p className="text-gray-900">
                    <a
                      href={`mailto:${selectedContact.email}`}
                      className="text-blue-600 hover:text-blue-800:text-blue-300"
                    >
                      {selectedContact.email}
                    </a>
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Received
                  </label>
                  <p className="text-gray-900">
                    {formatDate(selectedContact.CreatedAt)}
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-900 whitespace-pre-wrap">
                      {selectedContact.message}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() =>
                    markAsRead(selectedContact.ID, !selectedContact.read)
                  }
                  className="px-4 py-2 text-sm font-medium text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200:bg-blue-800"
                >
                  {selectedContact.read ? "Mark as Unread" : "Mark as Read"}
                </button>
                <button
                  onClick={() => {
                    deleteContact(selectedContact.ID);
                    setShowContactModal(false);
                  }}
                  className="px-4 py-2 text-sm font-medium text-red-600 bg-red-100 rounded-md hover:bg-red-200:bg-red-800"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowContactModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminContacts;
