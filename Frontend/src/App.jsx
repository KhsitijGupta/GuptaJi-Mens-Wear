// import React from "react";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import "./App.css";
// // import GroceryLanding from "./main/component/GroceryLanding";
// import AdminLoginForm from "./admin/component/AdminLoginForm";
// import { AdminSidebar } from "./admin/component/AdminSidebar";
// // import HeroCarousel from "./main/component/HeroCrousel";
// // import TermsAndConditions from "./main/component/Terms&codition";
// // import PrivacyPolicy from "./main/component/PrivacyPolicy";
// // import ScrollToTop from "./main/component/ScrolltoTop";

// import { CartProvider } from "./context/CartContext";
// import Navbar from "./components/Navbar";
// import Home from "./pages/Home";
// import CategoryPage from "./pages/CategoryPage";
// import ProductDetail from "./pages/ProductDetail";
// import CartPage from "./pages/CartPage";
// import CheckoutPage from "./pages/CheckoutPage";
// import About from "./pages/About";

// function App() {
//   return (
//     <Router>
//       <ScrollToTop/>
//       <Routes>
//         {/* <Route path="/" element={<GroceryLanding />} /> */}
//         <Route path="/mmart/panel/login" element={<AdminLoginForm />} />
//         <Route path="/mmart/panel/dashboard" element={<AdminSidebar />} />
//         {/* <Route path="/home" element={<HeroCarousel />} /> */}
//         {/* <Route path="/terms&condition" element={<TermsAndConditions />} /> */}
//         {/* <Route path="/privacypolicy" element={<PrivacyPolicy />} /> */}

//         {/* <Route path="/about" element={<AboutUs />} />
//         <Route path="/why-choose-us" element={<WhyChooseUs />} />
//         <Route path="/how-it-works" element={<HowItWorks />} />
//         <Route path="/blogs" element={<BlogsSection />} />
//         <Route path="/contact" element={<ContactUs />} /> */}

//          <Route path="/" element={<Home />} />
//           <Route path="/category/:category" element={<CategoryPage />} />
//           <Route path="/product/:id" element={<ProductDetail />} />
//           <Route path="/cart" element={<CartPage />} />
//           <Route path="/checkout" element={<CheckoutPage />} />
//           <Route path="/about" element={<About />} />
//       </Routes>
//     </Router>
//   );
// }

// export default App;
import React, { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { useDispatch } from "react-redux";
import { CartProvider } from "./context/CartContext";
import Home from "./main/pages/Home";
import TopProducts from "./main/components/TopProducts";
import ProductDetail from "./main/pages/ProductDetail";
import Cart from "./main/pages/Cart";
import Checkout from "./main/pages/CheckoutPage";
import AboutUs from "./main/components/AboutUs";
import WhyChooseUs from "./main/components/WhyChooseUs";
import Contact from "./main/components/Contact";
import SubCategoryPage from "./main/pages/SubCategoryPage";
import { AdminSidebar } from "./admin/component/AdminSidebar";
import AdminLoginForm from "./admin/component/AdminLoginForm";
import Login from "./main/components/Login";
import UserProfilePage from "./main/pages/UserProfilePage";
import Categories from "./main/components/Categories";
import ScrollToTop from "./main/components/ScrolltoTop";
import { fetchCart } from "./redux/slices/cartSlice";
import { getUserOrders } from "./redux/slices/orderSlice";
import { fetchAddresses } from "./redux/slices/addressSlice";
import Loader from "./main/components/Loader";
import "./css/color.css";

function App() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const startTime = Date.now();
    const user = JSON.parse(sessionStorage.getItem("user"));

    const fetchData = async () => {
      if (user?._id) {
        await Promise.all([
          dispatch(fetchCart()),
          dispatch(getUserOrders()),
          dispatch(fetchAddresses(user._id)),
        ]);
      }
      const elapsed = Date.now() - startTime;
      const remaining = 1500 - elapsed;
      if (remaining > 0) {
        setTimeout(() => setLoading(false), remaining);
      } else {
        setLoading(false);
      }
    };

    fetchData();
  }, [dispatch]);

  if (loading) return <Loader size={450} />;

  return (
    <CartProvider>
      <Router>
        <ScrollToTop />
        <div className="min-h-screen bg-primary">
          <Routes>
            <Route path="/zk/panel/login" element={<AdminLoginForm />} />
            <Route path="/zk/panel/dashboard" element={<AdminSidebar />} />
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<TopProducts />} />
            <Route path="/categories" element={<Categories />} />
            <Route
              path="/subcategory/:categoryId"
              element={<SubCategoryPage />}
            />
            <Route
              path="/products/:subcategory"
              element={<SubCategoryPage />}
            />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/profile" element={<UserProfilePage />} />
            <Route path="/about" element={<AboutUs />} />
            <Route path="/choose-us" element={<WhyChooseUs />} />
            <Route
              path="/cart"
              element={
                localStorage.getItem("user") ? (
                  <Cart />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route path="/login" element={<Login />} />
          </Routes>
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
