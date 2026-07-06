// import React, { useEffect } from "react";
// import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
// import { useDispatch, useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import {
//   fetchCart,
//   addToCart,
//   decreaseCartItem,
// } from "../../redux/slices/cartSlice";

// const Cart = ({ closeCart }) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();

//   const { cartItems, totalPrice, totalItems, loading } = useSelector(
//     (state) => state.cart,
//   );

//   useEffect(() => {
//     dispatch(fetchCart());
//   }, [dispatch]);

//   /* ================= EMPTY CART ================= */
//   if (!loading && cartItems.length === 0) {
//     return (
//       <div className="flex flex-col items-center justify-center h-full text-center p-8">
//         <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mb-4">
//           🛒
//         </div>
//         <h2 className="text-lg font-semibold mb-2">Your Cart is Empty</h2>
//         <p className="text-gray-500 text-sm">
//           Looks like you haven’t added anything yet.
//         </p>
//         <button
//           onClick={() => {
//             closeCart();
//             navigate("/products");
//           }}
//           className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-full hover:bg-orange-600 transition"
//         >
//           Start Shopping
//         </button>
//       </div>
//     );
//   }

//   return (
//     <div className="flex flex-col h-full bg-gray-50">

//       {/* ================= ITEMS ================= */}
//       <div className="flex-1 overflow-y-auto p-2 space-y-3">

//         {cartItems.map((item) => {
//           const product = item.productId;
//           const image = product?.productImage?.[0] || "/placeholder.png";
//           const price = product?.pricing?.[0]?.price || 0;

//           return (
//             <div
//               key={product?._id}
//               className="bg-white rounded-2xl shadow-sm border border-gray-100 p-1 flex gap-4 hover:shadow-md transition"
//             >
//               {/* Image */}
//               <img
//                 src={image}
//                 alt={product?.productName}
//                 className="w-20 h-20 object-cover rounded-xl"
//               />

//               {/* Info */}
//               <div className="flex-1 flex flex-col justify-between">

//                 <div>
//                   <h4 className="font-semibold text-gray-800 text-sm mb-1">
//                     {product?.productName}
//                   </h4>
//                   <p className="text-orange-600 font-bold text-sm">
//                     ₹{price}
//                   </p>
//                 </div>

//                 {/* Quantity Row */}
//                 <div className="flex items-center justify-between mt-1 mr-2">

//                   {/* Quantity Controls */}
//                   <div className="flex items-center border rounded-lg overflow-hidden">

//                     <button
//                       onClick={() =>
//                         dispatch(decreaseCartItem(product?._id))
//                       }
//                       className="px-2 py-1 hover:bg-gray-100 transition"
//                     >
//                       <FiMinus size={14} />
//                     </button>

//                     <span className="px-4 text-sm font-semibold">
//                       {item.quantity}
//                     </span>

//                     <button
//                       onClick={() =>
//                         dispatch(
//                           addToCart({
//                             productId: product?._id,
//                             quantity: 1,
//                           }),
//                         )
//                       }
//                       className="px-3 py-1 hover:bg-gray-100 transition"
//                     >
//                       <FiPlus size={14} />
//                     </button>
//                   </div>

//                   {/* Remove */}
//                   <button
//                     onClick={() =>
//                       dispatch(decreaseCartItem(product?._id))
//                     }
//                     className="text-red-500 hover:text-red-600 transition"
//                   >
//                     <FiTrash2 size={16} />
//                   </button>

//                 </div>
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       {/* ================= SUMMARY ================= */}
//       <div className="border-t bg-white p-2 shadow-[0_-6px_20px_rgba(0,0,0,0.05)]">

//         <div className="space-y-2 text-sm">

//           <div className="flex justify-between text-gray-600">
//             <span>Total Items</span>
//             <span>{totalItems}</span>
//           </div>

//           <div className="flex justify-between text-lg font-semibold text-gray-900">
//             <span>Total</span>
//             <span>₹{totalPrice}</span>
//           </div>

//         </div>

//         <button
//           onClick={() => {
//             closeCart();
//             navigate("/checkout");
//           }}
//           className="mt-5 w-full bg-linear-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg transition-all duration-300"
//         >
//           Proceed to Checkout
//         </button>
//       </div>
//     </div>
//   );
// };

// export default Cart;
import React, { useEffect } from "react";
import { FiMinus, FiPlus, FiTrash2 } from "react-icons/fi";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchCart,
  addToCart,
  decreaseCartItem,
} from "../../redux/slices/cartSlice";

const Cart = ({ closeCart }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { cartItems, totalPrice, totalItems, loading } = useSelector(
    (state) => state.cart,
  );

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  // ================= EMPTY CART =================
  if (!loading && cartItems.length === 0) {
    return (
      <div
        className="flex h-full flex-col items-center justify-center p-8 text-center"
        style={{
          background: "var(--background)",
          color: "var(--text-primary)",
        }}
      >
        <div
          className="mb-4 flex h-20 w-20 items-center justify-center rounded-full"
          style={{
            background: "var(--primary-light)",
            color: "var(--surface)",
          }}
        >
          🛒
        </div>
        <h2 className="mb-2 text-lg font-semibold">Your Cart is Empty</h2>
        <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
          Looks like you haven’t added anything yet.
        </p>
        <button
          onClick={() => {
            closeCart();
            navigate("/products");
          }}
          className="mt-6 rounded-full px-6 py-2 text-sm font-semibold transition"
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
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div
      className="flex h-full flex-col"
      style={{ background: "var(--background)" }}
    >
      {/* ================= ITEMS ================= */}
      <div className="flex-1 space-y-3 overflow-y-auto p-2">
        {cartItems.map((item) => {
          const product = item.productId;
          const image = product?.productImage?.[0] || "/placeholder.png";
          const price = product?.pricing?.[0]?.price || 0;

          return (
            <div
              key={product?._id}
              className="flex gap-4 rounded-2xl border p-2 transition hover:shadow-md"
              style={{
                background: "var(--surface)",
                borderColor: "var(--border)",
              }}
            >
              {/* Image */}
              <img
                src={image}
                alt={product?.productName}
                className="h-20 w-20 rounded-xl object-cover"
              />

              {/* Info */}
              <div className="flex flex-1 flex-col justify-between">
                <div>
                  <h4
                    className="mb-1 text-sm font-semibold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {product?.productName}
                  </h4>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--primary)" }}
                  >
                    ₹{price}
                  </p>
                </div>

                {/* Quantity Row */}
                <div className="mt-1 mr-2 flex items-center justify-between">
                  {/* Quantity Controls */}
                  <div
                    className="flex items-center overflow-hidden rounded-lg border"
                    style={{ borderColor: "var(--border)" }}
                  >
                    <button
                      onClick={() => dispatch(decreaseCartItem(product?._id))}
                      className="px-2 py-1 transition"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--background)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <FiMinus size={14} />
                    </button>

                    <span
                      className="px-4 text-sm font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {item.quantity}
                    </span>

                    <button
                      onClick={() =>
                        dispatch(
                          addToCart({
                            productId: product?._id,
                            quantity: 1,
                          }),
                        )
                      }
                      className="px-3 py-1 transition"
                      style={{ color: "var(--text-secondary)" }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.background = "var(--background)")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.background = "transparent")
                      }
                    >
                      <FiPlus size={14} />
                    </button>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => dispatch(decreaseCartItem(product?._id))}
                    className="transition"
                    style={{ color: "var(--danger)" }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "#b91c1c")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--danger)")
                    }
                  >
                    <FiTrash2 size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ================= SUMMARY ================= */}
      <div
        className="border-t p-3 shadow-[0_-6px_20px_rgba(15,23,42,0.08)]"
        style={{
          background: "var(--surface)",
          borderColor: "var(--border)",
        }}
      >
        <div className="space-y-2 text-sm">
          <div
            className="flex justify-between"
            style={{ color: "var(--text-secondary)" }}
          >
            <span>Total Items</span>
            <span>{totalItems}</span>
          </div>

          <div
            className="flex justify-between text-lg font-semibold"
            style={{ color: "var(--text-primary)" }}
          >
            <span>Total</span>
            <span>₹{totalPrice}</span>
          </div>
        </div>

        <button
          onClick={() => {
            closeCart();
            navigate("/checkout");
          }}
          className="mt-4 w-full rounded-xl py-3 text-sm font-semibold shadow-md transition-all duration-300"
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
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
