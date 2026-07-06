import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiMapPin, FiPlus } from "react-icons/fi";
import { useSelector, useDispatch } from "react-redux";
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

import {
  createAddress,
  fetchAddresses,
  deleteAddress,
} from "../../redux/slices/addressSlice";
import { clearCartState } from "../../redux/slices/cartSlice";
import {
  createOrder,
  verifyRazorpayPayment,
} from "../../redux/slices/orderSlice";
import { Trash2 } from "lucide-react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Lottie from "lottie-react";
import successAnimation from "../../Assests/lotties/Success.json"; // path correct karo
import AddressModal from "../components/AddressModal";

const Checkout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    cartItems = [],
    totalPrice = 0,
    deliveryCharges = 0,
    coinsUsed = 0,
  } = useSelector((state) => state.cart);
  const { addresses = [] } = useSelector((state) => state.address);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState("");

  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [selectedAddress, setSelectedAddress] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    country: "India",
    pincode: "",
    landmark: "",
    city: "",
    state: "",
    addressType: "HOME",
  });

  // REF for focus effect
  const nameInputRef = useRef(null);

  // Focus the first input when modal opens
  useEffect(() => {
    if (showAddressModal && nameInputRef.current) {
      nameInputRef.current.focus();
    }
  }, [showAddressModal]);

  // Prefill name and phone when modal opens
  useEffect(() => {
    if (showAddressModal && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        phone: user.phone || "",
      }));
    }
  }, [showAddressModal, user]);

  // ✅ Fetch user profile from API using token
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const fetchUser = async () => {
      try {
        setUserLoading(true);
        const res = await axios.get("/api/users/getMe", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUser(res.data.user);
        console.log(res.data);
        // Fetch addresses after getting user ID
        if (res.data.user?._id) {
          dispatch(fetchAddresses(res.data.user._id));
        }
      } catch (err) {
        setUserError(err.response?.data?.message || "Something went wrong");
        console.error(err);
      } finally {
        setUserLoading(false);
      }
    };

    fetchUser();
  }, [dispatch]);

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await axios.post(
          "https://countriesnow.space/api/v0.1/countries/states",
          {
            country: "India",
          },
        );

        setStates(res.data.data.states);
      } catch (error) {
        console.error("State fetch error", error);
      }
    };

    fetchStates();
  }, []);

  const handleStateChange = async (e) => {
    const state = e.target.value;

    setFormData({ ...formData, state: state, city: "" });

    try {
      const res = await axios.post(
        "https://countriesnow.space/api/v0.1/countries/state/cities",
        {
          country: "India",
          state: state,
        },
      );

      // ✅ Normalize city names
      const normalizedCities = res.data.data.map((city) =>
        city.normalize("NFKD").replace(/[^\x00-\x7F]/g, ""),
      );

      setCities(normalizedCities);
    } catch (error) {
      console.error("City fetch error", error);
      setCities([]);
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // const handleAddAddress = async () => {
  //   try {
  //     const res = await dispatch(createAddress(formData)).unwrap();
  //     await dispatch(fetchAddresses(user._id));
  //     setSelectedAddress(res?.address?._id);
  //     setShowAddressModal(false);

  //     // ✅ Show Swal2 success
  //     Swal.fire({
  //       icon: "success",
  //       title: "Address Saved!",
  //       text: "Your new address has been added successfully.",
  //       showConfirmButton: false,
  //       timer: 1500,
  //     });
  //   } catch (error) {
  //     console.error(error);
  //     Swal.fire({
  //       icon: "error",
  //       title: "Error",
  //       text: "Failed to save address. Please try again.",
  //     });
  //   }
  // };

  const handleAddAddress = async () => {
    try {
      const res = await dispatch(createAddress(formData)).unwrap();
      await dispatch(fetchAddresses(user._id));
      setSelectedAddress(res?.address?._id);
      setShowAddressModal(false);

      // Reset form
      setFormData({
        name: user.fullName || "",
        phone: user.phone || "",
        country: "India",
        pincode: "",
        landmark: "",
        city: "",
        state: "",
        addressType: "HOME",
      });

      Swal.fire({
        icon: "success",
        title: "Address Saved!",
        text: "Your new address has been added successfully.",
        showConfirmButton: false,
        timer: 1500,
      });
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: "Failed to save address. Please try again.",
      });
    }
  };
  // const handlePlaceOrder = async () => {
  //   if (!selectedAddress) return alert("Select Address");

  //   try {
  //     setLoading(true);

  //     await dispatch(
  //       createOrder({
  //         shippingAddress: selectedAddress,
  //         paymentMethod: "COD",
  //       }),
  //     ).unwrap();

  //     dispatch(clearCartState());

  //     alert("✅ Order Placed Successfully");
  //     navigate("/");
  //   } catch (err) {
  //     console.error(err);
  //   } finally {
  //     setLoading(false);
  //   }
  // };
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  const handleRazorpayPayment = async (result) => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      Swal.fire({
        icon: "error",
        title: "Payment failed",
        text: "Unable to load Razorpay checkout. Please try again.",
      });
      return;
    }

    if (!result?.razorpayOrder || !result?.razorpayKey) {
      Swal.fire({
        icon: "error",
        title: "Payment failed",
        text: "Invalid Razorpay order data.",
      });
      return;
    }

    const options = {
      key: result.razorpayKey,
      amount: result.razorpayOrder.amount,
      currency: result.razorpayOrder.currency,
      name: "GuptaJi mens Wear",
      description: `Payment for order ${result.coId}`,
      order_id: result.razorpayOrder.id,
      prefill: {
        name: user?.fullName || "",
        email: user?.email || "",
        contact: user?.phone || "",
      },
      notes: {
        coId: result.coId,
      },
      theme: {
        color: "#5bbafa",
      },
      handler: async (response) => {
        try {
          const verifyResult = await dispatch(
            verifyRazorpayPayment({
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
              shippingAddress: selectedAddress,
            }),
          ).unwrap();

          dispatch(clearCartState());
          setShowSuccess(true);
          setTimeout(() => {
            setShowSuccess(false);
            navigate("/profile");
          }, 2000);
        } catch (error) {
          console.error(error);
          Swal.fire({
            icon: "error",
            title: "Payment verification failed",
            text: error || "Unable to verify payment. Please contact support.",
          });
        }
      },
      modal: {
        ondismiss: () => {
          Swal.fire({
            icon: "info",
            title: "Payment cancelled",
            text: "You can try again by placing the order again.",
          });
        },
      },
    };

    const razorpay = new window.Razorpay(options);
    razorpay.open();
  };

  const handlePlaceOrder = async () => {
    if (!selectedAddress) return alert("Select Address");

    try {
      setLoading(true);

      const result = await dispatch(
        createOrder({
          shippingAddress: selectedAddress,
          paymentMethod,
        }),
      ).unwrap();

      if (paymentMethod === "Razorpay") {
        await handleRazorpayPayment(result);
      } else {
        dispatch(clearCartState());
        setShowSuccess(true);
        setTimeout(() => {
          setShowSuccess(false);
          navigate("/profile");
        }, 2000);
      }
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Order failed",
        text: err || "Unable to place order. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <Navbar />
      {cartItems?.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-4 h-100">
          <p className="text-lg text-gray-500">Your cart is empty!</p>
          <button
            onClick={() => navigate("/")} // shop page route
            className="bg-orange-500 text-white px-6 py-3 rounded-lg hover:bg-orange-600"
          >
            Continue Shopping
          </button>
        </div>
      ) : (
        <div className="min-h-screen bg-white py-8 px-4">
          <div className="max-w-7xl mx-auto">
            {/* BACK BUTTON */}
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 mb-6 text-gray-700"
            >
              <FiArrowLeft /> Back to Cart
            </button>

            {/* CUSTOMER DETAILS */}
            <div className="bg-white p-6 rounded-xl shadow mb-6">
              <h2 className="text-xl font-bold mb-4">Customer Details</h2>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-gray-500 text-sm">Full Name</p>
                  <p className="font-semibold">{user?.fullName || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Email</p>
                  <p className="font-semibold">{user?.email || "-"}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm">Phone</p>
                  <p className="font-semibold">{user?.phone || "-"}</p>
                </div>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* LEFT SIDE */}

              <div className="lg:col-span-2">
                {/* PRODUCT CARDS */}
                <div className="bg-white p-3 rounded-xl shadow mb-6">
                  <h2 className="text-lg font-bold mb-2">Order Items</h2>
                  {cartItems?.length === 0 && (
                    <p className="text-sm text-gray-500">No items in cart</p>
                  )}

                  {/* Scrollable container: max 2 cards */}
                  <div className="max-h-[260px] overflow-y-auto">
                    {cartItems?.map((item) => {
                      const product = item?.product || item;
                      const price =
                        Number(item?.price) ||
                        Number(product?.pricing?.[0]?.price) ||
                        0;
                      const qty = Number(item?.quantity || 0);
                      const image =
                        product?.productImage?.[0] ||
                        product?.image ||
                        "/no-image.png";

                      return (
                        <div
                          key={item._id}
                          className="flex gap-2 border border-gray-400 rounded-lg p-2 mb-2 items-center"
                        >
                          <img
                            src={image}
                            alt={product?.productName}
                            className="w-10 h-10 object-cover rounded"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold text-sm truncate">
                              {product?.productName}
                            </h3>
                            <div className="flex justify-between text-xs mt-1">
                              <span>Price: ₹{price}</span>
                              <span>Qty: {qty}</span>
                              <span className="font-semibold">
                                Total: ₹{(price * qty).toFixed(2)}
                              </span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* ADDRESS SECTION */}
                <div className="bg-white p-4 rounded-xl shadow mb-6">
                  <div className="flex justify-between items-center mb-3">
                    <h2 className="text-lg font-bold">Delivery Address</h2>
                    <button
                      onClick={() => setShowAddressModal(true)}
                      className="flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg font-semibold bg-white border-orange-500 text-orange-500 hover:bg-orange-500 hover:text-white"
                    >
                      <FiPlus size={16} /> Add Address
                    </button>
                  </div>

                  {/* Scrollable container: max 4 cards height */}
                  <div className="grid md:grid-cols-2 gap-3 max-h-[260px] overflow-y-auto">
                    {addresses?.map((addr) => (
                      <div
                        key={addr._id}
                        className={`relative border border-gray-400 rounded-lg p-3 cursor-pointer transition ${
                          selectedAddress === addr._id
                            ? "border-orange-600 bg-orange-50"
                            : "hover:border-gray-400"
                        }`}
                        onClick={() => setSelectedAddress(addr._id)}
                      >
                        {/* DELETE BUTTON */}
                        <button
                          onClick={async (e) => {
                            e.stopPropagation(); // Prevent selecting address

                            const result = await Swal.fire({
                              title: "Are you sure?",
                              text: "Do you want to delete this address?",
                              icon: "warning",
                              showCancelButton: true,
                              confirmButtonColor: "#f97316", // orange
                              cancelButtonColor: "#d1d5db", // gray
                              confirmButtonText: "Yes, delete it!",
                              cancelButtonText: "Cancel",
                            });

                            if (result.isConfirmed) {
                              try {
                                await dispatch(
                                  deleteAddress(addr._id),
                                ).unwrap();
                                if (user?._id)
                                  dispatch(fetchAddresses(user._id));
                                if (selectedAddress === addr._id)
                                  setSelectedAddress(null);

                                Swal.fire({
                                  title: "Deleted!",
                                  text: "Address has been deleted.",
                                  icon: "success",
                                  timer: 1500,
                                  showConfirmButton: false,
                                });
                              } catch (err) {
                                console.error(err);
                                Swal.fire({
                                  title: "Error!",
                                  text: "Failed to delete address.",
                                  icon: "error",
                                });
                              }
                            }
                          }}
                          className="absolute top-1.5 right-1.5 text-red-500 hover:text-red-700"
                        >
                          <Trash2 size={16} />
                        </button>

                        <div className="flex gap-1.5 items-center mb-1.5">
                          <FiMapPin size={16} />
                          <span className="font-semibold text-sm">
                            {addr.addressType}
                          </span>
                        </div>
                        <p className="font-semibold text-sm">{addr.name}</p>
                        <p className="text-xs">{addr.landmark}</p>
                        <p className="text-xs">
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="text-xs">{addr.phone}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ORDER SUMMARY */}
              {/* ORDER SUMMARY */}
              <div className="bg-white p-6 rounded-xl shadow h-fit sticky top-20">
                <h2 className="text-xl font-bold mb-4">Order Summary</h2>

                {/* List each cart item */}
                <div className="flex flex-col gap-3 border-b pb-4">
                  {cartItems?.map((item) => {
                    const product = item?.product || item;
                    const price = Number(
                      item?.price || product?.pricing?.[0]?.price || 0,
                    );
                    const qty = Number(item?.quantity || 0);
                    const total = price * qty;

                    return (
                      <div
                        key={item._id}
                        className="flex justify-between items-center text-sm"
                      >
                        <div className="flex flex-col">
                          <span className="font-semibold">
                            {product?.productName}
                          </span>
                          <span className="text-gray-500 text-xs">
                            ₹{price} x {qty} pcs
                          </span>
                        </div>
                        <span className="font-semibold">
                          ₹{total.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Subtotal */}
                <div className="flex justify-between font-semibold text-sm mt-4">
                  <span>Subtotal</span>
                  <span>₹{Number(totalPrice || 0).toFixed(2)}</span>
                </div>

                {/* Delivery Charges */}
                <div className="flex justify-between font-semibold text-sm mt-1">
                  <span>Delivery Charges</span>
                  <span>₹{Number(deliveryCharges || 0).toFixed(2)}</span>
                </div>

                {/* Coins / Discount */}
                {coinsUsed > 0 && (
                  <div className="flex justify-between font-semibold text-sm mt-1 text-green-600">
                    <span>Coins Applied</span>
                    <span>- ₹{Number(coinsUsed || 0).toFixed(2)}</span>
                  </div>
                )}

                <div className="mt-5">
                  <h3 className="font-semibold mb-2">Payment Method</h3>
                  <div className="space-y-3">
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="COD"
                        checked={paymentMethod === "COD"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-orange-500"
                      />
                      Cash on Delivery
                    </label>
                    <label className="flex items-center gap-2 text-sm">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="Razorpay"
                        checked={paymentMethod === "Razorpay"}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="accent-orange-500"
                      />
                      Pay Online
                    </label>
                  </div>
                </div>

                {/* Total Payable */}
                <div className="flex justify-between font-bold text-lg mt-4 border-t pt-4">
                  <span>Payable Amount</span>
                  <span>₹{Number(totalPrice || 0).toFixed(2)}</span>
                </div>

                <button
                  disabled={!selectedAddress || loading}
                  onClick={handlePlaceOrder}
                  className="w-full bg-black text-white py-3 rounded-lg mt-6 hover:bg-gray-800 disabled:opacity-50"
                >
                  {loading ? "Placing Order..." : "Place Order"}
                </button>
                {!selectedAddress && (
                  <p className="text-red-400 ">
                    {" "}
                    please select the address first.{" "}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* ADDRESS MODAL */}
          {showAddressModal && (
            <AddressModal
              show={showAddressModal}
              setShow={setShowAddressModal}
              user={user}
              onAddressCreated={(id) => setSelectedAddress(id)}
            />
          )}
        </div>
      )}

      <AnimatePresence>
        {showSuccess && (
          <motion.div
            className="fixed inset-0 bg-white flex justify-center items-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white  p-8 flex flex-col items-center max-w-sm w-full text-center"
              initial={{ scale: 0.7, y: 80, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {/* Success Animation */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.3, type: "spring", stiffness: 150 }}
              >
                <Lottie
                  // play
                  loop={false}
                  animationData={successAnimation}
                  style={{ height: 180, width: 180 }}
                />
              </motion.div>

              {/* Title */}
              <motion.h2
                className="text-2xl font-bold text-green-600 mt-2"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                Order Completed
              </motion.h2>

              {/* Message */}
              <motion.p
                className="text-gray-600 mt-2 text-sm leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Your order has been placed successfully. Thank you for choosing
                our service. You can track your order in the Orders section.
              </motion.p>

              {/* Info Box */}
              <motion.div
                className="bg-green-50 text-green-700 text-sm px-4 py-2 rounded-lg mt-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                Estimated processing time: 5–10 minutes
              </motion.div>

              {/* Button */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => (window.location.href = "/orders")}
                className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition"
              >
                View My Orders
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
      <Footer />
    </>
  );
};

export default Checkout;
