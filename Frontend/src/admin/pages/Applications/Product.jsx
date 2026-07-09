import React, { useState, useEffect } from "react";
// import { Trash2, Plus, Edit, X } from "lucide-react";
import Swal from "sweetalert2";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import api from '@/utils/api';
import {
  X,
  Trash2,
  Plus,
  Edit,
  Package,
  FileText,
  Layers,
  Boxes,
  Percent,
  Calendar,
  ShieldCheck,
  Truck,
  RotateCcw,
  Leaf,
  Image as ImageIcon,
  IndianRupee,
  Eye,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Pagination from "../../component/Pagination";

const ITEMS_PER_PAGE = 25;

const Product = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const [removedImages, setRemovedImages] = useState([]);
  const [featureInput, setFeatureInput] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState(searchQuery);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  const [viewModal, setViewModal] = useState(false);
  const [viewProduct, setViewProduct] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);

  // 🔹 state (top of component)
  const [activeImage, setActiveImage] = useState(0);

  const [newProduct, setNewProduct] = useState({
    id: null,
    productName: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
    discount: "",
    validity: "",
    features: [],
    isLowMargin: false,
    stock: 0,
    productImage: [],
    previewUrls: [],
    pricing: [{ unit: "", price: "", value: 0 }],
    feature: false,
    // New fields
    discountedPrice: "",
    trustedQuality: true,
    deliveryTime: "24 hours",
    returnPolicy: "Return Assured",
    sourcedFreshDaily: false,
  });

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  // Fetch products
  const fetchProducts = async () => {
    try {
      const res = await api.get("/api/products/getAllProducts", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const productsData = res.data.data || [];
      console.log(productsData);
      setProducts(productsData);
      setFilteredProducts(productsData);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await api.get("/api/category/getAllCategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  // Fetch subcategories
  const fetchSubCategories = async () => {
    try {
      const res = await api.get("/api/subcategory/getAllSubCategories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSubCategories(res.data.data || []);
    } catch (error) {
      console.error("Error fetching subcategories:", error);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
  }, []);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedSearch(searchQuery), 300);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  // Filter products by search, category, and subcategory filters
  useEffect(() => {
    let filtered = products;

    if (categoryFilter) {
      filtered = filtered.filter(
        (p) =>
          p.categoryId?._id === categoryFilter ||
          p.categoryId === categoryFilter,
      );
    }

    if (subCategoryFilter) {
      filtered = filtered.filter(
        (p) =>
          p.subCategoryId?._id === subCategoryFilter ||
          p.subCategoryId === subCategoryFilter,
      );
    }

    if (debouncedSearch) {
      filtered = filtered.filter((p) =>
        p.productName.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [debouncedSearch, categoryFilter, subCategoryFilter, products]);

  // Pagination slice
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);

  // Utility: get category/subcategory names
  const getCategoryName = (id) =>
    categories.find((c) => c._id === id)?.categoryName || "N/A";

  const getSubCategoryName = (id) =>
    subCategories.find((s) => s._id === id)?.subCategoryName || "N/A";

  // Inserted here for brevity your existing handlers unchanged, just ensure they're placed correctly

  // For example:
  const handleFilesChange = (e) => {
    const files = Array.from(e.target.files);
    const previewUrls = files.map((file) => URL.createObjectURL(file));
    setNewProduct({
      ...newProduct,
      productImage: [...newProduct.productImage, ...files],
      previewUrls: [...newProduct.previewUrls, ...previewUrls],
    });
  };

  const handleRemoveImage = (index) => {
    const updatedPreviews = [...newProduct.previewUrls];
    const removed = updatedPreviews[index];

    if (typeof removed === "string") {
      setRemovedImages([...removedImages, removed]);
    } else {
      const updatedFiles = [...newProduct.productImage];
      updatedFiles.splice(index, 1);
      newProduct.productImage = updatedFiles;
    }

    updatedPreviews.splice(index, 1);
    setNewProduct({ ...newProduct, previewUrls: updatedPreviews });
  };

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...newProduct.pricing];
    if (field === "price" || field === "value") {
      value = Number(value);
      if (value < 0) value = 0;
    }
    updatedPricing[index][field] = value;
    setNewProduct({ ...newProduct, pricing: updatedPricing });
  };
  const getDiscountedPrice = (price, discount) => {
    const p = Number(price) || 0;
    const d = Number(discount) || 0;
    if (p <= 0 || d <= 0) return p;
    return p - (p * d) / 100;
  };

  const addPricingRow = () => {
    setNewProduct({
      ...newProduct,
      pricing: [...newProduct.pricing, { unit: "", price: "", value: 0 }],
    });
  };

  const removePricingRow = (index) => {
    const updatedPricing = newProduct.pricing.filter((_, i) => i !== index);
    setNewProduct({ ...newProduct, pricing: updatedPricing });
  };

  const resetNewProduct = () => {
    setNewProduct({
      id: null,
      productName: "",
      description: "",
      categoryId: "",
      subCategoryId: "",
      validity: "",
      features: [],
      discount: "",
      isLowMargin: false, // ✅ ADD
      stock: 0,
      productImage: [],
      previewUrls: [],
      discountedPrice: "",
      pricing: [{ unit: "", price: "", value: 0 }],
      feature: false,
      // New fields
      trustedQuality: true,
      deliveryTime: "24 hours",
      returnPolicy: "Return Assured",
      sourcedFreshDaily: false,
    });
    setRemovedImages([]);
    setFeatureInput("");
  };

  const handleSave = async () => {
    // 🔴 Required fields validation
    if (
      !newProduct.productName ||
      !newProduct.categoryId ||
      !newProduct.subCategoryId
    ) {
      Swal.fire("Error", "Please fill all required fields", "error");
      return;
    }

    // 🔴 Checkbox validation
    if (!newProduct.trustedQuality && !newProduct.sourcedFreshDaily) {
      Swal.fire({
        icon: "warning",
        title: "Confirm Required",
        text: "Please check both Trusted Quality and Sourced Fresh Daily.",
      });
      return;
    }

    if (!newProduct.trustedQuality) {
      Swal.fire({
        icon: "warning",
        text: "Please confirm Trusted Quality.",
      });
      return;
    }
    const originalPrice = Number(newProduct.pricing[0].price);
    const discountedPrice = Number(newProduct.discountedPrice);

    if (
      !originalPrice ||
      !discountedPrice ||
      discountedPrice >= originalPrice
    ) {
      Swal.fire({
        icon: "warning",
        text: "Invalid pricing: Discounted price must be less than original price",
      });
      return;
    }

    if (!newProduct.sourcedFreshDaily) {
      Swal.fire({
        icon: "warning",
        text: "Please confirm Sourced Fresh Daily.",
      });
      return;
    }
    try {
      const formData = new FormData();

      newProduct.productImage.forEach((file) =>
        formData.append("productImage", file),
      );

      formData.append("productName", newProduct.productName);
      formData.append("stock", Number(newProduct.stock) || 0);
      formData.append("discount", Number(newProduct.discount) || 0);
      formData.append("description", newProduct.description);
      formData.append("categoryId", newProduct.categoryId?.toString() || "");
      formData.append(
        "subCategoryId",
        newProduct.subCategoryId?.toString() || "",
      );
      formData.append("validity", newProduct.validity || "");

      formData.append(
        "pricing",
        JSON.stringify(
          newProduct.pricing.map((p) => ({
            unit: p.unit,
            price: Number(p.price),
            discountedPrice: Number(newProduct.discountedPrice),
            value: Number(p.value),
          })),
        ),
      );

      formData.append("isLowMargin", newProduct.isLowMargin ? "true" : "false");

      formData.append("features", JSON.stringify(newProduct.features));
      formData.append("feature", newProduct.feature ? "true" : "false");

      // ✅ Checkbox fields
      formData.append(
        "trustedQuality",
        newProduct.trustedQuality ? "true" : "false",
      );
      formData.append(
        "sourcedFreshDaily",
        newProduct.sourcedFreshDaily ? "true" : "false",
      );

      formData.append("deliveryTime", newProduct.deliveryTime || "24 hours");
      formData.append(
        "returnPolicy",
        newProduct.returnPolicy || "Return Assured",
      );

      if (removedImages.length > 0) {
        formData.append("removedImages", JSON.stringify(removedImages));
      }

      let res;
      if (newProduct.id) {
        console.log(formData);
        res = await api.put(
          `/api/products/updateProduct/${newProduct.id}`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "multipart/form-data",
            },
          },
        );
      } else {
        res = await api.post("/api/products/uploadProduct", formData, {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        });
      }

      const savedProduct = res.data.data;

      if (newProduct.id) {
        setProducts((prev) =>
          prev.map((p) => (p._id === newProduct.id ? savedProduct : p)),
        );
        Swal.fire("Updated!", "Product updated successfully", "success");
      } else {
        setProducts((prev) => [savedProduct, ...prev]);
        Swal.fire("Added!", "Product added successfully", "success");
      }

      setShowModal(false);
      resetNewProduct();
    } catch (error) {
      console.error("Save failed:", error.response?.data || error);
      Swal.fire("Error", "Failed to save product", "error");
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This product will be deleted permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/api/products/deleteProduct/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setProducts(products.filter((p) => p._id !== id));
          Swal.fire("Deleted!", "Product deleted.", "success");
        } catch (error) {
          console.error("Delete failed:", error);
        }
      }
    });
  };

  const Section = ({ title, children }) => (
    <div className="bg-purple-50/40 rounded-2xl p-4 border border-purple-100">
      <h3 className="text-sm font-bold text-gray-700 mb-3 flex items-center gap-2">
        {/* <span className="w-2 h-2 rounded-full bg-purple-600" /> */}
        {title}
      </h3>
      {children}
    </div>
  );

  const Info = ({ icon: Icon, label, value }) => (
    <div className="bg-white rounded-xl p-4 border border-purple-100 shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3">
        <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-xs text-gray-500">{label}</p>
          <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className=" bg-gray-50 min-h-screen">
      {/* Header with search and filters */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4 md:gap-0">
        <div className="">
          <h1 className="text-2xl font-bold">
            Manage <span className="text-orange-500">Products</span>
          </h1>
          {/* Display count */}
          <p className="text-gray-600 mb-4">
            {filteredProducts.length} products found
          </p>
        </div>

        <div className="flex flex-wrap md:flex-nowrap gap-2 w-full md:w-auto items-center">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full md:w-64 px-3 py-2 rounded-lg border border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500 bg-white text-gray-900"
          />

          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setSubCategoryFilter("");
            }}
            className="w-48 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c._id} value={c._id}>
                {c.categoryName}
              </option>
            ))}
          </select>

          <select
            value={subCategoryFilter}
            onChange={(e) => setSubCategoryFilter(e.target.value)}
            className="w-48 px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            disabled={!categoryFilter}
          >
            <option value="">All SubCategories</option>
            {subCategories
              .filter((s) => s.categoryId?._id === categoryFilter)
              .map((s) => (
                <option key={s._id} value={s._id}>
                  {s.subCategoryName}
                </option>
              ))}
          </select>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-white text-orange-500 border border-orange-500 rounded-lg hover:bg-orange-500 hover:text-white font-semibold hover:border-none"
          >
            <Plus size={18} /> Add Product
          </button>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block overflow-x-auto bg-white shadow-md rounded-lg">
        <table className="w-full text-xs text-left">
          <thead className="bg-orange-50 text-gray-600">
            <tr>
              <th className="px-4 py-3">S.No</th>
              <th className="px-4 py-3">Image</th>
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Pricing</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Validity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedProducts.map((p, index) => {
              const hasDiscount = Number(p.discount) > 0;
              const hasSpecial =
                p.spicialDiscount && p.spicialDiscount.status === "active";

              return (
                <tr
                  key={p._id}
                  className="border-t border-gray-200 hover:bg-gray-50 transition"
                >
                  {/* S.No */}
                  <td className="px-4 py-3 align-top">
                    {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                  </td>

                  {/* Image */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex gap-1">
                      {p.productImage?.slice(0, 2).map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="product"
                          className="w-10 h-10 rounded-md object-cover border border-gray-200"
                        />
                      ))}
                    </div>
                  </td>

                  {/* Product + badges + desc */}
                  <td className="px-4 py-3 align-top max-w-60">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-gray-900 text-sm">
                          {p.productName}
                        </span>

                        {hasDiscount && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            {p.discount}% OFF
                          </span>
                        )}

                        {hasSpecial && (
                          <span className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                            {p.spicialDiscount.offerPercentage}% SD
                          </span>
                        )}
                        {/* ✅ ADD LOW MARGIN BADGE HERE */}
                        {p.isLowMargin && (
                          <span
                            className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold
          bg-red-50 text-red-600 border border-red-100"
                          >
                            Low Margin
                          </span>
                        )}
                      </div>

                      {/* <p className="text-[11px] text-gray-500 line-clamp-2">
                        {p.description}
                      </p> */}

                      {hasSpecial && (
                        <p className="text-[11px] text-purple-600 font-medium">
                          {p.spicialDiscount.offerTitle}
                        </p>
                      )}
                    </div>
                  </td>

                  {/* Category / Subcategory */}
                  <td className="px-4 py-3 align-top text-[11px] text-gray-700">
                    <div className="font-medium">
                      {getCategoryName(p.categoryId?._id || p.categoryId)}
                    </div>
                    <div className="text-gray-500">
                      {getSubCategoryName(
                        p.subCategoryId?._id || p.subCategoryId,
                      )}
                    </div>
                  </td>

                  {/* Pricing: base, discount, special */}
                  <td className="px-4 py-3 align-top">
                    <div className="space-y-1">
                      {p.pricing?.map((pr, idx) => {
                        const baseDiscounted = getDiscountedPrice(
                          pr.price,
                          p.discount,
                        );
                        const finalSpecial =
                          hasSpecial && p.SpecialDiscountedPrice
                            ? p.SpecialDiscountedPrice
                            : baseDiscounted;

                        return (
                          <div
                            key={idx}
                            className="rounded bg-white px-2 py-1 border border-gray-100"
                          >
                            {/* Unit + Qty */}
                            <div className="flex justify-between text-[11px] text-gray-500">
                              <span>
                                Qty: {pr.value}-{pr.unit}
                              </span>
                            </div>

                            {/* Prices */}
                            <div className="mt-0.5 flex flex-col text-[11px]">
                              {hasDiscount ? (
                                <div className="flex items-center gap-1">
                                  <span className="line-through text-gray-400">
                                    ₹{Number(pr.price).toFixed(2)}
                                  </span>
                                  <span className="font-semibold text-emerald-600">
                                    ₹{p.discountedPrice.toFixed(2)}
                                  </span>
                                </div>
                              ) : (
                                <span className="font-semibold text-gray-800">
                                  ₹{Number(pr.price).toFixed(2)}
                                </span>
                              )}

                              {hasSpecial && (
                                <span className="text-[11px] text-purple-600 font-semibold">
                                  Special: ₹
                                  {Number(p.SpecialDiscountedPrice.toFixed(2))}
                                </span>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-3 align-top text-xs">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full font-medium ${
                        p.stock === 0
                          ? "bg-red-50 text-red-700"
                          : p.stock <= 10
                            ? "bg-amber-50 text-amber-700"
                            : "bg-emerald-50 text-emerald-700"
                      }`}
                    >
                      {p.stock === 0
                        ? "Out of stock"
                        : p.stock <= 10
                          ? `Low stock (${p.stock})`
                          : `In stock (${p.stock})`}
                    </span>
                  </td>

                  {/* Validity */}
                  <td className="px-4 py-3 align-top text-[11px] text-gray-700">
                    {p.validity && p.validity.substring(0, 10)}
                  </td>

                  {/* Status */}
                  <td className="px-4 py-3 align-top text-[11px]">
                    <span
                      className={`px-2 py-0.5 rounded-full font-medium ${
                        p.status === "active"
                          ? "bg-emerald-50 text-emerald-700"
                          : "bg-gray-100 text-gray-500"
                      }`}
                    >
                      {p.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-4 py-3 align-top">
                    <div className="flex gap-2 justify-center">
                      <button
                        onClick={() => {
                          setNewProduct({
                            id: p._id,
                            productName: p.productName,
                            description: p.description,
                            categoryId: p.categoryId?._id || p.categoryId,
                            subCategoryId:
                              p.subCategoryId?._id || p.subCategoryId,
                            validity: p.validity?.substring(0, 10),
                            stock: p.stock || 0,
                            discountedPrice: p.discountedPrice,
                            isLowMargin: p.isLowMargin ?? false,
                            features: p.features || [],
                            feature: p.feature || false,
                            productImage: [],
                            previewUrls: p.productImage || [],
                            pricing: p.pricing?.map((pr) => ({
                              unit: pr.unit,
                              price: pr.price,
                              value: pr.value,
                            })) || [{ unit: "", price: "", value: 0 }],
                            trustedQuality: p.trustedQuality,
                            deliveryTime: p.deliveryTime,
                            returnPolicy: p.returnPolicy,
                            sourcedFreshDaily: p.sourcedFreshDaily,
                          });
                          setShowModal(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-[11px] font-medium"
                      >
                        <Edit size={14} />
                        Edit
                      </button>

                      <button
                        onClick={() => {
                          setViewProduct(p);
                          setViewModal(true);
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-[11px] font-medium"
                      >
                        <Eye size={14} /> View
                      </button>

                      <button
                        onClick={() => handleDelete(p._id)}
                        className="flex items-center gap-1 px-2.5 py-1 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-[11px] font-medium"
                      >
                        <Trash2 size={14} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filteredData.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}{" "}
      </div>

      {/* Mobile Cards */}
      <div className="block md:hidden space-y-4">
        {paginatedProducts.map((p, index) => {
          const hasDiscount = Number(p.discount) > 0;
          const hasSpecial =
            p.spicialDiscount && p.spicialDiscount.status === "active";

          return (
            <div
              key={p._id}
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
            >
              {/* Top: S.No + badges */}
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-medium text-gray-500">
                  S.No: {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
                </p>

                <div className="flex items-center gap-1">
                  {hasDiscount && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
                      {p.discount}% OFF
                    </span>
                  )}
                  {hasSpecial && (
                    <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-purple-50 text-purple-600 border border-purple-100">
                      {p.spicialDiscount.offerPercentage}% SD
                    </span>
                  )}
                </div>
              </div>

              {/* Images */}
              <div className="flex gap-2 overflow-x-auto">
                {p.productImage?.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt="product"
                    className="w-20 h-20 rounded-lg object-cover border border-gray-100"
                  />
                ))}
              </div>

              {/* Title + description */}
              <h3 className="mt-3 font-semibold text-base text-gray-900 line-clamp-1">
                {p.productName}
              </h3>
              <p className="mt-1 text-xs text-gray-500 line-clamp-2">
                {p.description}
              </p>

              {/* Category */}
              <div className="mt-2 space-y-0.5 text-xs">
                <p>
                  <span className="font-medium text-gray-700">Category: </span>
                  <span className="text-gray-600">
                    {getCategoryName(p.categoryId?._id || p.categoryId)}
                  </span>
                </p>
                <p>
                  <span className="font-medium text-gray-700">
                    SubCategory:{" "}
                  </span>
                  <span className="text-gray-600">
                    {getSubCategoryName(
                      p.subCategoryId?._id || p.subCategoryId,
                    )}
                  </span>
                </p>
              </div>

              {/* Special offer title */}
              {hasSpecial && (
                <p className="mt-1 text-[11px] text-purple-600 font-medium">
                  {p.spicialDiscount.offerTitle}
                </p>
              )}

              {/* Pricing */}
              <div className="mt-3 space-y-1.5">
                {p.pricing?.map((pr, idx) => {
                  const baseDiscounted = getDiscountedPrice(
                    pr.price,
                    p.discount,
                  );
                  const finalSpecial =
                    hasSpecial && p.SpecialDiscountedPrice
                      ? p.SpecialDiscountedPrice
                      : baseDiscounted;

                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between text-xs text-gray-700 bg-gray-50 rounded-lg px-3 py-2"
                    >
                      {/* Unit + qty */}
                      <div className="flex flex-col">
                        <span className="text-[11px] text-gray-500">Unit</span>
                        <span className="font-medium">{pr.unit}</span>
                        <span className="text-[11px] text-gray-500">
                          Qty: {pr.value}
                        </span>
                      </div>

                      {/* Prices */}
                      <div className="flex flex-col items-end">
                        {hasDiscount ? (
                          <>
                            <span className="line-through text-[11px] text-gray-400">
                              ₹{Number(pr.price).toFixed(2)}
                            </span>
                            <span className="text-emerald-600 font-semibold text-sm">
                              ₹{p.discountedPrice}
                            </span>
                          </>
                        ) : (
                          <span className="text-gray-800 font-semibold text-sm">
                            ₹{Number(pr.price).toFixed(2)}
                          </span>
                        )}

                        {hasSpecial && (
                          <span className="mt-0.5 text-[11px] text-purple-600 font-semibold">
                            Special: ₹{Number(finalSpecial).toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  );
                })}
                {/* ✅ ADD LOW MARGIN BADGE HERE */}
                {p.isLowMargin && (
                  <span
                    className="px-2 py-0.5 rounded-full text-[11px] font-semibold
      bg-red-50 text-red-600 border border-red-100"
                  >
                    Low Margin
                  </span>
                )}
              </div>

              {/* Stock + validity + status */}
              <div className="mt-3 flex items-center justify-between text-[11px]">
                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    p.stock > 0
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {p.stock > 0 ? `In stock (${p.stock})` : "Out of stock"}
                </span>

                {p.validity && (
                  <span className="text-gray-500">
                    Exp: {p.validity.substring(0, 10)}
                  </span>
                )}

                <span
                  className={`px-2 py-0.5 rounded-full font-medium ${
                    p.status === "active"
                      ? "bg-emerald-50 text-emerald-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {p.status}
                </span>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-2 mt-4">
                <button
                  onClick={() => {
                    setNewProduct({
                      id: p._id,
                      productName: p.productName,
                      description: p.description,
                      categoryId: p.categoryId?._id || p.categoryId,
                      subCategoryId: p.subCategoryId?._id || p.subCategoryId,
                      validity: p.validity?.substring(0, 10),
                      features: p.features || [],
                      discount: p.discount,
                      stock: p.stock || 0,
                      discountedPrice: p.discountedPrice,
                      feature: p.feature || false,
                      productImage: [],
                      previewUrls: p.productImage || [],
                      isLowMargin: p.isLowMargin ?? false, // ✅ ADD
                      pricing: p.pricing?.map((pr) => ({
                        unit: pr.unit,
                        price: pr.price,
                        value: pr.value,
                      })) || [{ unit: "", price: "", value: 0 }],
                      trustedQuality: p.trustedQuality,
                      deliveryTime: p.deliveryTime,
                      returnPolicy: p.returnPolicy,
                      sourcedFreshDaily: p.sourcedFreshDaily,
                    });
                    setShowModal(true);
                  }}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 text-xs font-medium"
                >
                  <Edit size={14} />
                  Edit
                </button>

                <button
                  onClick={() => {
                    setViewProduct(p);
                    setViewModal(true);
                  }}
                  className="flex items-center gap-1 px-2.5 py-1 bg-emerald-50 text-emerald-700 rounded-lg hover:bg-emerald-100 text-[11px] font-medium"
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={() => handleDelete(p._id)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 text-xs font-medium"
                >
                  <Trash2 size={14} />
                  Delete
                </button>
              </div>
            </div>
          );
        })}
        {filteredData.length > ITEMS_PER_PAGE && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        )}{" "}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
            {/* Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {newProduct.id ? "Edit Product" : "Add Product"}
              </h2>
              <button
                onClick={() => {
                  setShowModal(false);
                  resetNewProduct();
                }}
                className="text-orange-500 hover:text-orange-600"
              >
                <X size={22} />
              </button>
            </div>

            {/* Form */}
            <div className="space-y-6 mt-6">
              {/* ✅ Basic Information */}
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-lg border-b border-gray-300 font-semibold text-gray-800 mb-3 pb-2">
                  Basic Information
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      value={newProduct.categoryId}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          categoryId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    >
                      <option value="">Select Category</option>
                      {categories.map((c) => (
                        <option key={c._id} value={c._id}>
                          {c.categoryName}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-2 font-medium text-gray-700">
                      Subcategory
                    </label>
                    <select
                      value={newProduct?.subCategoryId}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          subCategoryId: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    >
                      <option value="">Select SubCategory</option>
                      {subCategories
                        .filter(
                          (s) => s.categoryId?._id === newProduct.categoryId,
                        )
                        .map((s) => (
                          <option key={s._id} value={s._id}>
                            {s.subCategoryName}
                          </option>
                        ))}
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Product Name
                    </label>
                    <input
                      type="text"
                      value={newProduct?.productName}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          productName: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                      placeholder="Product Name"
                    />
                  </div>
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Total Stock
                    </label>
                    <input
                      type="Number"
                      min={0}
                      value={newProduct?.stock}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          stock: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    />
                  </div>

                  <div className="md:col-span-2 col-span-1">
                    <label className="block mb-1 font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      value={newProduct?.description}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          description: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                      placeholder="Enter Product Description (e.g. Organic)"
                    />
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100 mt-4">
                <label className="block text-lg font-semibold mb-3 border-b border-gray-300 text-gray-800">
                  Features
                </label>

                {/* Return Policy + Delivery Time (2 Columns) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Return Policy
                    </label>
                    <select
                      value={newProduct.returnPolicy}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          returnPolicy: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    >
                      <option value="Return Assured">Return Assured</option>
                      <option value="No Return">No Return</option>
                    </select>
                  </div>

                  <div>
                    <label className="block mb-1 font-medium text-gray-700">
                      Delivery Time
                    </label>
                    <input
                      type="text"
                      value={newProduct.deliveryTime}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          deliveryTime: e.target.value,
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    />
                  </div>
                </div>

                {/* Checkboxes below */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  {/* Trusted Quality */}
                  <label
                    className="flex items-center gap-3 p-4 rounded-2xl
    bg-linear-to-br from-green-50 to-white 
    hover:shadow-md transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newProduct.trustedQuality}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          trustedQuality: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-green-600"
                    />

                    <div>
                      <p className="text-gray-800 font-semibold">
                        Trusted Quality
                      </p>
                      <p className="text-xs text-gray-500">
                        Quality checked & verified
                      </p>
                    </div>
                  </label>

                  {/* Sourced Fresh Daily */}
                  <label
                    className="flex items-center gap-3 p-4 rounded-2xl 
    bg-linear-to-br from-green-50 to-white 
    hover:shadow-md transition cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={newProduct.sourcedFreshDaily}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          sourcedFreshDaily: e.target.checked,
                        })
                      }
                      className="w-5 h-5 accent-blue-600"
                    />

                    <div>
                      <p className="text-gray-800 font-semibold">
                        Sourced Fresh Daily
                      </p>
                      <p className="text-xs text-gray-500">
                        Direct from source every day
                      </p>
                    </div>
                  </label>
                </div>
              </div>

              {/* Features */}
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <label className="block mb-1 font-medium text-gray-700">
                  Highlights
                </label>

                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    className="flex-1 px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                    placeholder="Enter feature (e.g. Organic)"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      if (featureInput.trim() !== "") {
                        setNewProduct({
                          ...newProduct,
                          features: [...newProduct.features, featureInput],
                        });
                        setFeatureInput("");
                      }
                    }}
                    className="px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-amber-600"
                  >
                    Add
                  </button>
                </div>

                <div className="flex gap-2 flex-wrap">
                  {newProduct?.features?.map((f, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full text-sm flex items-center gap-2"
                    >
                      {f}
                      <button
                        type="button"
                        onClick={() =>
                          setNewProduct({
                            ...newProduct,
                            features: newProduct?.features.filter(
                              (_, i) => i !== idx,
                            ),
                          })
                        }
                        className="text-red-500 hover:text-red-700"
                      >
                        <X size={14} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* ✅ Pricing */}
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <label className="block mb-2 border-b border-gray-300 text-lg font-semibold text-gray-800">
                  Pricing & Stock
                </label>
                {newProduct.pricing.map((pr, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4 items-end"
                  >
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">
                        Unit
                      </label>
                      <select
                        value={pr?.unit}
                        onChange={(e) =>
                          handlePricingChange(idx, "unit", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                      >
                        <option value="">Select Unit</option>
                        <option value="Kg">kg</option>
                        <option value="gram">gram</option>
                        <option value="ml">ml</option>
                        <option value="liter">litre</option>
                        <option value="piece">piece</option>
                        <option value="pack">pack</option>
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">
                        Price (₹)
                      </label>
                      <input
                        type="number"
                        value={pr?.price}
                        onChange={(e) =>
                          handlePricingChange(idx, "price", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                      />
                    </div>
                    <div>
                      <label className="block mb-1 font-medium text-gray-700">
                        Quantity
                      </label>
                      <input
                        type="number"
                        value={pr?.value}
                        onChange={(e) =>
                          handlePricingChange(idx, "value", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                      />
                    </div>
                    {/* <div>
                      <button
                        onClick={() => removePricingRow(idx)}
                        className="px-2 py-1 bg-red-100 text-red-700 rounded-lg hover:bg-red-200"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div> */}
                  </div>
                ))}
                {/* <button
                   onClick={addPricingRow}
                   className="px-3 py-1 flex items-center gap-1 border-0 bg-amber-100 text-amber-600 rounded-lg hover:bg-amber-200 font-medium"
                 >
                   <Plus size={14} /> Add Row
                 </button> */}
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Discounted Price
                  </label>

                  <input
                    type="number"
                    placeholder="Discounted Price"
                    value={newProduct.discountedPrice}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        discountedPrice: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                  />
                </div>
              </div>

              {/* ✅ Product Image Upload */}
              <div className="bg-white p-4 rounded-2xl shadow-lg border border-gray-100">
                <label className="block text-lg font-semibold mb-2 border-b border-gray-300 text-gray-800">
                  Product Image
                </label>
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFilesChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 
                     file:rounded-lg file:border-0 file:text-sm file:font-medium
                     file:bg-orange-50 file:text-orange-600 hover:file:bg-amber-100 cursor-pointer"
                />
                <div className="flex gap-2 mt-3 flex-wrap">
                  {newProduct.previewUrls?.map((url, idx) => (
                    <div key={idx} className="relative">
                      <img
                        src={url}
                        alt="preview"
                        className="w-20 h-20 object-cover rounded-lg shadow-md"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemoveImage(idx)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* ✅ Validity & Feature */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 font-medium text-gray-700">
                    Validity
                  </label>
                  {/* <input
                    type="date"
                    value={newProduct?.validity}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, validity: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-400 outline-none shadow-sm"
                  /> */}
                  <DatePicker
                    selected={
                      newProduct.validity ? new Date(newProduct.validity) : null
                    }
                    onChange={(date) =>
                      setNewProduct({
                        ...newProduct,
                        validity: date.toISOString().substring(0, 10),
                      })
                    }
                    onChangeRaw={(e) => {
                      const value = e.target.value;
                      const parsed = new Date(value);
                      if (!isNaN(parsed)) {
                        setNewProduct({
                          ...newProduct,
                          validity: parsed.toISOString().substring(0, 10),
                        });
                      }
                    }}
                    dateFormat="yyyy-MM-dd"
                    showMonthDropdown
                    showYearDropdown
                    dropdownMode="select"
                    placeholderText="YYYY-MM-DD"
                    className="w-full px-3 py-2 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-orange-500 outline-none shadow-sm"
                  />
                </div>
                <label
                  className="flex items-center gap-3 p-4 rounded-2xl 
  bg-linear-to-br from-red-50 to-white 
  hover:shadow-md transition cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={newProduct.isLowMargin}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        isLowMargin: e.target.checked,
                      })
                    }
                    className="w-5 h-5 accent-red-600"
                  />

                  <div>
                    <p className="text-gray-800 font-semibold">
                      Low Margin Product
                    </p>
                    <p className="text-xs text-gray-500">
                      This product will be excluded from suggestions & random
                      lists
                    </p>
                  </div>
                </label>
              </div>

              {/* ✅ Buttons */}
              <div className="flex justify-end gap-4">
                <button
                  onClick={() => {
                    setShowModal(false);
                    resetNewProduct();
                  }}
                  className="px-5 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 rounded-xl bg-orange-500 text-white font-semibold"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {viewModal && viewProduct && (
        <div className="fixed inset-0 z-9999 flex items-center justify-center bg-black/60 p-4">
          <div className="bg-white rounded-3xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6">
            {/* ================= HEADER ================= */}
            <div className="flex justify-between items-start border-b pb-2 gap-4">
              <div className="mt-1 text-xl font-bold">
                <p>Product Details</p>
              </div>

              {/* Close button stays top-right */}
              <button
                onClick={() => setViewModal(false)}
                className="p-2 rounded-lg text-gray-500 hover:text-purple-600 hover:bg-purple-100 transition"
              >
                <X size={22} />
              </button>
            </div>

            {/* ================= STATUS ================= */}
            <div className="mt-3">
              <span
                className={`px-4 py-1.5 rounded-full text-sm font-semibold
      ${
        viewProduct.stock > 0
          ? "bg-green-100 text-green-700"
          : "bg-red-100 text-red-700"
      }`}
              >
                {viewProduct.stock > 0 ? "In Stock" : "Out of Stock"}
              </span>
            </div>

            {/* ================= IMAGE + BASIC INFO ================= */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-5 gap-6">
              {/* ===== LEFT : IMAGE SLIDER (SMALLER) ===== */}
              <div className="md:col-span-2">
                <Section title="Product Images">
                  {viewProduct.productImage?.length > 0 ? (
                    <>
                      <div className="relative w-full md:w-65 overflow-hidden rounded-2xl mt-2 shadow-lg">
                        <div
                          className="flex transition-transform duration-500 ease-in-out"
                          style={{
                            transform: `translateX(-${activeImage * 100}%)`,
                          }}
                        >
                          {viewProduct.productImage.map((img, i) => (
                            <img
                              key={i}
                              src={img}
                              alt="product"
                              className="w-full h-34 md:h-45 object-cover shrink-0 bg-gray-100"
                            />
                          ))}
                        </div>

                        {/* ===== Arrows ===== */}
                        <button
                          onClick={() =>
                            setActiveImage((prev) =>
                              prev === 0
                                ? viewProduct.productImage.length - 1
                                : prev - 1,
                            )
                          }
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow hover:bg-purple-100 transition"
                        >
                          <ChevronLeft size={16} className="text-gray-700" />
                        </button>

                        <button
                          onClick={() =>
                            setActiveImage((prev) =>
                              prev === viewProduct.productImage.length - 1
                                ? 0
                                : prev + 1,
                            )
                          }
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 p-1.5 rounded-full shadow hover:bg-purple-100 transition"
                        >
                          <ChevronRight size={16} className="text-gray-700" />
                        </button>
                      </div>

                      {/* ===== Dots ===== */}
                      <div className="flex justify-center gap-2 mt-2">
                        {viewProduct.productImage.map((_, i) => (
                          <button
                            key={i}
                            onClick={() => setActiveImage(i)}
                            className={`w-1.5 h-1.5 rounded-full transition-colors duration-300 ${
                              activeImage === i
                                ? "bg-purple-600"
                                : "bg-gray-300"
                            }`}
                          />
                        ))}
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">No images available</p>
                  )}
                </Section>
              </div>

              {/* ===== RIGHT : BASIC INFORMATION (SAME DESIGN) ===== */}
              <div className="md:col-span-3">
                <Section title="Basic Information">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Info
                      icon={Package}
                      label="Product Name"
                      value={viewProduct.productName}
                    />
                    <Info
                      icon={Boxes}
                      label="Stock"
                      value={viewProduct.stock}
                    />
                    <Info
                      icon={Layers}
                      label="Category"
                      value={getCategoryName(
                        viewProduct.categoryId?._id || viewProduct.categoryId,
                      )}
                    />
                    <Info
                      icon={Layers}
                      label="Sub Category"
                      value={getSubCategoryName(
                        viewProduct.subCategoryId?._id ||
                          viewProduct.subCategoryId,
                      )}
                    />
                  </div>
                </Section>
              </div>
            </div>

            {/* ================= PRICING ================= */}
            <Section title="Pricing" className="mt-6">
              <div className="space-y-3">
                {viewProduct.pricing?.map((p, i) => (
                  <div
                    key={i}
                    className="flex justify-between items-center rounded-xl px-4 py-2 shadow-md bg-white"
                  >
                    <span className="font-medium">
                      {p.unit} ({p.value})
                    </span>
                    <span className="font-semibold text-purple-700 flex items-center gap-1">
                      <IndianRupee size={14} /> {p.price}
                    </span>
                  </div>
                ))}
              </div>
            </Section>

            {/* ================= QUALITY & DELIVERY ================= */}
            <Section title="Quality & Delivery" className="mt-6">
              <div className="grid grid-cols-2 gap-4">
                <Info
                  icon={ShieldCheck}
                  label="Trusted Quality"
                  value={viewProduct.trustedQuality ? "Yes" : "No"}
                />
                <Info
                  icon={Truck}
                  label="Delivery Time"
                  value={viewProduct.deliveryTime || "-"}
                />
                <Info
                  icon={RotateCcw}
                  label="Return Policy"
                  value={viewProduct.returnPolicy || "-"}
                />
                <Info
                  icon={Leaf}
                  label="Fresh Daily"
                  value={viewProduct.sourcedFreshDaily ? "Yes" : "No"}
                />
              </div>
            </Section>

            {/* ================= FEATURES ================= */}
            {viewProduct.features?.length > 0 && (
              <Section title="Features" className="mt-6">
                <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                  {viewProduct.features.map((f, i) => (
                    <li key={i}>{f}</li>
                  ))}
                </ul>
              </Section>
            )}
            {/* ================= DESCRIPTION ================= */}
            <Section title="Description" className="mt-6">
              <p className="text-sm text-gray-700">
                {viewProduct.description || "-"}
              </p>
            </Section>
          </div>
        </div>
      )}
    </div>
  );
};

export default Product;
