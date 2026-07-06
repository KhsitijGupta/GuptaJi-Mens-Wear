import React, { useState, useEffect } from "react";
import { Trash2, Plus, Calendar, Edit, X } from "lucide-react";
import Swal from "sweetalert2";import api from '@/utils/api';

const BlogPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [formData, setFormData] = useState({
    title: "",
    date: "",
    description: "",
    link: "",
  });

  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ Get token from localStorage
 const authData = JSON.parse(sessionStorage.getItem("admin"));
 const token = authData?.token;  

  // ✅ Common axios config`
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchBlogs = async () => {
    try {
      const res = await api.get("/api/blog/getAllBlogs", axiosConfig);
      setBlogs(res.data);
    } catch (error) {
      console.error("Error fetching blogs:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.date || !formData.description) {
      return Swal.fire(
        "Missing Fields",
        "Please fill all required fields!",
        "warning"
      );
    }

    const data = new FormData();
    data.append("title", formData.title);
    data.append("date", formData.date);
    data.append("description", formData.description);
    data.append("link", formData.link || "");
    if (selectedFile) data.append("blogImage", selectedFile);

    try {
      if (isEditing) {
        // ✅ Update blog with token
        const res = await api.put(
          `/api/blog/updateBlog/${editingId}`,
          data,
          {
            headers: {
              ...axiosConfig.headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );
        setBlogs(blogs.map((b) => (b._id === editingId ? res.data : b)));
        Swal.fire("Updated!", "Blog has been updated.", "success");
      } else {
        // ✅ Upload blog with token
        const res = await api.post("/api/blog/uploadBlog", data, {
          headers: {
            ...axiosConfig.headers,
            "Content-Type": "multipart/form-data",
          },
        });
        setBlogs([res.data, ...blogs]);
        Swal.fire("Success!", "Blog uploaded successfully.", "success");
      }

      // Reset form
      setSelectedFile(null);
      setPreviewUrl(null);
      setFormData({ title: "", date: "", description: "", link: "" });
      setIsEditing(false);
      setEditingId(null);
      setShowModal(false);
    } catch (error) {
      console.error("Upload failed:", error);
      Swal.fire("Error", "Blog upload failed!", "error");
    }
  };

  const handleDeleteBlog = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This blog will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (confirm.isConfirmed) {
      try {
        await api.delete(`/api/blog/deleteBlog/${id}`, axiosConfig);
        setBlogs(blogs.filter((blog) => blog._id !== id));
        Swal.fire("Deleted!", "Your blog has been deleted.", "success");
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire("Error", "Failed to delete blog", "error");
      }
    }
  };

  const handleEditBlog = (blog) => {
    setFormData({
      title: blog.title,
      date: blog.date,
      description: blog.description,
      link: blog.link,
    });
    setIsEditing(true);
    setEditingId(blog._id);
    setShowModal(true);
    setPreviewUrl(blog.image || null); // Show old image if exists
    setSelectedFile(null); // Clear selected file
  };

  const openAddModal = () => {
    setShowModal(true);
    setIsEditing(false);
    setFormData({ title: "", date: "", description: "", link: "" });
    setSelectedFile(null);
    setPreviewUrl(null);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <h1 className="text-2xl font-bold text-gray-900">
            Blog{" "}
            <span className="bg-amber-500 bg-clip-text text-transparent">
              Manager
            </span>
          </h1>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2 bg-white text-amber-500 border border-amber-500 rounded-lg hover:bg-amber-500 hover:bg-gradient-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] hover:text-white font-semibold hover:border-none"
          >
            <Plus className="w-4 h-4" />
            Add Blog
          </button>
        </div>

        {/* Blog Cards */}
        {loading ? (
          <p className="text-center text-gray-500">Loading blogs...</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {blogs.map((blog) => (
              <div
                key={blog._id}
                className="bg-white rounded-lg shadow hover:shadow-md transition overflow-hidden flex flex-col"
              >
                {blog.image && (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="w-full h-52 sm:h-48 md:h-56 lg:h-60 object-cover"
                  />
                )}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-2 text-gray-500 text-sm mb-2">
                      <Calendar className="w-4 h-4" />
                      <span>{new Date(blog.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {blog.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <button
                      onClick={() =>
                        Swal.fire({
                          title: blog.title,
                          html: `
                          <div style="text-align: left;">
                            <p><strong>Date:</strong> ${new Date(
                              blog.date
                            ).toLocaleDateString()}</p>
                            <p style="margin-top:10px;">${blog.description}</p>
                            ${
                              blog.link
                                ? `<p style="margin-top:10px;"><a href="${blog.link}" target="_blank" style="color:#c56a0fbc; text-decoration:underline;">Visit Link</a></p>`
                                : ""
                            }
                          </div>
                        `,
                          imageUrl: blog.image,
                          imageAlt: blog.title,
                          confirmButtonColor: "#3085d6",
                        })
                      }
                      className="px-3 py-1 bg-gradient-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] text-white font-semibold text-sm rounded-lg"
                    >
                      View
                    </button>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBlog(blog)}
                        className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200 transition"
                      >
                        <Edit className="w-4 h-4 text-blue-700" />
                      </button>
                      <button
                        onClick={() => handleDeleteBlog(blog._id)}
                        className="bg-red-100 p-2 rounded-lg hover:bg-red-200 transition"
                      >
                        <Trash2 className="w-4 h-4 text-red-700" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-2 sm:p-6 overflow-auto">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md sm:max-w-2xl h-auto max-h-[90vh] sm:max-h-[90vh] mx-2 sm:mx-6 p-4 sm:p-6 flex flex-col overflow-hidden">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-amber-500 hover:text-amber-600 transition"
            >
              <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4 sm:mb-6 text-gray-800 border-b pb-2 sm:pb-3">
              {isEditing ? "Edit Blog" : "Add New Blog"}
            </h2>
            <div className="flex-1 overflow-y-auto space-y-4 sm:space-y-6 px-1 sm:px-4">
              {/* Blog Image */}
              <div className="bg-white p-3 sm:p-6 rounded-2xl shadow-lg">
                <label className="block border-b border-gray-300 pb-2 font-medium mb-2 sm:mb-3">
                  Blog Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-amber-50 file:text-amber-600
                    hover:file:bg-amber-100 cursor-pointer"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 sm:w-28 sm:h-28 object-cover rounded-lg mt-3 sm:mt-4"
                  />
                )}
              </div>

              {/* Title */}
              <div>
                <label className="block border-b border-gray-300 pb-1 sm:pb-2 font-medium mb-1 sm:mb-2">
                  Title
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter Title"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-50 focus:bg-white
                    focus:ring-2 focus:ring-amber-500 focus:ring-inset outline-none
                    transition shadow-sm text-sm sm:text-base"
                />
              </div>

              {/* Date */}
              <div>
                <label className="block border-b border-gray-300 pb-1 sm:pb-2 font-medium mb-1 sm:mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-50 focus:bg-white
                    focus:ring-2 focus:ring-amber-500 focus:ring-inset outline-none
                    transition shadow-sm text-sm sm:text-base"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block border-b border-gray-300 pb-1 sm:pb-2 font-medium mb-1 sm:mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter Description"
                  rows="4"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-50 focus:bg-white
                    focus:ring-2 focus:ring-amber-500 focus:ring-inset outline-none
                    transition shadow-sm text-sm sm:text-base resize-none"
                />
              </div>

              {/* Link */}
              <div>
                <label className="block border-b border-gray-300 pb-1 sm:pb-2 font-medium mb-1 sm:mb-2">
                  Link
                </label>
                <input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleInputChange}
                  placeholder="Enter Link"
                  className="w-full px-3 py-2 sm:px-4 sm:py-3 rounded-lg bg-gray-50 focus:bg-white
                    focus:ring-2 focus:ring-amber-500 focus:ring-inset outline-none
                    transition shadow-sm text-sm sm:text-base"
                />
              </div>
            </div>

            {/* Footer Buttons */}
            <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-3 mt-4 border-t pt-3 sm:pt-4 px-1 sm:px-4">
              <button
                onClick={() => setShowModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="px-7 py-2 rounded-xl bg-gradient-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] text-white font-semibold"
              >
                {isEditing ? "Update Blog" : "Save Blog"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
