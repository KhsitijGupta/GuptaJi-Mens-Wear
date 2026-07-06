import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";import api from '@/utils/api';

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Categories = ({ isHomePage = false }) => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch Categories
  const fetchCategories = async () => {
    try {
      const { data } = await api.get(
        "/api/category/getAllCategories"
      );
      setCategories(data?.data || []);
    } catch (error) {
      console.error(
        "Error fetching categories:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Loading State
  if (loading) {
    return (
      <>
        {!isHomePage && <Navbar />}
        <div className="py-20 text-center text-lg font-semibold">
          Loading Categories...
        </div>
        {!isHomePage && <Footer />}
      </>
    );
  }

  return (
    <>
      {!isHomePage && <Navbar />}

      <section className="py-20 bg-linear-to-br from-orange-50/50 via-white to-emerald-50/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center">
            <p className="text-sm bg-orange-100 py-1 text-gray-500 font-medium rounded-xl max-w-[150px] mx-auto mb-2">
              Latest Collection
            </p>

            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 tracking-tight">
              Categories
            </h2>
          </div>

          {/* CATEGORY GRID */}
          <div className="mt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/subcategory/${category._id}`}
                className="group"
              >
                <div className="bg-white rounded-xl text-center shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-500 border border-orange-100 h-full p-2">

                  {/* Image */}
                  <div className="overflow-hidden rounded-t-3xl">
                    <img
                      src={
                        category.image
                          ? category.image
                          : "/placeholder.png"
                      }
                      alt={category.categoryName}
                      className="w-full h-22 object-contain group-hover:scale-105 transition duration-500"
                    />
                  </div>

                  {/* Text */}
                  <div className="py-2 px-2">
                    <h3 className="font-semibold text-md text-gray-800">
                      {category.categoryName}
                    </h3>

                    {/* <p className="text-xs text-gray-600 mt-1">
                      Item (12)
                    </p> */}
                  </div>

                </div>
              </Link>
            ))}
          </div>

        </div>
      </section>

      {!isHomePage && <Footer />}
    </>
  );
};

export default Categories;