import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserOrders,
  cancelOrder,
  clearOrders,
} from "../../redux/slices/orderSlice";
import {
  createAddress,
  fetchAddresses,
  deleteAddress,
} from "../../redux/slices/addressSlice";
import { Trash2 } from "lucide-react";import api from '@/utils/api';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import FallbackImage from "../../Assests/fallBackUser.png";
import { useNavigate } from "react-router-dom";
import { clearCartState } from "../../redux/slices/cartSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";

import Swal from "sweetalert2";
import "swiper/css";
import "swiper/css/navigation";
import AddressModal from "../components/AddressModal";
const UserProfilePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { orders, loading, error } = useSelector((state) => state.order);
  const addresses = useSelector((state) => state.address.addresses);
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(false);
  const [userError, setUserError] = useState(null);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  const [showEdit, setShowEdit] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: "",
    profileImage: null,
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    city: "",
    state: "",
    pincode: "",
    addressType: "HOME",
    landmark: "",
  });
  useEffect(() => {
    if (user && showEdit) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: null,
      });

      setPreviewImage(user.profileImage || FallbackImage);
    }
  }, [showEdit, user]);
  // REF for focus effect
  const nameInputRef = useRef(null);

  const token = localStorage.getItem("token");
  useEffect(() => {
    const fetchData = async () => {
      try {
        setUserLoading(true);

        // ✅ Fetch User Profile
        const userRes = await api.get(`/api/users/getMe`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log(userRes.data?.user);
        setUser(userRes.data?.user);
      } catch (err) {
        setUserError(err.response?.data?.message || "Something went wrong");
      } finally {
        setUserLoading(false);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    dispatch(getUserOrders());
  }, []);
  console.log("orders", orders);

  useEffect(() => {
    if (user && showEdit) {
      setEditForm({
        fullName: user.fullName || "",
        email: user.email || "",
        phone: user.phone || "",
        profileImage: null,
      });
    }
  }, [showEdit, user]);

  // Address
  useEffect(() => {
    if (showAddressModal && user) {
      setFormData((prev) => ({
        ...prev,
        name: user.fullName || "",
        phone: user.phone || "",
      }));
    }
  }, [showAddressModal, user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const res = await api.post(
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
      const res = await api.post(
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

  const handleAddAddress = async () => {
    try {
      // Validation add karo
      if (
        !formData.name ||
        !formData.phone ||
        !formData.city ||
        !formData.state ||
        !formData.pincode
      ) {
        Swal.fire({
          icon: "warning",
          title: "Missing Fields",
          text: "Please fill all required fields.",
        });
        return;
      }

      const res = await dispatch(createAddress(formData)).unwrap();

      // Redux addresses refresh (same as checkout)
      await dispatch(fetchAddresses(user._id || user.id));

      // User profile refresh (user.address populated hai to)
      const token = localStorage.getItem("token");
      const userRes = await api.get("/api/users/getMe", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser(userRes.data.user);

      setShowAddressModal(false);

      // Reset form (same as checkout)
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
      console.error("Address Error:", error);
      Swal.fire({
        icon: "error",
        title: "Error",
        text: error || "Failed to save address. Please try again.",
      });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); // token remove
    localStorage.removeItem("user"); // token remove

    dispatch(clearCartState());
    dispatch(clearOrders());
    navigate("/"); // login page pe redirect
  };

  const getStatusColor = (status) => {
    if (status === "Delivered") return "bg-green-100 text-green-600";
    if (status === "Pending") return "bg-yellow-100 text-yellow-600";
    if (status === "Cancelled") return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };
  const [expandedOrder, setExpandedOrder] = useState(null);

  const toggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const handleCancel = async (orderId) => {
    try {
      // Dispatch cancelOrder and wait for it to complete
      await dispatch(cancelOrder(orderId)).unwrap();

      // Show SweetAlert2 success popup
      Swal.fire({
        icon: "success",
        title: "Order Cancelled",
        text: `Your order has been cancelled successfully!`,
        showConfirmButton: false,
        timer: 1800,
      });
    } catch (error) {
      // Show SweetAlert2 error popup
      Swal.fire({
        icon: "error",
        title: "Cancel Failed",
        text: error || "Failed to cancel order. Please try again.",
      });
    }
  };
  return (
    <>
      <Navbar />

      <div className="max-w-7xl mx-auto p-2 md:p-6 mb-15 md:mb-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* ================= LEFT SIDE - PROFILE ================= */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Card */}
            <div className="bg-white shadow-xl rounded-lg p-4 md:p-6 text-center">
              <img
                src={user?.profileImage || FallbackImage}
                alt="profile"
                className="w-28 h-28 rounded-lg object-cover mx-auto border-4 border-gray-200"
              />

              <h2 className="mt-4 text-xl font-bold">{user?.fullName}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
              <p className="text-gray-500 text-sm">{user?.phone}</p>

              <div className="mt-5 flex justify-center gap-2">
                <button
                  onClick={() => setShowEdit(true)}
                  className="py-2 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 bg-red-500 hover:bg-red-600 text-white rounded-lg transition"
                >
                  Logout
                </button>
              </div>
            </div>

            {/* Address Section */}
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-bold">Saved Addresses</h3>

              <button
                onClick={() => setShowAddressModal(true)}
                className="bg-orange-500 text-white px-3 py-2 rounded-lg text-sm font-semibold  hover:bg-orange-600"
              >
                + Add Address
              </button>
            </div>

            <div className="space-y-4 max-h-80 overflow-y-auto">
              {user?.address?.length > 0 ? (
                user.address.map((addr) => (
                  <div
                    key={addr._id}
                    className="relative border border-gray-200 rounded-lg p-4 text-sm bg-gray-50"
                  >
                    {/* DELETE BUTTON */}
                    <button
                      onClick={async (e) => {
                        e.stopPropagation();

                        const result = await Swal.fire({
                          title: "Are you sure?",
                          text: "Do you want to delete this address?",
                          icon: "warning",
                          showCancelButton: true,
                          confirmButtonColor: "#f97316",
                          cancelButtonColor: "#d1d5db",
                          confirmButtonText: "Yes, delete it!",
                          cancelButtonText: "Cancel",
                        });

                        if (result.isConfirmed) {
                          try {
                            // Delete address from backend
                            await dispatch(deleteAddress(addr._id)).unwrap();

                            // Update local state to remove the deleted address
                            setUser((prev) => ({
                              ...prev,
                              address: prev.address.filter(
                                (a) => a._id !== addr._id,
                              ),
                            }));

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
                    {/* ADDRESS INFO */}
                    <p className="font-semibold">{addr.name}</p>
                    <p>{addr.landmark}</p>
                    <p>
                      {addr.city}, {addr.state}
                    </p>
                    <p>
                      {addr.country} - {addr.pincode}
                    </p>
                    <p className="text-gray-500">📞 {addr.phone}</p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No addresses found</p>
              )}
            </div>
          </div>

          {/* ================= RIGHT SIDE - ORDERS ================= */}
          <div className="lg:col-span-2">
            <div className="bg-white shadow-xl rounded-2xl p-4 md:p-6">
              <h3 className="text-2xl font-bold mb-6">My Orders</h3>

              {loading && (
                <p className="text-center text-gray-500">Loading orders...</p>
              )}

              {error && <p className="text-center text-red-500">{error}</p>}

              {!loading && orders?.length === 0 && (
                <p className="text-gray-500 text-center">No orders found.</p>
              )}

              <div className="space-y-6 max-h-[660px] overflow-y-auto">
                {orders?.map((order) => (
                  <div
                    key={order._id}
                    className="border border-gray-200 rounded-2xl p-6 bg-gray-50 hover:shadow-lg transition"
                  >
                    {/* ================= COLLAPSED HEADER ================= */}
                    <div
                      className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 cursor-pointer"
                      onClick={() => toggleExpand(order._id)}
                    >
                      {/* ========= LEFT: PRODUCT IMAGE SLIDER ========= */}
                      {expandedOrder !== order._id && (
                        <div className="w-full md:w-1/5">
                          <Swiper
                            modules={[Navigation, Autoplay]}
                            spaceBetween={10}
                            slidesPerView={1}
                            autoplay={{
                              delay: 1000,
                              disableOnInteraction: false,
                            }}
                            loop={true}
                            className="w-full"
                          >
                            {order.items.map((item) => (
                              <SwiperSlide key={item._id}>
                                <img
                                  src={
                                    item.productId?.productImage?.[0]
                                      ? item.productId.productImage[0]
                                      : "/default-product.png"
                                  }
                                  alt="product"
                                  className="h-20 w-full object-cover rounded-lg"
                                />
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      )}

                      {/* ========= CENTER: ORDER INFO ========= */}
                      <div className="flex-1">
                        <p className="text-sm text-gray-500">
                          Order ID: {order.coId}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </p>

                        {order.items.map((item) => (
                          <p
                            key={item._id}
                            className="text-sm font-medium text-gray-700"
                          >
                            {item.productId?.productName}
                          </p>
                        ))}
                      </div>

                      {/* ========= RIGHT: TOTAL PRICE ========= */}
                      <div className="text-right">
                        <span
                          className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${getStatusColor(
                            order.orderStatus,
                          )}`}
                        >
                          {order.orderStatus}
                        </span>
                        <p className="text-lg font-bold text-gray-800">
                          ₹{order.payableAmount}
                        </p>
                        <span className="text-xs text-gray-500">
                          {expandedOrder === order._id ? "▲" : "▼"}
                        </span>
                      </div>
                    </div>
                    {/* ================= EXPANDED FULL DESIGN ================= */}
                    {expandedOrder === order._id && (
                      <>
                        {/* ================= TOP HEADER ================= */}
                        <div className="flex flex-col md:flex-row md:justify-between md:items-center border-b pb-4 mb-4 mt-4">
                          <div>
                            <p className="text-sm text-gray-500">
                              {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                          </div>

                          <div className="mt-3 md:mt-0 text-right">
                            <span
                              className={`inline-block mt-1 text-xs px-3 py-1 rounded-full ${getStatusColor(
                                order.orderStatus,
                              )}`}
                            >
                              {order.orderStatus}
                            </span>
                          </div>
                        </div>

                        {/* ================= ORDER ITEMS ================= */}
                        <div className="space-y-4">
                          {order.items.map((item) => (
                            <div
                              key={item._id}
                              className="flex items-center gap-4 bg-white p-3 rounded-xl shadow-sm"
                            >
                              <img
                                src={
                                  item.productId?.productImage?.[0]
                                    ? `${item.productId.productImage[0]}`
                                    : "/default-product.png"
                                }
                                alt="product"
                                className="w-16 h-16 object-cover rounded-lg"
                              />

                              <div className="flex-1">
                                <p className="font-semibold">
                                  {item.productId?.productName}
                                </p>
                                <p className="text-sm text-gray-500">
                                  Qty: {item.quantity}
                                </p>
                              </div>

                              <div className="font-semibold text-gray-700">
                                ₹{item.price}
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* ================= ADDRESS & PAYMENT ================= */}
                        <div className="mt-5 pt-4 border-t grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                          <div>
                            <p className="font-semibold mb-2">
                              Shipping Address
                            </p>
                            <p>{order.shippingAddress?.name}</p>
                            <p>{order.shippingAddress?.landmark}</p>
                            <p>
                              {order.shippingAddress?.city},{" "}
                              {order.shippingAddress?.state}
                            </p>
                            <p>
                              {order.shippingAddress?.country} -{" "}
                              {order.shippingAddress?.pincode}
                            </p>
                            <p className="text-gray-500">
                              📞 {order.shippingAddress?.phone}
                            </p>
                          </div>

                          <div>
                            <p className="font-semibold mb-2">
                              Payment Details
                            </p>
                            <p>Method: {order.paymentMethod}</p>
                            <p>Status: {order.paymentStatus}</p>
                            <p>Discount: ₹{order.discount}</p>
                            <p>Delivery Charges: ₹{order.deliveryCharges}</p>
                            <p className="font-semibold">
                              Total: ₹{order.payableAmount}
                            </p>
                          </div>
                        </div>

                        {/* ================= ACTIONS ================= */}

                        {order.orderStatus === "Pending" && (
                          <div className="mt-5 text-right">
                            <button
                              onClick={() => handleCancel(order._id)}
                              className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm"
                            >
                              Cancel Order
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {showEdit && (
        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-md relative">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            <form
              onSubmit={async (e) => {
                e.preventDefault();
                try {
                  const formData = new FormData();
                  formData.append("fullName", editForm.fullName);
                  formData.append("email", editForm.email);
                  formData.append("phone", editForm.phone);
                  if (editForm.profileImage) {
                    formData.append("profileImage", editForm.profileImage);
                  }

                  await api.put(`/api/users/editUser/${user._id}`, formData, {
                    headers: {
                      Authorization: `Bearer ${token}`,
                      "Content-Type": "multipart/form-data",
                    },
                  });

                  // Refresh user data
                  const userRes = await api.get(`/api/users/getMe`, {
                    headers: { Authorization: `Bearer ${token}` },
                  });
                  setUser(userRes.data?.user);
                  setShowEdit(false);
                } catch (err) {
                  alert(
                    err.response?.data?.message || "Error updating profile",
                  );
                }
              }}
              className="space-y-4"
            >
              <div>
                <label className="block text-sm font-semibold">Full Name</label>
                <input
                  type="text"
                  value={editForm.fullName}
                  onChange={(e) =>
                    setEditForm({ ...editForm, fullName: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Full Name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Email</label>
                <input
                  type="email"
                  value={editForm.email}
                  onChange={(e) =>
                    setEditForm({ ...editForm, email: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Email"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold">Phone</label>
                <input
                  type="text"
                  value={editForm.phone}
                  onChange={(e) =>
                    setEditForm({ ...editForm, phone: e.target.value })
                  }
                  className="w-full border px-3 py-2 rounded-lg mt-1 focus:ring-2 focus:ring-orange-400 outline-none"
                  placeholder="Phone"
                />
              </div>
              <label className="block text-sm font-semibold">
                Profile Image
              </label>

              <div className="flex justify-center mb-3">
                <img
                  src={previewImage || FallbackImage}
                  alt="preview"
                  className="w-24 h-24 rounded-lg object-cover border"
                />
              </div>

              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files[0];
                  if (file) {
                    setEditForm({ ...editForm, profileImage: file });
                    setPreviewImage(URL.createObjectURL(file));
                  }
                }}
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowEdit(false)}
                  className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ADDRESS MODAL */}
      {showAddressModal && (
        <AddressModal
          show={showAddressModal}
          setShow={setShowAddressModal}
          user={user}
          onAddressCreated={(id) => {
            setSelectedAddress(id);

            // user profile refresh (addresses update)
            const token = localStorage.getItem("token");

            axios
              .get("/api/users/getMe", {
                headers: { Authorization: `Bearer ${token}` },
              })
              .then((res) => {
                setUser(res.data.user);
              });
          }}
        />
      )}
      <Footer />
    </>
  );
};

export default UserProfilePage;
