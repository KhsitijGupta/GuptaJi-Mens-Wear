// import { useParams, useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import axios from "axios";
// import Navbar from "../components/Navbar";
// import Footer from "../components/Footer";
// import { Swiper, SwiperSlide } from "swiper/react";
// import { useDispatch, useSelector } from "react-redux";
// import { Navigation, Pagination, Autoplay } from "swiper/modules";
// import {
//   addToCart,
//   decreaseCartItem,
//   fetchCart,
// } from "../../redux/slices/cartSlice";
// import {
//   ShoppingCart,
//   Minus,
//   Plus,
//   Trash2,
//   Tag,
//   Truck,
//   ShieldCheck,
//   CalendarDays,
//   BadgeCheck,
//   Leaf,
//   PackageCheck,
//   ArrowLeft,
// } from "lucide-react";
// import "swiper/css";
// import "swiper/css/navigation";
// import "swiper/css/pagination";
// import ImageSlider from "../components/ImageSlider";
// import Swal from "sweetalert2";

// export default function ProductDetail() {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const dispatch = useDispatch();

//   const { cartItems } = useSelector((state) => state.cart);

//   const [product, setProduct] = useState(null);
//   const [loading, setLoading] = useState(true);

//   /* ================= FETCH PRODUCT ================= */
//   useEffect(() => {
//     const fetchProduct = async () => {
//       try {
//         const res = await axios.get(`/api/products/getProductById/${id}`);
//         setProduct(res?.data?.data);
//       } catch (err) {
//         console.error(err);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchProduct();
//     dispatch(fetchCart());
//   }, [id, dispatch]);

//   /* ================= GET CART ITEM ================= */
//   const cartItem = cartItems?.find(
//     (item) => item.productId?._id === id || item.productId === id,
//   );

//   const cartQuantity = Number(cartItem?.quantity) || 0;

//   // 🔹 Toast configuration
//   const Toast = Swal.mixin({
//     toast: true,
//     position: "bottom-end",
//     showConfirmButton: false,
//     timer: 1500,
//     timerProgressBar: true,
//     background: "#1e293b",
//     color: "#ffffff",
//     iconColor: "#22c55e",
//   });

//   // 🔹 Generic login check
//   const requireLogin = async () => {
//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     if (!user || !token) {
//       const result = await Swal.fire({
//         title: "Login Required",
//         text: "Please login to continue",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Go to Login",
//         cancelButtonText: "Cancel",
//       });

//       if (result.isConfirmed) navigate("/login");
//       return false;
//     }
//     return true;
//   };

//   // 🔹 ADD TO CART
//   const handleAdd = async () => {
//     if (!(await requireLogin()) || !product?._id) return;

//     dispatch(
//       addToCart({
//         productId: product._id,
//         quantity: 1,
//       }),
//     );

//     Toast.fire({
//       icon: "success",
//       title: "Product added to cart",
//     });
//   };

//   // 🔹 DECREASE CART
//   const handleDecrease = async () => {
//     if (!(await requireLogin()) || !product?._id) return;

//     dispatch(decreaseCartItem(product._id));

//     Toast.fire({
//       icon: "info",
//       title: "Product quantity decreased",
//     });
//   };

//   // 🔹 REMOVE COMPLETELY
//   const handleRemove = async () => {
//     if (!(await requireLogin()) || !cartQuantity) return;

//     for (let i = 0; i < cartQuantity; i++) {
//       await dispatch(decreaseCartItem(product._id));
//     }

//     Toast.fire({
//       icon: "error",
//       title: "Product removed from cart",
//     });
//   };
//   if (loading) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
//         Loading...
//       </div>
//     );
//   }

//   if (!product) {
//     return (
//       <div className="min-h-screen flex items-center justify-center text-lg font-semibold">
//         Product Not Found
//       </div>
//     );
//   }

//   const {
//     productName,
//     productImage = [],
//     description,
//     pricing = [],
//     discount,
//     discountedPrice,
//     stock,
//   } = product;

//   return (
//     <>
//       <Navbar />

//       <div className="my-10 bg-linear-to-br from-gray-50 via-white to-gray-100 py-10 px-4 sm:px-6">
//         <div className="max-w-7xl mx-auto">
//           {/* Back Button */}
//           <button
//             onClick={() => navigate(-1)}
//             className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 font-medium transition"
//           >
//             <ArrowLeft size={18} />
//             Back
//           </button>

//           <div className="grid lg:grid-cols-2 gap-10">
//             {/* ================= IMAGE SECTION ================= */}
//             <ImageSlider images={productImage} productName={productName} />

//             {/* ================= RIGHT CONTENT ================= */}
//             <div className="space-y-6">
//               {/* Title */}
//               <div>
//                 <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-3">
//                   {productName}
//                 </h1>

//                 <div className="flex flex-wrap gap-3">
//                   <span className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
//                     <Tag size={16} />
//                     {product?.categoryId?.categoryName}
//                   </span>

//                   <span className="flex items-center gap-2 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
//                     <PackageCheck size={16} />
//                     {product?.subCategoryId?.subCategoryName}
//                   </span>
//                 </div>
//               </div>

//               {/* ================= BUY CARD ================= */}
//               <div className="bg-white  rounded-3xl px-6 space-y-2">
//                 {/* Price */}
//                 <div>
//                   {discount ? (
//                     <div className="flex flex-wrap items-center gap-2">
//                       <span className="text-2xl sm:text-3xl font-bold">
//                         ₹{discountedPrice}
//                       </span>

//                       <span className="line-through text-gray-400 text-lg">
//                         ₹{pricing?.[0]?.price}
//                       </span>

//                       <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-semibold">
//                         {discount}% OFF
//                       </span>
//                     </div>
//                   ) : (
//                     <span className="text-3xl sm:text-4xl font-bold text-orange-600">
//                       ₹{pricing?.[0]?.price}
//                     </span>
//                   )}
//                 </div>

//                 {/* Stock */}
//                 <div
//                   className={`text-sm font-semibold ${stock > 0 ? "text-green-600" : "text-red-600"
//                     }`}
//                 >
//                   {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
//                 </div>

//                 {/* <hr /> */}

//                 {/* ================= CART SECTION ================= */}
//                 {cartQuantity === 0 ? (
//                   <button
//                     disabled={stock === 0}
//                     onClick={handleAdd}
//                     className="w-1/3 flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 transition text-white py-3 rounded-2xl font-semibold shadow disabled:opacity-50"
//                   >
//                     <ShoppingCart size={18} />
//                     Add to Cart
//                   </button>
//                 ) : (
//                   <div className="space-y-2">
//                     {/* Quantity Controller */}
//                     <div className="w-1/4 flex items-center justify-between border rounded-md overflow-hidden">
//                       <button
//                         onClick={handleDecrease}
//                         className="flex items-center justify-center px-4 py-1 hover:bg-gray-100 text-orange-500"
//                       >
//                         <Minus size={18} />
//                       </button>

//                       <span className="px-2 py-1 font-bold text-lg">
//                         {cartQuantity}
//                       </span>

//                       <button
//                         onClick={handleAdd}
//                         disabled={cartQuantity >= stock}
//                         className="flex items-center justify-center px-4 py-1 hover:bg-gray-100 text-orange-500 disabled:opacity-50"
//                       >
//                         <Plus size={18} />
//                       </button>
//                     </div>

//                     {/* Remove Button */}
//                     <button
//                       onClick={handleRemove}
//                       className="flex items-center justify-center gap-2 text-red-600  border px-2 py-1 rounded-lg hover:bg-red-600 hover:text-white transition text-xs"
//                     >
//                       <Trash2 size={13} />
//                       Remove Item From Cart
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Description */}
//               <div>
//                 <h3 className="text-lg font-semibold ">Product Details</h3>
//                 <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
//                   {description}
//                 </p>
//               </div>

//               {/* Info Cards */}
//               <div className="grid sm:grid-cols-2 gap-2">
//                 <InfoCard
//                   icon={<Truck className="text-orange-500" />}
//                   title="Delivery"
//                   text={product.deliveryTime}
//                 />
//                 <InfoCard
//                   icon={<ShieldCheck className="text-green-600" />}
//                   title="Return Policy"
//                   text={product.returnPolicy}
//                 />
//                 <InfoCard
//                   icon={<CalendarDays className="text-blue-600" />}
//                   title="Validity"
//                   text={
//                     product.validity
//                       ? new Date(product.validity).toLocaleDateString()
//                       : "N/A"
//                   }
//                 />
//                 <InfoCard
//                   icon={<Leaf className="text-emerald-600" />}
//                   title="Quality"
//                   text={
//                     product.trustedQuality
//                       ? "Trusted Quality Assured"
//                       : "Standard Quality"
//                   }
//                 />
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       <Footer />
//     </>
//   );
// }

// /* ================= REUSABLE INFO CARD ================= */
// const InfoCard = ({ icon, title, text }) => (
//   <div className="bg-white shadow-md rounded-2xl p-4 flex gap-4 items-start">
//     {icon}
//     <div>
//       <p className="font-semibold">{title}</p>
//       <p className="text-gray-500 text-sm">{text || "N/A"}</p>
//     </div>
//   </div>
// );
import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseCartItem,
  fetchCart,
} from "../../redux/slices/cartSlice";
import {
  ShoppingCart,
  Minus,
  Plus,
  Trash2,
  Tag,
  Truck,
  ShieldCheck,
  CalendarDays,
  BadgeCheck,
  Leaf,
  PackageCheck,
  ArrowLeft,
} from "lucide-react";
import ImageSlider from "../components/ImageSlider";
import Swal from "sweetalert2";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { cartItems } = useSelector((state) => state.cart);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`/api/products/getProductById/${id}`);
        setProduct(res?.data?.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    dispatch(fetchCart());
  }, [id, dispatch]);

  /* ================= GET CART ITEM ================= */
  const cartItem = cartItems?.find(
    (item) => item.productId?._id === id || item.productId === id,
  );

  const cartQuantity = Number(cartItem?.quantity) || 0;

  // 🔹 Toast configuration (theme colors)
  const Toast = Swal.mixin({
    toast: true,
    position: "bottom-end",
    showConfirmButton: false,
    timer: 1500,
    timerProgressBar: true,
    background: "var(--secondary)",
    color: "var(--surface)",
    iconColor: "var(--success)",
  });

  // 🔹 Generic login check
  const requireLogin = async () => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login to continue",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "var(--primary)",
      });

      if (result.isConfirmed) navigate("/login");
      return false;
    }
    return true;
  };

  // 🔹 ADD TO CART
  const handleAdd = async () => {
    if (!(await requireLogin()) || !product?._id) return;

    dispatch(
      addToCart({
        productId: product._id,
        quantity: 1,
      }),
    );

    Toast.fire({
      icon: "success",
      title: "Product added to cart",
    });
  };

  // 🔹 DECREASE CART
  const handleDecrease = async () => {
    if (!(await requireLogin()) || !product?._id) return;

    dispatch(decreaseCartItem(product._id));

    Toast.fire({
      icon: "info",
      title: "Product quantity decreased",
    });
  };

  // 🔹 REMOVE COMPLETELY
  const handleRemove = async () => {
    if (!(await requireLogin()) || !cartQuantity) return;

    for (let i = 0; i < cartQuantity; i++) {
      // sequential decrease
      await dispatch(decreaseCartItem(product._id));
    }

    Toast.fire({
      icon: "error",
      title: "Product removed from cart",
    });
  };

  if (loading) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-lg font-semibold"
        style={{
          background: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        Loading...
      </div>
    );
  }

  if (!product) {
    return (
      <div
        className="flex min-h-screen items-center justify-center text-lg font-semibold"
        style={{
          background: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        Product Not Found
      </div>
    );
  }

  const {
    productName,
    productImage = [],
    description,
    pricing = [],
    discount,
    discountedPrice,
    stock,
  } = product;

  const basePrice = pricing?.[0]?.price;

  return (
    <>
      <Navbar />

      <div
        className=" px-4 py-10 sm:px-6"
        style={{
          background:
            "linear-gradient(45deg, var(--background) 0%, #ffffff 45%, #e8f4fc 100%)",
        }}
      >
        <div className="mx-auto max-w-7xl">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-6 inline-flex items-center gap-2 text-sm font-medium transition"
            style={{ color: "var(--text-secondary)" }}
          >
            <ArrowLeft size={18} />
            Back
          </button>

          <div className="grid gap-10 lg:grid-cols-2">
            {/* ================= IMAGE SECTION ================= */}
            <div
              className="rounded-3xl border p-3 shadow-sm"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              <ImageSlider images={productImage} productName={productName} />
            </div>

            {/* ================= RIGHT CONTENT ================= */}
            <div className="space-y-6">
              {/* Title + chips */}
              <div>
                <h1
                  className="mb-3 text-2xl font-bold sm:text-3xl lg:text-4xl"
                  style={{ color: "var(--text-primary)" }}
                >
                  {productName}
                </h1>

                <div className="flex flex-wrap gap-3">
                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      background: "rgba(34,197,94,0.08)",
                      color: "var(--success)",
                    }}
                  >
                    <Tag size={16} />
                    {product?.categoryId?.categoryName}
                  </span>

                  <span
                    className="inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium"
                    style={{
                      background: "rgba(36,133,168,0.08)",
                      color: "var(--primary-dark)",
                    }}
                  >
                    <PackageCheck size={16} />
                    {product?.subCategoryId?.subCategoryName}
                  </span>
                </div>
              </div>

              {/* ================= BUY CARD ================= */}
              <div
                className="space-y-3 rounded-3xl border px-6 py-4 shadow-sm"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                {/* Price */}
                <div>
                  {discount ? (
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className="text-2xl font-bold sm:text-3xl"
                        style={{ color: "var(--primary-dark)" }}
                      >
                        ₹{discountedPrice}
                      </span>

                      <span
                        className="text-lg line-through"
                        style={{ color: "var(--text-light)" }}
                      >
                        ₹{basePrice}
                      </span>

                      <span
                        className="rounded-full px-3 py-1 text-sm font-semibold"
                        style={{
                          background: "rgba(239,68,68,0.1)",
                          color: "var(--danger)",
                        }}
                      >
                        {discount}% OFF
                      </span>
                    </div>
                  ) : (
                    <span
                      className="text-3xl font-bold sm:text-4xl"
                      style={{ color: "var(--primary-dark)" }}
                    >
                      ₹{basePrice}
                    </span>
                  )}
                </div>

                {/* Stock */}
                <div
                  className="text-sm font-semibold"
                  style={{
                    color: stock > 0 ? "var(--success)" : "var(--danger)",
                  }}
                >
                  {stock > 0 ? `In Stock (${stock} available)` : "Out of Stock"}
                </div>

                {/* CART SECTION */}
                {cartQuantity === 0 ? (
                  <button
                    disabled={stock === 0}
                    onClick={handleAdd}
                    className="mt-2 flex w-full max-w-xs items-center justify-center gap-2 rounded-2xl py-3 text-sm font-semibold shadow transition disabled:opacity-60"
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
                    <ShoppingCart size={18} />
                    Add to Cart
                  </button>
                ) : (
                  <div className="space-y-3">
                    {/* Quantity Controller */}
                    <div
                      className="flex w-full max-w-xs items-center justify-between rounded-xl border"
                      style={{ borderColor: "var(--border)" }}
                    >
                      <button
                        onClick={handleDecrease}
                        className="flex h-11 w-11 items-center justify-center border-r transition"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--primary)",
                        }}
                      >
                        <Minus size={18} />
                      </button>

                      <span
                        className="text-lg font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {cartQuantity}
                      </span>

                      <button
                        onClick={handleAdd}
                        disabled={cartQuantity >= stock}
                        className="flex h-11 w-11 items-center justify-center border-l transition disabled:opacity-50"
                        style={{
                          borderColor: "var(--border)",
                          color: "var(--primary)",
                        }}
                      >
                        <Plus size={18} />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={handleRemove}
                      className="inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition"
                      style={{
                        borderColor: "var(--danger)",
                        color: "var(--danger)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = "var(--danger)";
                        e.currentTarget.style.color = "var(--surface)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                        e.currentTarget.style.color = "var(--danger)";
                      }}
                    >
                      <Trash2 size={13} />
                      Remove Item From Cart
                    </button>
                  </div>
                )}
              </div>

              {/* Description */}
              <div
                className="space-y-2 rounded-3xl border px-5 py-4"
                style={{
                  background: "var(--surface)",
                  borderColor: "var(--border)",
                }}
              >
                <h3
                  className="text-lg font-semibold"
                  style={{ color: "var(--text-primary)" }}
                >
                  Product Details
                </h3>
                <p
                  className="text-sm leading-relaxed sm:text-base"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {description}
                </p>
              </div>

              {/* Info Cards */}
              <div className="grid gap-3 sm:grid-cols-2">
                <InfoCard
                  icon={
                    <Truck
                      className="h-5 w-5"
                      style={{ color: "var(--primary)" }}
                    />
                  }
                  title="Delivery"
                  text={product.deliveryTime}
                />
                <InfoCard
                  icon={
                    <ShieldCheck
                      className="h-5 w-5"
                      style={{ color: "var(--success)" }}
                    />
                  }
                  title="Return Policy"
                  text={product.returnPolicy}
                />
                <InfoCard
                  icon={
                    <CalendarDays
                      className="h-5 w-5"
                      style={{ color: "var(--info)" }}
                    />
                  }
                  title="Validity"
                  text={
                    product.validity
                      ? new Date(product.validity).toLocaleDateString()
                      : "N/A"
                  }
                />
                <InfoCard
                  icon={
                    <Leaf
                      className="h-5 w-5"
                      style={{ color: "var(--accent)" }}
                    />
                  }
                  title="Quality"
                  text={
                    product.trustedQuality
                      ? "Trusted Quality Assured"
                      : "Standard Quality"
                  }
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}

/* ================= REUSABLE INFO CARD ================= */
const InfoCard = ({ icon, title, text }) => (
  <div
    className="flex items-start gap-3 rounded-2xl border p-4 shadow-sm"
    style={{
      background: "var(--surface)",
      borderColor: "var(--border)",
    }}
  >
    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[rgba(36,133,168,0.08)]">
      {icon}
    </div>
    <div>
      <p
        className="text-sm font-semibold"
        style={{ color: "var(--text-primary)" }}
      >
        {title}
      </p>
      <p
        className="text-xs sm:text-sm"
        style={{ color: "var(--text-secondary)" }}
      >
        {text || "N/A"}
      </p>
    </div>
  </div>
);
