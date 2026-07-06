// import React, { useEffect, useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { FiChevronRight, FiChevronLeft, FiArrowLeft } from "react-icons/fi";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation } from "swiper/modules";
// import axios from "axios";
// import { useSelector } from "react-redux";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import ProductCard from "../components/ProductCard";

// import "swiper/css";
// import "swiper/css/navigation";

// const SubCategoryPage = ({ isHomePage = false }) => {
//   const navigate = useNavigate();
//   const { categoryId } = useParams();
//   const cartItems = useSelector((state) => state.cart.cartItems || []);

//   const [subcategories, setSubcategories] = useState([]);
//   const [products, setProducts] = useState([]);
//   const [selectedSubcategory, setSelectedSubcategory] = useState(null);

//   const [loadingSub, setLoadingSub] = useState(true);
//   const [loadingProducts, setLoadingProducts] = useState(false);
//   const [error, setError] = useState("");

//   /* ================= FETCH SUBCATEGORIES ================= */
//   useEffect(() => {
//     const fetchSubcategories = async () => {
//       if (!categoryId) return;
//       try {
//         setLoadingSub(true);
//         const { data } = await axios.get(
//           `/api/subcategory/getSubCategoriesByCategory/${categoryId}`
//         );

//         if (data.success) {
//           setSubcategories(data.subCategories || []);
//           if (data.subCategories?.length > 0) {
//             setSelectedSubcategory(data.subCategories[0]._id);
//           }
//         } else {
//           setSubcategories([]);
//         }
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load subcategories");
//       } finally {
//         setLoadingSub(false);
//       }
//     };

//     fetchSubcategories();
//   }, [categoryId]);

//   /* ================= FETCH PRODUCTS ================= */
//   useEffect(() => {
//     const fetchProducts = async () => {
//       if (!selectedSubcategory) return;

//       try {
//         setLoadingProducts(true);
//         const { data } = await axios.get(
//           `/api/products/getProductsBySubCategory/${selectedSubcategory}`
//         );

//         if (Array.isArray(data)) setProducts(data);
//         else if (data.success && data.data) setProducts(data.data);
//         else setProducts([]);
//       } catch (err) {
//         console.error(err);
//         setError("Failed to load products");
//       } finally {
//         setLoadingProducts(false);
//       }
//     };

//     fetchProducts();
//   }, [selectedSubcategory]);

//   const getCartQuantity = (productId) => {
//     const cartItem = cartItems.find(
//       (item) =>
//         item.productId?._id === productId || item.productId === productId
//     );
//     return Number(cartItem?.quantity) || 0;
//   };

//   return (
//     <>
//       {!isHomePage && <Navbar />}

//       <section className=" py-8 md:py-12 bg-linear-to-br from-orange-50 via-white to-emerald-50 ">
//         <div className="max-w-7xl mx-auto px-3 md:px-6">

//           {/* BACK BUTTON */}
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 mb-2 text-gray-700 hover:text-emerald-600 transition"
//           >
//             <FiArrowLeft />
//             Back
//           </button>

//           {/* ================= SUBCATEGORY FILTER ================= */}
//           <h2 className="text-lg md:text-2xl font-bold text-gray-900 mb-3">
//             Filter by Subcategory
//           </h2>

//           {loadingSub ? (
//             <div className="flex gap-1 md:gap-4 mb-6">
//               {[...Array(5)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-14 w-40 bg-gray-200 rounded-2xl animate-pulse"
//                 ></div>
//               ))}
//             </div>
//           ) : (
//             <div className="relative mb-6">

//               <Swiper
//                 modules={[Navigation]}
//                 slidesPerView={3}
//                 spaceBetween={12}
//                 navigation={{
//                   nextEl: ".sub-next",
//                   prevEl: ".sub-prev",
//                 }}
//                 breakpoints={{
//                   640: { slidesPerView: 3 },
//                   768: { slidesPerView: 4 },
//                   1024: { slidesPerView: 5 },
//                   1280: { slidesPerView: 6 },
//                 }}
//               >
//                 {subcategories.map((subcategory) => (
//                   <SwiperSlide key={subcategory._id}>
//                     <div
//                       onClick={() => setSelectedSubcategory(subcategory._id)}
//                       className={`cursor-pointer flex items-center gap-3 px-2 md:px-3 py-1 md:py-2 rounded-xl border transition shadow-sm hover:shadow-md ${selectedSubcategory === subcategory._id
//                         ? "border-orange-500 bg-orange-50"
//                         : "border-gray-200 bg-white"
//                         }`}
//                     >
//                       <div className="w-8 h-8 md:w-12 md:h-12 rounded-lg overflow-hidden">
//                         <img
//                           src={subcategory.image || "/placeholder.png"}
//                           alt={subcategory.subCategoryName}
//                           className="w-full h-full object-cover"
//                         />
//                       </div>

//                       <p
//                         className={`text-xs md:text-sm font-semibold ${selectedSubcategory === subcategory._id
//                           ? "text-orange-600"
//                           : "text-gray-800"
//                           }`}
//                       >
//                         {subcategory.subCategoryName}
//                       </p>
//                     </div>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>

//               <button className="sub-prev absolute -left-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center hidden md:flex">
//                 <FiChevronLeft />
//               </button>

//               <button className="sub-next absolute -right-6 top-1/2 -translate-y-1/2 w-10 h-10 bg-white rounded-xl shadow flex items-center justify-center hidden md:flex">
//                 <FiChevronRight />
//               </button>
//             </div>
//           )}

//           {/* ================= PRODUCTS GRID ================= */}
//           {loadingProducts ? (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
//               {[...Array(8)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-64 bg-gray-200 rounded-2xl animate-pulse"
//                 ></div>
//               ))}
//             </div>
//           ) : products.length === 0 ? (
//             <div className="text-center text-gray-500 py-20">
//               No products found in this subcategory
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 md:gap-6">
//               {products.map((product) => (
//                 <ProductCard
//                   key={product._id}
//                   product={product}
//                   quantity={getCartQuantity(product._id)}
//                 />
//               ))}
//             </div>
//           )}

//         </div>
//       </section>

//       {!isHomePage && <Footer />}
//     </>
//   );
// };

// export default SubCategoryPage;
import React, { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import axios from "axios";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const SubCategoryPage = ({ isHomePage = false }) => {
  const navigate = useNavigate();
  const { categoryId } = useParams();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [subcategories, setSubcategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");
  const [selectedSubName, setSelectedSubName] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const [loadingSub, setLoadingSub] = useState(true);
  const [loadingProducts, setLoadingProducts] = useState(false);
  const [error, setError] = useState("");
  const [sortBy, setSortBy] = useState("newest"); // newest | low-high | high-low

  /* ================= FETCH SUBCATEGORIES ================= */
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!categoryId) return;
      try {
        setLoadingSub(true);
        setError("");
        const { data } = await axios.get(
          `/api/subcategory/getSubCategoriesByCategory/${categoryId}`,
        );

        if (data.success) {
          const subs = data.subCategories || [];
          setSubcategories(subs);
          if (subs.length > 0) {
            setSelectedSubcategory(subs[0]._id);
            setSelectedSubName(subs[0].subCategoryName || "");
            if (subs[0].categoryId?.categoryName) {
              setCategoryName(subs[0].categoryId.categoryName);
            }
          }
        } else {
          setSubcategories([]);
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load subcategories");
      } finally {
        setLoadingSub(false);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  /* ================= FETCH PRODUCTS ================= */
  useEffect(() => {
    const fetchProducts = async () => {
      if (!selectedSubcategory) return;

      try {
        setLoadingProducts(true);
        setError("");
        const { data } = await axios.get(
          `/api/products/getProductsBySubCategory/${selectedSubcategory}`,
        );

        if (Array.isArray(data)) setProducts(data);
        else if (data.success && data.data) setProducts(data.data);
        else setProducts([]);
      } catch (err) {
        console.error(err);
        setError("Failed to load products");
      } finally {
        setLoadingProducts(false);
      }
    };

    fetchProducts();
  }, [selectedSubcategory]);

  /* ================= SORTED PRODUCTS ================= */
  const sortedProducts = useMemo(() => {
    const list = [...products];
    if (sortBy === "low-high") {
      return list.sort(
        (a, b) =>
          (a.discountedPrice || a.pricing?.[0]?.price || 0) -
          (b.discountedPrice || b.pricing?.[0]?.price || 0),
      );
    }
    if (sortBy === "high-low") {
      return list.sort(
        (a, b) =>
          (b.discountedPrice || b.pricing?.[0]?.price || 0) -
          (a.discountedPrice || a.pricing?.[0]?.price || 0),
      );
    }
    // newest – assuming createdAt
    return list.sort(
      (a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0),
    );
  }, [products, sortBy]);

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(
      (item) =>
        item.productId?._id === productId || item.productId === productId,
    );
    return Number(cartItem?.quantity) || 0;
  };

  const handleSubClick = (sub) => {
    setSelectedSubcategory(sub._id);
    setSelectedSubName(sub.subCategoryName || "");
  };

  return (
    <>
      {!isHomePage && <Navbar />}

      <section
        className="relative overflow-hidden py-8 md:py-12"
        style={{
          background:
            "linear-gradient(45deg, var(--background) 0%, #ffffff 45%, #e0f2fe 100%)",
        }}
      >
        {/* Soft blobs */}
        <div className="pointer-events-none absolute inset-0 opacity-40">
          <div
            className="absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "rgba(59,130,246,0.18)" }}
          />
          <div
            className="absolute top-40 right-0 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "rgba(16,185,129,0.12)" }}
          />
        </div>

        <div className="relative mx-auto max-w-7xl px-3 md:px-6">
          {/* Back button */}
          <motion.button
            whileHover={{ x: -3 }}
            onClick={() => navigate(-1)}
            className="mb-4 inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium shadow-sm transition"
            style={{
              background: "var(--surface)",
              color: "var(--text-primary)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(12px)",
            }}
          >
            <FiArrowLeft />
            Back
          </motion.button>

          {/* Header + sort */}
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p
                className="mb-1 text-[11px] uppercase tracking-[0.25em]"
                style={{ color: "var(--text-secondary)" }}
              >
                {categoryName || "Collection"}
              </p>
              <h2
                className="text-2xl font-bold md:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                {selectedSubName || "Choose a subcategory"}
              </h2>
              {sortedProducts.length > 0 && !loadingProducts && (
                <p
                  className="mt-1 text-xs"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {sortedProducts.length} item
                  {sortedProducts.length > 1 ? "s" : ""} in this subcategory
                </p>
              )}
            </div>

            {/* Sort dropdown */}
            <div className="flex items-center gap-2">
              <label
                className="text-xs"
                style={{ color: "var(--text-secondary)" }}
              >
                Sort by
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="rounded-lg px-3 py-1.5 text-xs"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              >
                <option value="newest">Newest</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>
          </div>

          {/* Subcategory chips – NO SLIDER */}
          {loadingSub ? (
            <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-12 animate-pulse rounded-2xl"
                  style={{ background: "rgba(255,255,255,0.8)" }}
                />
              ))}
            </div>
          ) : subcategories.length === 0 ? (
            <div
              className="mb-8 rounded-2xl px-4 py-6 text-center text-sm"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                color: "var(--text-secondary)",
              }}
            >
              No subcategories found for this category.
            </div>
          ) : (
            <div className="mb-6 space-y-3">
              {/* Desktop / tablet: horizontal scroll chips */}
              <div className="hidden gap-2 overflow-x-auto pb-1 md:flex">
                {subcategories.map((sub) => {
                  const active = selectedSubcategory === sub._id;
                  return (
                    <button
                      key={sub._id}
                      onClick={() => handleSubClick(sub)}
                      className="flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium transition-all"
                      style={{
                        background: active
                          ? "var(--primary)"
                          : "var(--surface)",
                        color: active
                          ? "var(--surface)"
                          : "var(--text-primary)",
                        border: active
                          ? "1px solid transparent"
                          : "1px solid var(--border)",
                        boxShadow: active ? "var(--card-shadow)" : "none",
                      }}
                    >
                      <span>{sub.subCategoryName}</span>
                    </button>
                  );
                })}
              </div>

              {/* Mobile: compact chips + dropdown */}
              <div className="flex flex-col gap-2 md:hidden">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {subcategories.map((sub) => {
                    const active = selectedSubcategory === sub._id;
                    return (
                      <button
                        key={sub._id}
                        onClick={() => handleSubClick(sub)}
                        className="whitespace-nowrap rounded-full px-3 py-1.5 text-[11px] font-medium transition-all"
                        style={{
                          background: active
                            ? "var(--primary)"
                            : "var(--surface)",
                          color: active
                            ? "var(--surface)"
                            : "var(--text-primary)",
                          border: active
                            ? "1px solid transparent"
                            : "1px solid var(--border)",
                        }}
                      >
                        {sub.subCategoryName}
                      </button>
                    );
                  })}
                </div>

                {/* Optional: dropdown for all subcategories */}
                <select
                  value={selectedSubcategory || ""}
                  onChange={(e) => {
                    const s = subcategories.find(
                      (sub) => sub._id === e.target.value,
                    );
                    if (s) handleSubClick(s);
                  }}
                  className="rounded-lg px-3 py-2 text-xs"
                  style={{
                    background: "var(--surface)",
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                  }}
                >
                  {subcategories.map((sub) => (
                    <option key={sub._id} value={sub._id}>
                      {sub.subCategoryName}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Products grid with motion */}
          <AnimatePresence mode="wait">
            {loadingProducts ? (
              <motion.div
                key="skeleton"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
              >
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="h-64 animate-pulse rounded-3xl"
                    style={{ background: "rgba(255,255,255,0.9)" }}
                  />
                ))}
              </motion.div>
            ) : sortedProducts.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="py-20 text-center text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                No products found in this subcategory.
              </motion.div>
            ) : (
              <motion.div
                key="grid"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="grid grid-cols-2 gap-3 sm:grid-cols-2 md:grid-cols-3 md:gap-6 lg:grid-cols-4"
              >
                {sortedProducts.map((product, index) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.03 }}
                    whileHover={{ y: -5 }}
                    className="rounded-3xl"
                  >
                    <ProductCard
                      product={product}
                      quantity={getCartQuantity(product._id)}
                    />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {!isHomePage && <Footer />}
    </>
  );
};

export default SubCategoryPage;
