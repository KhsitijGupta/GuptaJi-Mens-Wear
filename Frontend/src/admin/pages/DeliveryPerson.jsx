// import React, { useState, useEffect } from "react";
// import {
//   Trash2,
//   Plus,
//   Edit,
//   Eye,
//   ArrowRight,
//   RotateCcw,
//   X,
// } from "lucide-react";
// import Swal from "sweetalert2";
// import axios from "axios";
// import Pagination from "../component/Pagination";
// import DeliveryPersonProfile from "../component/DeliveryPersonProfile";
// import DeliveryPersonModal from "../component/DeliveryPersonModal";

// const DeliveryPersons = () => {
//   const [deliveryPersons, setDeliveryPersons] = useState([]);

//   // 🔍 SEARCH & FILTER STATES
//   const [search, setSearch] = useState("");
//   const [statusFilter, setStatusFilter] = useState("");

//   // 📄 PAGINATION
//   const [currentPage, setCurrentPage] = useState(1);
//   const itemsPerPage = 10;

//   const [showModal, setShowModal] = useState(false);
//   const [showViewModal, setShowViewModal] = useState(false);
//   const [selectedPerson, setSelectedPerson] = useState(null);

//   const [formData, setFormData] = useState({
//     _id: null,
//     fullName: "",
//     gender: "",
//     dateOfBirth: "",
//     email: "",
//     phone: "",
//     permanentAddress: "",
//     currentAddress: "",
//     vehicleType: "",
//     vehicleNumber: "",
//     licenseNumber: "",
//     assignedAreas: "",
//     availabilityStatus: "Available",
//     emergencyName: "",
//     emergencyRelation: "",
//     emergencyPhone: "",
//     idType: "",
//     idNumber: "",
//     profileImage: null,
//     licenseFile: null,
//     idProofFile: null,
//   });

//   const authData = JSON.parse(sessionStorage.getItem("admin"));
//   const token = authData?.token;
//   const API_URL = "/api/delivery-persons";

//   useEffect(() => {
//     fetchDeliveryPersons();
//   }, []);

//   const fetchDeliveryPersons = async () => {
//     try {
//       const res = await axios.get(`${API_URL}/getAllDeliveryPersons`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setDeliveryPersons(res.data.data || []);
//     } catch (err) {
//       Swal.fire("Error", "Failed to fetch delivery persons", "error");
//     }
//   };

//   // 🧠 FILTER + SEARCH LOGIC
//   const filteredPersons = deliveryPersons.filter((p) => {
//     const matchesSearch =
//       p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
//       p.email?.toLowerCase().includes(search.toLowerCase()) ||
//       p.deliveryBoyId?.toLowerCase().includes(search.toLowerCase());

//     const matchesStatus =
//       statusFilter === ""
//         ? true
//         : statusFilter === "Active"
//         ? p.isActive === true
//         : p.isActive === false;

//     return matchesSearch && matchesStatus;
//   });

//   // 📄 PAGINATION LOGIC
//   const indexOfLast = currentPage * itemsPerPage;
//   const indexOfFirst = indexOfLast - itemsPerPage;
//   const currentItems = filteredPersons.slice(indexOfFirst, indexOfLast);

//   const handleChange = (e) => {
//     const { name, value, files } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: files ? files[0] : value,
//     }));
//   };

//   const handleSave = async () => {
//     if (!formData.fullName || !formData.email || !formData.phone) {
//       Swal.fire("Error", "Please fill required fields", "error");
//       return;
//     }

//     const payload = new FormData();
//     Object.keys(formData).forEach((key) => {
//       if (formData[key]) payload.append(key, formData[key]);
//     });

//     try {
//       if (formData._id) {
//         await axios.put(
//           `${API_URL}/updateDeliveryPerson/${formData._id}`,
//           payload,
//           {
//             headers: {
//               "Content-Type": "multipart/form-data",
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );
//         Swal.fire("Updated!", "Delivery person updated.", "success");
//       } else {
//         await axios.post(`${API_URL}/createDeliveryPerson`, payload, {
//           headers: {
//             "Content-Type": "multipart/form-data",
//             Authorization: `Bearer ${token}`,
//           },
//         });
//         Swal.fire("Added!", "Delivery person added.", "success");
//       }

//       fetchDeliveryPersons();
//       setShowModal(false);
//       resetForm();
//     } catch (err) {
//       Swal.fire("Error", "Failed to save delivery person", "error");
//     }
//   };

//   const handleStatusChange = async (id, status) => {
//     try {
//       const authData = JSON.parse(sessionStorage.getItem("admin"));
//       const token = authData?.token;
//       if (!token) {
//         console.error("No token found, user not authenticated");
//         return;
//       }

//       const res = await axios.put(
//         `${API_URL}/deliveryPerson/status/${id}`,
//         { adminApproved: status },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
//       console.log(res.data);
//       fetchDeliveryPersons();
//     } catch (error) {
//       if (error.response && error.response.status === 401) {
//         console.error("Unauthorized: Token failed or expired");
//         // optionally redirect to login
//       } else {
//         console.error("Status update failed", error);
//       }
//     }
//   };

//   const resetForm = () => {
//     setFormData({
//       _id: null,
//       fullName: "",
//       gender: "",
//       dateOfBirth: "",
//       email: "",
//       phone: "",
//       permanentAddress: "",
//       currentAddress: "",
//       vehicleType: "",
//       vehicleNumber: "",
//       licenseNumber: "",
//       assignedAreas: "",
//       availabilityStatus: "Available",
//       emergencyName: "",
//       emergencyRelation: "",
//       emergencyPhone: "",
//       idType: "",
//       idNumber: "",
//       profileImage: null,
//       licenseFile: null,
//       idProofFile: null,
//     });
//   };

//   const handleEdit = (person) => {
//     setFormData({
//       _id: person._id,
//       fullName: person.fullName,
//       gender: person.gender,
//       dateOfBirth: person.dateOfBirth
//         ? person.dateOfBirth.substring(0, 10)
//         : "",
//       email: person.email,
//       phone: person.phone,
//       permanentAddress: person.address?.permanent || "",
//       currentAddress: person.address?.current || "",
//       vehicleType: person.vehicleDetails?.vehicleType || "",
//       vehicleNumber: person.vehicleDetails?.vehicleNumber || "",
//       licenseNumber: person.vehicleDetails?.licenseNumber || "",
//       assignedAreas: person.assignedAreas?.join(", ") || "",
//       availabilityStatus: person.availabilityStatus || "Available",
//       emergencyName: person.emergencyContact?.name || "",
//       emergencyRelation: person.emergencyContact?.relation || "",
//       emergencyPhone: person.emergencyContact?.phone || "",
//       idType: person.idProof?.idType || "",
//       idNumber: person.idProof?.idNumber || "",
//       profileImage: null,
//       licenseFile: null,
//       idProofFile: null,
//     });
//     setShowModal(true);
//   };

//   const handleView = (person) => {
//     setSelectedPerson(person);
//     setShowViewModal(true);
//   };

//   const handleDelete = async (id) => {
//     Swal.fire({
//       title: "Are you sure?",
//       text: "This action cannot be undone!",
//       icon: "warning",
//       showCancelButton: true,
//     }).then(async (result) => {
//       if (result.isConfirmed) {
//         try {
//           await axios.delete(`${API_URL}/deleteDeliveryPerson/${id}`, {
//             headers: { Authorization: `Bearer ${token}` },
//           });
//           Swal.fire("Deleted!", "Delivery person deleted.", "success");
//           fetchDeliveryPersons();
//         } catch (err) {
//           Swal.fire("Error", "Failed to delete delivery person", "error");
//         }
//       }
//     });
//   };

//   return (
//     <div className="bg-gray-50 min-h-screen p-4">
//       {/* TITLE */}
//       <h1 className="text-2xl font-bold mb-4">
//         Manage <span className="text-amber-500">Delivery Persons</span>
//       </h1>

//       {/* SEARCH + FILTER + ADD + RESET BUTTON ROW */}
//       <div className="flex flex-col md:flex-row items-end md:items-center gap-4 mb-6 bg-white p-4 rounded-lg shadow">
//         {/* 🔍 Search */}
//         <div className="w-full md:w-1/4">
//           <label className="text-xs text-gray-600 mb-1 block">Search</label>
//           <input
//             type="text"
//             placeholder="Search by name, email or ID..."
//             value={search}
//             onChange={(e) => {
//               setSearch(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full px-4 py-2 border rounded-lg shadow-sm"
//           />
//         </div>

//         {/* 🔽 Status Filter */}
//         <div className="w-full md:w-1/5">
//           <label className="text-xs text-gray-600 mb-1 block">Status</label>
//           <select
//             value={statusFilter}
//             onChange={(e) => {
//               setStatusFilter(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full px-4 py-2 border rounded-lg shadow-sm"
//           >
//             <option value="">All Status</option>
//             <option value="Active">Active</option>
//             <option value="Inactive">Pending</option>
//           </select>
//         </div>

//         {/* 🔄 Reset Button */}
//         <button
//           onClick={() => {
//             setSearch("");
//             setStatusFilter("");
//             setFromDate("");
//             setToDate("");
//             setCurrentPage(1);
//           }}
//           className="flex items-center gap-2 px-4 py-2 mt-5 bg-gray-200 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-300"
//         >
//           Reset
//         </button>

//         {/* ➕ Add Delivery Person */}
//         <button
//           onClick={() => setShowModal(true)}
//           className="flex items-center gap-2 px-4 py-2 ml-55 mt-5 bg-white text-amber-500 border border-amber-500 rounded-lg hover:bg-amber-500 hover:text-white"
//         >
//           <Plus size={18} /> Add Delivery Person
//         </button>
//       </div>

//       {/* TABLE */}
//       <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
//         <table className="w-full text-sm text-left">
//           <thead className="bg-gray-200 text-gray-700 uppercase">
//             <tr>
//               <th className="px-6 py-3">Profile</th>
//               <th className="px-6 py-3">ID</th>
//               <th className="px-6 py-3">Name</th>
//               <th className="px-6 py-3">Email</th>
//               <th className="px-6 py-3">Phone</th>
//               <th className="px-6 py-3">Status</th>
//               <th className="px-6 py-3">Admin Status</th>
//               <th className="px-6 py-3 text-center">Actions</th>
//             </tr>
//           </thead>

//           <tbody>
//             {currentItems.map((person) => (
//               <tr key={person._id} className="border-t hover:bg-gray-50">
//                 <td className="px-3 py-2">
//                   {person.profileImage ? (
//                     <img
//                       src={`${person.profileImage}`}
//                       className="w-10 h-10 rounded-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
//                       N/A
//                     </div>
//                   )}
//                 </td>

//                 <td className="px-3 py-2">{person.deliveryBoyId}</td>
//                 <td className="px-3 py-2">{person.fullName}</td>
//                 <td className="px-3 py-2">{person.email}</td>
//                 <td className="px-3 py-2">{person.phone}</td>

//                 <td className="px-3 py-2">
//                   <span
//                     className={`px-3 py-1 rounded-full font-semibold ${
//                       person.isActive
//                         ? "bg-green-200 text-green-800"
//                         : "bg-red-200 text-red-800"
//                     }`}
//                   >
//                     {person.isActive ? "Active" : "Inactive"}
//                   </span>
//                 </td>

//                 <td className="px-3 py-2">
//                   <select
//                     value={person.adminApproved ? "Active" : "Inactive"}
//                     onChange={(e) =>
//                       handleStatusChange(
//                         person._id,
//                         e.target.value === "Active"
//                       )
//                     }
//                     className={`px-3 py-1 rounded-md border font-semibold cursor-pointer outline-none ${
//                       person.adminApproved
//                         ? "bg-green-100 text-green-700"
//                         : "bg-red-100 text-red-700"
//                     }`}
//                   >
//                     <option value="Active">Active</option>
//                     <option value="Inactive">Inactive</option>
//                   </select>
//                 </td>

//                 <td className="px-3 py-2 flex gap-2 justify-center">
//                   <button
//                     onClick={() => handleView(person)}
//                     className="bg-green-100 p-2 rounded-lg hover:bg-green-200"
//                   >
//                     <Eye size={16} className="text-green-700" />
//                   </button>

//                   <button
//                     onClick={() => handleEdit(person)}
//                     className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
//                   >
//                     <Edit size={16} className="text-blue-700" />
//                   </button>

//                   <button
//                     onClick={() => handleDelete(person._id)}
//                     className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
//                   >
//                     <Trash2 size={16} className="text-red-700" />
//                   </button>
//                 </td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       </div>

//       {/* MOBILE VIEW */}
//       <div className="md:hidden space-y-4">
//         {currentItems.map((person) => (
//           <div
//             key={person._id}
//             className="bg-white shadow-md rounded-2xl p-4 flex flex-col gap-2"
//           >
//             <div className="flex items-center gap-3">
//               {person.profileImage ? (
//                 <img
//                   src={`${person.profileImage}`}
//                   className="w-16 h-16 rounded-full object-cover"
//                 />
//               ) : (
//                 <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
//                   N/A
//                 </div>
//               )}

//               <div className="flex-1">
//                 <h3 className="font-semibold text-lg">{person.fullName}</h3>
//                 <p className="text-sm text-gray-500">{person.email}</p>
//                 <p className="text-sm text-gray-500">{person.phone}</p>
//               </div>
//             </div>

//             <div className="flex justify-between items-center mt-2">
//               <span
//                 className={`px-3 py-1 rounded-full font-semibold text-sm ${
//                   person.isActive
//                     ? "bg-green-200 text-green-800"
//                     : "bg-red-200 text-red-800"
//                 }`}
//               >
//                 {person.isActive ? "Active" : "Inactive"}
//               </span>

//               <div className="flex gap-2">
//                 <button
//                   onClick={() => handleView(person)}
//                   className="bg-green-100 p-2 rounded-lg hover:bg-green-200"
//                 >
//                   <Eye size={16} className="text-green-700" />
//                 </button>

//                 <button
//                   onClick={() => handleEdit(person)}
//                   className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
//                 >
//                   <Edit size={16} className="text-blue-700" />
//                 </button>

//                 <button
//                   onClick={() => handleDelete(person._id)}
//                   className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
//                 >
//                   <Trash2 size={16} className="text-red-700" />
//                 </button>
//               </div>
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* PAGINATION */}
//       <Pagination
//         currentPage={currentPage}
//         totalItems={filteredPersons.length}
//         itemsPerPage={itemsPerPage}
//         onPageChange={setCurrentPage}
//       />

//       {/* Add/Edit Modal */}

//       <DeliveryPersonModal
//         showModal={showModal}
//         setShowModal={setShowModal}
//         formData={formData}
//         handleChange={handleChange}
//         handleSave={handleSave}
//       />

//       {/* View Modal */}
//       {showViewModal && selectedPerson && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
//           <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto p-6">
//             {/* Modal Header */}
//             <div className="flex justify-between items-center border-b pb-3">
//               <h2 className="text-2xl font-bold">Delivery Person Details</h2>
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="text-amber-500 hover:text-amber-600"
//               >
//                 <X size={20} />
//               </button>
//             </div>

//             <DeliveryPersonProfile deliveryPersonId={selectedPerson._id} />

//             {/* Close Button */}
//             <div className="flex justify-end mt-6">
//               <button
//                 onClick={() => setShowViewModal(false)}
//                 className="px-6 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DeliveryPersons;
import React, { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  Edit,
  Eye,
  ArrowRight,
  RotateCcw,
  X,
} from "lucide-react";
import Swal from "sweetalert2";
import axios from "axios";
import Pagination from "../component/Pagination";
import DeliveryPersonProfile from "../component/DeliveryPersonProfile";
import DeliveryPersonModal from "../component/DeliveryPersonModal";

const DeliveryPersons = () => {
  const [deliveryPersons, setDeliveryPersons] = useState([]);

  // 🔍 SEARCH & FILTER STATES
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // 📄 PAGINATION
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedPerson, setSelectedPerson] = useState(null);

  const [formData, setFormData] = useState({
    _id: null,
    fullName: "",
    gender: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    permanentAddress: "",
    currentAddress: "",
    vehicleType: "",
    vehicleNumber: "",
    licenseNumber: "",
    assignedAreas: "",
    availabilityStatus: "Available",
    emergencyName: "",
    emergencyRelation: "",
    emergencyPhone: "",
    idType: "",
    idNumber: "",
    profileImage: null,
    licenseFile: null,
    idProofFile: null,
  });

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;
  const API_URL = "/api/delivery-persons";

  useEffect(() => {
    fetchDeliveryPersons();
  }, []);

  const fetchDeliveryPersons = async () => {
    try {
      const res = await axios.get(`${API_URL}/getAllDeliveryPersons`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeliveryPersons(res.data.data || []);
    } catch (err) {
      Swal.fire("Error", "Failed to fetch delivery persons", "error");
    }
  };

  // 🧠 FILTER + SEARCH LOGIC
  const filteredPersons = deliveryPersons.filter((p) => {
    const matchesSearch =
      p.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      p.email?.toLowerCase().includes(search.toLowerCase()) ||
      p.deliveryBoyId?.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === ""
        ? true
        : statusFilter === "Active"
        ? p.isActive === true
        : p.isActive === false;

    return matchesSearch && matchesStatus;
  });

  // 📄 PAGINATION LOGIC
  const indexOfLast = currentPage * itemsPerPage;
  const indexOfFirst = indexOfLast - itemsPerPage;
  const currentItems = filteredPersons.slice(indexOfFirst, indexOfLast);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSave = async () => {
    if (!formData.fullName || !formData.email || !formData.phone) {
      Swal.fire("Error", "Please fill required fields", "error");
      return;
    }

    const payload = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key]) payload.append(key, formData[key]);
    });

    try {
      if (formData._id) {
        await axios.put(
          `${API_URL}/updateDeliveryPerson/${formData._id}`,
          payload,
          {
            headers: {
              "Content-Type": "multipart/form-data",
              Authorization: `Bearer ${token}`,
            },
          }
        );
        Swal.fire("Updated!", "Delivery person updated.", "success");
      } else {
        await axios.post(`${API_URL}/createDeliveryPerson`, payload, {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        });
        Swal.fire("Added!", "Delivery person added.", "success");
      }

      fetchDeliveryPersons();
      setShowModal(false);
      resetForm();
    } catch (err) {
      Swal.fire("Error", "Failed to save delivery person", "error");
    }
  };

  const handleStatusChange = async (id, status) => {
    try {
      const authData = JSON.parse(sessionStorage.getItem("admin"));
      const token = authData?.token;
      if (!token) {
        console.error("No token found, user not authenticated");
        return;
      }

      const res = await axios.put(
        `${API_URL}/deliveryPerson/status/${id}`,
        { adminApproved: status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      console.log(res.data);
      fetchDeliveryPersons();
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.error("Unauthorized: Token failed or expired");
      } else {
        console.error("Status update failed", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      _id: null,
      fullName: "",
      gender: "",
      dateOfBirth: "",
      email: "",
      phone: "",
      permanentAddress: "",
      currentAddress: "",
      vehicleType: "",
      vehicleNumber: "",
      licenseNumber: "",
      assignedAreas: "",
      availabilityStatus: "Available",
      emergencyName: "",
      emergencyRelation: "",
      emergencyPhone: "",
      idType: "",
      idNumber: "",
      profileImage: null,
      licenseFile: null,
      idProofFile: null,
    });
  };

  const handleEdit = (person) => {
    setFormData({
      _id: person._id,
      fullName: person.fullName,
      gender: person.gender,
      dateOfBirth: person.dateOfBirth
        ? person.dateOfBirth.substring(0, 10)
        : "",
      email: person.email,
      phone: person.phone,
      permanentAddress: person.address?.permanent || "",
      currentAddress: person.address?.current || "",
      vehicleType: person.vehicleDetails?.vehicleType || "",
      vehicleNumber: person.vehicleDetails?.vehicleNumber || "",
      licenseNumber: person.vehicleDetails?.licenseNumber || "",
      assignedAreas: person.assignedAreas?.join(", ") || "",
      availabilityStatus: person.availabilityStatus || "Available",
      emergencyName: person.emergencyContact?.name || "",
      emergencyRelation: person.emergencyContact?.relation || "",
      emergencyPhone: person.emergencyContact?.phone || "",
      idType: person.idProof?.idType || "",
      idNumber: person.idProof?.idNumber || "",
      profileImage: null,
      licenseFile: null,
      idProofFile: null,
    });
    setShowModal(true);
  };

  const handleView = (person) => {
    setSelectedPerson(person);
    setShowViewModal(true);
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`${API_URL}/deleteDeliveryPerson/${id}`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          Swal.fire("Deleted!", "Delivery person deleted.", "success");
          fetchDeliveryPersons();
        } catch (err) {
          Swal.fire("Error", "Failed to delete delivery person", "error");
        }
      }
    });
  };

  return (
    <div className="bg-gray-50 ">
      {/* TITLE */}
      <h1 className="text-2xl font-bold mb-4">
        Manage <span className="text-amber-500">Delivery Persons</span>
      </h1>

      {/* SEARCH + FILTER + ADD + RESET BUTTON ROW */}
      <div className="bg-white rounded-xl shadow-xs border border-gray-100 p-4 mb-2">
        {/* TOP ROW - Title + Add Button */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2 mb-2">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Delivery Persons
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {filteredPersons.length} total records
            </p>
          </div>

          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-linear-to-r from-amber-500 to-amber-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-amber-600 hover:to-amber-700 transition-all duration-200 h-fit"
          >
            <Plus size={20} />
            Add Delivery Person
          </button>
        </div>

        {/* BOTTOM ROW - Search + Filters + Reset */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-2 items-end">
          {/* 🔍 Search */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Search
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Name, email or ID..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setCurrentPage(1);
                }}
                className="w-full pl-11 pr-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm"
              />
              <svg
                className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          {/* 🔽 Status Filter */}
          <div>
            <label className="text-xs font-medium text-gray-600 mb-2 block">
              Status
            </label>
            <select
              value={statusFilter}
              onChange={(e) => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl shadow-sm focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200 text-sm appearance-none bg-white"
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Inactive">Pending</option>
            </select>
          </div>

          {/* 🔄 Reset Button */}
          <div className="flex justify-end lg:justify-start">
            <button
              onClick={() => {
                setSearch("");
                setStatusFilter("");
                setCurrentPage(1);
              }}
              className="flex items-center gap-1.5 px-4 py-2.5 bg-gray-100 text-gray-700 font-medium rounded-lg border border-gray-200 hover:bg-gray-200 hover:shadow-sm transition-all duration-200 text-sm w-full lg:w-auto h-fit"
            >
              <RotateCcw size={16} className="group-hover:animate-none" />
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* TABLE - DESKTOP */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-200 text-gray-700 uppercase">
            <tr>
              <th className="px-6 py-3">Profile</th>
              <th className="px-6 py-3">ID</th>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Status</th>
              <th className="px-6 py-3">Admin Status</th>
              <th className="px-6 py-3 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentItems.map((person) => (
              <tr key={person._id} className="border-t hover:bg-gray-50">
                <td className="px-3 py-2">
                  {person.profileImage ? (
                    <img
                      src={`${person.profileImage}`}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
                      N/A
                    </div>
                  )}
                </td>

                <td className="px-3 py-2">{person.deliveryBoyId}</td>
                <td className="px-3 py-2">{person.fullName}</td>
                <td className="px-3 py-2">{person.email}</td>
                <td className="px-3 py-2">{person.phone}</td>

                <td className="px-3 py-2">
                  <span
                    className={`px-3 py-1 rounded-full font-semibold ${
                      person.isActive
                        ? "bg-green-200 text-green-800"
                        : "bg-red-200 text-red-800"
                    }`}
                  >
                    {person.isActive ? "Active" : "Inactive"}
                  </span>
                </td>

                <td className="px-3 py-2">
                  <select
                    value={person.adminApproved ? "Active" : "Inactive"}
                    onChange={(e) =>
                      handleStatusChange(
                        person._id,
                        e.target.value === "Active"
                      )
                    }
                    className={`px-3 py-1 rounded-md border font-semibold cursor-pointer outline-none ${
                      person.adminApproved
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </td>

                <td className="px-3 py-2 flex gap-2 justify-center">
                  <button
                    onClick={() => handleView(person)}
                    className="bg-green-100 p-2 rounded-lg hover:bg-green-200"
                  >
                    <Eye size={16} className="text-green-700" />
                  </button>

                  <button
                    onClick={() => handleEdit(person)}
                    className="bg-blue-100 p-2 rounded-lg hover:bg-blue-200"
                  >
                    <Edit size={16} className="text-blue-700" />
                  </button>

                  <button
                    onClick={() => handleDelete(person._id)}
                    className="bg-red-100 p-2 rounded-lg hover:bg-red-200"
                  >
                    <Trash2 size={16} className="text-red-700" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MOBILE VIEW - FULL FUNCTIONALITY */}
      <div className="md:hidden space-y-4">
        {currentItems.map((person) => (
          <div
            key={person._id}
            className="bg-white shadow-md rounded-2xl p-4 border"
          >
            {/* Profile + Basic Info Row */}
            <div className="flex items-start gap-4 mb-4">
              {/* Profile Image */}
              <div>
                {person.profileImage ? (
                  <img
                    src={`${person.profileImage}`}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
                    N/A
                  </div>
                )}
              </div>

              {/* Name + ID + Email */}
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-lg mb-1">{person.fullName}</h3>
                <p className="text-sm text-gray-600 mb-1">
                  ID:{" "}
                  <span className="font-mono bg-gray-100 px-2 py-1 rounded text-xs">
                    {person.deliveryBoyId}
                  </span>
                </p>
                <p className="text-sm text-blue-600 mb-1 truncate">
                  {person.email}
                </p>
              </div>

              {/* Phone */}
              <div className="text-right">
                <p className="font-semibold text-lg">{person.phone}</p>
              </div>
            </div>

            {/* Status Row - Both Statuses + Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-3 border-t">
              {/* User Status Badge */}
              <div className="flex-1">
                <span
                  className={`inline-flex px-3 py-1 rounded-full font-semibold text-sm ${
                    person.isActive
                      ? "bg-green-200 text-green-800"
                      : "bg-red-200 text-red-800"
                  }`}
                >
                  {person.isActive ? "Active" : "Inactive"}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 shrink-0">
                {/* Admin Status Dropdown */}
                <div className="">
                  <select
                    value={person.adminApproved ? "Active" : "Inactive"}
                    onChange={(e) =>
                      handleStatusChange(
                        person._id,
                        e.target.value === "Active"
                      )
                    }
                    className={` px-3 py-2 rounded-lg border font-semibold text-sm cursor-pointer outline-none text-center ${
                      person.adminApproved
                        ? "bg-green-100 text-green-700 border-green-300"
                        : "bg-red-100 text-red-700 border-red-300"
                    }`}
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
                <button
                  onClick={() => handleView(person)}
                  className="bg-green-100 p-2.5 rounded-xl hover:bg-green-200 shrink-0"
                  title="View Details"
                >
                  <Eye size={18} className="text-green-700" />
                </button>

                <button
                  onClick={() => handleEdit(person)}
                  className="bg-blue-100 p-2.5 rounded-xl hover:bg-blue-200 shrink-0"
                  title="Edit"
                >
                  <Edit size={18} className="text-blue-700" />
                </button>

                <button
                  onClick={() => handleDelete(person._id)}
                  className="bg-red-100 p-2.5 rounded-xl hover:bg-red-200 shrink-0"
                  title="Delete"
                >
                  <Trash2 size={18} className="text-red-700" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <Pagination
        currentPage={currentPage}
        totalItems={filteredPersons.length}
        itemsPerPage={itemsPerPage}
        onPageChange={setCurrentPage}
      />

      {/* Add/Edit Modal */}
      <DeliveryPersonModal
        showModal={showModal}
        setShowModal={setShowModal}
        formData={formData}
        handleChange={handleChange}
        handleSave={handleSave}
      />

      {/* View Modal */}
      {showViewModal && selectedPerson && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 overflow-y-auto p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl max-h-[85vh] overflow-y-auto p-2">
            {/* Modal Header */}
            <div className="flex justify-between items-center border-b pb-3">
              <h2 className="text-2xl font-bold">Delivery Person Details</h2>
              <button
                onClick={() => setShowViewModal(false)}
                className="text-amber-500 hover:text-amber-600"
              >
                <X size={20} />
              </button>
            </div>

            <DeliveryPersonProfile deliveryPersonId={selectedPerson._id} />

            {/* Close Button */}
            <div className="flex justify-end mt-6">
              <button
                onClick={() => setShowViewModal(false)}
                className="px-6 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeliveryPersons;
