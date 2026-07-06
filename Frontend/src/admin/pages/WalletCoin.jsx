// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { toast, ToastContainer } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const WalletCoin = () => {
//   const authData = JSON.parse(sessionStorage.getItem("admin"));
//   const adminToken = authData?.token;

//   const authHeader = {
//     headers: {
//       Authorization: `Bearer ${adminToken}`,
//     },
//   };

//   const [rules, setRules] = useState([]);
//   const [loading, setLoading] = useState(false);

//   const [form, setForm] = useState({
//     minAmount: "",
//     maxAmount: "",
//     coins: "",
//   });

//   const [editId, setEditId] = useState(null);

//   // 🔐 Redirect if token missing
//   useEffect(() => {
//     if (!adminToken) {
//       window.location.href = "mmart/panel/login";
//     }
//   }, [adminToken]);

//   // ================= FETCH RULES =================
//   const fetchRules = async () => {
//     try {
//       setLoading(true);
//       const res = await axios.get("/api/coins/all", authHeader);
//       setRules(res.data.data || []);
//     } catch (err) {
//       toast.error("Unauthorized or failed to load coin rules");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRules();
//   }, []);

//   // ================= INPUT CHANGE =================
//   const handleChange = (e) => {
//     setForm({ ...form, [e.target.name]: e.target.value });
//   };

//   // ================= CREATE / UPDATE =================
//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!form.minAmount || !form.maxAmount || !form.coins) {
//       return toast.warning("All fields are required");
//     }

//     try {
//       if (editId) {
//         await axios.put(`/api/coins/update/${editId}`, form, authHeader);
//         toast.success("Coin rule updated successfully");
//       } else {
//         await axios.post("/api/coins/create", form, authHeader);
//         toast.success("Coin rule created successfully");
//       }

//       setForm({ minAmount: "", maxAmount: "", coins: "" });
//       setEditId(null);
//       fetchRules();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Operation failed");
//     }
//   };

//   // ================= EDIT =================
//   const handleEdit = (rule) => {
//     setEditId(rule._id);
//     setForm({
//       minAmount: rule.minAmount,
//       maxAmount: rule.maxAmount,
//       coins: rule.coins,
//     });
//   };

//   // ================= DELETE =================
//   const handleDelete = async (id) => {
//     if (!window.confirm("Are you sure you want to delete this rule?")) return;

//     try {
//       await axios.delete(`/api/coins/delete/${id}`, authHeader);
//       toast.success("Rule deleted successfully");
//       fetchRules();
//     } catch (err) {
//       toast.error("Delete failed");
//     }
//   };

//   // ================= TOGGLE ACTIVE =================
//   const toggleActive = async (rule) => {
//     try {
//       await axios.put(
//         `/api/coins/update/${rule._id}`,
//         { isActive: !rule.isActive },
//         authHeader
//       );
//       toast.success("Status updated");
//       fetchRules();
//     } catch (err) {
//       toast.error("Failed to update status");
//     }
//   };

//   return (
//     <div className="p-2 max-w-full mx-auto">
//       <ToastContainer />

//       <h2 className="text-2xl font-bold mb-6">
//         💰 Wallet Coin Management (Admin)
//       </h2>

//       {/* ================= FORM ================= */}
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-4 gap-4"
//       >
//         <input
//           type="number"
//           name="minAmount"
//           placeholder="Min Amount (₹)"
//           value={form.minAmount}
//           onChange={handleChange}
//           className="border p-2 rounded-md border-gray-300"
//         />

//         <input
//           type="number"
//           name="maxAmount"
//           placeholder="Max Amount (₹)"
//           value={form.maxAmount}
//           onChange={handleChange}
//           className="border p-2 rounded-md border-gray-300"
//         />

//         <input
//           type="number"
//           name="coins"
//           placeholder="Coins"
//           value={form.coins}
//           onChange={handleChange}
//           className="border p-2 rounded-md border-gray-300"
//         />

//         <button type="submit" className="bg-black text-white rounded px-4 py-2">
//           {editId ? "Update Rule" : "Add Rule"}
//         </button>
//       </form>

//       {/* ================= TABLE ================= */}
//       <div className="bg-white rounded-xl shadow-md overflow-hidden">
//         <div className="overflow-x-auto">
//           <table className="min-w-full text-sm">
//             <thead className="bg-gray-50 sticky top-0 z-10">
//               <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
//                 <th className="px-5 py-3">Min Amount (₹)</th>
//                 <th className="px-5 py-3">Max Amount (₹)</th>
//                 <th className="px-5 py-3">Coins</th>
//                 <th className="px-5 py-3 text-center">Status</th>
//                 <th className="px-5 py-3 text-center">Actions</th>
//               </tr>
//             </thead>

//             <tbody className="divide-y">
//               {loading ? (
//                 <tr>
//                   <td colSpan="5" className="py-6 text-center text-gray-500">
//                     Loading coin rules...
//                   </td>
//                 </tr>
//               ) : rules.length === 0 ? (
//                 <tr>
//                   <td colSpan="5" className="py-6 text-center text-gray-500">
//                     No coin rules found
//                   </td>
//                 </tr>
//               ) : (
//                 rules.map((rule) => (
//                   <tr key={rule._id} className="hover:bg-gray-50 transition">
//                     <td className="px-5 py-3 font-medium">₹{rule.minAmount}</td>
//                     <td className="px-5 py-3">₹{rule.maxAmount}</td>
//                     <td className="px-5 py-3 font-semibold text-indigo-600">
//                       {rule.coins}
//                     </td>

//                     {/* STATUS */}
//                     <td className="px-5 py-3 text-center">
//                       <select
//                         value={rule.isActive ? "active" : "inactive"}
//                         onChange={() => toggleActive(rule)}
//                         className={`px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer
//       focus:outline-none focus:ring-1
//       ${
//         rule.isActive
//           ? "bg-green-50 text-green-700 border-green-300 focus:ring-green-400"
//           : "bg-red-50 text-red-700 border-red-300 focus:ring-red-400"
//       }`}
//                       >
//                         <option value="active">Active</option>
//                         <option value="inactive">Inactive</option>
//                       </select>
//                     </td>

//                     {/* ACTIONS */}
//                     <td className="px-5 py-3 text-center">
//                       <div className="flex justify-center gap-2">
//                         <button
//                           onClick={() => handleEdit(rule)}
//                           className="px-3 py-1.5 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200 transition"
//                         >
//                           Edit
//                         </button>

//                         <button
//                           onClick={() => handleDelete(rule._id)}
//                           className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200 transition"
//                         >
//                           Delete
//                         </button>
//                       </div>
//                     </td>
//                   </tr>
//                 ))
//               )}
//             </tbody>
//           </table>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default WalletCoin;

import React, { useEffect, useState } from "react";import api from '@/utils/api';
import Swal from "sweetalert2";

const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 2500,
  timerProgressBar: true,
});

const WalletCoin = () => {
  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const adminToken = authData?.token;

  const authHeader = {
    headers: { Authorization: `Bearer ${adminToken}` },
  };

  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ price: "", coins: "" });
  const [editId, setEditId] = useState(null);

  // Redirect if token missing
  useEffect(() => {
    if (!adminToken) window.location.href = "mmart/panel/login";
  }, [adminToken]);

  // Fetch rules
  const fetchRules = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/coins/all", authHeader);
      setRules(res.data.data || []);
    } catch {
      Toast.fire({
        icon: "error",
        title: "Unauthorized or failed to load coin rules",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRules();
  }, []);

  // Input change
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  // Create / Update
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.price || !form.coins) {
      return Toast.fire({ icon: "warning", title: "All fields are required" });
    }

    try {
      if (editId) {
        await api.put(`/api/coins/update/${editId}`, form, authHeader);
        Toast.fire({
          icon: "success",
          title: "Coin rule updated successfully",
        });
      } else {
        await api.post("/api/coins/create", form, authHeader);
        Toast.fire({
          icon: "success",
          title: "Coin rule created successfully",
        });
      }
      setForm({ price: "", coins: "" });
      setEditId(null);
      fetchRules();
    } catch (err) {
      Toast.fire({
        icon: "error",
        title: err.response?.data?.message || "Operation failed",
      });
    }
  };

  // Edit
  const handleEdit = (rule) => {
    setEditId(rule._id);
    setForm({ price: rule.price, coins: rule.coins });
  };

  // Delete
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This rule will be deleted",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      confirmButtonText: "Yes, delete it",
    });
    if (!result.isConfirmed) return;

    try {
      await api.delete(`/api/coins/delete/${id}`, authHeader);
      Toast.fire({ icon: "success", title: "Rule deleted successfully" });
      fetchRules();
    } catch {
      Toast.fire({ icon: "error", title: "Delete failed" });
    }
  };

  // Toggle active
  const toggleActive = async (rule) => {
    try {
      await api.put(
        `/api/coins/update/${rule._id}`,
        { isActive: !rule.isActive },
        authHeader
      );
      Toast.fire({ icon: "success", title: "Status updated" });
      fetchRules();
    } catch {
      Toast.fire({ icon: "error", title: "Failed to update status" });
    }
  };

  return (
    <div className="p-2 max-w-full mx-auto">
      <h2 className="text-2xl font-bold mb-6">
        💰 Wallet Coin Management
      </h2>

      {/* Form */}
      <form className="bg-white shadow rounded p-4 mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          type="number"
          name="price"
          placeholder="Amount (₹)"
          value={form.price}
          onChange={handleChange}
          className="border p-2 rounded-md border-gray-300"
        />
        <input
          type="number"
          name="coins"
          placeholder="Coins"
          value={form.coins}
          onChange={handleChange}
          className="border p-2 rounded-md border-gray-300"
        />

        <div className={`grid ${editId ? "grid-cols-2" : "grid-cols-1"} gap-2`}>
          <button
            onClick={handleSubmit}
            className="bg-[#bd2858] text-white rounded px-4 py-2"
          >
            {editId ? "Update Coin Rule" : "Add New Coin Rule"}
          </button>
          {editId && (
            <button
              onClick={() => {
                setEditId(null);
                setForm({ price: "", coins: "" });
              }}
              className="bg-[#e2dee0] text-black rounded px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead className="bg-gray-50 sticky top-0 z-10">
              <tr className="text-left text-gray-600 uppercase text-xs tracking-wider">
                <th className="px-5 py-3">Amount (₹)</th>
                <th className="px-5 py-3">Coins</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {loading ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    Loading coin rules...
                  </td>
                </tr>
              ) : rules.length === 0 ? (
                <tr>
                  <td colSpan="4" className="py-6 text-center text-gray-500">
                    No coin rules found
                  </td>
                </tr>
              ) : (
                rules.map((rule) => (
                  <tr key={rule._id} className="hover:bg-gray-50 transition">
                    <td className="px-5 py-3 font-medium">₹{rule.price}</td>
                    <td className="px-5 py-3 font-semibold text-indigo-600">
                      {rule.coins}
                    </td>
                    <td className="px-5 py-3 text-center">
                      <select
                        value={rule.isActive ? "active" : "inactive"}
                        onChange={() => toggleActive(rule)}
                        className={`px-3 py-1.5 text-xs font-semibold rounded-full border cursor-pointer ${
                          rule.isActive
                            ? "bg-green-50 text-green-700 border-green-300"
                            : "bg-red-50 text-red-700 border-red-300"
                        }`}
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <div className="flex justify-center gap-2">
                        <button
                          onClick={() => handleEdit(rule)}
                          className="px-3 py-1.5 text-xs rounded-md bg-blue-100 text-blue-700 hover:bg-blue-200"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(rule._id)}
                          className="px-3 py-1.5 text-xs rounded-md bg-red-100 text-red-700 hover:bg-red-200"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default WalletCoin;
