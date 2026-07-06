import React, { useEffect, useState } from "react";
import axios from "axios";
import { Trash2, Upload, Plus, X } from "lucide-react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const ApplicationBanner = () => {
  const [banners, setBanners] = useState([]);
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUploadForm, setShowUploadForm] = useState(false);

  // ✅ Get token (adjust if you store it differently)
  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  // ✅ Axios config with Authorization
  const axiosConfig = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const fetchBanners = async () => {
    try {
      const res = await axios.get(
        "/api/applicationBanner/getAllApplicationBanners",
        axiosConfig
      );

      // Ensure sorting by 'order' field
      const sortedBanners = res.data.sort((a, b) => a.order - b.order);
      setBanners(sortedBanners);
    } catch (error) {
      console.error("Error fetching banners:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file first.");

    const formData = new FormData();
    formData.append("applicationBannerImage", selectedFile);

    try {
      const res = await axios.post(
        "/api/applicationBanner/uploadApplicationBanner",
        formData,
        axiosConfig
      );
      setBanners([res.data, ...banners]);
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowUploadForm(false);
    } catch (error) {
      console.error("Upload failed:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;

    try {
      await axios.delete(
        `/api/applicationBanner/deleteApplicationBanner/${id}`,
        axiosConfig
      );
      setBanners(banners.filter((b) => b._id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const items = Array.from(banners);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update frontend order
    const updatedItems = items.map((b, index) => ({ ...b, order: index }));
    setBanners(updatedItems);

    try {
      await axios.post(
        "/api/applicationBanner/reorderApplicationBanner",
        { banners: updatedItems.map((b) => ({ _id: b._id, order: b.order })) },
        axiosConfig
      );
    } catch (error) {
      console.error("Reorder save failed:", error);
    }
  };

  return (
    <div className="">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4 sm:gap-0">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
          Banner <span className="text-amber-500">Manager</span>
        </h2>
        <button
          onClick={() => setShowUploadForm(!showUploadForm)}
          className="flex items-center gap-2 px-4 py-2 bg-white text-amber-500 border border-amber-500 rounded-lg hover:bg-linear-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] font-semibold hover:text-white hover:border-none"
        >
          {<Plus size={16} />}
          {"Add Banner"}
        </button>
      </div>

      {/* Upload Form Modal */}
      {showUploadForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 sm:p-6">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-xl w-full max-w-md relative">
            {/* Close Button */}
            <button
              onClick={() => setShowUploadForm(false)}
              className="absolute top-4 sm:top-6 right-4 sm:right-6 text-amber-500 hover:text-amber-600 transition"
            >
              <X size={20} />
            </button>

            {/* Heading */}
            <h2 className="text-xl font-bold text-gray-800 mb-4 sm:mb-6 border-b border-gray-300 pb-2">
              Upload Image
            </h2>

            {/* File Input */}
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-sm sm:text-base text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-lg file:border-0
                file:text-sm file:font-medium
                file:bg-amber-50 file:text-amber-600
                hover:file:bg-amber-100 cursor-pointer"
            />

            {/* Preview */}
            {previewUrl && (
              <div className="mt-4 flex justify-center">
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-full max-w-xs h-auto rounded-lg p-2 shadow-lg"
                />
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={handleUpload}
              className="mt-4 w-full sm:w-auto px-3 py-2 rounded-lg bg-linear-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] text-white font-semibold shadow-lg transition flex justify-center items-center gap-2"
            >
              <Upload size={16} />
              Upload
            </button>
          </div>
        </div>
      )}

      {/* Banners Grid with Drag & Drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="banners" direction="horizontal">
          {(provided) => (
            <div
              className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 mt-6"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {loading ? (
                <p className="col-span-full text-center text-gray-500">
                  Loading banners...
                </p>
              ) : banners.length === 0 ? (
                <p className="col-span-full text-center text-gray-500">
                  No banners found.
                </p>
              ) : (
                banners.map((banner, index) => (
                  <Draggable
                    key={banner._id}
                    draggableId={banner._id}
                    index={index}
                  >
                    {(provided) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        className="relative overflow-hidden rounded-xl shadow-lg group hover:scale-105 transform transition duration-300 "
                      >
                        <img
                          src={banner.image}
                          alt="Banner"
                          className="w-full h-48 sm:h-56 md:h-64 lg:h-52 xl:h-60 object-contain rounded-xl bg-red-100"
                        />
                        <button
                          onClick={() => handleDelete(banner._id)}
                          className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded hover:bg-red-700 transition"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
};

export default ApplicationBanner;
