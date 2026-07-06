// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import {
//   ShoppingBag,
//   DollarSign,
//   Users,
//   Package,
//   TrendingUp,
//   Box,
//   ShoppingCart,
//   Loader2,
//   IndianRupee,
// } from "lucide-react";
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   CartesianGrid,
//   Tooltip,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from "recharts";

// const Dashboard = () => {
//   const [stats, setStats] = useState({});
//   const [orders, setOrders] = useState([]);
//   const [salesData, setSalesData] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const authData = JSON.parse(sessionStorage.getItem("admin"));
//   const token = authData?.token;

//   const apiCall = axios.create({
//     baseURL: "/api",
//     headers: {
//       Authorization: `Bearer ${token}`,
//       "Content-Type": "application/json",
//     },
//   });

//   // useEffect(() => {
//   //   const fetchData = async () => {
//   //     try {
//   //       setLoading(true);

//   //       // Fetch stats
//   //       const statsRes = await apiCall.get("/dashboard/stats");
//   //       setStats(statsRes.data.data);
//   //       // Fetch orders
//   //       const ordersRes = await apiCall.get("/orders/getAllOrders");
//   //       setOrders(ordersRes.data.orders.slice(0, 5)); // Last 5 orders
//   //       console.log(ordersRes);

//   //       // Generate sales data for graph (mock - replace with real API)
//   //       const salesMock = [
//   //         { month: "Jan", revenue: 12000 },
//   //         { month: "Feb", revenue: 18000 },
//   //         { month: "Mar", revenue: 22000 },
//   //         { month: "Apr", revenue: 28000 },
//   //         { month: "May", revenue: 32000 },
//   //         { month: "Jun", revenue: 38000 },
//   //       ];
//   //       setSalesData(salesMock);
//   //     } catch (err) {
//   //       setError("Failed to load dashboard data");
//   //       console.error(err);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   if (token) {
//   //     fetchData();
//   //   }
//   // }, [token]);
//   useEffect(() => {
//     const fetchData = async () => {
//       try {
//         setLoading(true);

//         // Parallel API calls for better performance
//         const [statsRes, ordersRes, revenueRes] = await Promise.all([
//           apiCall.get("/dashboard/stats"),
//           apiCall.get("/orders/getAllOrders"),
//           apiCall.get("/orders/monthlyrevenue"),
//         ]);

//         // Stats
//         setStats(statsRes.data.data);

//         // Orders (last 5)
//         setOrders(ordersRes.data.orders.slice(0, 5));
//         console.log(ordersRes.data.orders[0]);
//         // ✅ FULLY DYNAMIC Sales Data
//         const monthlyData = revenueRes.data.data;
//         console.log("📊 Dynamic Sales Data:", monthlyData);
//         const formattedSalesData = monthlyData
//           .map((item) => ({
//             month: item.month || item._id?.slice(-3) || "N/A", // Handles MongoDB _id grouping
//             revenue: Number(item.totalRevenue || item.revenue || 0),
//           }))
//           .filter((item) => item.revenue > 0); // Remove zero revenue months

//         setSalesData(formattedSalesData);
//       } catch (err) {
//         setError("Failed to load dashboard data");
//         console.error("Dashboard Error:", err.response?.data || err.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (token) {
//       fetchData();
//     }
//   }, [token]);

//   const getStatusColor = (status) => {
//     switch (status?.toLowerCase()) {
//       case "completed":
//         return "bg-green-100 text-green-700";
//       case "pending":
//         return "bg-yellow-100 text-yellow-700";
//       case "cancelled":
//         return "bg-red-100 text-red-700";
//       default:
//         return "bg-gray-100 text-gray-700";
//     }
//   };

//   if (loading) {
//     return (
//       <div className="min-h-screen bg-gray-50 flex items-center justify-center">
//         <div className="text-center">
//           <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
//           <p className="text-lg text-gray-600">Loading dashboard...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50">
//       {/* Header */}
//       <div className="mb-8">
//         <h1 className="text-4xl lg:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
//           Dashboard
//         </h1>
//         <p className="text-gray-600 mt-2 text-lg">
//           Real-time overview of your business
//         </p>
//       </div>

//       {/* Stats Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 mb-10">
//         <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg">
//               <Package className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
//                 Total Orders
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.totalOrders || 0}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-linear-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
//               <Users className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
//                 Total Users
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.totalUsers || 0}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
//               <IndianRupee className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
//                 Total Revenue
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 ${stats.totalRevenue || 0}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
//               <Box className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
//                 Products
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.totalProducts || 0}
//               </p>
//             </div>
//           </div>
//         </div>

//         <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
//           <div className="flex items-center gap-4">
//             <div className="p-3 bg-linear-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
//               <ShoppingCart className="w-8 h-8 text-white" />
//             </div>
//             <div>
//               <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
//                 Pending Orders
//               </p>
//               <p className="text-3xl font-bold text-gray-900">
//                 {stats.pendingOrders || 0}
//               </p>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Charts & Recent Orders */}
//       <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
//         {/* Sales Graph */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
//           <div className="flex justify-between items-center mb-8">
//             <h2 className="text-2xl font-bold text-gray-800">Sales Overview</h2>
//             <TrendingUp className="w-8 h-8 text-emerald-500" />
//           </div>
//           <ResponsiveContainer width="100%" height={400}>
//             <LineChart data={salesData}>
//               <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
//               <XAxis dataKey="month" stroke="#64748b" />
//               <YAxis stroke="#64748b" />
//               <Tooltip />
//               <Line
//                 type="monotone"
//                 dataKey="revenue"
//                 stroke="#10b981"
//                 strokeWidth={4}
//                 dot={{ fill: "#10b981", strokeWidth: 2 }}
//                 activeDot={{ r: 8, strokeWidth: 3 }}
//               />
//             </LineChart>
//           </ResponsiveContainer>
//         </div>

//         {/* Recent Orders */}
//         <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50 overflow-hidden">
//           <h2 className="text-2xl font-bold text-gray-800 mb-6">
//             Recent Orders
//           </h2>
//           <div className="space-y-2">
//             {orders.length > 0 ? (
//               orders.map((order) => (
//                 <div
//                   key={order._id}
//                   className="group hover:bg-gray-50 p-3 rounded-lg border border-gray-200 hover:shadow-sm transition-all"
//                 >
//                   <div className="flex items-center justify-between mb-2">
//                     <span className="font-mono text-xs bg-blue-500 text-white px-2 py-1 rounded">
//                       #{order.coId || order._id?.slice(-6)}
//                     </span>
//                     <span
//                       className={`px-2 py-1 text-xs font-bold rounded ${getStatusColor(
//                         order.orderStatus || order.status
//                       )}`}
//                     >
//                       {order.orderStatus || order.status}
//                     </span>
//                   </div>

//                   <div className="flex items-center justify-between">
//                     <div>
//                       <p className="font-medium text-sm text-gray-900 truncate max-w-[150px]">
//                         {order.userId?.fullName || order.shippingAddress?.name}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {order.items?.length} items
//                       </p>
//                     </div>
//                     <div className="text-right">
//                       <p className="font-bold text-lg text-emerald-600">
//                         ₹{order.payableAmount?.toLocaleString() || 0}
//                       </p>
//                       <p className="text-xs text-gray-500">
//                         {new Date(order.createdAt).toLocaleDateString("en-IN")}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               ))
//             ) : (
//               <div className="text-center py-8 text-gray-500">
//                 <ShoppingCart className="w-10 h-10 mx-auto mb-3 opacity-50" />
//                 <p className="text-sm font-medium">No recent orders</p>
//               </div>
//             )}
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
//           <p className="text-red-800 font-medium">{error}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Dashboard;

import React, { useState, useEffect } from "react";import api from '@/utils/api';
import {
  ShoppingBag,
  DollarSign,
  Users,
  Package,
  TrendingUp,
  Box,
  ShoppingCart,
  Loader2,
  IndianRupee,
  MapPin,
  Phone,
  Truck,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const Dashboard = ({ setActiveView }) => {
  const [stats, setStats] = useState({});
  const [orders, setOrders] = useState([]);
  const [salesData, setSalesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  const apiCall = api.create({
    baseURL: "/api",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const [statsRes, ordersRes, weeklyRes] = await Promise.all([
          apiCall.get("/dashboard/stats"),
          apiCall.get("/orders/getAllOrders"),
          apiCall.get("/orders/getWeeklyOrdersByDay"), // ✅ Your new endpoint
        ]);

        setStats(statsRes.data.data);
        setOrders(ordersRes.data.orders.slice(0, 20));

        // ✅ ORDERS CHART DATA - Perfect format from your backend
        const weeklyData = weeklyRes.data.data;
        console.log("📊 Weekly Orders:", weeklyData);

        const ordersChartData = weeklyData.map((item) => ({
          day: item.day, // "Week 32 - 2025"
          orders: item.orders,
        }));

        console.log("📈 Weekly Chart Data:", ordersChartData);
        setSalesData(ordersChartData);
      } catch (err) {
        setError("Failed to load dashboard data");
        console.error("Dashboard Error:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchData();
    }
  }, [token]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      case "processing":
        return "bg-blue-100 text-blue-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-lg text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className=" bg-linear-to-br from-gray-50 to-blue-50 p-1">
      {/* Header */}
      <div className="mb-4">
        <h1 className="text-4xl lg:text-2xl font-bold bg-linear-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
          Dashboard
        </h1>
        <p className="text-gray-600 mt-2 text-lg">
          Real-time overview of your business
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 mb-2">
        <div
          className="hover:cursor-pointer bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50"
          onClick={() => setActiveView("All Order")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-yellow-400 to-yellow-500 rounded-xl shadow-lg">
              <Package className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalOrders || 0}
              </p>
            </div>
          </div>
        </div>

        <div
          className="hover:cursor-pointer bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50"
          onClick={() => setActiveView("Customers")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-purple-500 to-purple-600 rounded-xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Users
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalUsers || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-emerald-500 to-emerald-600 rounded-xl shadow-lg">
              <IndianRupee className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Total Revenue
              </p>
              <p className="text-3xl font-bold text-gray-900">
                ₹{stats.totalRevenue?.toLocaleString() || 0}
              </p>
            </div>
          </div>
        </div>

        <div
          className="hover:cursor-pointer bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50"
          onClick={() => setActiveView("Product")}
        >
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-blue-500 to-blue-600 rounded-xl shadow-lg">
              <Box className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Products
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.totalProducts || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white/80 backdrop-blur-sm shadow-xl rounded-2xl p-6 hover:shadow-2xl transition-all duration-300 border border-white/50">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-linear-to-r from-red-500 to-red-600 rounded-xl shadow-lg">
              <ShoppingCart className="w-8 h-8 text-white" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600 uppercase tracking-wider">
                Pending Orders
              </p>
              <p className="text-3xl font-bold text-gray-900">
                {stats.pendingOrders || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts & Recent Orders */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        {/* Orders Chart */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-white/50">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Monthly Orders</h2>
            <TrendingUp className="w-8 h-8 text-emerald-500" />
          </div>

          {salesData.length > 0 ? (
            <ResponsiveContainer width="100%" height={400}>
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis allowDecimals={false} />
                <Tooltip />
                <Line type="monotone" dataKey="orders" strokeWidth={3} dot />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-gray-500">
              <TrendingUp className="w-16 h-16 opacity-50 mb-4" />
              <p>No orders data available</p>
            </div>
          )}
        </div>

        {/* Recent Orders - 20 Orders with More Details */}
        <div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-2xl p-2 border border-white/50 max-h-[600px] overflow-y-auto">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-2">
            Recent Orders (20)
          </h2>
          <div className="space-y-3">
            {orders.length > 0 ? (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="group hover:bg-gray-50 p-2 rounded-xl border border-gray-200 hover:shadow-md transition-all"
                >
                  {/* Order Header */}
                  <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                    <span className="font-mono text-sm bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
                      #{order.coId || order._id?.slice(-6)}
                    </span>
                    <span
                      className={`px-3 py-1 text-xs font-bold rounded-full ${getStatusColor(
                        order.orderStatus || order.status
                      )}`}
                    >
                      {order.orderStatus || order.status}
                    </span>
                  </div>

                  {/* Customer & Amount */}
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="font-semibold text-gray-900 text-sm">
                        {order.userId?.fullName || order.shippingAddress?.name}
                      </p>
                      <p className="text-xs text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {order.shippingAddress?.phone || order.userId?.phone}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-xl text-emerald-600">
                        ₹{order.payableAmount?.toLocaleString() || 0}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {/* Items Summary - SIMPLE ROW LAYOUT - ALL ITEMS */}
                  <div className="mb-4 p-2 bg-white border border-gray-200 rounded-xl shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                        🛍️ Items ({order.items?.length || 0})
                      </h4>
                      <span className="font-bold text-xl text-emerald-600">
                        ₹{order.payableAmount?.toLocaleString()}
                      </span>
                    </div>

                    {/* SIMPLE ROW - ALL ITEMS */}
                    <div className="space-y-2 max-h-32 overflow-y-auto pr-2">
                      {order.items?.map((item, idx) => (
                        <div
                          key={idx}
                          className="flex items-center justify-between py-2 px-3 bg-gray-50 hover:bg-gray-100 rounded-lg group transition-colors"
                        >
                          {/* Product Info */}
                          <div className="flex items-center gap-3 flex-1 min-w-0">
                            <div className="w-10 h-10 bg-linear-to-br from-blue-100 to-emerald-100 rounded-lg flex items-center justify-center shrink-0">
                              <span className="text-xs font-semibold text-gray-700 truncate px-1">
                                {item.productId?.productName?.slice(0, 12)}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="font-medium text-sm text-gray-900 truncate">
                                {item.productId?.productName}
                              </p>
                              <p className="text-xs text-gray-500">
                                x{item.quantity}
                              </p>
                            </div>
                          </div>

                          {/* Price */}
                          <div className="text-right ml-4">
                            <p className="font-bold text-sm text-emerald-600">
                              ₹{(item.price / item.quantity).toFixed(0)}
                            </p>
                            <p className="font-bold text-sm text-emerald-600">
                              ₹{(item.price * item.quantity).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Address & Delivery */}
                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                    <div className="flex items-start gap-1">
                      <MapPin className="w-3 h-3 mt-0.5 shrink-0" />
                      <span className="truncate">
                        {order.shippingAddress?.city},{" "}
                        {order.shippingAddress?.state}
                      </span>
                    </div>
                    {order.deliveryPerson && (
                      <div className="flex items-center gap-1">
                        <Truck className="w-3 h-3" />
                        <span>{order.deliveryPerson.deliveryBoyId}</span>
                      </div>
                    )}
                  </div>

                  {/* Payment */}
                  <div className="mt-2 pt-2 border-t border-gray-100">
                    <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                      {order.paymentMethod} | {order.paymentStatus}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-500">
                <ShoppingCart className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium">No recent orders</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-8 p-6 bg-red-50 border border-red-200 rounded-2xl">
          <p className="text-red-800 font-medium">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
