import React, { useState, useEffect } from "react";
import { Trash2, Plus, Edit, X } from "lucide-react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";import api from '@/utils/api';
import Pagination from "../../component/Pagination";

const ITEMS_PER_PAGE = 25;

const Category = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]); // For search & pagination
  const [showModal, setShowModal] = useState(false);
  const [newCategory, setNewCategory] = useState({
    id: null,
    image: "",
    file: null,
    categoryName: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);
  const [currentPage, setCurrentPage] = useState(1);

  // Get auth token from session storage
  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  // File size limit 500KB in bytes
  const MAX_IMAGE_SIZE = 1024 * 500;

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/category/getAllCategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
      setFilteredCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial data fetch on mount
  useEffect(() => {
    fetchCategories();
  }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter categories by debounced search
  useEffect(() => {
    const filtered = categories.filter((cat) =>
      cat.categoryName.toLowerCase().includes(debouncedSearch.toLowerCase()),
    );
    setFilteredCategories(filtered);
    setCurrentPage(1); // Reset to first page when filter changes
  }, [debouncedSearch, categories]);

  // Handle file changes with preview and validation
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > MAX_IMAGE_SIZE) {
        Swal.fire("Error", `Image size must be less than 500KB`, "error");
        setNewCategory({ ...newCategory, file: null });
        setPreviewUrl(null);
        return;
      }
      setNewCategory({ ...newCategory, file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Save or update category
  const handleSave = async () => {
    if (!newCategory.categoryName) {
      Swal.fire("Error", "Please enter category name", "error");
      return;
    }

    if (!newCategory.id && !newCategory.file) {
      Swal.fire("Error", "Please upload a category image", "error");
      return;
    }

    if (newCategory.file && newCategory.file.size > MAX_IMAGE_SIZE) {
      Swal.fire("Error", "Image size must be less than 500KB", "error");
      return;
    }

    try {
      let res;

      if (newCategory.id) {
        // Update existing category
        if (newCategory.file) {
          const formData = new FormData();
          formData.append("categoryImage", newCategory.file);
          formData.append("categoryName", newCategory.categoryName);

          res = await api.put(
            `/api/category/updateCategory/${newCategory.id}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
                Authorization: `Bearer ${token}`,
              },
            },
          );
        } else {
          const categoryData = {
            categoryName: newCategory.categoryName,
            image: newCategory.image,
          };
          res = await api.put(
            `/api/category/updateCategory/${newCategory.id}`,
            categoryData,
            { headers: { Authorization: `Bearer ${token}` } },
          );
        }

        setCategories(
          categories.map((c) => (c._id === newCategory.id ? res.data.data : c)),
        );
        Swal.fire("Updated!", "Category updated successfully", "success");
      } else {
        // Add new category
        if (newCategory.file) {
          const formData = new FormData();
          formData.append("categoryImage", newCategory.file);
          formData.append("categoryName", newCategory.categoryName);

          res = await api.post("/api/category/uploadCategory", formData, {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          });
        } else {
          const categoryData = {
            categoryName: newCategory.categoryName,
          };

          res = await api.post("/api/category/createCategory", categoryData, {
            headers: { Authorization: `Bearer ${token}` },
          });
        }

        setCategories([res.data.data, ...categories]);
        Swal.fire("Added!", "Category added successfully", "success");
      }

      // Reset form and close modal
      setShowModal(false);
      setNewCategory({
        id: null,
        image: "",
        file: null,
        categoryName: "",
      });
      setPreviewUrl(null);
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire("Error", "Failed to save category", "error");
    }
  };

  // Delete category with confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This category will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/category/deletecategory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setCategories(categories.filter((c) => c._id !== id));
          Swal.fire("Deleted!", "Category deleted.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
        }
      }
    });
  };

  // Pagination: slice filtered categories for current page
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredCategories.length / ITEMS_PER_PAGE);

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header + Search */}
      <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-6 gap-4">
        <div className="">
          <h1 className="text-2xl font-bold">
            Manage <span className="text-orange-500">Categories</span>
          </h1>
          {/* Display count */}
          <p className="text-gray-600 mb-4">
            {filteredCategories.length} categories found
          </p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            placeholder="Search category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-lg border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white"
          />
          <button
            onClick={() => setShowModal(!showModal)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white hover:shadow-lg transition duration-300 font-semibold hover:border-none"
          >
            {showModal ? <X size={18} /> : <Plus size={18} />}
            {showModal ? "Cancel" : "Add Category"}
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-2 py-3">S.No</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedCategories.map((cat, index) => (
              <tr
                key={cat._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-3 py-2">
                  <img
                    src={cat.image}
                    alt="category"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-3 py-2">{cat.categoryName}</td>
                <td className="px-3 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setNewCategory({
                        id: cat._id,
                        image: cat.image,
                        categoryName: cat.categoryName,
                        file: null,
                      });
                      setPreviewUrl(cat.image);
                      setShowModal(true);
                    }}
                    className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={16} className="text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(cat._id)}
                    className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} className="text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCategories.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Mobile Card View */}
      {/* <div className="md:hidden space-y-4">
        {paginatedCategories.map((cat, index) => (
          <div
            key={cat._id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <p className="text-gray-600 font-semibold">
              S.No: {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
            </p>
            <img
              src={cat.image}
              alt="category"
              className="w-full sm:w-24 h-24 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <h2 className="font-semibold text-gray-800 text-lg">
                {cat.categoryName}
              </h2>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    setNewCategory({
                      id: cat._id,
                      image: cat.image,
                      categoryName: cat.categoryName,
                      file: null,
                    });
                    setPreviewUrl(cat.image);
                    setShowModal(true);
                  }}
                  className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                >
                  <Edit size={16} className="text-blue-700" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <Pagination />
      </div> */}
      <div className="md:hidden space-y-3">
        {paginatedCategories.map((cat, index) => (
          <div
            key={cat._id}
            className="bg-white shadow-sm rounded-lg p-2 flex items-center gap-3"
          >
            {/* Small Image */}
            <img
              src={cat.image}
              alt="category"
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />

            {/* Category Name + Actions */}
            <div className="flex-1 flex justify-between items-center">
              <h2 className="font-semibold text-gray-800 text-sm">
                {cat.categoryName}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewCategory({
                      id: cat._id,
                      image: cat.image,
                      categoryName: cat.categoryName,
                      file: null,
                    });
                    setPreviewUrl(cat.image);
                    setShowModal(true);
                  }}
                  className="bg-blue-100 p-1 rounded hover:bg-blue-200"
                >
                  <Edit size={16} className="text-blue-700" />
                </button>
                <button
                  onClick={() => handleDelete(cat._id)}
                  className="bg-red-100 p-1 rounded hover:bg-red-200"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          </div>
        ))}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />{" "}
      </div>

      {/* Modal / Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
              {newCategory.id ? "Edit Category" : "Add Category"}
            </h2>

            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl shadow">
                <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  placeholder="Enter Category Name"
                  value={newCategory.categoryName}
                  onChange={(e) =>
                    setNewCategory({
                      ...newCategory,
                      categoryName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition shadow-sm"
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <label className="block font-medium border-b border-gray-300 pb-2 mb-2">
                  Category Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500
                    file:mr-4 file:py-2 file:px-4
                    file:rounded-lg file:border-0
                    file:text-sm file:font-medium
                    file:bg-orange-50 file:text-orange-600
                    hover:file:bg-orange-100 cursor-pointer"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-24 h-24 object-cover rounded-lg mt-2 shadow-sm"
                  />
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Category;
