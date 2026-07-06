// import { useState, useEffect } from "react";
// import { useSelector, useDispatch } from "react-redux";
// import { NavLink, useNavigate } from "react-router-dom";
// import {
//   Phone,
//   Search,
//   ShoppingCart,
//   User,
//   Home,
//   LayoutGrid,
//   X,
// } from "lucide-react";
// import logo from "../../Assests/logo.png";
// import axios from "axios";
// import { clearCartState, fetchCart } from "../../redux/slices/cartSlice";
// import { clearOrders } from "../../redux/slices/orderSlice";
// import Cart from "../pages/Cart";
// import { useLocation } from "react-router-dom";

// const Navbar = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const location = useLocation();

//   const { totalItems } = useSelector((state) => state.cart);

//   const [isLoggedIn, setIsLoggedIn] = useState(false);
//   const [searchQuery, setSearchQuery] = useState("");
//   const [cartOpen, setCartOpen] = useState(false);
//   const [user, setUser] = useState(null);

//   const token = localStorage.getItem("token");

//   /* ================= FETCH USER ================= */
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         if (!token) {
//           setIsLoggedIn(false);
//           setUser(null);
//           return;
//         }

//         setIsLoggedIn(true);
//         dispatch(fetchCart());

//         const userRes = await axios.get(`/api/users/getMe`, {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         setUser(userRes.data?.user);
//       } catch (err) {
//         setIsLoggedIn(false);
//         setUser(null);
//       }
//     };

//     fetchData();
//   }, [token, dispatch]);

//   const linkClass = ({ isActive }) =>
//     `hover:text-orange-500 ${
//       isActive ? "text-orange-500 border-b-2 pb-3 font-semibold" : "pb-3"
//     }`;

//   const handleSearch = () => {
//     if (searchQuery.trim()) {
//       navigate(`/search?query=${encodeURIComponent(searchQuery)}`);
//     }
//   };

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     setIsLoggedIn(false);
//     setUser(null);
//     dispatch(clearCartState());
//     dispatch(clearOrders());
//     navigate("/");
//   };

//   return (
//     <>
//       {/* ================= HEADER ================= */}
//       <header
//         className="w-full sticky top-0 z-50 shadow-sm"
//         style={{
//           background: "var(--surface)",
//           borderBottom: "1px solid var(--border)",
//         }}
//       >
//         {" "}
//         <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-2">
//           {/* Left Phone */}
//           <div className="hidden md:flex items-center gap-3">
//             <div
//               className="w-8 h-8 rounded-lg flex items-center justify-center"
//               style={{ backgroundColor: "var(--primary)" }}
//             >
//               {" "}
//               <Phone className="w-5 h-5 text-white" />
//             </div>
//             <div>
//               <p className="text-xs text-gray-500">Call Us</p>
//               <p className="font-semibold text-sm">+91 9174433650</p>
//             </div>
//           </div>

//           {/* Logo */}
//           <div
//             className="flex items-center gap-2 cursor-pointer"
//             onClick={() => navigate("/")}
//           >
//             <img src={logo} alt="Logo" className="h-14 w-auto" />
//             {/* <span className=" text-xl  text-orange-500 font-bold">
//               GuptaJi Mens Wear
//             </span> */}
//           </div>

//           {/* Right Section */}
//           <div className="flex items-center gap-4">
//             {/* Desktop Search */}
//             {/* <div className="relative hidden md:flex">
//               <input
//                 type="text"
//                 placeholder="Search..."
//                 className="border border-gray-300 rounded-full px-4 py-2 w-56 focus:ring-1 focus:ring-orange-500 outline-none"
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 onKeyDown={(e) => e.key === "Enter" && handleSearch()}
//               />
//               <Search
//                 className="w-5 h-5 text-gray-500 absolute right-4 top-3 cursor-pointer"
//                 onClick={handleSearch}
//               />
//             </div> */}

//             {/* Desktop Login */}
//             {!isLoggedIn && (
//               <NavLink to="/login" className="hidden md:block">
//                 <button className="bg-[var(--primary)] text-white hover:bg-[var(--hover)] px-5 py-2 rounded-lg transition-all">
//                   Login
//                 </button>
//               </NavLink>
//             )}

//             {/* Desktop Cart + Profile */}
//             {isLoggedIn && (
//               <div className="hidden md:flex items-center gap-5">
//                 {/* Cart */}
//                 <div
//                   onClick={() => setCartOpen(true)}
//                   className="relative cursor-pointer"
//                 >
//                   <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-orange-500" />
//                   {totalItems > 0 && (
//                     <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs px-1.5 py-0.5 rounded-full">
//                       {totalItems > 99 ? "99+" : totalItems}
//                     </span>
//                   )}
//                 </div>

//                 {/* Profile */}
//                 <div className="relative group">
//                   <div
//                     onClick={() => navigate("/profile")}
//                     className="flex items-center gap-2 bg-orange-100 p-1.5 border border-orange-300 rounded-lg cursor-pointer"
//                   >
//                     <img
//                       src={user?.profileImage}
//                       alt="profile"
//                       className="w-10 h-10 rounded-md object-cover border border-orange-200 cursor-pointer"
//                     />

//                     <span className="text-sm font-medium">
//                       {user?.fullName}
//                     </span>
//                   </div>
//                   <div className="absolute right-0 mt-2 w-28 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
//                     <button
//                       onClick={handleLogout}
//                       className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100 rounded-lg"
//                     >
//                       Logout
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             )}
//           </div>
//         </div>
//         {/* Desktop Menu */}
//         <nav className="hidden md:flex justify-center gap-16 font-medium text-gray-700">
//           <NavLink
//             to="/"
//             className={({ isActive }) =>
//               `mb-1 border-b-2 transition-all duration-300 ${
//                 isActive
//                   ? "text-[var(--primary)] border-[var(--primary)]"
//                   : "text-[var(--text-primary)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]"
//               }`
//             }
//           >
//             Home
//           </NavLink>
//           <NavLink
//             to="/about"
//             className={({ isActive }) =>
//               `mb-1 border-b-2 transition-all duration-300 ${
//                 isActive
//                   ? "text-[var(--primary)] border-[var(--primary)]"
//                   : "text-[var(--text-primary)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]"
//               }`
//             }
//           >
//             About Us
//           </NavLink>

//           <NavLink
//             to="/categories"
//             className={({ isActive }) =>
//               `mb-1 border-b-2 transition-all duration-300 ${
//                 isActive
//                   ? "text-[var(--primary)] border-[var(--primary)]"
//                   : "text-[var(--text-primary)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]"
//               }`
//             }
//           >
//             Categories
//           </NavLink>
//           <NavLink
//             to="/products"
//             className={({ isActive }) =>
//               `mb-1 border-b-2 transition-all duration-300 ${
//                 isActive
//                   ? "text-[var(--primary)] border-[var(--primary)]"
//                   : "text-[var(--text-primary)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]"
//               }`
//             }
//           >
//             Products
//           </NavLink>

//           <NavLink
//             to="/contact"
//             className={({ isActive }) =>
//               `mb-1 border-b-2 transition-all duration-300 ${
//                 isActive
//                   ? "text-[var(--primary)] border-[var(--primary)]"
//                   : "text-[var(--text-primary)] border-transparent hover:text-[var(--primary)] hover:border-[var(--primary)]"
//               }`
//             }
//           >
//             Contact
//           </NavLink>
//         </nav>
//       </header>

//       {/* ================= PREMIUM MOBILE BOTTOM NAV ================= */}
//       <div className="fixed bottom-2  left-1/2 -translate-x-1/2 w-[97%] md:hidden z-50">
//         <div className="relative rounded-2xl bg-white/90 backdrop-blur-lg border-t border-gray-200 shadow-[0_-8px_25px_rgba(0,0,0,0.08)] px-4 py-2">
//           <div className="flex justify-evenly  items-center">
//             {/* Home */}
//             <button
//               onClick={() => navigate("/")}
//               className="flex flex-col items-center text-[11px] transition"
//             >
//               <div
//                 className={`w-8 h-8 rounded-md flex items-center justify-center ${
//                   location.pathname === "/"
//                     ? "bg-orange-100 text-orange-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <Home size={18} />
//               </div>
//               <span
//                 className={` ${
//                   location.pathname === "/"
//                     ? "text-orange-600 font-medium"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Home
//               </span>
//             </button>

//             {/* Categories */}
//             <button
//               onClick={() => navigate("/categories")}
//               className="flex flex-col items-center text-[11px] transition"
//             >
//               <div
//                 className={`w-8 h-8 rounded-md flex items-center justify-center ${
//                   location.pathname === "/categories"
//                     ? "bg-orange-100 text-orange-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <LayoutGrid size={18} />
//               </div>
//               <span
//                 className={` ${
//                   location.pathname === "/categories"
//                     ? "text-orange-600 font-medium"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Categories
//               </span>
//             </button>

//             {/* Floating Cart */}
//             <div className="relative -mt-8">
//               <button
//                 onClick={() => setCartOpen(true)}
//                 className="relative w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl border-4 border-white hover:scale-105 transition"
//               >
//                 <ShoppingCart size={22} className="text-white" />

//                 {totalItems > 0 && (
//                   <span className="absolute -top-2 -right-1 bg-white text-orange-600 text-[10px] font-semibold px-1.5 py-0.5 rounded-full shadow">
//                     {totalItems > 99 ? "99+" : totalItems}
//                   </span>
//                 )}
//               </button>
//             </div>

//             {/* Products */}
//             <button
//               onClick={() => navigate("/products")}
//               className="flex flex-col items-center text-[11px] transition"
//             >
//               <div
//                 className={`w-8 h-8 rounded-md flex items-center justify-center ${
//                   location.pathname === "/products"
//                     ? "bg-orange-100 text-orange-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 <Search size={18} />
//               </div>
//               <span
//                 className={` ${
//                   location.pathname === "/products"
//                     ? "text-orange-600 font-medium"
//                     : "text-gray-600"
//                 }`}
//               >
//                 Products
//               </span>
//             </button>

//             {/* Profile / Login */}
//             <button
//               onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
//               className="flex flex-col items-center text-[11px] transition"
//             >
//               <div
//                 className={`w-8 h-8 rounded-md flex items-center justify-center ${
//                   location.pathname === "/profile" ||
//                   location.pathname === "/login"
//                     ? "bg-orange-100 text-orange-600"
//                     : "text-gray-600"
//                 }`}
//               >
//                 {isLoggedIn ? (
//                   <img
//                     onClick={() => navigate("/profile")}
//                     src={user?.profileImage}
//                     alt="profile"
//                     className="w-12 h-10 rounded-lg object-contain mx-auto border border-orange-200"
//                   />
//                 ) : (
//                   <User size={18} />
//                 )}
//               </div>

//               <span
//                 className={` ${
//                   location.pathname === "/profile" ||
//                   location.pathname === "/login"
//                     ? "text-orange-600 font-medium"
//                     : "text-gray-600"
//                 }`}
//               >
//                 {isLoggedIn ? "Profile" : "Login"}
//               </span>
//             </button>
//           </div>
//         </div>
//       </div>

//       {/* ================= CART DRAWER ================= */}
//       <div
//         className={`fixed inset-0 bg-black/40 z-40 transition-opacity duration-300 ${
//           cartOpen ? "opacity-100 visible" : "opacity-0 invisible"
//         }`}
//         onClick={() => setCartOpen(false)}
//       ></div>

//       <div
//         className={`fixed top-0 right-0 h-full w-110 bg-white shadow-xl z-50 transform transition-transform duration-300 ${
//           cartOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         <div className="flex justify-between items-center p-4 border-b">
//           <h2 className="text-lg font-semibold">Your Cart</h2>
//           <X className="cursor-pointer" onClick={() => setCartOpen(false)} />
//         </div>

//         <div className=" overflow-y-auto h-[calc(100%-60px)]">
//           <Cart closeCart={() => setCartOpen(false)} />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Navbar;
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import {
  Phone,
  Search,
  ShoppingCart,
  User,
  Home,
  LayoutGrid,
  X,
} from "lucide-react";
import logo from "../../Assests/logo.png";import api from '@/utils/api';
import { clearCartState, fetchCart } from "../../redux/slices/cartSlice";
import { clearOrders } from "../../redux/slices/orderSlice";
import Cart from "../pages/Cart";

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const { totalItems } = useSelector((state) => state.cart);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [user, setUser] = useState(null);

  const token = localStorage.getItem("token");

  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!token) {
          setIsLoggedIn(false);
          setUser(null);
          return;
        }

        setIsLoggedIn(true);
        dispatch(fetchCart());

        const userRes = await api.get(`/api/users/getMe`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(userRes.data?.user);
      } catch (err) {
        setIsLoggedIn(false);
        setUser(null);
      }
    };

    fetchData();
  }, [token, dispatch]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setUser(null);
    dispatch(clearCartState());
    dispatch(clearOrders());
    navigate("/");
  };

  const desktopLinks = [
    { to: "/", label: "Home" },
    { to: "/categories", label: "Categories" },
    { to: "/products", label: "Products" },
    { to: "/about", label: "About" },
    { to: "/contact", label: "Contact" },
  ];

  const mobileLinks = [
    { key: "home", label: "Home", icon: Home, path: "/" },
    {
      key: "categories",
      label: "Categories",
      icon: LayoutGrid,
      path: "/categories",
    },
    { key: "products", label: "Products", icon: Search, path: "/products" },
  ];

  const isActivePath = (path) => location.pathname === path;

  return (
    <>
      {/* ================= GLASS DESKTOP NAV ================= */}
      <header className="sticky top-0 z-50">
        {/* Main glass nav */}
        <div
          className="border-b border-transparent bg-transparent pb-1 pt-3"
          style={{ backdropFilter: "blur(10px)" }}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between px-4 md:px-6">
            {/* Left: Logo */}
            <div
              onClick={() => navigate("/")}
              className="group relative flex cursor-pointer items-center gap-2"
            >
              {/* Outer glow ring */}
              <div
                className="relative flex h-18 w-32 items-center justify-center rounded-xl transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] group-hover:-translate-y-[1px]"
                style={{
                  background:
                    "radial-gradient(circle at 30% 30%, rgba(59,130,246,0.4), rgba(15,23,42,1))",
                  border: "1px solid rgba(148,163,184,0.7)",
                }}
              >
                {/* Inner white-ish tile */}
                <div className="flex h-15 w-28 items-center justify-center rounded-lg bg-white/95 shadow-sm transition-transform duration-300 group-hover:scale-105">
                  <img
                    src={logo}
                    alt="Logo"
                    className="h-20 w-23 object-contain transition-transform duration-300 group-hover:rotate-3"
                  />
                </div>

                {/* Small corner shine */}
                <span
                  className="pointer-events-none absolute -top-1 -right-1 h-4 w-4 rounded-full opacity-70 blur-[2px] transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(circle, rgba(248,250,252,0.9), rgba(59,130,246,0))",
                  }}
                />
              </div>
            </div>

            {/* Center pill nav (desktop only) */}
            <div className="hidden md:flex">
              <nav
                className="flex items-center gap-1 rounded-xl px-3 py-2 text-xs shadow-sm"
                style={{
                  background: "rgba(15,23,42,0.9)",
                  border: "1px solid rgba(148,163,184,0.5)",
                }}
              >
                {desktopLinks.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `relative rounded-full px-4 py-2 transition-all duration-200 ${
                        isActive ? "text-[var(--surface)]" : "text-white"
                      }`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        <span className="relative z-50 font-medium">
                          {item.label}
                        </span>
                        {isActive && (
                          <span
                            className="absolute inset-0 rounded-xl "
                            style={{
                              background:
                                "linear-gradient(135deg, rgba(137, 181, 252, 1), rgba(129, 216, 253, 0.5))",
                              boxShadow: "0 0 28px rgba(128, 176, 255, 0.55)",
                            }}
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                ))}
              </nav>
            </div>

            {/* Right: Cart + Profile */}
            <div className="flex items-center gap-3 md:gap-4">
              {/* Cart icon (desktop & mobile) */}
              <button
                onClick={() => setCartOpen(true)}
                className="relative flex h-10 w-10 items-center justify-center rounded-full border transition-colors"
                style={{
                  borderColor: "var(--border)",
                  background: "var(--surface)",
                }}
              >
                <ShoppingCart
                  className="h-5 w-5"
                  style={{ color: "var(--text-primary)" }}
                />
                {totalItems > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold"
                    style={{
                      background: "var(--accent)",
                      color: "var(--dark)",
                    }}
                  >
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </button>

              {/* Profile / login (desktop) */}
              <div className="hidden items-center md:flex">
                {isLoggedIn ? (
                  <div className="relative group">
                    <button
                      onClick={() => navigate("/profile")}
                      className="flex items-center gap-2 rounded-full border px-2 py-1.5 text-xs"
                      style={{
                        borderColor: "var(--border)",
                        background: "var(--surface)",
                      }}
                    >
                      <img
                        src={user?.profileImage}
                        alt="profile"
                        className="h-8 w-8 rounded-full object-cover"
                        style={{ border: "1px solid var(--border)" }}
                      />
                      <span
                        className="pr-1 font-medium"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {user?.fullName}
                      </span>
                    </button>

                    <div
                      className="invisible absolute right-0 mt-2 w-28 rounded-lg shadow-lg opacity-0 transition-all duration-200 group-hover:visible group-hover:opacity-100"
                      style={{
                        background: "var(--surface)",
                        border: "1px solid var(--border)",
                      }}
                    >
                      <button
                        onClick={handleLogout}
                        className="w-full rounded-lg px-4 py-2 text-left text-xs transition-colors"
                        style={{ color: "var(--danger)" }}
                        onMouseEnter={(e) =>
                          (e.currentTarget.style.background =
                            "var(--background)")
                        }
                        onMouseLeave={(e) =>
                          (e.currentTarget.style.background = "transparent")
                        }
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => navigate("/login")}
                    className="hidden rounded-md px-4 py-1.5 text-xs font-medium transition-all md:inline-flex"
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
                    Login
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ================= CURVED FLOATING BOTTOM TAB (MOBILE) ================= */}
      <div className="fixed bottom-3 left-1/2 z-50 w-[93%] -translate-x-1/2 md:hidden">
        <div
          className="relative mx-auto flex items-center justify-between rounded-3xl px-4 py-2 shadow-[0_10px_30px_rgba(15,23,42,0.35)]"
          style={{
            background: "rgba(15,23,42,0.95)",
            border: "1px solid rgba(148,163,184,0.4)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Left 2 tabs */}
          {mobileLinks.map((item) => {
            const active = isActivePath(item.path);
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => navigate(item.path)}
                className="flex flex-1 flex-col items-center gap-0.5 text-[10px]"
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                    active ? "scale-105" : "opacity-80"
                  }`}
                  style={{
                    background: active
                      ? "rgba(59,130,246,0.25)"
                      : "transparent",
                    color: active ? "var(--primary-light)" : "#e5e7eb",
                  }}
                >
                  <Icon size={18} />
                </div>
                <span
                  className={`${active ? "font-medium" : ""}`}
                  style={{
                    color: active ? "var(--primary-light)" : "#d1d5db",
                  }}
                >
                  {item.label}
                </span>
              </button>
            );
          })}

          {/* Center raised cart pill */}
          <div className="pointer-events-none absolute -top-12 left-1/2 -translate-x-1/2 ">
            <button
              onClick={() => setCartOpen(true)}
              className="pointer-events-auto flex h-12 w-85 items-center justify-center gap-1.5 rounded-xl border-2 shadow-xl transition-transform"
              style={{
                background:
                  "linear-gradient(135deg, var(--primary), var(--primary-dark))",
                borderColor: "var(--surface)",
              }}
            >
              <div className="">
                {totalItems > 0 && (
                  <span className="ml-0.5 rounded-lg bg-white px-2 py-0.5 text-[12px] font-bold text-[var(--primary)]">
                    {totalItems > 99 ? "99+" : totalItems}
                  </span>
                )}
              </div>
              <div className=" flex gap-2 justify-center items-center">
                <span className="text-xs font-semibold text-white">
                  Items added to Cart
                </span>
                <ShoppingCart size={14} className="text-white" />
              </div>
            </button>
          </div>

          {/* Right: profile / login */}
          <button
            onClick={() => navigate(isLoggedIn ? "/profile" : "/login")}
            className="flex flex-1 flex-col items-center gap-0.5 text-[10px]"
          >
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-full transition-all ${
                location.pathname === "/profile" ||
                location.pathname === "/login"
                  ? "scale-105"
                  : "opacity-80"
              }`}
              style={{
                background:
                  location.pathname === "/profile" ||
                  location.pathname === "/login"
                    ? "rgba(59,130,246,0.25)"
                    : "transparent",
              }}
            >
              {isLoggedIn && user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt="profile"
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <User size={18} className="text-slate-200" />
              )}
            </div>
            <span
              className={`${
                location.pathname === "/profile" ||
                location.pathname === "/login"
                  ? "font-medium"
                  : ""
              }`}
              style={{
                color:
                  location.pathname === "/profile" ||
                  location.pathname === "/login"
                    ? "var(--primary-light)"
                    : "#d1d5db",
              }}
            >
              {isLoggedIn ? "Profile" : "Login"}
            </span>
          </button>
        </div>
      </div>

      {/* ================= CART DRAWER ================= */}
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity duration-300 ${
          cartOpen ? "visible opacity-100" : "invisible opacity-0"
        }`}
        onClick={() => setCartOpen(false)}
      />

      <div
        className={`fixed right-0 top-0 z-50 h-full w-80 transform bg-white shadow-xl transition-transform duration-300 md:w-96 ${
          cartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div
          className="flex items-center justify-between border-b p-4"
          style={{ borderColor: "var(--border)" }}
        >
          <h2
            className="text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            Your Cart
          </h2>
          <X
            className="cursor-pointer"
            style={{ color: "var(--text-secondary)" }}
            onClick={() => setCartOpen(false)}
          />
        </div>

        <div className="h-[calc(100%-60px)] overflow-y-auto">
          <Cart closeCart={() => setCartOpen(false)} />
        </div>
      </div>
    </>
  );
};

export default Navbar;
