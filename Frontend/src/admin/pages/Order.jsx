import React, { useEffect, useState } from "react";import api from '@/utils/api';
import Swal from "sweetalert2";
import { XCircle, Filter, Eye, Download, UserCheck } from "lucide-react";
import Pagination from "../component/Pagination";
import DeliveryPersonProfile from "../component/DeliveryPersonProfile";
import {
  X,
  User2,
  ShoppingBag,
  Wallet,
  MapPin,
  CalendarDays,
  CreditCard,
} from "lucide-react";
import { Check } from "lucide-react";

const API_URL = "/api/orders";
const DELIVERY_URL = "/api/delivery-persons";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters + Search
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // ADD STATE FOR DELIVERY MODAL
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Modal state
  const [selected, setSelected] = useState(null);

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;
  // DP PROFILE MODAL STATE
  const [dpProfileOpen, setDpProfileOpen] = useState(false);
  const [selectedDpId, setSelectedDpId] = useState(null);

  const openAssignModal = async (orderId) => {
    await fetchDeliveryPersons();

    setCurrentOrderId(orderId);
    setAssignModalOpen(true);
  };
  // open dp profile
  const openDpProfile = (dpId) => {
    setSelectedDpId(dpId);
    setDpProfileOpen(true);
  };

  // Fetch all orders
  const fetchOrders = async () => {
    try {
      const res = await api.get(`${API_URL}/getAllOrders`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = res.data.orders || [];
      setOrders(data);
      console.log(data[0]);
      setFiltered(data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      const res = await api.get(`${DELIVERY_URL}/getDeliveryPersonActive`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const persons = res.data.activeDeliveryPersons || res.data.data || [];
      console.log(res.data);
      setDeliveryPersons(persons);
    } catch (error) {
      console.error("Delivery persons error:", error);
      setDeliveryPersons([]);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 🔍 SEARCH + FILTER LOGIC
  useEffect(() => {
    let data = [...orders];

    // Search by orderId, name, productName
    if (search.trim() !== "") {
      data = data.filter((o) => {
        const matchOrderId = o.coId
          ?.toLowerCase()
          .includes(search.toLowerCase());
        const matchName = o.userId?.fullName
          ?.toLowerCase()
          .includes(search.toLowerCase());
        return matchOrderId || matchName;
      });
    }

    // Status filter
    if (statusFilter !== "") {
      data = data.filter((o) => o.orderStatus === statusFilter);
    }

    // Date Range Filter
    if (fromDate !== "" && toDate !== "") {
      const from = new Date(fromDate);
      const to = new Date(toDate);
      data = data.filter((o) => {
        const orderDate = new Date(o.createdAt);
        return orderDate >= from && orderDate <= to;
      });
    }

    setFiltered(data);
  }, [search, statusFilter, fromDate, toDate, orders]);

  //Assign delivery partner
  const handleAssignDelivery = async (orderId, deliveryPersonId) => {
    try {
      const res = await api.put(
        `${DELIVERY_URL}/assignDeliveryPerson`, // ✅ no /${orderId} in the URL
        { orderId, deliveryPersonId }, // ✅ send both in the body
        { headers: { Authorization: `Bearer ${token}` } },
      );

      Swal.fire("Success", res.data.message, "success");
      fetchOrders(); // ✅ refresh orders list
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to assign",
        "error",
      );
      console.error("Assign Error:", error);
    }
  };

  // Cancel order
  const handleCancelOrder = async (orderId) => {
    try {
      const res = await api.delete(`${API_URL}/cancelOrder/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Cancelled", res.data.message, "success");
      fetchOrders();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to cancel",
        "error",
      );
    }
  };

  // HANDLE ASSIGN DELIVERY PERSON
  const handleAssignDeliveryModal = async (deliveryPersonId) => {
    try {
      await api.put(
        `${DELIVERY_URL}/assignDeliveryPerson`,
        { orderId: currentOrderId, deliveryPersonId },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Swal.fire("Success", "Delivery person assigned", "success");
      fetchOrders();
      setAssignModalOpen(false);
      setCurrentOrderId(null);
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to assign",
        "error",
      );
      console.error(error);
    }
  };
  // Status class

  const getStatusClass = (status) => {
    switch (status) {
      case "Pending":
        return "bg-amber-100 text-amber-700";
      case "Processing":
        return "bg-sky-100 text-sky-700";
      case "Out Of Delivery":
        return "bg-indigo-100 text-indigo-700";
      case "Delivered":
        return "bg-emerald-100 text-emerald-700";
      case "Cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await api.put(
        `${API_URL}/updateOrderStatus/${orderId}`,
        { orderStatus: newStatus },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      Swal.fire("Updated", "Order status updated", "success");
      fetchOrders();
    } catch (error) {
      Swal.fire(
        "Error",
        error.response?.data?.message || "Failed to update status",
        "error",
      );
    }
  };
  const downloadInvoice = async (orderId) => {
    try {
      const res = await api.get(
        `/api/invoice/preview/${orderId}`, // ⚠️ route backend ke according
        {
          responseType: "blob",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const blob = new Blob([res.data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = `invoice-${orderId.slice(-6)}.pdf`;
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      Swal.fire("Error", "Invoice download failed", "error");
      console.error("Invoice download error:", error);
    }
  };

  // 🕒 Order Age (like 2 days ago)
  const getDaysAgo = (date) => {
    const now = new Date();
    const orderDate = new Date(date);
    const diff = Math.floor((now - orderDate) / (1000 * 60 * 60 * 24));

    if (diff === 0) return "Today";
    if (diff === 1) return "1 day ago";
    return `${diff} days ago`;
  };

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  // PAGINATION LOGIC
  const lastIndex = currentPage * itemsPerPage;
  const firstIndex = lastIndex - itemsPerPage;
  const currentItems = filtered.slice(firstIndex, lastIndex);

  return (
    <div>
      <h1 className="text-2xl mb-4 font-bold">
        All <span className="text-orange-500">Orders</span>
      </h1>

      {/* 🔍 Search + Filters */}
      <div className="bg-white p-3 rounded-xl shadow-sm  mb-4">
        {/* Header */}
        <div className="flex items-center gap-2 mb-3">
          <Filter size={18} className="text-gray-600" />
          <h3 className="font-semibold text-gray-700 text-sm">
            Search & Filters
          </h3>
        </div>

        <div className="flex flex-wrap justify-between items-end gap-3">
          {/* LEFT SIDE: Search + Status */}
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            {/* Search */}
            <div className="flex flex-col w-full md:w-48">
              <label className="text-[11px] text-gray-500 mb-1">Search</label>
              <input
                type="text"
                placeholder="Search by Name / Order ID"
                className="border border-gray-300 px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-[#bd2858] transition-all text-sm"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Status Filter */}
            <div className="flex flex-col w-full md:w-40">
              <label className="text-[11px] text-gray-500 mb-1">Status</label>
              <select
                className="border border-gray-300 px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-[#bd2858] transition-all text-sm"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">All Status</option>
                <option>Pending</option>
                <option>Cancelled</option>
              </select>
            </div>
          </div>

          {/* RIGHT SIDE: Date Range + Reset */}
          <div className="flex items-end gap-3 w-full md:w-auto">
            {/* Date Range */}
            <div className="flex items-center gap-3">
              <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1">From</label>
                <input
                  type="date"
                  className="border border-gray-300 px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-[#bd2858] transition-all text-sm"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-[11px] text-gray-500 mb-1">To</label>
                <input
                  type="date"
                  className="border border-gray-300 px-3 py-1.5 rounded-lg focus:ring-1 focus:ring-[#bd2858] transition-all text-sm"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                />
              </div>
            </div>

            {/* Reset Button */}
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setFromDate("");
                setToDate("");
              }}
              className="flex items-center gap-2 px-4 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-200 transition-all"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-[0.78rem] text-left">
          <thead className="bg-gray-200 text-gray-700 ">
            <tr>
              <th className="px-2 py-2">S.No</th>
              <th className="px-2 py-2">Order ID</th>
              <th className="px-2 py-2">Customer</th>
              <th className="px-2 py-2">Total</th>
              <th className="px-2 py-2">Payment Status</th>
              <th className="px-2 py-2"> Order Status</th>
              <th className="px-2 py-2">Days Since Order</th>
              <th className="px-2 py-2">Delivery Person</th>
              <th className="px-2 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((order, index) => (
              <tr
                key={order._id}
                className="transition-all hover:-translate-y-0.5 hover:shadow-lg border-b border-gray-300"
              >
                {/* S.No */}
                <td className="px-2 py-2">{firstIndex + index + 1}</td>

                {/* Order ID - CLICK TO OPEN DETAILS */}
                <td
                  className="px-2 py-2 text-blue-600 font-semibold cursor-pointer hover:underline"
                  onClick={() => setSelected(order)}
                >
                  {order.coId}
                </td>

                {/* Customer + Email */}
                <td className="px-2 py-2">
                  <div
                    className="font-semibold cursor-pointer"
                    onClick={() => setSelected(order)}
                  >
                    {order.userId?.fullName}
                  </div>
                  <div className="text-xs text-gray-600">
                    {order.userId?.email}
                  </div>
                </td>

                {/* Total */}
                <td className="px-2 py-2">
                  ₹{Number(order.payableAmount).toFixed(2)}
                </td>

                {/* Payment */}
                <td className="px-2 py-2">{order.paymentStatus}</td>

                {/* Status */}
                <td className="px-2 py-2">
                  <select
                    value={order.orderStatus}
                    onChange={(e) =>
                      handleStatusChange(order._id, e.target.value)
                    }
                    className={`px-3 py-1 rounded-md font-semibold text-xs border cursor-pointer ${getStatusClass(
                      order.orderStatus,
                    )}`}
                  >
                    <option
                      value="Pending"
                      disabled={order.orderStatus !== "Pending"}
                    >
                      Pending
                    </option>

                    <option
                      value="Processing"
                      disabled={[
                        "Out Of Delivery",
                        "Delivered",
                        "Cancelled",
                      ].includes(order.orderStatus)}
                    >
                      Processing
                    </option>

                    <option
                      value="Out Of Delivery"
                      disabled={["Delivered", "Cancelled"].includes(
                        order.orderStatus,
                      )}
                    >
                      Out Of Delivery
                    </option>

                    <option value="Delivered">Delivered</option>
                    <option value="Cancelled">Cancelled</option>
                  </select>
                </td>

                {/* Order Age + Created Date */}
                <td className="px-2 py-2">
                  <div className="flex flex-col leading-tight">
                    <span className="font-medium">
                      {getDaysAgo(order.createdAt)}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </td>

                {/* Assigned To */}
                <td className="px-2 py-2">
                  {order.deliveryPerson ? (
                    <span
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-green-100/80 hover:bg-green-100 text-green-800 rounded-full text-xs font-semibold shadow-sm cursor-pointer hover:shadow-md transition-all max-w-[120px] truncate"
                      onClick={(e) => {
                        e.stopPropagation();
                        openDpProfile(order.deliveryPerson._id);
                      }}
                      title={order.deliveryPerson.fullName} // Full name on hover
                    >
                      <UserCheck size={12} />
                      <span className="truncate">
                        {order.deliveryPerson.fullName}
                      </span>
                    </span>
                  ) : (
                    <button
                      className="flex items-center gap-1 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-blue-200 transition"
                      onClick={(e) => {
                        e.stopPropagation();
                        openAssignModal(order._id);
                      }}
                    >
                      <UserCheck size={14} />
                      <span>Allot</span>
                    </button>
                  )}
                </td>

                {/* ACTIONS */}
                <td className="px-2 py-2 flex gap-2 justify-center">
                  {/* DOWNLOAD BUTTON */}
                  <button
                    className="px-3 py-2 rounded bg-[#3c72fc]/10 text-[#3c72fc] hover:bg-[#3c72fc]/20 flex items-center gap-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      downloadInvoice(order._id);
                    }}
                  >
                    <Download size={18} />
                  </button>

                  {/* CANCEL BUTTON */}
                  {order.orderStatus !== "Cancelled" && (
                    <button
                      className="px-3 py-2 rounded bg-red-50 text-red-700 hover:bg-red-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCancelOrder(order._id);
                      }}
                    >
                      <XCircle size={18} />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="space-y-3 md:hidden">
        {currentItems.map((order, index) => (
          <div
            key={order._id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-3"
          >
            {/* Top row: ID + status */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[11px] text-gray-400">Order ID</p>
                <button
                  onClick={() => setSelected(order)}
                  className="text-xs font-semibold text-blue-600"
                >
                  {order.coId}
                </button>
                <p className="mt-1 text-[11px] text-gray-500">
                  #{firstIndex + index + 1} • {getDaysAgo(order.createdAt)}
                </p>
              </div>

              {/* <div className="flex flex-col items-end gap-1">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`px-2 py-1 rounded-full text-[10px] font-medium border cursor-pointer ${getStatusClass(
                    order.orderStatus
                  )}`}
                >
                  <option value="Pending">Pending</option>
                  <option value="Processing">Processing</option>
                  <option value="Out Of Delivery">Out Of Delivery</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                </select>

                <span className="text-[11px] text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div> */}
              <div className="flex flex-col items-end gap-1">
                <select
                  value={order.orderStatus}
                  onChange={(e) =>
                    handleStatusChange(order._id, e.target.value)
                  }
                  className={`px-2 py-1 rounded-full text-[10px] font-medium border cursor-pointer ${getStatusClass(
                    order.orderStatus,
                  )}`}
                >
                  <option
                    value="Pending"
                    disabled={order.orderStatus !== "Pending"}
                  >
                    Pending
                  </option>

                  <option
                    value="Processing"
                    disabled={[
                      "Out Of Delivery",
                      "Delivered",
                      "Cancelled",
                    ].includes(order.orderStatus)}
                  >
                    Processing
                  </option>

                  <option
                    value="Out Of Delivery"
                    disabled={["Delivered", "Cancelled"].includes(
                      order.orderStatus,
                    )}
                  >
                    Out Of Delivery
                  </option>

                  <option value="Delivered">Delivered</option>

                  <option value="Cancelled">Cancelled</option>
                </select>

                <span className="text-[11px] text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>

            {/* Customer */}
            <div
              className="mt-3 flex items-start justify-between gap-2"
              onClick={() => setSelected(order)}
            >
              <div>
                <p className="text-[11px] text-gray-400">Customer</p>
                <p className="text-xs font-semibold text-gray-900">
                  {order.userId?.fullName}
                </p>
                <p className="text-[11px] text-gray-500">
                  {order.userId?.email}
                </p>
              </div>

              <div className="text-right">
                <p className="text-[11px] text-gray-400">Total</p>
                <p className="text-sm font-semibold text-gray-900">
                  ₹{Number(order.payableAmount).toFixed(2)}
                </p>
                <p className="text-[11px] text-gray-500">
                  {order.paymentStatus}
                </p>
              </div>
            </div>

            {/* Delivery + actions */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <div>
                <p className="text-[11px] text-gray-400">Delivery</p>
                {order.deliveryPerson ? (
                  <button
                    className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full bg-green-100 text-green-700 text-[11px] font-medium"
                    onClick={() => openDpProfile(order.deliveryPerson._id)}
                  >
                    {order.deliveryPerson.fullName}
                  </button>
                ) : (
                  <button
                    className="mt-0.5 inline-flex items-center px-2 py-0.5 rounded-full bg-blue-100 text-blue-700 text-[11px] font-medium"
                    onClick={() => openAssignModal(order._id)}
                  >
                    <UserCheck size={12} className="mr-1" />
                    Allot
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <button
                  className="px-2 py-1 rounded bg-[#3c72fc]/10 text-[#3c72fc] hover:bg-[#3c72fc]/20 flex items-center gap-1"
                  onClick={() => console.log("PDF download later", order._id)}
                >
                  <Download size={14} />
                </button>

                {order.orderStatus !== "Cancelled" && (
                  <button
                    className="px-2 py-1 rounded bg-red-50 text-red-700 hover:bg-red-100"
                    onClick={() => handleCancelOrder(order._id)}
                  >
                    <XCircle size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      {filtered.length > itemsPerPage && (
        <Pagination
          currentPage={currentPage}
          totalItems={filtered.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      )}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          {/* Modal */}
          <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 h-[90vh] overflow-y-scroll">
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-5 h-5 text-rose-600" />
                <h2 className="text-base font-semibold text-gray-900">
                  Order Details
                </h2>
              </div>

              <button
                onClick={() => setSelected(null)}
                className="rounded-full p-1.5 hover:bg-gray-100 transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="p-5 space-y-4 max-h-[95vh] overflow-y-auto">
              {/* User */}
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img
                    src={
                      selected.userId?.profileImage ||
                      "https://via.placeholder.com/60"
                    }
                    className="w-12 h-12 rounded-full object-cover border border-gray-100"
                    alt="User"
                  />
                  <span className="absolute -bottom-0.5 -right-0.5 bg-white rounded-full p-0.5 shadow">
                    <User2 className="w-3.5 h-3.5 text-rose-600" />
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">
                    {selected.userId?.fullName || "No Name"}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {selected.userId?.email}
                  </p>
                  <p className="mt-1 inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-medium text-amber-700">
                    <Wallet className="w-3 h-3" />
                    Coins: {selected.userId?.coins ?? 0}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div className="rounded-xl border border-rose-100 bg-rose-50/60 p-3">
                <div className="mb-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ShoppingBag className="w-4 h-4 text-rose-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wide text-rose-600">
                      Products
                    </h3>
                  </div>
                  <span className="text-[11px] font-medium text-rose-600 bg-white/70 px-2 py-0.5 rounded-full">
                    {selected.items.length} item
                    {selected.items.length > 1 && "s"}
                  </span>
                </div>

                <div
                  className={`space-y-1.5 ${
                    selected.items.length > 3
                      ? "max-h-95 overflow-y-scroll pr-1"
                      : ""
                  }`}
                >
                  {selected.items.map((item) => (
                    <div
                      key={item._id}
                      className="flex items-center justify-between rounded-lg bg-white/80 px-2.5 py-1.5 text-xs shadow-[0_0_0_1px_rgba(248,113,113,0.15)]"
                    >
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-900 line-clamp-1">
                          {item.productId?.productName}
                        </span>
                        <span className="text-[11px] text-gray-500">
                          Qty: {item.quantity}
                        </span>
                      </div>
                      <div className="flex flex-col">
                        <span className="font-medium text-gray-800 line-clamp-1">
                          {item.productId?.pricing[0]?.value}{" "}
                          {item.productId?.pricing[0]?.unit}
                        </span>
                      </div>

                      <span className="text-xs font-semibold text-rose-600">
                        ₹{item.price.toFixed(2) * item.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <CreditCard className="w-3 h-3 text-emerald-500" />
                    Total Amount
                  </p>
                  <p className="mt-1 text-sm font-semibold text-gray-900">
                    ₹{selected.totalAmount}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500">Payable Amount</p>
                  <p className="mt-1 text-xs font-semibold capitalize">
                    {selected.payableAmount}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500">Order Status</p>
                  <p className="mt-1 text-xs font-semibold capitalize">
                    {selected.orderStatus}
                  </p>
                </div>

                <div className="rounded-xl border border-gray-100 p-3">
                  <p className="text-[11px] text-gray-500 flex items-center gap-1">
                    <CalendarDays className="w-3 h-3 text-indigo-500" />
                    Order Date
                  </p>
                  <p className="mt-1 text-xs font-medium text-gray-900">
                    {new Date(selected.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Address */}
              <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-3">
                <p className="mb-1.5 flex items-center gap-1 text-[11px] font-semibold uppercase tracking-wide text-gray-600">
                  <MapPin className="w-3.5 h-3.5 text-rose-600" />
                  Shipping Address
                </p>
                <p className="text-xs leading-relaxed text-gray-800">
                  {selected.shippingAddress.landmark},{" "}
                  {selected.shippingAddress.city},{" "}
                  {selected.shippingAddress.state} -{" "}
                  {selected.shippingAddress.pincode},{" "}
                  {selected.shippingAddress.country}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* ASSIGN DELIVERY MODAL - Grid Layout Responsive */}
      {assignModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md lg:max-w-6xl xl:max-w-7xl rounded-3xl shadow-2xl max-h-[95vh] overflow-hidden">
            {/* Header */}
            <div className="px-6 lg:px-8 py-6 lg:py-8 border-b border-gray-100 sticky top-0 z-10 bg-white/95 backdrop-blur-sm">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-linear-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl shadow-lg">
                    <UserCheck className="w-6 h-6 lg:w-7 lg:h-7 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
                      Assign Delivery
                    </h3>
                    <p className="text-sm lg:text-base text-gray-500 font-medium">
                      Order #{currentOrderId?.slice(-6)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setAssignModalOpen(false)}
                  className="p-2 rounded-2xl hover:bg-gray-100 transition-all text-gray-500 hover:text-gray-700 hover:shadow-md lg:p-3 lg:hover:scale-105"
                  aria-label="Close modal"
                >
                  <X className="w-5 h-5 lg:w-6 lg:h-6" />
                </button>
              </div>
            </div>

            {/* Delivery Persons Grid */}
            <div className="p-4 lg:p-6 max-h-[70vh] overflow-y-auto">
              {deliveryPersons.length === 0 ? (
                <div className="text-center py-16 lg:py-20">
                  <UserCheck className="w-16 h-16 lg:w-20 lg:h-20 text-gray-300 mx-auto mb-6" />
                  <h4 className="text-lg lg:text-xl font-bold text-gray-900 mb-2">
                    No Delivery Persons
                  </h4>
                  <p className="text-gray-500 text-sm lg:text-base font-medium max-w-sm mx-auto">
                    No available delivery personnel at the moment. Check back
                    later.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
                  {deliveryPersons.map((dp) => {
                    const availabilityClass =
                      dp.availabilityStatus === "Available"
                        ? "bg-emerald-100 text-emerald-700 border-emerald-200"
                        : dp.availabilityStatus === "On Delivery"
                          ? "bg-amber-100 text-amber-700 border-amber-200"
                          : "bg-red-100 text-red-700 border-red-200";

                    return (
                      <div
                        key={dp._id}
                        className="group bg-linear-to-b from-white to-gray-50/50 rounded-2xl lg:rounded-3xl border border-gray-200 hover:border-blue-300 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 overflow-hidden cursor-pointer backdrop-blur-sm h-full flex flex-col"
                        onClick={() => handleAssignDeliveryModal(dp._id)}
                      >
                        {/* Profile Header */}
                        <div className="flex items-start p-4 lg:p-6 gap-4 lg:gap-6 shrink-0">
                          <div className="relative shrink-0">
                            <div
                              className={`w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden shadow-xl bg-linear-to-br ${
                                dp.isActive
                                  ? "from-emerald-500/10 to-teal-500/10 border-3 lg:border-4 border-emerald-200/80"
                                  : "from-gray-400/20 to-gray-500/20 border-3 lg:border-4 border-gray-300/50"
                              } flex items-center justify-center relative`}
                            >
                              {dp.profileImage ? (
                                <img
                                  src={dp.profileImage}
                                  alt={dp.fullName}
                                  className="w-full h-full object-cover"
                                  loading="lazy"
                                />
                              ) : (
                                <User2 className="w-8 h-8 lg:w-10 lg:h-10 text-gray-600 lg:text-gray-700" />
                              )}
                              <div
                                className={`absolute -top-1 -right-1 w-6 h-6 lg:w-7 lg:h-7 rounded-full flex items-center justify-center text-xs lg:text-sm font-bold shadow-lg border-2 border-white ${
                                  dp.isActive
                                    ? "bg-emerald-500 text-white"
                                    : "bg-gray-400 text-white"
                                }`}
                              >
                                {dp.isActive ? "A" : "I"}
                              </div>
                            </div>
                          </div>

                          {/* Name + ID + Phone */}
                          <div className="flex-1 min-w-0 py-1">
                            <div className="flex flex-col lg:flex-row lg:items-center gap-2 mb-2 lg:mb-0">
                              <p className="text-base lg:text-lg font-bold text-gray-900 truncate leading-tight">
                                {dp.fullName}
                              </p>
                              <span className="px-3 py-1 bg-linear-to-r from-blue-100 to-blue-200 text-blue-800 text-xs lg:text-sm font-semibold rounded-full lg:rounded-xl shadow-sm whitespace-nowrap">
                                {dp.deliveryBoyId}
                              </span>
                            </div>
                            <p className="text-sm lg:text-base text-gray-600 font-medium truncate">
                              {dp.phone}
                            </p>
                          </div>
                        </div>

                        {/* Divider */}
                        <div className="h-px bg-linear-to-r from-transparent via-gray-200/60 to-transparent mx-4 lg:mx-6 shrink-0" />

                        {/* Details Section */}
                        <div className="flex-1 px-4 lg:px-6 pb-4 lg:pb-6 pt-3 space-y-3 lg:space-y-4">
                          {/* Details Grid */}
                          <div className="grid grid-cols-2 gap-3 text-sm lg:text-base">
                            <div className="space-y-1">
                              <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                Vehicle
                              </p>
                              <p className="font-semibold text-gray-900">
                                {dp.vehicleDetails?.vehicleType || "N/A"}
                              </p>
                            </div>
                            <div className="space-y-1">
                              <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide font-medium">
                                ID Proof
                              </p>
                              <p className="font-semibold text-gray-900">
                                {dp.idProof?.idType || "N/A"}
                              </p>
                            </div>
                          </div>

                          {/* Cash in Hand */}
                          <div className="space-y-1 pt-2">
                            <p className="text-xs lg:text-sm text-gray-500 uppercase tracking-wide font-medium">
                              Cash in Hand
                            </p>
                            <p className="font-bold text-emerald-600 text-lg lg:text-xl leading-tight">
                              ₹{dp.cashInHand?.toFixed(0) || 0}
                            </p>
                          </div>
                        </div>

                        {/* Status + Assign Button */}
                        <div className="px-4 lg:px-6 pb-4 lg:pb-6 pt-3 lg:pt-0 border-t border-gray-100/50 shrink-0">
                          <div className="flex flex-col gap-3">
                            {/* Status Row */}
                            <div className="flex items-center justify-between">
                              <span
                                className={`px-3 lg:px-4 py-1.5 lg:py-2 rounded-full text-xs lg:text-sm font-bold border-2 shadow-sm inline-flex items-center gap-1.5 ${availabilityClass}`}
                              >
                                <XCircle className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                {dp.availabilityStatus || "N/A"}
                              </span>
                              <div className="text-xs lg:text-sm text-gray-500 flex items-center gap-1 font-medium">
                                <CalendarDays className="w-3 h-3 lg:w-4 lg:h-4 shrink-0" />
                                <span className="hidden lg:inline">
                                  Joined{" "}
                                  {new Date(dp.joinDate).toLocaleDateString()}
                                </span>
                              </div>
                            </div>

                            {/* Assign Button */}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleAssignDeliveryModal(dp._id);
                              }}
                              className="w-full px-6 py-3 bg-linear-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-2xl shadow-xl hover:shadow-2xl hover:-translate-y-0.5 hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 flex items-center justify-center gap-2 text-sm group"
                            >
                              <Check className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                              Assign Now
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {dpProfileOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-4xl h-[85vh] overflow-scroll w-full relative">
            <button
              className="absolute top-4 right-4 text-xl text-gray-500 hover:text-red-500"
              onClick={() => setDpProfileOpen(false)}
            >
              ✖
            </button>

            <DeliveryPersonProfile
              deliveryPersonId={selectedDpId}
              onClose={() => setDpProfileOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
