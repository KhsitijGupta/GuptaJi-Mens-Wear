import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight, FiStar, FiTruck, FiShield } from "react-icons/fi";
import Banner from "../components/Banner";
import TopProducts from "../components/TopProducts";
import AboutUs from "../components/AboutUs";
import Testimonials from "../components/Testimonials";
import FAQ from "../components/FAQ";
import Footer from "../components/Footer";
import WhyChooseUs from "../components/WhyChooseUs";
import CategoryPage from "../pages/CategoryPage";
import Navbar from "../components/Navbar";
import FeaturesSection from "../components/FeaturesSection";
import Contact from "../components/Contact";
// import SubCategoryPage from "../pages/SubCategoryPage";

const Home = () => {
  return (
    <div>
      <Navbar />
      <Banner />
      <FeaturesSection />
      <CategoryPage isHomePage={true} />
      {/* <SubCategoryPage /> */}
      <TopProducts isHomePage={true} />
      <AboutUs isHomePage={true} />
      {/* <WhyChooseUs /> */}
      <Testimonials />
      <Contact isHomePage={true} />
      {/* <FAQ /> */}
      <Footer />
    </div>
  );
};

export default Home;
