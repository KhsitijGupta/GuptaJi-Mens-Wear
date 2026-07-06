// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const AdminDeliveryAccounting = () => {
//   // Core states
//   const [viewMode, setViewMode] = useState("list"); // 'list' or 'dashboard'
//   const [selectedDP, setSelectedDP] = useState(null);
//   const [deliveryPersons, setDeliveryPersons] = useState([]);
//   const [dashboardData, setDashboardData] = useState(null);
//   const [transactions, setTransactions] = useState([]);
//   const [pagination, setPagination] = useState({});

//   // Filters
//   const [filters, setFilters] = useState({
//     type: "",
//     startDate: "",
//     endDate: "",
//     page: 1,
//     limit: 25,
//   });

//   const authData = JSON.parse(sessionStorage.getItem("admin"));
//   const token = authData?.token;

//   // Modals
//   const [showSettlement, setShowSettlement] = useState(false);
//   const [showCredit, setShowCredit] = useState(false);
//   const [showDebit, setShowDebit] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedTransaction, setSelectedTransaction] = useState(null);

//   // Form states
//   const [settlementForm, setSettlementForm] = useState({
//     amount: "",
//     mode: "CASH",
//     remark: "",
//   });
//   const [creditForm, setCreditForm] = useState({ amount: "", note: "" });
//   const [debitForm, setDebitForm] = useState({ amount: "", note: "" });

//   // Load delivery persons on mount
//   useEffect(() => {
//     loadDeliveryPersons();
//   }, []);

//   // Load dashboard when DP changes
//   useEffect(() => {
//     if (selectedDP && viewMode === "dashboard") {
//       loadDashboard(selectedDP._id);
//       loadTransactions(selectedDP._id);
//     }
//   }, [selectedDP, viewMode]);

//   const loadDeliveryPersons = async () => {
//     try {
//       const res = await axios.get(
//         "/api/delivery-persons/getAllDeliveryPersons",
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setDeliveryPersons(res.data.data || []);
//     } catch (err) {
//       console.error("Failed to load delivery persons");
//     }
//   };

//   const loadDashboard = async (dpId) => {
//     try {
//       const res = await axios.get(`/api/deliveryaccounting/dashboard/${dpId}`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDashboardData(res.data);
//     } catch (err) {
//       console.error("Failed to load dashboard");
//     }
//   };

//   const loadTransactions = async (dpId) => {
//     try {
//       const res = await axios.get(
//         `/api/deliveryaccounting/transactionsForAdmin/${dpId}`,
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setTransactions(res.data.data);
//       setPagination(res.data.pagination);
//     } catch (err) {
//       console.error("Failed to load transactions");
//     }
//   };

//   const handleFilterChange = (key, value) => {
//     setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
//   };

//   const applyFilters = () => {
//     if (selectedDP) loadTransactions(selectedDP._id);
//   };

//   const resetFilters = () => {
//     const resetFilters = {
//       type: "",
//       startDate: "",
//       endDate: "",
//       page: 1,
//       limit: 10,
//     };
//     setFilters(resetFilters);
//     if (selectedDP) loadTransactions(selectedDP._id);
//   };

//   const handlePageChange = (page) => {
//     const newFilters = { ...filters, page };
//     setFilters(newFilters);
//     if (selectedDP) loadTransactions(selectedDP._id);
//   };

//   const openViewModal = (transaction) => {
//     setSelectedTransaction(transaction);
//     setShowViewModal(true);
//   };

//   const reloadData = () => {
//     if (selectedDP) {
//       loadDashboard(selectedDP._id);
//       loadTransactions(selectedDP._id);
//     }
//   };

//   // Form handlers (same as original)
//   const handleSettlementSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "/api/deliveryaccounting/admin-settlement",
//         {
//           deliveryPersonId: selectedDP._id,
//           amount: Number(settlementForm.amount),
//           mode: settlementForm.mode,
//           remark: settlementForm.remark,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setShowSettlement(false);
//       reloadData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Settlement failed");
//     }
//   };

//   const handleCreditSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "/api/deliveryaccounting/wallet-credit",
//         {
//           deliveryPersonId: selectedDP._id,
//           amount: Number(creditForm.amount),
//           note: creditForm.note,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setShowCredit(false);
//       reloadData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Credit failed");
//     }
//   };

//   const handleDebitSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       await axios.post(
//         "/api/deliveryaccounting/wallet-debit",
//         {
//           deliveryPersonId: selectedDP._id,
//           amount: Number(debitForm.amount),
//           note: debitForm.note,
//         },
//         {
//           headers: { Authorization: `Bearer ${token}` },
//         }
//       );
//       setShowDebit(false);
//       reloadData();
//     } catch (err) {
//       alert(err.response?.data?.message || "Debit failed");
//     }
//   };

//   const getTypeBadgeClass = (type) => {
//     const classes = {
//       COD_COLLECTED: "bg-emerald-100 text-emerald-800",
//       ADMIN_SETTLEMENT: "bg-indigo-100 text-indigo-800",
//       WALLET_CREDIT: "bg-blue-100 text-blue-800",
//       WALLET_DEBIT: "bg-rose-100 text-rose-800",
//     };
//     return classes[type] || "bg-gray-100 text-gray-800";
//   };

//   const selectDeliveryPerson = (dp) => {
//     setSelectedDP(dp);
//     setViewMode("dashboard");
//   };

//   const goBackToList = () => {
//     setSelectedDP(null);
//     setViewMode("list");
//     setDashboardData(null);
//     setTransactions([]);
//   };

//   // 1. Delivery Persons List View (Simple Cards)
//   if (viewMode === "list") {
//     return (
//       <div className="bg-slate-100 p-4 rounded-lg">
//         <div className="">
//           {/* Header */}
//           <div className=" mb-4">
//             <h1 className="text-3xl font-bold text-gray-900 mb-4">
//               Delivery Accounting
//             </h1>
//             <p className="text-gray-600 text-lg">
//               Click on any delivery person to view their dashboard
//             </p>
//           </div>

//           {/* Delivery Persons Grid */}
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//             {deliveryPersons.map((dp) => (
//               <div
//                 key={dp._id}
//                 onClick={() => selectDeliveryPerson(dp)}
//                 className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
//               >
//                 <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
//                   <span className="text-2xl text-white">🚚</span>
//                 </div>

//                 <div className="text-center space-y-3">
//                   <h3 className="text-xl font-bold text-gray-900">
//                     {dp.fullName}
//                   </h3>
//                   <p className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full inline-block">
//                     {dp.deliveryBoyId}
//                   </p>

//                   <div className="grid grid-cols-2 gap-4 pt-4 border-t">
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase tracking-wide">
//                         Cash
//                       </p>
//                       <p className="text-lg font-bold text-emerald-600">
//                         ₹{dp.cashInHand?.toFixed(0) || 0}
//                       </p>
//                     </div>
//                     <div>
//                       <p className="text-xs text-gray-500 uppercase tracking-wide">
//                         Wallet
//                       </p>
//                       <p className="text-lg font-bold text-blue-600">
//                         ₹{dp.walletBalance?.toFixed(0) || 0}
//                       </p>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {deliveryPersons.length === 0 && (
//             <div className="text-center py-20">
//               <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
//                 <span className="text-3xl">📦</span>
//               </div>
//               <h3 className="text-2xl font-bold text-gray-900 mb-2">
//                 No Delivery Persons
//               </h3>
//               <p className="text-gray-500">No delivery persons found.</p>
//             </div>
//           )}
//         </div>
//       </div>
//     );
//   }

//   // 2. Dashboard View (Original logic with simple clean design)
//   return (
//     <div className=" bg-slate-100 p-4 rounded-lg ">
//       <div className="">
//         {/* Back Button & Header */}
//         <div className="flex items-center justify-between mb-8">
//           <button
//             onClick={goBackToList}
//             className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-xl hover:shadow-lg transition-all text-gray-700 font-medium"
//           >
//             <svg
//               className="w-5 h-5"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M15 19l-7-7 7-7"
//               />
//             </svg>
//             Back
//           </button>

//           <div>
//             <h1 className="text-3xl font-bold text-gray-900">
//               {selectedDP.fullName}
//             </h1>
//             <p className="text-gray-600">{selectedDP.deliveryBoyId}</p>
//           </div>
//         </div>

//         {selectedDP && dashboardData && (
//           <>
//             {/* Summary Cards - Simple */}
//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
//                 <div className="flex items-center gap-4">
//                   <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
//                     <span className="text-emerald-600 text-xl">₹</span>
//                   </div>
//                   <div>
//                     <p className="text-sm font-medium text-emerald-800">
//                       Total COD Collected
//                     </p>
//                     <p className="text-2xl font-bold text-emerald-900 mt-1">
//                       ₹{dashboardData.totalCODCollected?.toFixed(0) || 0}
//                     </p>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-indigo-800">
//                       Given to Admin
//                     </p>
//                     <p className="text-2xl font-bold text-indigo-900 mt-1">
//                       ₹{dashboardData.givenToAdmin?.toFixed(0) || 0}
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
//                     <span className="text-indigo-600 text-xl">✓</span>
//                   </div>
//                 </div>
//               </div>

//               <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-sm font-medium text-orange-800">
//                       Pending to Admin
//                     </p>
//                     <p className="text-2xl font-bold text-orange-900 mt-1">
//                       ₹{dashboardData.pendingToAdmin?.toFixed(0) || 0}
//                     </p>
//                   </div>
//                   <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
//                     <span className="text-orange-600 text-xl">!</span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             {/* Current Status Cards */}
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
//               <div className="bg-white p-6 rounded-2xl shadow-md text-center">
//                 <p className="text-sm text-gray-500 mb-2">Cash in Hand</p>
//                 <p className="text-2xl font-bold text-emerald-600">
//                   ₹{selectedDP.cashInHand?.toFixed(0) || 0}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md text-center">
//                 <p className="text-sm text-gray-500 mb-2">Wallet Balance</p>
//                 <p className="text-2xl font-bold text-blue-600">
//                   ₹{selectedDP.walletBalance?.toFixed(0) || 0}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md text-center">
//                 <p className="text-sm text-gray-500 mb-2">Delivery Boy ID</p>
//                 <p className="text-lg font-semibold">
//                   {selectedDP.deliveryBoyId}
//                 </p>
//               </div>
//               <div className="bg-white p-6 rounded-2xl shadow-md text-center">
//                 <p className="text-sm text-gray-500 mb-2">Name</p>
//                 <p className="text-lg font-semibold">{selectedDP.fullName}</p>
//               </div>
//             </div>

//             {/* Action Buttons */}
//             <div className="flex flex-wrap gap-3 justify-end mb-8">
//               <button
//                 onClick={() => setShowSettlement(true)}
//                 disabled={selectedDP.cashInHand === 0}
//                 className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
//               >
//                 Admin Settlement (₹{selectedDP.cashInHand?.toFixed(0)})
//               </button>
//               <button
//                 onClick={() => setShowCredit(true)}
//                 className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
//               >
//                 Wallet Credit
//               </button>
//               <button
//                 onClick={() => setShowDebit(true)}
//                 disabled={selectedDP.walletBalance === 0}
//                 className="px-6 py-3 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all"
//               >
//                 Wallet Debit (₹{selectedDP.walletBalance?.toFixed(0)})
//               </button>
//             </div>

//             {/* Filters - Same as original but cleaner */}
//             <div className="bg-white rounded-2xl shadow-md p-6 mb-6">
//               <div className="flex flex-wrap items-end gap-4">
//                 <div className="flex flex-wrap gap-4">
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Type
//                     </label>
//                     <select
//                       className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                       value={filters.type}
//                       onChange={(e) =>
//                         handleFilterChange("type", e.target.value)
//                       }
//                     >
//                       <option value="">All Types</option>
//                       <option value="COD_COLLECTED">COD Collected</option>
//                       <option value="ADMIN_SETTLEMENT">Admin Settlement</option>
//                       <option value="WALLET_CREDIT">Wallet Credit</option>
//                       <option value="WALLET_DEBIT">Wallet Debit</option>
//                     </select>
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       Start Date
//                     </label>
//                     <input
//                       type="date"
//                       className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                       value={filters.startDate}
//                       onChange={(e) =>
//                         handleFilterChange("startDate", e.target.value)
//                       }
//                     />
//                   </div>
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 mb-2">
//                       End Date
//                     </label>
//                     <input
//                       type="date"
//                       className="px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
//                       value={filters.endDate}
//                       onChange={(e) =>
//                         handleFilterChange("endDate", e.target.value)
//                       }
//                     />
//                   </div>
//                 </div>
//                 <div className="flex gap-2">
//                   <button
//                     onClick={applyFilters}
//                     className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md"
//                   >
//                     Apply
//                   </button>
//                   <button
//                     onClick={resetFilters}
//                     className="px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
//                   >
//                     Reset
//                   </button>
//                 </div>
//               </div>
//             </div>

//             {/* Transactions Table - Original styling */}
//             <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-8">
//               <div className="px-6 py-4 bg-gray-50">
//                 <h3 className="text-lg font-semibold text-gray-900">
//                   Transaction History
//                 </h3>
//               </div>
//               <div className="overflow-x-auto">
//                 <table className="w-full">
//                   <thead>
//                     <tr className="bg-gray-50">
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Date
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Type
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Amount
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Order
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Note
//                       </th>
//                       <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Reference
//                       </th>
//                       <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                         Action
//                       </th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-gray-200">
//                     {transactions.map((tx) => (
//                       <tr key={tx._id} className="hover:bg-gray-50">
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                           {new Date(tx.createdAt).toLocaleString()}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap">
//                           <span
//                             className={`px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
//                               tx.type
//                             )}`}
//                           >
//                             {tx.type.replace(/_/g, " ")}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
//                           ₹{tx.amount.toFixed(2)}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
//                           {tx.order
//                             ? `${tx.order.coId || "N/A"} · ₹${
//                                 tx.order.payableAmount
//                               }`
//                             : "-"}
//                         </td>
//                         <td
//                           className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate"
//                           title={tx.note}
//                         >
//                           {tx.note || "-"}
//                         </td>
//                         <td className="px-6 py-4 text-sm text-gray-600">
//                           {tx.referenceNo || "-"}
//                         </td>
//                         <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                           <button
//                             onClick={() => openViewModal(tx)}
//                             className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-lg hover:bg-blue-50 transition-colors"
//                           >
//                             View
//                           </button>
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//               {pagination.totalPages > 1 && (
//                 <div className="px-6 py-4 bg-gray-50 flex items-center justify-between">
//                   <div className="text-sm text-gray-700">
//                     Showing{" "}
//                     {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
//                     {Math.min(
//                       pagination.currentPage * pagination.limit,
//                       pagination.totalRecords
//                     )}{" "}
//                     of {pagination.totalRecords} results
//                   </div>
//                   <div className="flex gap-1">
//                     <button
//                       onClick={() =>
//                         handlePageChange(pagination.currentPage - 1)
//                       }
//                       disabled={pagination.currentPage === 1}
//                       className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                     >
//                       Previous
//                     </button>
//                     <span className="px-3 py-2 text-sm font-medium">
//                       Page {pagination.currentPage} of {pagination.totalPages}
//                     </span>
//                     <button
//                       onClick={() =>
//                         handlePageChange(pagination.currentPage + 1)
//                       }
//                       disabled={
//                         pagination.currentPage === pagination.totalPages
//                       }
//                       className="px-3 py-2 text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
//                     >
//                       Next
//                     </button>
//                   </div>
//                 </div>
//               )}
//             </div>
//           </>
//         )}

//         {/* All Modals - Same as original but with shadow-md instead of borders */}
//         {showViewModal && selectedTransaction && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="px-6 py-5 bg-gray-50">
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-xs text-gray-500 uppercase tracking-wide">
//                       Transaction Details
//                     </p>
//                     <h2 className="text-xl font-bold text-gray-900 mt-1">
//                       #{selectedTransaction._id.slice(-8).toUpperCase()}
//                     </h2>
//                   </div>
//                   <button
//                     onClick={() => setShowViewModal(false)}
//                     className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
//                   >
//                     <span className="text-xl">×</span>
//                   </button>
//                 </div>
//               </div>
//               <div className="p-6 space-y-6">
//                 <div className="flex items-center justify-between">
//                   <span
//                     className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(
//                       selectedTransaction.type
//                     )}`}
//                   >
//                     {selectedTransaction.type.replace(/_/g, " ")}
//                   </span>
//                   <span className="text-3xl font-bold text-gray-900">
//                     ₹{selectedTransaction.amount.toFixed(2)}
//                   </span>
//                 </div>
//                 <div className="grid grid-cols-2 gap-6 text-sm">
//                   <div>
//                     <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                       Date & Time
//                     </p>
//                     <p className="font-semibold text-gray-900">
//                       {new Date(selectedTransaction.createdAt).toLocaleString()}
//                     </p>
//                   </div>
//                   {selectedTransaction.order && (
//                     <div>
//                       <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                         Order
//                       </p>
//                       <div className="space-y-1">
//                         <p className="font-semibold">
//                           {selectedTransaction.order.coId}
//                         </p>
//                         <p className="text-xs text-gray-600">
//                           ₹{selectedTransaction.order.payableAmount} •{" "}
//                           {selectedTransaction.order.orderStatus}
//                         </p>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2">
//                     Note
//                   </p>
//                   <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-xl">
//                     {selectedTransaction.note || "No note provided"}
//                   </p>
//                 </div>
//                 <div className="text-xs text-gray-500 space-y-1">
//                   <p>
//                     <span className="font-semibold">Delivery Person:</span>{" "}
//                     {selectedDP?.fullName} ({selectedDP?.deliveryBoyId})
//                   </p>
//                   {selectedTransaction.referenceNo && (
//                     <p>
//                       <span className="font-semibold">Reference:</span>{" "}
//                       {selectedTransaction.referenceNo}
//                     </p>
//                   )}
//                 </div>
//               </div>
//               <div className="px-6 py-4 bg-gray-50">
//                 <button
//                   onClick={() => setShowViewModal(false)}
//                   className="w-full py-3 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
//                 >
//                   Close
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Settlement, Credit, Debit Modals - Same styling changes */}
//         {showSettlement && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="px-6 py-5 bg-emerald-50">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Admin Settlement
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Receive cash from delivery person
//                 </p>
//               </div>
//               <form onSubmit={handleSettlementSubmit} className="p-6 space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Amount{" "}
//                     <span className="text-emerald-600 font-semibold">
//                       (Max: ₹{selectedDP?.cashInHand?.toFixed(0)})
//                     </span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     max={selectedDP?.cashInHand}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
//                     value={settlementForm.amount}
//                     onChange={(e) =>
//                       setSettlementForm({
//                         ...settlementForm,
//                         amount: e.target.value,
//                       })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Settlement Mode
//                   </label>
//                   <select
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
//                     value={settlementForm.mode}
//                     onChange={(e) =>
//                       setSettlementForm({
//                         ...settlementForm,
//                         mode: e.target.value,
//                       })
//                     }
//                   >
//                     <option value="CASH">Cash</option>
//                     <option value="UPI">UPI</option>
//                     <option value="BANK">Bank Transfer</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Remark (Optional)
//                   </label>
//                   <textarea
//                     rows="3"
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-vertical"
//                     value={settlementForm.remark}
//                     onChange={(e) =>
//                       setSettlementForm({
//                         ...settlementForm,
//                         remark: e.target.value,
//                       })
//                     }
//                     placeholder="Any additional notes..."
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="submit"
//                     className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all"
//                   >
//                     Confirm Settlement
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowSettlement(false)}
//                     className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {/* Similar changes for Credit and Debit modals */}
//         {showCredit && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="px-6 py-5 bg-blue-50">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Wallet Credit
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Add commission or incentive
//                 </p>
//               </div>
//               <form onSubmit={handleCreditSubmit} className="p-6 space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Amount
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
//                     value={creditForm.amount}
//                     onChange={(e) =>
//                       setCreditForm({ ...creditForm, amount: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Reason
//                   </label>
//                   <textarea
//                     rows="3"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-vertical"
//                     value={creditForm.note}
//                     onChange={(e) =>
//                       setCreditForm({ ...creditForm, note: e.target.value })
//                     }
//                     placeholder="Commission, incentive, bonus..."
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="submit"
//                     className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all"
//                   >
//                     Credit Wallet
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowCredit(false)}
//                     className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}

//         {showDebit && (
//           <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
//             <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
//               <div className="px-6 py-5 bg-rose-50">
//                 <h2 className="text-xl font-bold text-gray-900">
//                   Wallet Debit
//                 </h2>
//                 <p className="text-sm text-gray-600 mt-1">
//                   Deduct penalty or adjustment
//                 </p>
//               </div>
//               <form onSubmit={handleDebitSubmit} className="p-6 space-y-5">
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Amount{" "}
//                     <span className="text-rose-600 font-semibold">
//                       (Max: ₹{selectedDP?.walletBalance?.toFixed(0)})
//                     </span>
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     max={selectedDP?.walletBalance}
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
//                     value={debitForm.amount}
//                     onChange={(e) =>
//                       setDebitForm({ ...debitForm, amount: e.target.value })
//                     }
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 mb-2">
//                     Reason
//                   </label>
//                   <textarea
//                     rows="3"
//                     required
//                     className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 resize-vertical"
//                     value={debitForm.note}
//                     onChange={(e) =>
//                       setDebitForm({ ...debitForm, note: e.target.value })
//                     }
//                     placeholder="Penalty, adjustment, fine..."
//                   />
//                 </div>
//                 <div className="flex gap-3 pt-2">
//                   <button
//                     type="submit"
//                     className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 shadow-md hover:shadow-lg transition-all"
//                   >
//                     Debit Wallet
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => setShowDebit(false)}
//                     className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
//                   >
//                     Cancel
//                   </button>
//                 </div>
//               </form>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default AdminDeliveryAccounting;
import React, { useState, useEffect } from "react";import api from '@/utils/api';
import {
  ArrowLeft,
  Truck,
  IndianRupee,
  Check,
  AlertCircle,
  Users,
  Wallet,
  Calendar,
  Filter,
  Search,
  Eye,
  X,
  CreditCard,
  UserCheck,
} from "lucide-react";

const AdminDeliveryAccounting = () => {
  // Core states
  const [viewMode, setViewMode] = useState("list"); // 'list' or 'dashboard'
  const [selectedDP, setSelectedDP] = useState(null);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [dashboardData, setDashboardData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [pagination, setPagination] = useState({});

  // Filters
  const [filters, setFilters] = useState({
    type: "",
    startDate: "",
    endDate: "",
    page: 1,
    limit: 25,
  });

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  // Modals
  const [showSettlement, setShowSettlement] = useState(false);
  const [showCredit, setShowCredit] = useState(false);
  const [showDebit, setShowDebit] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  // Form states
  const [settlementForm, setSettlementForm] = useState({
    amount: "",
    mode: "CASH",
    remark: "",
  });
  const [creditForm, setCreditForm] = useState({ amount: "", note: "" });
  const [debitForm, setDebitForm] = useState({ amount: "", note: "" });

  // Load delivery persons on mount
  useEffect(() => {
    loadDeliveryPersons();
  }, []);

  // Load dashboard when DP changes
  useEffect(() => {
    if (selectedDP && viewMode === "dashboard") {
      loadDashboard(selectedDP._id);
      loadTransactions(selectedDP._id);
    }
  }, [selectedDP, viewMode]);

  const loadDeliveryPersons = async () => {
    try {
      const res = await api.get(
        "/api/delivery-persons/getAllDeliveryPersons",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setDeliveryPersons(res.data.data || []);
    } catch (err) {
      console.error("Failed to load delivery persons");
    }
  };

  const loadDashboard = async (dpId) => {
    try {
      const res = await api.get(`/api/deliveryaccounting/dashboard/${dpId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDashboardData(res.data);
    } catch (err) {
      console.error("Failed to load dashboard");
    }
  };

  const loadTransactions = async (dpId) => {
    try {
      const res = await api.get(
        `/api/deliveryaccounting/transactionsForAdmin/${dpId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setTransactions(res.data.data);
      setPagination(res.data.pagination);
    } catch (err) {
      console.error("Failed to load transactions");
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const applyFilters = () => {
    if (selectedDP) loadTransactions(selectedDP._id);
  };

  const resetFilters = () => {
    const resetFilters = {
      type: "",
      startDate: "",
      endDate: "",
      page: 1,
      limit: 10,
    };
    setFilters(resetFilters);
    if (selectedDP) loadTransactions(selectedDP._id);
  };

  const handlePageChange = (page) => {
    const newFilters = { ...filters, page };
    setFilters(newFilters);
    if (selectedDP) loadTransactions(selectedDP._id);
  };

  const openViewModal = (transaction) => {
    setSelectedTransaction(transaction);
    setShowViewModal(true);
  };

  const reloadData = () => {
    if (selectedDP) {
      loadDashboard(selectedDP._id);
      loadTransactions(selectedDP._id);
    }
  };

  // Form handlers (same as original)
  const handleSettlementSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/deliveryaccounting/admin-settlement",
        {
          deliveryPersonId: selectedDP._id,
          amount: Number(settlementForm.amount),
          mode: settlementForm.mode,
          remark: settlementForm.remark,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowSettlement(false);
      reloadData();
      setSettlementForm({ amount: "", mode: "CASH", remark: "" });
    } catch (err) {
      alert(err.response?.data?.message || "Settlement failed");
    }
  };

  const handleCreditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/deliveryaccounting/wallet-credit",
        {
          deliveryPersonId: selectedDP._id,
          amount: Number(creditForm.amount),
          note: creditForm.note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowCredit(false);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.message || "Credit failed");
    }
  };

  const handleDebitSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post(
        "/api/deliveryaccounting/wallet-debit",
        {
          deliveryPersonId: selectedDP._id,
          amount: Number(debitForm.amount),
          note: debitForm.note,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setShowDebit(false);
      reloadData();
    } catch (err) {
      alert(err.response?.data?.message || "Debit failed");
    }
  };

  const getTypeBadgeClass = (type) => {
    const classes = {
      COD_COLLECTED: "bg-emerald-100 text-emerald-800",
      ADMIN_SETTLEMENT: "bg-indigo-100 text-indigo-800",
      WALLET_CREDIT: "bg-blue-100 text-blue-800",
      WALLET_DEBIT: "bg-rose-100 text-rose-800",
    };
    return classes[type] || "bg-gray-100 text-gray-800";
  };

  const selectDeliveryPerson = (dp) => {
    setSelectedDP(dp);
    setViewMode("dashboard");
  };

  const goBackToList = () => {
    setSelectedDP(null);
    setViewMode("list");
    setDashboardData(null);
    setTransactions([]);
  };

  // 1. Delivery Persons List View (Simple Cards)
  if (viewMode === "list") {
    return (
      <div className="bg-slate-100 p-4 rounded-lg">
        <div className="">
          {/* Header */}
          <div className=" mb-4">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Delivery Accounting
            </h1>
            <p className="text-gray-600 text-lg">
              Click on any delivery person to view their dashboard
            </p>
          </div>

          {/* Delivery Persons Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {deliveryPersons.map((dp) => (
              <div
                key={dp._id}
                onClick={() => selectDeliveryPerson(dp)}
                className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer group"
              >
                <div className="w-16 h-16 bg-emerald-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                  <Truck className="w-8 h-8 text-white" />
                </div>

                <div className="text-center space-y-3">
                  <h3 className="text-xl font-bold text-gray-900">
                    {dp.fullName}
                  </h3>
                  <p className="text-sm bg-gray-100 text-gray-800 px-3 py-1 rounded-full inline-block">
                    {dp.deliveryBoyId}
                  </p>

                  <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Cash
                      </p>
                      <p className="text-lg font-bold text-emerald-600">
                        ₹{dp.cashInHand?.toFixed(0) || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase tracking-wide">
                        Wallet
                      </p>
                      <p className="text-lg font-bold text-blue-600">
                        ₹{dp.walletBalance?.toFixed(0) || 0}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {deliveryPersons.length === 0 && (
            <div className="text-center py-20">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                No Delivery Persons
              </h3>
              <p className="text-gray-500">No delivery persons found.</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // 2. Dashboard View (Mobile Responsive + Lucide Icons)
  return (
    <div className="bg-slate-100 p-4 rounded-lg">
      <div className="">
        {/* Back Button & Header - Mobile Stacked */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-4">
          <button
            onClick={goBackToList}
            className="flex items-center gap-2 px-4 py-2 bg-white shadow-md rounded-xl hover:shadow-lg transition-all text-gray-700 font-medium w-fit sm:w-auto"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="hidden sm:inline">Back</span>
          </button>

          {/* Action Buttons - Mobile: Stacked */}
          <div className="grid grid-cols-1 sm:flex sm:flex-wrap gap-4  items-center  justify-end mb-8">
            <div className="text-center sm:text-left">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                {selectedDP.fullName}
              </h1>
              <p className="text-gray-600 text-sm text-end">
                {selectedDP.deliveryBoyId}
              </p>
            </div>
            <button
              onClick={() => setShowSettlement(true)}
              disabled={selectedDP.cashInHand === 0}
              className="px-6 py-3 rounded-xl bg-emerald-600 text-white font-medium hover:bg-emerald-700 disabled:bg-emerald-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all order-2 sm:order-1"
            >
              Admin Settlement (₹{selectedDP.cashInHand?.toFixed(0)})
            </button>
            {/* <button
              onClick={() => setShowCredit(true)}
              className="px-6 py-3 rounded-xl bg-blue-600 text-white font-medium hover:bg-blue-700 shadow-md hover:shadow-lg transition-all order-1 sm:order-2"
            >
              Wallet Credit
            </button>
            <button
              onClick={() => setShowDebit(true)}
              disabled={selectedDP.walletBalance === 0}
              className="px-6 py-3 rounded-xl bg-rose-600 text-white font-medium hover:bg-rose-700 disabled:bg-rose-300 disabled:cursor-not-allowed shadow-md hover:shadow-lg transition-all order-3"
            >
              Wallet Debit (₹{selectedDP.walletBalance?.toFixed(0)})
            </button> */}
          </div>
        </div>

        {selectedDP && dashboardData && (
          <>
            {/* Summary Cards - Mobile: 1 col, Desktop: 3 col */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-4">
              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-emerald-800">
                      Total COD Collected
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-emerald-900 mt-1">
                      ₹{dashboardData.totalCODCollected?.toFixed(0) || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center p-1">
                    <IndianRupee className="w-6 h-6 text-emerald-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-800">
                      Given to Admin
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-indigo-900 mt-1">
                      ₹{dashboardData.givenToAdmin?.toFixed(0) || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center p-1">
                    <Check className="w-6 h-6 text-indigo-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-md hover:shadow-lg transition-all">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-orange-800">
                      Pending to Admin
                    </p>
                    <p className="text-2xl sm:text-3xl font-bold text-orange-900 mt-1">
                      ₹{dashboardData.pendingToAdmin?.toFixed(0) || 0}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center p-1">
                    <AlertCircle className="w-6 h-6 text-orange-600" />
                  </div>
                </div>
              </div>
            </div>

            {/* Current Status Cards - Mobile: 2 col, Desktop: 4 col */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 mb-4">
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
                <IndianRupee className="w-6 h-6 mx-auto mb-2 text-emerald-600" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Cash in Hand
                </p>
                <p className="text-xl sm:text-2xl font-bold text-emerald-600">
                  ₹{selectedDP.cashInHand?.toFixed(0) || 0}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
                <Wallet className="w-6 h-6 mx-auto mb-2 text-blue-600" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Wallet Balance
                </p>
                <p className="text-xl sm:text-2xl font-bold text-blue-600">
                  ₹{selectedDP.walletBalance?.toFixed(0) || 0}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
                <Users className="w-6 h-6 mx-auto mb-2 text-gray-600" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">
                  Delivery Boy ID
                </p>
                <p className="text-sm sm:text-lg font-semibold">
                  {selectedDP.deliveryBoyId}
                </p>
              </div>
              <div className="bg-white p-4 sm:p-6 rounded-2xl shadow-md text-center">
                <UserCheck className="w-6 h-6 mx-auto mb-2 text-indigo-600" />
                <p className="text-xs sm:text-sm text-gray-500 mb-2">Name</p>
                <p className="text-sm sm:text-lg font-semibold">
                  {selectedDP.fullName}
                </p>
              </div>
            </div>

            {/* Filters - Mobile: Full width stacked */}
            <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 mb-4">
              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-end gap-4">
                <div className="flex flex-col sm:flex-row flex-1 gap-4 w-full sm:w-auto">
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Filter className="w-4 h-4" />
                      Type
                    </label>
                    <select
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                      value={filters.type}
                      onChange={(e) =>
                        handleFilterChange("type", e.target.value)
                      }
                    >
                      <option value="">All Types</option>
                      <option value="COD_COLLECTED">COD Collected</option>
                      <option value="ADMIN_SETTLEMENT">Admin Settlement</option>
                      <option value="WALLET_CREDIT">Wallet Credit</option>
                      <option value="WALLET_DEBIT">Wallet Debit</option>
                    </select>
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      Start Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                      value={filters.startDate}
                      onChange={(e) =>
                        handleFilterChange("startDate", e.target.value)
                      }
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                      <Calendar className="w-4 h-4" />
                      End Date
                    </label>
                    <input
                      type="date"
                      className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 text-sm"
                      value={filters.endDate}
                      onChange={(e) =>
                        handleFilterChange("endDate", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    onClick={applyFilters}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 shadow-md"
                  >
                    Apply
                  </button>
                  <button
                    onClick={resetFilters}
                    className="flex-1 sm:flex-none px-6 py-2.5 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300"
                  >
                    Reset
                  </button>
                </div>
              </div>
            </div>

            {/* Transactions Table - Mobile Cards */}
            <div className="bg-white rounded-2xl shadow-md overflow-hidden mb-4">
              <div className="px-4 sm:px-6 py-4 bg-gray-50 flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Transaction History
                </h3>
                <span className="text-sm text-gray-500 hidden sm:inline">
                  {transactions.length} transactions
                </span>
              </div>

              {/* Mobile: Cards | Desktop: Table */}
              <div className="block sm:hidden">
                <div className="divide-y divide-gray-100">
                  {transactions.map((tx) => (
                    <div
                      key={tx._id}
                      className="p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="flex flex-col items-center gap-1">
                            <div className="w-12 h-12 bg-linear-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                              <Calendar className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="text-xs text-gray-500 text-center leading-tight">
                              {new Date(tx.createdAt).toLocaleDateString()}
                            </span>
                            <span className="text-xs text-gray-400 text-center leading-tight">
                              {new Date(tx.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </span>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                                  tx.type
                                )}`}
                              >
                                {tx.type.replace(/_/g, " ").toLowerCase()}
                              </span>
                            </div>
                            <p className="text-sm font-semibold text-gray-900 mb-1 truncate">
                              {tx.order
                                ? `${tx.order.coId || "N/A"} · ₹${
                                    tx.order.payableAmount
                                  }`
                                : "No order"}
                            </p>
                            {tx.note && (
                              <p
                                className="text-xs text-gray-500 mb-1 line-clamp-2"
                                title={tx.note}
                              >
                                {tx.note}
                              </p>
                            )}
                            {tx.referenceNo && (
                              <p className="text-xs text-gray-400 flex items-center gap-1">
                                <CreditCard className="w-3 h-3" />
                                {tx.referenceNo}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="text-right ml-4">
                          <p className="text-2xl font-bold text-gray-900 mb-1">
                            ₹{tx.amount.toFixed(2)}
                          </p>
                          <button
                            onClick={() => openViewModal(tx)}
                            className="flex items-center gap-1 text-blue-600 hover:text-blue-900 px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors text-sm font-medium"
                          >
                            <Eye className="w-4 h-4" />
                            View
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Desktop Table */}
              <div className="hidden sm:block">
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[600px]">
                    <thead>
                      <tr className="bg-gray-50">
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          Date
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Type
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-20">
                          Amount
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                          Order
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                          Note
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-20 hidden sm:table-cell">
                          Ref
                        </th>
                        <th className="px-4 sm:px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider w-16">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {transactions.map((tx) => (
                        <tr key={tx._id} className="hover:bg-gray-50">
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-900">
                            {new Date(tx.createdAt).toLocaleString()}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap">
                            <span
                              className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${getTypeBadgeClass(
                                tx.type
                              )}`}
                            >
                              {tx.type.replace(/_/g, " ")}
                            </span>
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 text-right">
                            ₹{tx.amount.toFixed(2)}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-xs sm:text-sm text-gray-600">
                            {tx.order
                              ? `${tx.order.coId || "N/A"} · ₹${
                                  tx.order.payableAmount
                                }`
                              : "-"}
                          </td>
                          <td
                            className="px-4 sm:px-6 py-4 text-xs text-gray-600 max-w-xs truncate hidden md:table-cell"
                            title={tx.note}
                          >
                            {tx.note || "-"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 text-xs text-gray-600 hidden sm:table-cell">
                            {tx.referenceNo || "-"}
                          </td>
                          <td className="px-4 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              onClick={() => openViewModal(tx)}
                              className="flex items-center gap-1 text-blue-600 hover:text-blue-900 px-2 py-1 rounded-lg hover:bg-blue-50 transition-colors w-full sm:w-auto justify-center"
                            >
                              <Eye className="w-4 h-4" />
                              <span className="hidden sm:inline">View</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {pagination.totalPages > 1 && (
                <div className="px-4 sm:px-6 py-4 bg-gray-50 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="text-xs sm:text-sm text-gray-700 text-center sm:text-left">
                    Showing{" "}
                    {(pagination.currentPage - 1) * pagination.limit + 1} to{" "}
                    {Math.min(
                      pagination.currentPage * pagination.limit,
                      pagination.totalRecords
                    )}{" "}
                    of {pagination.totalRecords} results
                  </div>
                  <div className="flex gap-1 w-full sm:w-auto justify-center sm:justify-end">
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage - 1)
                      }
                      disabled={pagination.currentPage === 1}
                      className="px-3 py-2 text-xs sm:text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                      Previous
                    </button>
                    <span className="px-3 py-2 text-xs sm:text-sm font-medium flex items-center justify-center min-w-[100px]">
                      Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <button
                      onClick={() =>
                        handlePageChange(pagination.currentPage + 1)
                      }
                      disabled={
                        pagination.currentPage === pagination.totalPages
                      }
                      className="px-3 py-2 text-xs sm:text-sm border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100 flex-1 sm:flex-none"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {/* All Modals - Enhanced with Icons */}
        {showViewModal && selectedTransaction && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-gray-50">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-500 uppercase tracking-wide flex items-center gap-1">
                      <Eye className="w-4 h-4" />
                      Transaction Details
                    </p>
                    <h2 className="text-xl font-bold text-gray-900 mt-1">
                      #{selectedTransaction._id.slice(-8).toUpperCase()}
                    </h2>
                  </div>
                  <button
                    onClick={() => setShowViewModal(false)}
                    className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeBadgeClass(
                      selectedTransaction.type
                    )}`}
                  >
                    {selectedTransaction.type.replace(/_/g, " ")}
                  </span>
                  <span className="text-3xl font-bold text-gray-900">
                    ₹{selectedTransaction.amount.toFixed(2)}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-6 text-sm">
                  <div>
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                      <Calendar className="w-4 h-4 inline" />
                      Date & Time
                    </p>
                    <p className="font-semibold text-gray-900">
                      {new Date(selectedTransaction.createdAt).toLocaleString()}
                    </p>
                  </div>
                  {selectedTransaction.order && (
                    <div>
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                        <Search className="w-4 h-4 inline" />
                        Order
                      </p>
                      <div className="space-y-1">
                        <p className="font-semibold">
                          {selectedTransaction.order.coId}
                        </p>
                        <p className="text-xs text-gray-600">
                          ₹{selectedTransaction.order.payableAmount} •{" "}
                          {selectedTransaction.order.orderStatus}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1">
                    Note
                  </p>
                  <p className="text-sm text-gray-900 bg-gray-50 p-3 rounded-xl">
                    {selectedTransaction.note || "No note provided"}
                  </p>
                </div>
                <div className="text-xs text-gray-500 space-y-1">
                  <p className="flex items-center gap-1">
                    <UserCheck className="w-4 h-4 text-gray-700" />
                    <span className="font-semibold">Delivery Person:</span>{" "}
                    {selectedDP?.fullName} ({selectedDP?.deliveryBoyId})
                  </p>
                  {selectedTransaction.referenceNo && (
                    <p className="flex items-center gap-1">
                      <CreditCard className="w-4 h-4 text-gray-700" />
                      <span className="font-semibold">Reference:</span>{" "}
                      {selectedTransaction.referenceNo}
                    </p>
                  )}
                </div>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                <button
                  onClick={() => setShowViewModal(false)}
                  className="w-full py-3 bg-white rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  <X className="w-4 h-4" />
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Settlement Modal */}
        {showSettlement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-emerald-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-emerald-600" />
                  Admin Settlement
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Receive cash from delivery person
                </p>
              </div>
              <form onSubmit={handleSettlementSubmit} className="p-6 space-y-5">
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Amount
                    <span className="text-emerald-600 font-semibold">
                      (Max: ₹{selectedDP?.cashInHand?.toFixed(0)})
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedDP?.cashInHand}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    value={settlementForm.amount}
                    onChange={(e) =>
                      setSettlementForm({
                        ...settlementForm,
                        amount: e.target.value,
                      })
                    }
                  />
                </div>
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Settlement Mode
                  </label>
                  <select
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500"
                    value={settlementForm.mode}
                    onChange={(e) =>
                      setSettlementForm({
                        ...settlementForm,
                        mode: e.target.value,
                      })
                    }
                  >
                    <option value="CASH">Cash</option>
                    <option value="UPI">UPI</option>
                    <option value="BANK">Bank Transfer</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Remark (Optional)
                  </label>
                  <textarea
                    rows="3"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-emerald-500 resize-vertical"
                    value={settlementForm.remark}
                    onChange={(e) =>
                      setSettlementForm({
                        ...settlementForm,
                        remark: e.target.value,
                      })
                    }
                    placeholder="Any additional notes..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-emerald-600 text-white rounded-xl font-semibold hover:bg-emerald-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Confirm Settlement
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowSettlement(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Credit Modal */}
        {showCredit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-blue-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-blue-600" />
                  Wallet Credit
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Add commission or incentive
                </p>
              </div>
              <form onSubmit={handleCreditSubmit} className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Amount
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500"
                    value={creditForm.amount}
                    onChange={(e) =>
                      setCreditForm({ ...creditForm, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 resize-vertical"
                    value={creditForm.note}
                    onChange={(e) =>
                      setCreditForm({ ...creditForm, note: e.target.value })
                    }
                    placeholder="Commission, incentive, bonus..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Credit Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowCredit(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Debit Modal */}
        {showDebit && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden">
              <div className="px-6 py-5 bg-rose-50">
                <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <IndianRupee className="w-6 h-6 text-rose-600" />
                  Wallet Debit
                </h2>
                <p className="text-sm text-gray-600 mt-1">
                  Deduct penalty or adjustment
                </p>
              </div>
              <form onSubmit={handleDebitSubmit} className="p-6 space-y-5">
                <div>
                  <label className=" text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    Amount{" "}
                    <span className="text-rose-600 font-semibold">
                      (Max: ₹{selectedDP?.walletBalance?.toFixed(0)})
                    </span>
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max={selectedDP?.walletBalance}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500"
                    value={debitForm.amount}
                    onChange={(e) =>
                      setDebitForm({ ...debitForm, amount: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Reason
                  </label>
                  <textarea
                    rows="3"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-rose-500 resize-vertical"
                    value={debitForm.note}
                    onChange={(e) =>
                      setDebitForm({ ...debitForm, note: e.target.value })
                    }
                    placeholder="Penalty, adjustment, fine..."
                  />
                </div>
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-rose-600 text-white rounded-xl font-semibold hover:bg-rose-700 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <Check className="w-5 h-5" />
                    Debit Wallet
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowDebit(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 flex items-center justify-center gap-2"
                  >
                    <X className="w-5 h-5" />
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDeliveryAccounting;
