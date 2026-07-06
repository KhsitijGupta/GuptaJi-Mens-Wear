import React, { useState, useEffect } from "react";
import { Trash2, Plus, Edit, X } from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../../component/Pagination";

const ITEMS_PER_PAGE = 25;

const SubCategory = () => {
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]); // For search & category filter
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newSubCategory, setNewSubCategory] = useState({
    id: null,
    subCategoryName: "",
    categoryId: "",
    file: null,
    image: "",
  });
  const [previewUrl, setPreviewUrl] = useState(null);
  const [searchQuery, setSearchQuery] = useState(""); // Search input
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery); // Debounced search
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState(""); // Category filter dropdown
  const [currentPage, setCurrentPage] = useState(1);

  // Get auth token from session storage
  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  // Fetch all subcategories
  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("/api/subcategory/getAllSubCategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.data);
      setFilteredSubCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Fetch all categories for dropdowns
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/getAllCategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchSubCategories();
    fetchCategories();
  }, []);

  // Debounce search input by 300ms
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter subcategories by category filter and debounced search
  useEffect(() => {
    let filtered = subCategories;

    if (selectedCategoryFilter) {
      filtered = filtered.filter(
        (sub) => sub.categoryId?._id === selectedCategoryFilter,
      );
    }

    if (debouncedSearch) {
      filtered = filtered.filter((sub) =>
        sub.subCategoryName
          .toLowerCase()
          .includes(debouncedSearch.toLowerCase()),
      );
    }

    setFilteredSubCategories(filtered);
    setCurrentPage(1); // Reset pagination to first page on filter change
  }, [debouncedSearch, subCategories, selectedCategoryFilter]);

  // Handle image file selection with validation and preview
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/gif"];
      if (!validTypes.includes(file.type)) {
        Swal.fire(
          "Invalid File",
          "Only JPG, PNG, and GIF images are allowed",
          "error",
        );
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        Swal.fire("File Too Large", "Image must be less than 2MB", "error");
        return;
      }
      setNewSubCategory({ ...newSubCategory, file });
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  // Save or update subcategory
  const handleSave = async () => {
    if (!newSubCategory.subCategoryName || !newSubCategory.categoryId) {
      Swal.fire("Error", "Please fill in all fields", "error");
      return;
    }

    try {
      let formData;
      if (newSubCategory.file) {
        formData = new FormData();
        formData.append("subCategoryImage", newSubCategory.file);
        formData.append("subCategoryName", newSubCategory.subCategoryName);
        formData.append("categoryId", newSubCategory.categoryId);
      } else {
        formData = {
          subCategoryName: newSubCategory.subCategoryName,
          categoryId: newSubCategory.categoryId,
          image: newSubCategory.image,
        };
      }

      if (newSubCategory.id) {
        // Update existing
        await axios.put(
          `/api/subcategory/updateSubCategory/${newSubCategory.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              ...(newSubCategory.file && {
                "Content-Type": "multipart/form-data",
              }),
            },
          },
        );
        Swal.fire("Updated!", "SubCategory updated successfully", "success");
      } else {
        // Add new
        await axios.post("/api/subcategory/uploadSubCategory", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            ...(newSubCategory.file && {
              "Content-Type": "multipart/form-data",
            }),
          },
        });
        Swal.fire("Added!", "SubCategory added successfully", "success");
      }

      // Reset form and reload
      setShowModal(false);
      setNewSubCategory({
        id: null,
        subCategoryName: "",
        categoryId: "",
        file: null,
        image: "",
      });
      setPreviewUrl(null);
      fetchSubCategories();
    } catch (error) {
      console.error("Save failed:", error);
      Swal.fire("Error", "Failed to save subcategory", "error");
    }
  };

  // Delete subcategory with confirmation
  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This subcategory will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`/api/subcategory/deleteSubCategory/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "SubCategory deleted.", "success");
          fetchSubCategories();
        } catch (error) {
          console.log("Delete failed:", error);
          Swal.fire("Deleted!", error?.response?.data?.message, "success");
        }
      }
    });
  };

  // Pagination: slice filtered subcategories for current page
  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredSubCategories.length / ITEMS_PER_PAGE);
  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header + Search + Filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4 md:gap-0">
        <h1 className="text-2xl font-bold">
          Manage <span className="text-orange-500">SubCategories</span>
        </h1>

        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto items-center">
          <input
            type="text"
            placeholder="Search subcategory..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          />

          <select
            value={selectedCategoryFilter}
            onChange={(e) => setSelectedCategoryFilter(e.target.value)}
            className="w-48 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat._id} value={cat._id}>
                {cat.categoryName}
              </option>
            ))}
          </select>

          <button
            onClick={() => setShowModal(!showModal)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white hover:border-none font-semibold"
          >
            <Plus size={18} />
            Add SubCategory
          </button>
        </div>
      </div>

      {/* Display count of filtered subcategories */}
      <p className="text-gray-600 mb-4">
        {filteredSubCategories.length} subcategories found
      </p>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-1 py-3">S.No</th>
              <th className="px-6 py-3">Image</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Category</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedSubCategories.map((sub, index) => (
              <tr
                key={sub._id}
                className="border-t hover:bg-gray-50 transition"
              >
                <td className="px-3 py-2">
                  {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </td>
                <td className="px-3 py-2">
                  <img
                    src={sub.image}
                    alt="subcategory"
                    className="w-12 h-12 rounded-md object-cover"
                  />
                </td>
                <td className="px-3 py-2">{sub.subCategoryName}</td>
                <td className="px-3 py-2">{sub.categoryId?.categoryName}</td>
                <td className="px-3 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => {
                      setNewSubCategory({
                        id: sub._id,
                        subCategoryName: sub.subCategoryName,
                        categoryId: sub.categoryId?._id,
                        image: sub.image,
                        file: null,
                      });
                      setPreviewUrl(sub.image);
                      setShowModal(true);
                    }}
                    className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={16} className="text-blue-700" />
                  </button>
                  <button
                    onClick={() => handleDelete(sub._id)}
                    className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} className="text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredSubCategories.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {paginatedSubCategories.map((sub, index) => (
          <div
            key={sub._id}
            className="bg-white shadow-sm rounded-lg p-2 flex items-center gap-3"
          >
            {/* Small Image */}
            <img
              src={sub.image}
              alt="subcategory"
              className="w-16 h-16 rounded-md object-cover flex-shrink-0"
            />

            {/* Subcategory Info + Actions */}
            <div className="flex-1 flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-gray-800 text-sm">
                  {sub.subCategoryName}
                </h2>
                <p className="text-gray-500 text-xs">
                  {sub.categoryId?.categoryName}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => {
                    setNewSubCategory({
                      id: sub._id,
                      subCategoryName: sub.subCategoryName,
                      categoryId: sub.categoryId?._id,
                      image: sub.image,
                      file: null,
                    });
                    setPreviewUrl(sub.image);
                    setShowModal(true);
                  }}
                  className="bg-blue-100 p-1 rounded hover:bg-blue-200"
                >
                  <Edit size={16} className="text-blue-700" />
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
                  className="bg-red-100 p-1 rounded hover:bg-red-200"
                >
                  <Trash2 size={16} className="text-red-700" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {filteredSubCategories.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}
      </div>

      {/* Mobile Card View
      <div className="md:hidden space-y-4">
        {paginatedSubCategories.map((sub) => (
          <div
            key={sub._id}
            className="bg-white shadow-md rounded-xl p-4 flex flex-col sm:flex-row sm:items-center gap-4"
          >
            <img
              src={sub.image}
              alt="subcategory"
              className="w-full sm:w-24 h-24 rounded-md object-cover flex-shrink-0"
            />
            <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
              <div>
                <h2 className="font-semibold text-gray-800 text-lg">
                  {sub.subCategoryName}
                </h2>
                <p className="text-gray-500">{sub.categoryId?.categoryName}</p>
              </div>
              <div className="flex gap-2 mt-2 sm:mt-0">
                <button
                  onClick={() => {
                    setNewSubCategory({
                      id: sub._id,
                      subCategoryName: sub.subCategoryName,
                      categoryId: sub.categoryId?._id,
                      image: sub.image,
                      file: null,
                    });
                    setPreviewUrl(sub.image);
                    setShowModal(true);
                  }}
                  className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                >
                  <Edit size={16} className="text-blue-700" />
                </button>
                <button
                  onClick={() => handleDelete(sub._id)}
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

      {/* Modal / Card Form */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4 overflow-auto">
          <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md mx-auto p-6">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-4 right-4 text-orange-500 hover:text-orange-600 transition"
            >
              <X size={22} />
            </button>

            <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
              {newSubCategory.id ? "Edit SubCategory" : "Add SubCategory"}
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
                  Parent Category
                </label>
                <select
                  value={newSubCategory.categoryId}
                  onChange={(e) =>
                    setNewSubCategory({
                      ...newSubCategory,
                      categoryId: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition shadow-sm"
                >
                  <option value="">Select Parent Category</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
                  SubCategory Name
                </label>
                <input
                  type="text"
                  placeholder="Enter name"
                  value={newSubCategory.subCategoryName}
                  onChange={(e) =>
                    setNewSubCategory({
                      ...newSubCategory,
                      subCategoryName: e.target.value,
                    })
                  }
                  className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none transition shadow-sm"
                />
              </div>

              <div className="bg-white p-4 rounded-xl shadow">
                <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
                  SubCategory Image
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
                    className="w-24 h-24 object-cover rounded-lg mt-2"
                  />
                )}
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <button
                onClick={() => setShowModal(false)}
                className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold w-full sm:w-auto"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-5 py-2 rounded-xl bg-orange-500 text-white font-semibold w-full sm:w-auto"
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

export default SubCategory;
