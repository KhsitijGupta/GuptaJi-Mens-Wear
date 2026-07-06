// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { FiChevronUp, FiChevronRight } from "react-icons/fi";
// import axios from "axios";
// import { useDispatch, useSelector } from "react-redux";
// import { fetchCart } from "../../redux/slices/cartSlice";
// import Navbar from "../components/Navbar";
// import Footer from "./Footer";
// import ProductCard from "../components/ProductCard";

// const TopProducts = ({ isHomePage = false }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const cartItems = useSelector((state) => state.cart.cartItems || []);

//   const [products, setProducts] = useState([]);
//   const [filteredProducts, setFilteredProducts] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [subCategories, setSubCategories] = useState([]);

//   const [categoryFilter, setCategoryFilter] = useState("");
//   const [subCategoryFilter, setSubCategoryFilter] = useState("");

//   const [searchQuery, setSearchQuery] = useState("");
//   const [debouncedSearch, setDebouncedSearch] = useState("");

//   const [expanded, setExpanded] = useState(!isHomePage);
//   const [loading, setLoading] = useState(true);

//   // ================= FETCH DATA =================
//   useEffect(() => {
//     fetchProducts();
//     fetchCategories();
//     fetchSubCategories();
//     dispatch(fetchCart());
//   }, [dispatch]);

//   const fetchProducts = async () => {
//     try {
//       const res = await axios.get("/api/products/getAllProducts");
//       const data = res.data.success ? res.data.data || [] : [];
//       setProducts(data);
//       setFilteredProducts(data);
//     } catch (err) {
//       console.error("Products fetch error:", err);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await axios.get("/api/category/getAllCategories");
//       setCategories(res.data.success ? res.data.data || [] : []);
//     } catch (err) {
//       console.error("Category fetch error:", err);
//     }
//   };

//   const fetchSubCategories = async () => {
//     try {
//       const res = await axios.get("/api/subcategory/getAllSubCategories");
//       setSubCategories(res.data.success ? res.data.data || [] : []);
//     } catch (err) {
//       console.error("Subcategory fetch error:", err);
//     }
//   };

//   // ================= SEARCH DEBOUNCE =================
//   useEffect(() => {
//     const handler = setTimeout(() => {
//       setDebouncedSearch(searchQuery);
//     }, 300);

//     return () => clearTimeout(handler);
//   }, [searchQuery]);

//   // ================= FILTER LOGIC =================
//   useEffect(() => {
//     let filtered = products;

//     if (categoryFilter) {
//       filtered = filtered.filter(
//         (p) =>
//           p.categoryId?._id === categoryFilter ||
//           p.categoryId === categoryFilter,
//       );
//     }

//     if (subCategoryFilter) {
//       filtered = filtered.filter(
//         (p) =>
//           p.subCategoryId?._id === subCategoryFilter ||
//           p.subCategoryId === subCategoryFilter,
//       );
//     }

//     if (debouncedSearch) {
//       filtered = filtered.filter((p) =>
//         p.productName?.toLowerCase().includes(debouncedSearch.toLowerCase()),
//       );
//     }

//     setFilteredProducts(filtered);
//   }, [categoryFilter, subCategoryFilter, debouncedSearch, products]);

//   const visibleProducts = expanded
//     ? filteredProducts
//     : filteredProducts.slice(0, 8);

//   const getCartQuantity = (productId) => {
//     const cartItem = cartItems.find(
//       (item) =>
//         item.productId?._id === productId || item.productId === productId,
//     );
//     return Number(cartItem?.quantity) || 0;
//   };
//   const handleResetFilters = () => {
//     setCategoryFilter("");
//     setSubCategoryFilter("");
//     setSearchQuery("");
//     setDebouncedSearch("");
//   };

//   return (
//     <>
//       {!isHomePage && <Navbar />}

//       <section className="py-8 md:py-12 bg-linear-to-br from-orange-50 via-white to-emerald-50 min-h-screen">
//         <div className="max-w-7xl mx-auto px-3 md:px-4">
//           {/* HEADER */}
//           <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
//             <div>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 All Products
//               </h2>
//               <p className="text-sm md:text-lg text-gray-600">
//                 Fresh groceries delivered to your doorstep.
//               </p>
//             </div>

//             {isHomePage && filteredProducts.length > 8 && (
//               <button
//                 onClick={() => navigate("/products")}
//                 className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-xl font-semibold shadow-md transition w-36 md:w-auto justify-center"
//               >
//                 {expanded ? <FiChevronUp /> : <FiChevronRight />}
//                 {expanded ? "Show Less" : "View All"}
//               </button>
//             )}
//           </div>

//           {/* SEARCH BAR (ONLY IF NOT HOMEPAGE) */}
//           {!isHomePage && (
//             <div className="mb-4 flex flex-col md:flex-row md:items-center gap-4 justify-between">
//               <input
//                 type="text"
//                 placeholder="Search products..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full md:w-96 border border-gray-300 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400 shadow-sm"
//               />

//               <div className="flex flex-col md:flex-row gap-4 mb-2 items-start md:items-center">
//                 {/* Category Dropdown */}
//                 <select
//                   value={categoryFilter}
//                   onChange={(e) => {
//                     setCategoryFilter(e.target.value);
//                     setSubCategoryFilter("");
//                   }}
//                   className="border border-gray-300 px-4 py-2 rounded-lg"
//                 >
//                   <option value="">All Categories</option>
//                   {categories.map((cat) => (
//                     <option key={cat._id} value={cat._id}>
//                       {cat.categoryName}
//                     </option>
//                   ))}
//                 </select>

//                 {/* Subcategory Dropdown */}
//                 <select
//                   value={subCategoryFilter}
//                   onChange={(e) => setSubCategoryFilter(e.target.value)}
//                   className="border border-gray-300 px-4 py-2 rounded-lg"
//                 >
//                   <option value="">All Subcategories</option>
//                   {subCategories
//                     .filter(
//                       (sub) =>
//                         !categoryFilter ||
//                         sub.categoryId === categoryFilter ||
//                         sub.categoryId?._id === categoryFilter,
//                     )
//                     .map((sub) => (
//                       <option key={sub._id} value={sub._id}>
//                         {sub.subCategoryName}
//                       </option>
//                     ))}
//                 </select>

//                 {/* Reset Button */}
//                 <button
//                   onClick={handleResetFilters}
//                   className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg transition"
//                 >
//                   Reset
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* PRODUCTS GRID */}
//           {loading ? (
//             <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//               {[...Array(8)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-64 bg-gray-200 rounded-2xl animate-pulse"
//                 ></div>
//               ))}
//             </div>
//           ) : visibleProducts.length === 0 ? (
//             <div className="text-center py-20 text-gray-500 text-lg">
//               No products found.
//             </div>
//           ) : (
//             <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-2 md:gap-6">
//               {visibleProducts.map((product) => (
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

// export default TopProducts;
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiChevronUp, FiChevronRight } from "react-icons/fi";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { fetchCart } from "../../redux/slices/cartSlice";
import Navbar from "../components/Navbar";
import Footer from "./Footer";
import ProductCard from "../components/ProductCard";

const TopProducts = ({ isHomePage = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cartItems = useSelector((state) => state.cart.cartItems || []);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);

  const [categoryFilter, setCategoryFilter] = useState("");
  const [subCategoryFilter, setSubCategoryFilter] = useState("");

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const [expanded, setExpanded] = useState(!isHomePage);
  const [loading, setLoading] = useState(true);

  // ================= FETCH DATA =================
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchSubCategories();
    dispatch(fetchCart());
  }, [dispatch]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/api/products/getAllProducts");
      const data = res.data.success ? res.data.data || [] : [];
      setProducts(data);
      setFilteredProducts(data);
    } catch (err) {
      console.error("Products fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/api/category/getAllCategories");
      setCategories(res.data.success ? res.data.data || [] : []);
    } catch (err) {
      console.error("Category fetch error:", err);
    }
  };

  const fetchSubCategories = async () => {
    try {
      const res = await axios.get("/api/subcategory/getAllSubCategories");
      setSubCategories(res.data.success ? res.data.data || [] : []);
    } catch (err) {
      console.error("Subcategory fetch error:", err);
    }
  };

  // ================= SEARCH DEBOUNCE =================
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery]);

  // ================= FILTER LOGIC =================
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
        p.productName?.toLowerCase().includes(debouncedSearch.toLowerCase()),
      );
    }

    setFilteredProducts(filtered);
  }, [categoryFilter, subCategoryFilter, debouncedSearch, products]);

  const visibleProducts = expanded
    ? filteredProducts
    : filteredProducts.slice(0, 10);

  const getCartQuantity = (productId) => {
    const cartItem = cartItems.find(
      (item) =>
        item.productId?._id === productId || item.productId === productId,
    );
    return Number(cartItem?.quantity) || 0;
  };

  const handleResetFilters = () => {
    setCategoryFilter("");
    setSubCategoryFilter("");
    setSearchQuery("");
    setDebouncedSearch("");
  };

  return (
    <>
      {!isHomePage && <Navbar />}

      <section
        className="min-h-screen py-8 md:py-12"
        style={{
          background:
            "linear-gradient(135deg, var(--background) 0%, #ffffff 40%, #e0f2fe 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl px-3 md:px-4">
          {/* HEADER */}
          <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h2
                className="text-2xl font-bold md:text-3xl"
                style={{ color: "var(--text-primary)" }}
              >
                All Products
              </h2>
              <p
                className="text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                Discover latest men&apos;s styles with easy filters and quick
                add to cart.
              </p>
            </div>

            {isHomePage && filteredProducts.length > 8 && (
              <button
                onClick={() => navigate("/products")}
                className="flex w-36 items-center justify-center gap-2 rounded-xl px-5 py-2.5 text-sm font-semibold shadow-md transition md:w-auto"
                style={{
                  background: "var(--primary)",
                  color: "var(--surface)",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.background = "var(--hover)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.background = "var(--primary)")
                }
              >
                {expanded ? <FiChevronUp /> : <FiChevronRight />}
                {expanded ? "Show Less" : "View All"}
              </button>
            )}
          </div>

          {/* SEARCH & FILTERS (ONLY IF NOT HOMEPAGE) */}
          {!isHomePage && (
            <div
              className="mb-5 flex flex-col gap-4 rounded-2xl border p-3 md:flex-row md:items-center md:justify-between"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {/* Search */}
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-xl px-4 py-2 text-sm shadow-sm focus:outline-none"
                style={{
                  border: "1px solid var(--border)",
                  color: "var(--text-primary)",
                }}
              />

              {/* Filters */}
              <div className="flex flex-col items-start gap-3 md:flex-row md:items-center">
                {/* Category Dropdown */}
                <select
                  value={categoryFilter}
                  onChange={(e) => {
                    setCategoryFilter(e.target.value);
                    setSubCategoryFilter("");
                  }}
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    background: "var(--surface)",
                  }}
                >
                  <option value="">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.categoryName}
                    </option>
                  ))}
                </select>

                {/* Subcategory Dropdown */}
                <select
                  value={subCategoryFilter}
                  onChange={(e) => setSubCategoryFilter(e.target.value)}
                  className="rounded-lg px-4 py-2 text-sm"
                  style={{
                    border: "1px solid var(--border)",
                    color: "var(--text-primary)",
                    background: "var(--surface)",
                  }}
                >
                  <option value="">All Subcategories</option>
                  {subCategories
                    .filter(
                      (sub) =>
                        !categoryFilter ||
                        sub.categoryId === categoryFilter ||
                        sub.categoryId?._id === categoryFilter,
                    )
                    .map((sub) => (
                      <option key={sub._id} value={sub._id}>
                        {sub.subCategoryName}
                      </option>
                    ))}
                </select>

                {/* Reset Button */}
                <button
                  onClick={handleResetFilters}
                  className="rounded-lg px-4 py-2 text-sm font-medium transition"
                  style={{
                    background: "var(--background)",
                    color: "var(--text-secondary)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "var(--border)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "var(--background)";
                  }}
                >
                  Reset
                </button>
              </div>
            </div>
          )}

          {/* PRODUCTS GRID */}
          {loading ? (
            <div className="grid grid-cols-2 gap-2 md:grid-cols-4 md:gap-6 lg:grid-cols-5">
              {[...Array(10)].map((_, i) => (
                <div
                  key={i}
                  className="h-64 animate-pulse rounded-2xl"
                  style={{ background: "rgba(148,163,184,0.25)" }}
                />
              ))}
            </div>
          ) : visibleProducts.length === 0 ? (
            <div
              className="py-16 text-center text-lg"
              style={{ color: "var(--text-secondary)" }}
            >
              No products found.
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-2 md:grid-cols-4 md:gap-3 lg:grid-cols-5">
              {visibleProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  quantity={getCartQuantity(product._id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {!isHomePage && <Footer />}
    </>
  );
};

export default TopProducts;
