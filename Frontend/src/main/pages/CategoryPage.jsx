// import React, { useEffect, useState, useRef } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiChevronRight, FiChevronLeft } from "react-icons/fi";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import axios from "axios";

// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";

// const CategoryPage = ({ isHomePage = false }) => {
//   const navigate = useNavigate();
//   const [categories, setCategories] = useState([]);
//   const [loading, setLoading] = useState(true);

//   const prevRef = useRef(null);
//   const nextRef = useRef(null);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const { data } = await axios.get("/api/category/getAllCategories");
//         setCategories(data?.data || []);
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchCategories();
//   }, []);

//   return (
//     <>
//       {!isHomePage && <Navbar />}

//       <section className="py-14 bg-linear-to-br from-orange-50 via-white to-emerald-50 relative overflow-hidden">
//         <div className=" max-w-7xl mx-auto px-6">

//           {/* HEADER */}
//           <div className="justify-between flex  mb-4">
//             <div className="text-start mb-14">
//               <span className="inline-block bg-orange-100 text-orange-600 text-sm font-semibold px-4 py-1 rounded-full mb-2">
//                 Explore Categories
//               </span>
//               <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
//                 Shop by Category
//               </h2>
//             </div>

//             <button
//               onClick={() => navigate("/categories")}
//               className="bg-orange-500 hover:bg-orange-600 text-white shadow-lg h-10 text-center flex items-center justify-center  rounded-2xl px-4">View</button>

//           </div>

//           {/* LOADING SKELETON */}
//           {loading ? (
//             <div className="grid grid-cols-2 md:grid-cols-6 gap-2">
//               {[...Array(6)].map((_, i) => (
//                 <div
//                   key={i}
//                   className="h-48 bg-gray-200 animate-pulse rounded-3xl"
//                 ></div>
//               ))}
//             </div>
//           ) : (
//             <div className="relative">
//               <Swiper
//                 modules={[Pagination, Autoplay]}
//                 slidesPerView={3} // Mobile default = 3
//                 spaceBetween={16} // SAME GAP EVERYWHERE
//                 loop
//                 autoplay={{ delay: 3500 }}
//                 pagination={{ clickable: true }}
//                 breakpoints={{
//                   640: { slidesPerView: 3 },   // Small devices
//                   768: { slidesPerView: 4 },   // Tablets
//                   1024: { slidesPerView: 5 },  // Laptop
//                   1280: { slidesPerView: 6 },  // Desktop
//                 }}
//               >
//                 {categories.map((category) => (
//                   <SwiperSlide key={category._id} className="mb-10">
//                     <Link
//                       to={`/subcategory/${category._id}`}
//                       className="group block"
//                     >
//                       <div className="relative rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition duration-500">

//                         {/* IMAGE */}
//                         <img
//                           src={category.image || "/placeholder.png"}
//                           alt={category.categoryName}
//                           className="w-full h-28 sm:h-36 md:h-44 object-cover transform group-hover:scale-105 transition duration-500"
//                         />

//                         {/* OVERLAY */}
//                         <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-transparent"></div>

//                         {/* CATEGORY NAME */}
//                         <div className="absolute bottom-3 left-3 text-white">
//                           <h3 className="text-xs sm:text-sm md:text-base font-semibold">
//                             {category.categoryName}
//                           </h3>
//                         </div>
//                       </div>
//                     </Link>
//                   </SwiperSlide>
//                 ))}
//               </Swiper>

//               {/* ARROWS */}
//               {/* <button
//                 ref={prevRef}
//                 className="absolute -left-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition hidden md:flex"
//               >
//                 <FiChevronLeft size={22} />
//               </button>

//               <button
//                 ref={nextRef}
//                 className="absolute -right-5 top-1/2 -translate-y-1/2 w-11 h-11 bg-white rounded-full shadow-lg flex items-center justify-center text-orange-600 hover:bg-orange-500 hover:text-white transition hidden md:flex"
//               >
//                 <FiChevronRight size={22} />
//               </button> */}
//             </div>
//           )}
//         </div>
//       </section>

//       {!isHomePage && <Footer />}
//     </>
//   );
// };

// export default CategoryPage;
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";import api from '@/utils/api';
import { motion } from "framer-motion";

import "swiper/css";
import "swiper/css/pagination";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const CategoryPage = ({ isHomePage = false }) => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/api/category/getAllCategories");
        setCategories(data?.data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <>
      {!isHomePage && <Navbar />}

      <section
        className="relative overflow-hidden py-14 md:py-16"
        style={{
          background:
            "linear-gradient(135deg, var(--page-bg) 0%, #ffffff 48%, #ecfdf5 100%)",
        }}
      >
        <div className="absolute inset-0 pointer-events-none opacity-50">
          <div
            className="absolute -top-24 -left-20 h-72 w-72 rounded-full blur-3xl"
            style={{ background: "rgba(249,115,22,0.14)" }}
          />
          <div
            className="absolute top-32 right-0 h-80 w-80 rounded-full blur-3xl"
            style={{ background: "rgba(16,185,129,0.10)" }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 md:px-6">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <span
                className="inline-flex items-center rounded-full px-4 py-1 text-xs font-semibold tracking-[0.18em] uppercase"
                style={{
                  background: "var(--surface)",
                  color: "var(--primary)",
                  border: "1px solid var(--border)",
                  backdropFilter: "blur(14px)",
                  boxShadow: "var(--shadow-soft)",
                }}
              >
                Explore Categories
              </span>
              <h2
                className="mt-3 text-2xl md:text-4xl font-bold"
                style={{ color: "var(--text-primary)" }}
              >
                Shop by Category
              </h2>
              <p
                className="mt-2 max-w-xl text-sm md:text-base"
                style={{ color: "var(--text-secondary)" }}
              >
                Discover your style with curated collections designed for easy
                browsing.
              </p>
            </div>

            <motion.button
              whileHover={{ y: -2, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate("/categories")}
              className="inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-semibold text-white shadow-lg"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-2))",
              }}
            >
              View All
              <FiArrowRight />
            </motion.button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 md:gap-5">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="h-44 md:h-52 rounded-3xl animate-pulse"
                  style={{ background: "rgba(255,255,255,0.7)" }}
                />
              ))}
            </div>
          ) : (
            <Swiper
              modules={[Pagination, Autoplay]}
              slidesPerView={2.2}
              spaceBetween={14}
              loop
              autoplay={{ delay: 3200, disableOnInteraction: false }}
              pagination={{ clickable: true }}
              breakpoints={{
                640: { slidesPerView: 3 },
                768: { slidesPerView: 4 },
                1024: { slidesPerView: 5 },
                1280: { slidesPerView: 6 },
              }}
              className="pb-10"
            >
              {categories.map((category) => (
                <SwiperSlide key={category._id}>
                  <motion.div
                    whileHover={{ y: -8, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="group"
                  >
                    <Link to={`/subcategory/${category._id}`} className="block">
                      <div
                        className="relative overflow-hidden rounded-3xl border"
                        style={{
                          background: "var(--surface)",
                          borderColor: "var(--border)",
                          boxShadow: "var(--shadow-soft)",
                          backdropFilter: "blur(16px)",
                        }}
                      >
                        <div className="relative aspect-[3/4] overflow-hidden">
                          <img
                            src={category.image || "/placeholder.png"}
                            alt={category.categoryName}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
                        </div>

                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <div
                            className="rounded-2xl px-3 py-2 backdrop-blur-md"
                            style={{
                              background: "rgba(255,255,255,0.12)",
                              border: "1px solid rgba(255,255,255,0.18)",
                            }}
                          >
                            <h3 className="text-sm md:text-base font-semibold text-white">
                              {category.categoryName}
                            </h3>
                            <p className="mt-1 text-[11px] text-white/80">
                              Tap to explore
                            </p>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </div>
      </section>

      {!isHomePage && <Footer />}
    </>
  );
};

export default CategoryPage;
