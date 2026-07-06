// src/pages/Contact.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Trash2, Eye } from "lucide-react"; // Updated icons
import Pagination from "../component/Pagination";

const Contact = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const MESSAGES_PER_PAGE = 25;
  // Fetch all contact messages
  const fetchMessages = async () => {
    try {
      const res = await axios.get("/api/contact/getContactMessages"); // relative path
      setMessages(res.data.messages);
      setLoading(false);
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire("Error", "Failed to fetch messages", "error");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  // Delete a message
  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#f97316",
      cancelButtonColor: "#6b7280",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/api/contact/deleteContactMessage/${id}`);
        Swal.fire("Deleted!", "Message has been deleted.", "success");
        fetchMessages();
      } catch (error) {
        console.error("Delete Error:", error);
        Swal.fire("Error", "Failed to delete message", "error");
      }
    }
  };

  const handleView = (msg) => {
    Swal.fire({
      title: `<strong>Message from ${msg.fullName}</strong>`,
      html: `
        <p><strong>Email:</strong> ${msg.email}</p>
        <p><strong>Phone:</strong> ${msg.phone || "-"}</p>
        <p><strong>Message:</strong> ${msg.message}</p>
      `,
      icon: "info",
    });
  };

  const indexOfLast = currentPage * MESSAGES_PER_PAGE;
  const indexOfFirst = indexOfLast - MESSAGES_PER_PAGE;

  const currentMessages = messages.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(messages.length / MESSAGES_PER_PAGE);

  if (loading) return <p className="text-center mt-10">Loading messages...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">
        Contact <span className="text-orange-500">Messages</span>
      </h1>

      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-50 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Message</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {messages.length === 0 ? (
              <tr>
                <td colSpan="5" className="text-center py-6 text-gray-500">
                  No messages found
                </td>
              </tr>
            ) : (
              currentMessages.map((msg, index) => (
                <tr key={msg._id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-3">{msg.fullName}</td>
                  <td className="px-4 py-3">{msg.email}</td>
                  <td className="px-4 py-3">{msg.message}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      className="p-2 bg-green-100 text-green-600 rounded-md"
                      onClick={() => handleView(msg)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-md"
                      onClick={() => handleDelete(msg._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {messages.length > MESSAGES_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}
    </div>
  );
};

export default Contact;
