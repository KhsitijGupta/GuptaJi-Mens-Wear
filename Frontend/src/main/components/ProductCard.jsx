// import React from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { FiStar, FiShoppingCart } from "react-icons/fi";
// import { useDispatch } from "react-redux";
// import { addToCart, decreaseCartItem } from "../../redux/slices/cartSlice";
// import Swal from "sweetalert2";

// const ProductCard = ({ product, quantity }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const imageUrl = product.productImage?.[0] || "/placeholder.png";

//   const pricing = product.pricing?.[0];
//   const originalPrice = Number(pricing?.price) || 0;

//   const unitValue = pricing?.value;
//   const unitType = pricing?.unit;

//   const finalPrice =
//     Number(product.SpecialDiscountedPrice) ||
//     Number(product.discountedPrice) ||
//     originalPrice;

//   const hasDiscount = finalPrice < originalPrice;
//   const isOutOfStock = product.stock <= 0;

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

//   const handleAddToCart = async (e, productId) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     if (!user || !token) {
//       const result = await Swal.fire({
//         title: "Login Required",
//         text: "Please login to add items to cart",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Go to Login",
//         cancelButtonText: "Cancel",
//       });

//       if (result.isConfirmed) {
//         navigate("/login");
//       }
//       return;
//     }

//     dispatch(
//       addToCart({
//         productId: productId,
//         quantity: 1,
//       }),
//     );

//     Toast.fire({
//       icon: "success",
//       title: "Product added to cart",
//     });
//   };

//   const handleDecreaseCart = async (e, productId) => {
//     e.preventDefault();

//     const token = localStorage.getItem("token");
//     const user = localStorage.getItem("user");

//     if (!user || !token) {
//       const result = await Swal.fire({
//         title: "Login Required",
//         text: "Please login to update cart",
//         icon: "warning",
//         showCancelButton: true,
//         confirmButtonText: "Go to Login",
//         cancelButtonText: "Cancel",
//       });

//       if (result.isConfirmed) {
//         navigate("/login");
//       }
//       return;
//     }

//     dispatch(decreaseCartItem(productId));

//     Toast.fire({
//       icon: "success",
//       title: "Cart updated",
//     });
//   };

//   return (
//     <Link
//       to={`/product/${product._id}`}
//       className="group bg-white rounded-xl shadow-md hover:shadow-xl transition overflow-hidden"
//     >
//       {/* Image */}
//       <div className="h-36 md:h-50 overflow-hidden">
//         <img
//           src={imageUrl}
//           alt={product.productName}
//           className="w-full h-full object-cover group-hover:scale-110 transition"
//         />
//       </div>

//       <div>
//         {/* Product Name */}
//         <h3 className="font-bold text-sm md:text-lg ml-3 mt-3 line-clamp-2 group-hover:text-orange-600 transition">
//           {product.productName}
//         </h3>

//         {/* Quantity / Unit */}
//         {unitValue && unitType && (
//           <p className="text-xs text-white ml-3 p-1 px-2 bg-orange-500 inline-block rounded-lg mt-1">
//             {unitValue} {unitType}
//           </p>
//         )}

//         {/* Rating */}
//         <div className="flex items-center ml-3 text-yellow-400 text-xs">
//           {[...Array(5)].map((_, i) => (
//             <FiStar key={i} />
//           ))}
//           <span className="text-gray-500 ml-2 text-xs">(4.5)</span>
//         </div>

//         {/* Price */}
//         <div className="flex items-end ml-3 gap-2 mb-3">
//           <span className="text-sm md:text-xl font-bold text-orange-600">
//             ₹{finalPrice.toFixed(2)}
//           </span>

//           {unitValue && unitType && (
//             <span className="text-xs text-gray-500">
//               / {unitValue}
//               {unitType}
//             </span>
//           )}

//           {hasDiscount && (
//             <span className="text-sm text-gray-400 line-through">
//               ₹{originalPrice.toFixed(2)}
//             </span>
//           )}
//         </div>

//         {/* Cart Section */}
//         {isOutOfStock ? (
//           <button
//             disabled
//             className="w-full py-2 font-semibold bg-gray-300 cursor-not-allowed"
//           >
//             Out Of Stock
//           </button>
//         ) : quantity > 0 ? (
//           <div className="flex items-center justify-between bg-orange-100 p-1">
//             <button
//               onClick={(e) => handleDecreaseCart(e, product._id)}
//               className="px-3 py-1 bg-orange-500 text-white rounded-lg"
//             >
//               -
//             </button>

//             <span className="font-bold text-orange-700">{quantity}</span>

//             <button
//               onClick={(e) => handleAddToCart(e, product._id)}
//               className="px-3 py-1 bg-orange-500 text-white rounded-lg"
//             >
//               +
//             </button>
//           </div>
//         ) : (
//           <button
//             onClick={(e) => handleAddToCart(e, product._id)}
//             className="w-full bottom-0 py-3 font-semibold text-xs md:text-md bg-linear-to-r from-orange-500 to-orange-600 text-white hover:scale-105 shadow-lg transition"
//           >
//             <FiShoppingCart className="inline mr-2" />
//             Add to Cart
//           </button>
//         )}
//       </div>
//     </Link>
//   );
// };

// export default ProductCard;
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { FiStar, FiShoppingCart } from "react-icons/fi";
import { useDispatch } from "react-redux";
import { addToCart, decreaseCartItem } from "../../redux/slices/cartSlice";
import Swal from "sweetalert2";

const ProductCard = ({ product, quantity }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const imageUrl = product.productImage?.[0] || "/placeholder.png";

  const pricing = product.pricing?.[0];
  const originalPrice = Number(pricing?.price) || 0;

  const unitValue = pricing?.value;
  const unitType = pricing?.unit;

  const finalPrice =
    Number(product.SpecialDiscountedPrice) ||
    Number(product.discountedPrice) ||
    originalPrice;

  const hasDiscount = finalPrice < originalPrice;
  const isOutOfStock = product.stock <= 0;

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

  const handleAddToCart = async (e, productId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login to add items to cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "var(--primary)",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    dispatch(
      addToCart({
        productId,
        quantity: 1,
      }),
    );

    Toast.fire({
      icon: "success",
      title: "Product added to cart",
    });
  };

  const handleDecreaseCart = async (e, productId) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");

    if (!user || !token) {
      const result = await Swal.fire({
        title: "Login Required",
        text: "Please login to update cart",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Go to Login",
        cancelButtonText: "Cancel",
        confirmButtonColor: "var(--primary)",
      });

      if (result.isConfirmed) {
        navigate("/login");
      }
      return;
    }

    dispatch(decreaseCartItem(productId));

    Toast.fire({
      icon: "success",
      title: "Cart updated",
    });
  };

  return (
    <Link
      to={`/product/${product._id}`}
      className="group relative flex h-full flex-col overflow-hidden rounded-2xl border shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
      style={{
        background: "var(--surface)",
        borderColor: "var(--border)",
      }}
    >
      {/* Image */}
      <div className="relative h-40 md:h-52 overflow-hidden">
        <img
          src={imageUrl}
          alt={product.productName}
          className="h-full w-full object-contain transition duration-500 group-hover:scale-110"
        />

        {/* Discount badge */}
        {hasDiscount && (
          <div
            className="absolute left-2 top-2 rounded-full px-2 py-1 text-xs font-semibold"
            style={{
              background: "var(--accent)",
              color: "var(--dark)",
            }}
          >
            Sale
          </div>
        )}

        {/* Out of stock badge */}
        {isOutOfStock && (
          <div
            className="absolute right-2 top-2 rounded-full px-2 py-1 text-[10px] font-semibold uppercase"
            style={{
              background: "rgba(15,23,42,0.85)",
              color: "var(--surface)",
            }}
          >
            Out of Stock
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col px-3 pb-3 pt-2">
        {/* Product Name */}
        <h3
          className="line-clamp-2 text-sm md:text-base font-semibold transition-colors group-hover:text-[var(--primary)]"
          style={{ color: "var(--text-primary)" }}
        >
          {product.productName}
        </h3>

        {/* Quantity / Unit */}
        {unitValue && unitType && (
          <p
            className="mt-1 inline-block rounded-lg px-2 py-0.5 text-[11px] font-medium"
            style={{
              background: "rgba(36,133,168,0.08)",
              color: "var(--primary-dark)",
            }}
          >
            {unitValue} {unitType}
          </p>
        )}

        {/* Rating */}
        <div className="mt-2 flex items-center text-xs">
          <span
            className="flex items-center gap-0.5"
            style={{ color: "var(--accent)" }}
          >
            {[...Array(5)].map((_, i) => (
              <FiStar key={i} />
            ))}
          </span>
          <span
            className="ml-2 text-[11px]"
            style={{ color: "var(--text-secondary)" }}
          >
            (4.5)
          </span>
        </div>

        {/* Price */}
        <div className="mt-2 mb-3 flex flex-wrap items-end gap-2">
          <span
            className="text-sm md:text-lg font-bold"
            style={{ color: "var(--primary-dark)" }}
          >
            ₹{finalPrice.toFixed(2)}
          </span>

          {unitValue && unitType && (
            <span
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              / {unitValue}
              {unitType}
            </span>
          )}

          {hasDiscount && (
            <span
              className="text-xs line-through"
              style={{ color: "var(--text-light)" }}
            >
              ₹{originalPrice.toFixed(2)}
            </span>
          )}
        </div>

        {/* Cart Section */}
        {isOutOfStock ? (
          <button
            disabled
            className="mt-auto w-full rounded-xl py-2 text-sm font-semibold"
            style={{
              background: "var(--border)",
              color: "var(--text-secondary)",
              cursor: "not-allowed",
            }}
          >
            Out Of Stock
          </button>
        ) : quantity > 0 ? (
          <div
            className="mt-auto flex items-center justify-between rounded-xl px-2 py-1.5"
            style={{
              background: "rgba(36,133,168,0.06)",
            }}
          >
            <button
              onClick={(e) => handleDecreaseCart(e, product._id)}
              className="rounded-lg px-3 py-1 text-sm font-semibold transition"
              style={{
                background: "var(--surface)",
                color: "var(--primary-dark)",
                border: "1px solid var(--border)",
              }}
            >
              -
            </button>

            <span
              className="text-sm font-bold"
              style={{ color: "var(--primary-dark)" }}
            >
              {quantity}
            </span>

            <button
              onClick={(e) => handleAddToCart(e, product._id)}
              className="rounded-lg px-3 py-1 text-sm font-semibold transition"
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
              +
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => handleAddToCart(e, product._id)}
            className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold shadow-sm transition-transform duration-200"
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
            <FiShoppingCart />
            Add to Cart
          </button>
        )}
      </div>
    </Link>
  );
};

export default ProductCard;
