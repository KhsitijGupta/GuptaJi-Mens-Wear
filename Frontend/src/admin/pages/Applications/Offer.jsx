// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { Trash2, Edit, Plus, X } from "lucide-react";
// import Swal from "sweetalert2";

// const OfferPage = () => {
//   const [offers, setOffers] = useState([]);
//   const [offerTitle, setOfferTitle] = useState("");
//   const [offerPercentage, setOfferPercentage] = useState("");
//   const [categoryId, setCategoryId] = useState("");
//   const [subCategoryId, setSubCategoryId] = useState("");
//   const [selectedProducts, setSelectedProducts] = useState([]);
//   const [offerImage, setOfferImage] = useState(null);

//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);
//   const [productList, setProductList] = useState([]);
//   const [editingOffer, setEditingOffer] = useState(null);

//   const [subCategorySearch, setSubCategorySearch] = useState("");
//   const [productSearch, setProductSearch] = useState("");
//   const [subDropdownOpen, setSubDropdownOpen] = useState(false);

//   const [showModal, setShowModal] = useState(false);
//   const [previewUrl, setPreviewUrl] = useState(null);

//   const authData = JSON.parse(sessionStorage.getItem("admin"));
//   const token = authData?.token;
//   const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

//   useEffect(() => {
//     fetchOffers();
//     fetchCategories();
//   }, []);

//   const fetchOffers = async () => {
//     try {
//       const res = await axios.get("/api/offers/getAllOffers", axiosConfig);
//       setOffers(Array.isArray(res.data) ? res.data : res.data?.data || []);
//     } catch (error) {
//       console.error("Error fetching offers:", error);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("/api/category/getAllCategories", axiosConfig);
//       const data = Array.isArray(res.data) ? res.data : res.data.data || [];
//       setCategories(data);
//     } catch (error) {
//       console.error("Error fetching categories:", error);
//       setCategories([]);
//     }
//   };

//   const fetchSubCategories = async (catId) => {
//     if (!catId) return;
//     try {
//       const res = await axios.get(`/api/subcategory/getSubCategoriesByCategory/${catId}`, axiosConfig);
//       const data = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.data)
//         ? res.data.data
//         : [];
//       setSubCategories(data);
//       setProductList([]);
//       setSubCategorySearch("");
//     } catch (error) {
//       console.error("Error fetching subcategories:", error);
//       setSubCategories([]);
//     }
//   };

//   const fetchProductsBySubCategory = async (subCatId) => {
//     if (!subCatId) return;
//     try {
//       const res = await axios.get(`/api/products/getProductsBySubCategory/${subCatId}`, axiosConfig);
//       const data = Array.isArray(res.data)
//         ? res.data
//         : Array.isArray(res.data.data)
//         ? res.data.data
//         : [];
//       setProductList(data);
//       setProductSearch("");
//     } catch (error) {
//       console.error("Error fetching products:", error);
//       setProductList([]);
//     }
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files[0];
//     setOfferImage(file);
//     if (file) setPreviewUrl(URL.createObjectURL(file));
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const formData = new FormData();
//     formData.append("offerTitle", offerTitle);
//     formData.append("offerPercentage", offerPercentage);
//     formData.append("categoryId", categoryId);
//     formData.append("subCategoryId", subCategoryId);
//     formData.append("products", JSON.stringify(selectedProducts));
//     if (offerImage) formData.append("offerImage", offerImage);

//     try {
//       if (editingOffer) {
//         await axios.put(`/api/offers/updateOffer/${editingOffer._id}`, formData, axiosConfig);
//         Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: "Offer updated successfully",
//         });
//       } else {
//         await axios.post("/api/offers/createOffer", formData, axiosConfig);
//         Swal.fire({
//           icon: "success",
//           title: "Success!",
//           text: "Offer created successfully",
//         });
//       }
//       resetForm();
//       fetchOffers();
//     } catch (error) {
//       console.error("Error saving offer:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: "Error saving offer",
//       });
//     }
//   };

//   const deleteOffer = async (id) => {
//     const result = await Swal.fire({
//       title: "Are you sure?",
//       text: "Do you want to delete this offer?",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonColor: "#d33",
//       cancelButtonColor: "#3085d6",
//       confirmButtonText: "Yes, delete it!",
//     });

//     if (!result.isConfirmed) return;

//     try {
//       await axios.delete(`/api/offers/deleteOffer/${id}`, axiosConfig);
//       fetchOffers();
//       Swal.fire({
//         icon: "success",
//         title: "Deleted!",
//         text: "Offer deleted successfully",
//       });
//     } catch (error) {
//       console.error("Error deleting offer:", error);
//       Swal.fire({
//         icon: "error",
//         title: "Error!",
//         text: "Failed to delete offer",
//       });
//     }
//   };

//   const handleEdit = (offer) => {
//     setEditingOffer(offer);
//     setOfferTitle(offer.offerTitle);
//     setOfferPercentage(offer.offerPercentage);
//     setCategoryId(offer.categoryId?._id || "");
//     setSubCategoryId(offer.subCategoryId?._id || "");
//     setSelectedProducts(offer.products?.map((p) => p._id) || []);
//     fetchSubCategories(offer.categoryId?._id);
//     fetchProductsBySubCategory(offer.subCategoryId?._id);
//     setPreviewUrl(offer.offerImage);
//     setShowModal(true);
//   };

//   const resetForm = () => {
//     setOfferTitle("");
//     setOfferPercentage("");
//     setCategoryId("");
//     setSubCategoryId("");
//     setSelectedProducts([]);
//     setOfferImage(null);
//     setEditingOffer(null);
//     setSubCategories([]);
//     setProductList([]);
//     setSubCategorySearch("");
//     setProductSearch("");
//     setSubDropdownOpen(false);
//     setShowModal(false);
//     setPreviewUrl(null);
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen">
//       {/* Header */}
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-2xl font-bold">
//           Manage <span className="text-amber-500">Offers</span>
//         </h1>
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 px-4 py-2 bg-white text-amber-500 border border-amber-500 rounded-lg hover:bg-linear-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] hover:text-white hover:border-none font-semibold"
//         >
//           <Plus size={18} />
//           Add Offer
//         </button>
//       </div>

//       {/* Modal Form */}
//       {showModal && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 p-4">
//           <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl mx-auto max-h-[80vh] overflow-y-auto p-6">
//             <button
//               onClick={resetForm}
//               className="absolute top-4 right-4 text-amber-500 hover:text-amber-600 transition"
//             >
//               <X size={22} />
//             </button>

//             <h2 className="text-xl font-bold mb-6 text-gray-800 border-b pb-3">
//               {editingOffer ? "Edit Offer" : "Add Offer"}
//             </h2>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               {/* Category */}
//               <div>
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   Category
//                 </label>
//                 <select
//                   value={categoryId}
//                   onChange={(e) => {
//                     const id = e.target.value;
//                     setCategoryId(id);
//                     setSubCategoryId("");
//                     setProductList([]);
//                     fetchSubCategories(id);
//                   }}
//                   required
//                   className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white
//                     focus:ring-2 focus:ring-amber-500 outline-none transition shadow-sm"
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               {/* SubCategory */}
//               <div>
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   SubCategory
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Select Subcategory"
//                   value={
//                     subCategorySearch ||
//                     (subCategoryId
//                       ? subCategories.find((s) => s._id === subCategoryId)
//                           ?.subCategoryName
//                       : "")
//                   }
//                   onFocus={() => setSubDropdownOpen(true)}
//                   onChange={(e) => {
//                     setSubCategorySearch(e.target.value);
//                     setSubDropdownOpen(true);
//                   }}
//                   disabled={!subCategories.length}
//                   className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white
//                     focus:ring-2 focus:ring-amber-500 outline-none transition shadow-sm"
//                 />
//                 {subDropdownOpen && subCategories.length > 0 && (
//                   <ul className="absolute bg-white border rounded w-full max-h-40 overflow-y-auto z-10 shadow-lg">
//                     {subCategories
//                       .filter((sub) =>
//                         sub.subCategoryName
//                           .toLowerCase()
//                           .includes(subCategorySearch.toLowerCase())
//                       )
//                       .map((sub) => (
//                         <li
//                           key={sub._id}
//                           className="p-2 hover:bg-gray-200 cursor-pointer"
//                           onClick={() => {
//                             setSubCategoryId(sub._id);
//                             setSubCategorySearch(sub.subCategoryName);
//                             setSubDropdownOpen(false);
//                             fetchProductsBySubCategory(sub._id);
//                           }}
//                         >
//                           {sub.subCategoryName}
//                         </li>
//                       ))}
//                   </ul>
//                 )}
//               </div>

//               {/* Products */}
//               <div>
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   Select Products
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Search Products"
//                   value={productSearch}
//                   onChange={(e) => setProductSearch(e.target.value)}
//                   className="w-full px-3 py-2 rounded-lg mb-2 bg-gray-50 focus:bg-white
//                     focus:ring-2 focus:ring-amber-500 outline-none transition shadow-sm"
//                 />

//                 <div className="flex flex-wrap gap-2 mb-2 max-h-32 overflow-y-auto">
//                   {productList
//                     .filter((prod) =>
//                       prod.productName
//                         .toLowerCase()
//                         .includes(productSearch.toLowerCase())
//                     )
//                     .map((prod) => (
//                       <button
//                         key={prod._id}
//                         type="button"
//                         onClick={() => {
//                           if (!selectedProducts.includes(prod._id)) {
//                             setSelectedProducts([
//                               ...selectedProducts,
//                               prod._id,
//                             ]);
//                           }
//                         }}
//                         className="px-3 py-1 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm"
//                       >
//                         {prod.productName}
//                       </button>
//                     ))}
//                 </div>

//                 {/* Selected Products */}
//                 <div className="flex flex-wrap gap-2">
//                   {selectedProducts.map((id) => {
//                     const prod = productList.find((p) => p._id === id);
//                     if (!prod) return null;
//                     return (
//                       <div
//                         key={id}
//                         className="flex items-center gap-1 px-3 py-1 rounded-full bg-amber-50 text-amber-600 hover:bg-amber-100 text-sm"
//                       >
//                         {prod.productName}
//                         <X
//                           size={14}
//                           className="cursor-pointer"
//                           onClick={() =>
//                             setSelectedProducts(
//                               selectedProducts.filter((pid) => pid !== id)
//                             )
//                           }
//                         />
//                       </div>
//                     );
//                   })}
//                 </div>
//               </div>

//               {/* Offer Title */}
//               <div>
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   Offer Title
//                 </label>
//                 <input
//                   type="text"
//                   placeholder="Enter offer title"
//                   value={offerTitle}
//                   onChange={(e) => setOfferTitle(e.target.value)}
//                   required
//                   className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white
//                     focus:ring-2 focus:ring-amber-500 outline-none transition shadow-sm"
//                 />
//               </div>

//               {/* Offer Percentage */}
//               <div>
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   Offer Percentage
//                 </label>
//                 <input
//                   type="number"
//                   placeholder="Enter percentage"
//                   value={offerPercentage}
//                   onChange={(e) => setOfferPercentage(e.target.value)}
//                   required
//                   min="0"
//                   max="100"
//                   className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white
//                     focus:ring-2 focus:ring-amber-500 outline-none transition shadow-sm"
//                 />
//               </div>

//               {/* Offer Image */}
//               <div className="bg-white p-4 rounded-xl shadow">
//                 <label className="block border-b border-gray-300 pb-2 font-medium mb-2">
//                   Offer Image
//                 </label>
//                 <input
//                   type="file"
//                   accept="image/*"
//                   onChange={handleFileChange}
//                   className="block w-full text-sm text-gray-500
//                     file:mr-4 file:py-2 file:px-4
//                     file:rounded-lg file:border-0
//                     file:text-sm file:font-medium
//                     file:bg-amber-50 file:text-amber-600
//                     hover:file:bg-amber-100 cursor-pointer"
//                 />
//                 {previewUrl && (
//                   <img
//                     src={previewUrl}
//                     alt="Preview"
//                     className="w-24 h-24 object-cover rounded-lg mt-2"
//                   />
//                 )}
//               </div>

//               {/* Buttons */}
//               <div className="flex justify-end gap-3 mt-4">
//                 <button
//                   type="button"
//                   onClick={resetForm}
//                   className="px-5 py-2 rounded-xl bg-gray-100 text-gray-600 font-semibold"
//                 >
//                   Cancel
//                 </button>
//                 <button
//                   type="submit"
//                   className="px-5 py-2 rounded-xl bg-linear-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] text-white font-semibold"
//                 >
//                   {editingOffer ? "Update Offer" : "Create Offer"}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Offers Grid */}
//       <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 mt-6">
//         {offers.length === 0 ? (
//           <p className="col-span-full text-center text-gray-500">
//             No offers found.
//           </p>
//         ) : (
//           offers.map((offer) => (
//             <div
//               key={offer._id}
//               className="relative overflow-hidden rounded-xl shadow-lg group hover:scale-105 transform transition duration-300 flex flex-col"
//             >
//               {offer.offerImage && (
//                 <img
//                   src={offer.offerImage}
//                   alt={offer.offerTitle}
//                   className="w-full h-48 sm:h-56 md:h-64 lg:h-52 xl:h-60 object-cover rounded-t-xl"
//                 />
//               )}
//               <div className="p-3 flex flex-col justify-between flex-1">
//                 <div>
//                   <h3 className="font-semibold text-lg">{offer.offerTitle}</h3>
//                   <p className="text-sm text-gray-500">
//                     Offer ID: {offer.offerId}
//                   </p>
//                   <p className="text-sm text-gray-600">
//                     {offer.offerPercentage}% Off
//                   </p>
//                   <p className="text-sm text-gray-500 mt-1">
//                     Products:{" "}
//                     {offer.products?.length
//                       ? offer.products.map((p) => p.productName).join(", ")
//                       : "No products"}
//                   </p>
//                 </div>
//                 <div className="flex justify-end gap-2 mt-3">
//                   <button
//                     onClick={() => handleEdit(offer)}
//                     className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
//                   >
//                     <Edit size={16} className="text-blue-700" />
//                   </button>
//                   <button
//                     onClick={() => deleteOffer(offer._id)}
//                     className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
//                   >
//                     <Trash2 size={16} className="text-red-700" />
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))
//         )}
//       </div>
//     </div>
//   );
// };

// export default OfferPage;

import React, { useEffect, useState } from "react";import api from '@/utils/api';
import { Trash2, Edit, Plus, X } from "lucide-react";
import Swal from "sweetalert2";

const OfferPage = () => {
  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;
  const axiosConfig = { headers: { Authorization: `Bearer ${token}` } };

  /* ================= CREATE / EDIT STATES ================= */
  const [offers, setOffers] = useState([]);
  const [offerTitle, setOfferTitle] = useState("");
  const [offerPercentage, setOfferPercentage] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [offerImage, setOfferImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingOffer, setEditingOffer] = useState(null);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [productList, setProductList] = useState([]);

  /* ================= APPLY OFFER STATES ================= */
  const [applyModalOpen, setApplyModalOpen] = useState(false);
  const [activeOffer, setActiveOffer] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubCategories, setSelectedSubCategories] = useState([]);
  const [applyProducts, setApplyProducts] = useState([]);

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    fetchOffers();
    fetchCategories();
  }, []);

  // 🔥 NEW: Toggle Offer Status Function (Already exists, just moved up)
  const toggleOfferStatus = async (offerId, currentStatus) => {
    const newStatus = currentStatus === "active" ? "inactive" : "active";

    const result = await Swal.fire({
      title: `Make offer ${newStatus}?`,
      text: `This will ${
        newStatus === "inactive"
          ? "deactivate and remove from products"
          : "activate"
      } the offer.`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ff5954",
      cancelButtonColor: "#3085d6",
      confirmButtonText: `Yes, ${
        newStatus === "inactive" ? "Deactivate" : "Activate"
      }!`,
    });

    if (!result.isConfirmed) return;

    try {
      await api.post(
        `/api/offers/toggleOfferStatus/${offerId}`,
        { status: newStatus },
        axiosConfig
      );

      Swal.fire("Success!", "Offer status updated successfully", "success");
      fetchOffers(); // Refresh the offers list
    } catch (error) {
      console.error("Error toggling offer status:", error);
      Swal.fire("Error!", "Failed to update offer status", "error");
    }
  };

  const fetchOffers = async () => {
    try {
      const res = await api.get("/api/offers/getAllOffers", axiosConfig);
      console.log(res.data);
      setOffers(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.error("Error fetching offers:", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await api.get(
        "/api/category/getAllCategories",
        axiosConfig
      );
      setCategories(Array.isArray(res.data) ? res.data : res.data?.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchSubCategories = async (categoryIds) => {
    if (!categoryIds?.length) {
      setSubCategories([]);
      return;
    }
    try {
      const res = await api.post(
        "/api/subcategory/getSubCategoriesByCategories",
        { categoryIds },
        axiosConfig
      );
      setSubCategories(res.data.data || res.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
      setSubCategories([]);
    }
  };

  const fetchProductsBySubCategory = async (subCategoryIds) => {
    if (!subCategoryIds?.length) {
      setApplyProducts([]);
      return;
    }
    try {
      const res = await api.post(
        "/api/products/getProductsBySubCategories",
        { subCategoryIds },
        axiosConfig
      );
      setApplyProducts(
        Array.isArray(res.data) ? res.data : res.data?.data || []
      );
    } catch (error) {
      console.error("Error fetching products:", error);
      setApplyProducts([]);
    }
  };

  /* ================= CREATE/EDIT FUNCTIONS ================= */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setOfferImage(file);
    if (file) setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!offerTitle || !offerPercentage) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    const formData = new FormData();
    formData.append("offerTitle", offerTitle);
    formData.append("offerPercentage", offerPercentage);
    if (offerImage) formData.append("offerImage", offerImage);

    try {
      if (editingOffer) {
        await api.put(
          `/api/offers/updateOffer/${editingOffer._id}`,
          formData,
          axiosConfig
        );
        Swal.fire("Success!", "Offer updated successfully", "success");
      } else {
        await api.post("/api/offers/createOffer", formData, axiosConfig);
        Swal.fire("Success!", "Offer created successfully", "success");
      }
      resetForm();
      fetchOffers();
    } catch (error) {
      console.error("Error saving offer:", error);
      Swal.fire("Error!", "Failed to save offer", "error");
    }
  };

  const handleEdit = async (offer) => {
    setEditingOffer(offer);
    setOfferTitle(offer.offerTitle);
    setOfferPercentage(offer.offerPercentage);
    setCategoryId(offer.categoryId?._id || offer.categoryId || "");
    setSubCategoryId(offer.subCategoryId?._id || offer.subCategoryId || "");
    setSelectedProducts(offer.products?.map((p) => p._id) || []);

    // Fetch related data
    if (offer.categoryId?._id) {
      await fetchSubCategories([offer.categoryId._id]);
    }
    if (offer.subCategoryId?._id) {
      // Fetch products for edit form if needed
    }
    setPreviewUrl(offer.offerImage);
    setShowModal(true);
  };

  const resetForm = () => {
    setOfferTitle("");
    setOfferPercentage("");
    setCategoryId("");
    setSubCategoryId("");
    setSelectedProducts([]);
    setOfferImage(null);
    setEditingOffer(null);
    setPreviewUrl(null);
    setShowModal(false);
    setSubCategories([]);
    setProductList([]);
  };

  /* ================= APPLY OFFER FUNCTIONS ================= */
  const handleApplyOffer = async () => {
    if (!selectedProducts.length) {
      Swal.fire("Error", "Please select at least one product", "error");
      return;
    }

    try {
      await api.post(
        "/api/offers/apply-offer",
        {
          offerId: activeOffer.offerId || activeOffer._id,
          productIds: selectedProducts,
        },
        axiosConfig
      );
      Swal.fire("Success!", "Offer applied successfully", "success");
      setApplyModalOpen(false);
      setSelectedCategories([]);
      setSelectedSubCategories([]);
      setSelectedProducts([]);
      fetchOffers();
    } catch (error) {
      console.error("Error applying offer:", error);
      Swal.fire("Error!", "Failed to apply offer", "error");
    }
  };

  const deleteOffer = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This offer will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/offers/deleteOffer/${id}`, axiosConfig);
      fetchOffers();
      Swal.fire("Deleted!", "Offer has been deleted", "success");
    } catch (error) {
      console.error("Error deleting offer:", error);
      Swal.fire("Error!", "Failed to delete offer", "error");
    }
  };

  /* ================= REUSABLE SECTION COMPONENT ================= */
  const Section = ({ title, items, selected, onSelect, label }) => (
    <div className="mb-6 p-4 shadow-xs rounded-lg bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => onSelect(items.map((i) => i._id))}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
        )}
      </div>
      <div className="max-h-40 overflow-y-auto space-y-2">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No {title.toLowerCase()} available
          </p>
        ) : (
          items.map((item) => (
            <label
              key={item._id}
              className="flex items-center p-2 hover:bg-white rounded cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-amber-500 rounded mr-3"
                checked={selected.includes(item._id)}
                onChange={() =>
                  onSelect(
                    selected.includes(item._id)
                      ? selected.filter((id) => id !== item._id)
                      : [...selected, item._id]
                  )
                }
              />
              <span className="text-sm">{item[label]}</span>
            </label>
          ))
        )}
      </div>
      {title === "Products" && (
        <p className="text-sm text-gray-500 mt-2">
          Selected: {selected.length} products
        </p>
      )}
    </div>
  );

  const ProductSection = ({ title, items, selected, onSelect, label }) => (
    <div className="mb-6 p-4 shadow-xs rounded-lg bg-gray-100">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold">{title}</h4>
        {items.length > 0 && (
          <button
            type="button"
            onClick={() => onSelect(items.map((i) => i._id))}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium"
          >
            Select All
          </button>
        )}
      </div>
      <div className="max-h-20 overflow-y-auto space-y-2 flex flex-wrap ">
        {items.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No {title.toLowerCase()} available
          </p>
        ) : (
          items.map((item) => (
            <label
              key={item._id}
              className="flex items-center p-2 hover:bg-white rounded cursor-pointer"
            >
              <input
                type="checkbox"
                className="w-4 h-4 text-amber-500 rounded mr-3"
                checked={selected.includes(item._id)}
                onChange={() =>
                  onSelect(
                    selected.includes(item._id)
                      ? selected.filter((id) => id !== item._id)
                      : [...selected, item._id]
                  )
                }
              />
              <span className="text-sm">{item[label]}</span>
            </label>
          ))
        )}
      </div>
      {title === "Products" && (
        <p className="text-sm text-gray-500 mt-2">
          Selected: {selected.length} products
        </p>
      )}
    </div>
  );

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Manage <span className="text-amber-500">Offers</span>
        </h1>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
        >
          <Plus size={20} />
          Add New Offer
        </button>
      </div>

      {/* Offers Grid */}
      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-">
        {offers.length === 0 ? (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-500 text-lg">No offers found</p>
          </div>
        ) : (
          offers.map((offer) => (
            <div
              key={offer._id}
              className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 overflow-hidden"
            >
              {offer.offerImage && (
                <img
                  src={offer.offerImage}
                  alt={offer.offerTitle}
                  className="w-full h-48 object-contain"
                />
              )}
              <div className="p-6">
                <h3 className="font-bold text-xl mb-2 line-clamp-2">
                  {offer.offerTitle}
                </h3>

                {/* 🔥 STATUS INDICATOR */}
                <div className="flex items-center gap-2 mb-3">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      offer.status === "active"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {offer.status === "active" ? "🟢 Active" : "🔴 Inactive"}
                  </span>
                  <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-semibold">
                    {offer.offerPercentage}% OFF
                  </span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  Products: {offer.products?.length || 0}
                </p>

                {/* 🔥 UPDATED BUTTONS WITH INACTIVE TOGGLE */}
                <div className="flex gap-2">
                  {/* 🔥 NEW INACTIVE/ACTIVE BUTTON */}
                  <button
                    onClick={() => toggleOfferStatus(offer._id, offer.status)}
                    className={`flex-1 p-2 rounded-xl font-medium transition-all flex items-center justify-center gap-1 text-sm ${
                      offer.status === "active"
                        ? "bg-orange-100 text-orange-700 hover:bg-orange-200"
                        : "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    }`}
                    title={
                      offer.status === "active"
                        ? "Make Inactive"
                        : "Make Active"
                    }
                  >
                    {offer.status === "active" ? " Inactive" : " Active"}
                  </button>

                  {/* Apply Offer Button */}
                  <button
                    onClick={() => {
                      setActiveOffer(offer);
                      setSelectedCategories([]);
                      setSelectedSubCategories([]);
                      setSelectedProducts([]);
                      setApplyModalOpen(true);
                    }}
                    className="flex-1 bg-green-100 text-green-700 px-4 py-2 rounded-lg hover:bg-green-200 font-medium transition"
                  >
                    Apply Offer
                  </button>

                  {/* Edit Button */}
                  <button
                    onClick={() => handleEdit(offer)}
                    className="bg-blue-100 text-blue-700 p-3 rounded-xl hover:bg-blue-200 transition"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => deleteOffer(offer._id)}
                    className="bg-red-100 text-red-700 p-3 rounded-xl hover:bg-red-200 transition"
                    title="Delete"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* CREATE/EDIT MODAL */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-6 rounded-t-3xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">
                  {editingOffer ? "Edit Offer" : "Create New Offer"}
                </h2>
                <button
                  onClick={resetForm}
                  className="p-2 hover:bg-gray-100 rounded-xl transition"
                >
                  <X size={24} />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Offer Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Offer Title *
                  </label>
                  <input
                    type="text"
                    value={offerTitle}
                    onChange={(e) => setOfferTitle(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Discount % *
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={offerPercentage}
                    onChange={(e) => setOfferPercentage(e.target.value)}
                    required
                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Offer Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
                />
                {previewUrl && (
                  <img
                    src={previewUrl}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-xl mt-3 shadow-md"
                  />
                )}
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-4 pt-6 border-t">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 font-semibold transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-8 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl hover:shadow-lg transition"
                >
                  {editingOffer ? "Update Offer" : "Create Offer"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* APPLY OFFER MODAL - UNCHANGED */}
      {applyModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/30 backdrop-blur-sm"
          aria-modal="true"
          role="dialog"
        >
          <div className="relative w-full max-w-7xl max-h-[90vh]">
            {/* Soft glow */}
            <div className="pointer-events-none absolute inset-0 -z-10 bg-linear-to-br from-emerald-400/15 via-amber-300/10 to-sky-400/15 blur-3xl" />

            <div className="bg-white border border-slate-200 shadow-2xl rounded-3xl overflow-hidden">
              {/* Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between gap-4 px-6 py-4 bg-linear-to-r from-white via-emerald-50/40 to-white border-b border-slate-200">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-600">
                    Offer Configuration
                  </p>
                  <h2 className="mt-1 text-2xl font-bold text-slate-900 flex items-center gap-2">
                    Apply Offer
                    {activeOffer?.offerTitle && (
                      <span className="inline-flex items-center rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700">
                        {activeOffer.offerTitle}
                      </span>
                    )}
                  </h2>
                </div>

                <button
                  type="button"
                  onClick={() => setApplyModalOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-2xl 
                       border border-slate-200 bg-white text-slate-500 
                       hover:bg-slate-50 hover:text-slate-700 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Body: 2-column layout */}
              <div className="grid grid-cols-1 md:grid-cols-[1.6fr_1fr] max-h-[calc(90vh-72px)]">
                {/* LEFT: selection steps */}
                <div className="px-6 py-4 overflow-y-scroll border-r border-slate-200/70 bg-slate-50/60">
                  {/* Step indicator */}
                  <div className="mb-5 flex items-center gap-3 text-xs font-medium text-slate-600">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-emerald-600 text-[11px] font-bold text-white shadow-sm">
                        1
                      </span>
                      <span>Categories</span>
                    </div>

                    <span className="h-px flex-1 bg-linear-to-r from-emerald-400/70 via-emerald-400/30 to-transparent" />

                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold ${
                          selectedCategories.length
                            ? "bg-emerald-600 text-white shadow-sm"
                            : "bg-slate-200 text-slate-500"
                        }`}
                      >
                        2
                      </span>
                      <span>Sub Categories</span>
                    </div>

                    <span className="h-px flex-1 bg-linear-to-r from-emerald-400/30 via-emerald-400/10 to-transparent" />

                    <div className="flex items-center gap-2">
                      <span
                        className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold
                ${
                  selectedSubCategories.length
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "bg-slate-200 text-slate-500"
                }`}
                      >
                        3
                      </span>
                      <span>Products</span>
                    </div>
                  </div>

                  {/* Sections */}
                  <div className="space-y-5">
                    <div className="flex gap-2">
                      <div className="w-1/2 ">
                        <Section
                          title="Categories"
                          items={categories}
                          selected={selectedCategories}
                          label="categoryName"
                          onSelect={(ids) => {
                            setSelectedCategories(ids);
                            setSelectedSubCategories([]);
                            setSelectedProducts([]);
                            fetchSubCategories(ids);
                          }}
                        />
                      </div>

                      <div className="w-1/2 ">
                        <Section
                          title="Sub Categories"
                          items={subCategories}
                          selected={selectedSubCategories}
                          label="subCategoryName"
                          onSelect={(ids) => {
                            setSelectedSubCategories(ids);
                            setSelectedProducts([]);
                            fetchProductsBySubCategory(ids);
                          }}
                        />
                      </div>
                    </div>
                    <ProductSection
                      title="Products"
                      items={applyProducts}
                      selected={selectedProducts}
                      label="productName"
                      onSelect={setSelectedProducts}
                    />
                  </div>
                </div>

                {/* RIGHT: summary / preview */}
                <div className="flex flex-col bg-white">
                  <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/80">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-emerald-600">
                      Offer Preview
                    </p>
                    <h3 className="mt-1 text-sm font-semibold text-slate-900">
                      {activeOffer?.offerTitle || "Unnamed Offer"}
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Quick snapshot of where this offer will be applied.
                    </p>
                  </div>

                  <div className="flex-1 overflow-y-auto px-5 py-3 space-y-4 bg-white">
                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-1 text-[11px] font-semibold text-slate-500">
                        Categories selected
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedCategories.length || 0} categor
                        {selectedCategories.length === 1 ? "y" : "ies"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-1 text-[11px] font-semibold text-slate-500">
                        Sub categories selected
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedSubCategories.length || 0} sub categor
                        {selectedSubCategories.length === 1 ? "y" : "ies"}
                      </p>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                      <p className="mb-1 text-[11px] font-semibold text-slate-500">
                        Products selected
                      </p>
                      <p className="text-sm font-medium text-slate-800">
                        {selectedProducts.length || 0} product
                        {selectedProducts.length === 1 ? "" : "s"}
                      </p>
                    </div>
                  </div>

                  {/* Footer actions */}
                  <div className="px-5 py-4 border-t border-slate-200 bg-slate-50 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div className="text-[11px] text-slate-500">
                      Review selection before applying the offer.
                    </div>
                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setApplyModalOpen(false)}
                        className="px-4 py-2 rounded-xl border border-slate-200 
                             bg-white text-slate-700 text-xs font-semibold 
                             hover:bg-slate-50 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleApplyOffer}
                        disabled={selectedProducts.length === 0}
                        className="px-5 py-2 rounded-xl text-xs font-semibold text-white 
                             bg-linear-to-r from-emerald-500 to-emerald-400 
                             shadow-sm shadow-emerald-400/40
                             hover:from-emerald-600 hover:to-emerald-500
                             disabled:bg-emerald-300 disabled:shadow-none 
                             disabled:cursor-not-allowed transition-all"
                      >
                        Apply to {selectedProducts.length || 0} Products
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OfferPage;
