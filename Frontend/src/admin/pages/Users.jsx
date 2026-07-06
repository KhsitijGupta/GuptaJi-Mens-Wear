import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { Eye, Edit, Trash2, X, Upload, Search } from "lucide-react";
import Pagination from "../component/Pagination";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);

  const [search, setSearch] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const USERS_PER_PAGE = 25;

  const [selectedUser, setSelectedUser] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    // gender: "",
    // address: [
    //   {
    //     country: "",
    //     state: "",
    //     city: "",
    //     pincode: "",
    //     landmark: "",
    //     addressType: "",
    //     isDefault: false,
    //   },
    // ],
    // profileImage: null,
  });

  const authData = JSON.parse(sessionStorage.getItem("admin"));
  const token = authData?.token;

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    handleSearch();
    setCurrentPage(1);
  }, [search, users]);

  const fetchUsers = async () => {
    try {
      const res = await axios.get("/api/users/getAllUsers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const handleSearch = () => {
    const s = search.toLowerCase();

    const result = users.filter(
      (user) =>
        user.fullName.toLowerCase().includes(s) ||
        user.email.toLowerCase().includes(s) ||
        user.phone.toLowerCase().includes(s),
    );

    setFilteredUsers(result);
  };

  // Pagination slice
  const indexOfLast = currentPage * USERS_PER_PAGE;
  const indexOfFirst = indexOfLast - USERS_PER_PAGE;
  const currentUsers = filteredUsers.slice(indexOfFirst, indexOfLast);

  const totalPages = Math.ceil(filteredUsers.length / USERS_PER_PAGE);
  const handleView = (user) => {
    setSelectedUser(user);
    setShowViewModal(true);
  };

  const handleEdit = (user) => {
    setSelectedUser(user);
    setFormData({
      fullName: user.fullName || "",
      email: user.email || "",
      phone: user.phone || "",
      gender: user.gender || "",
      address:
        user.address && Array.isArray(user.address)
          ? user.address
          : [
              {
                country: "",
                state: "",
                city: "",
                pincode: "",
                landmark: "",
                addressType: "",
                isDefault: false,
              },
            ],
      profileImage: null,
    });
    setPreviewImage(user.profileImage || "/default-avatar.png");
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const form = new FormData();
      form.append("fullName", formData.fullName);
      form.append("email", formData.email);
      // form.append("phone", formData.phone);
      // form.append("gender", formData.gender);
      // form.append("addresses", JSON.stringify(formData.address));
      // if (formData.profileImage)
      //   form.append("userprofileImage", formData.profileImage);

      await axios.put(
        `/api/users/updateUserProfile/${selectedUser._id}`,
        form,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        },
      );

      Swal.fire("Updated!", "User updated successfully.", "success");
      setShowEditModal(false);
      fetchUsers();
    } catch (error) {
      console.error("Error updating user:", error);
    }
  };

  const handleDelete = async (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e63946",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Delete",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`/api/users/deleteUser/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        Swal.fire("Deleted!", "User successfully deleted.", "success");
        fetchUsers();
      }
    });
  };

  return (
    <div className="bg-gray-50 ">
      {/*  HEADER AND SEARCH (Same Row) */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">
          All <span className="text-orange-500">Users</span>
        </h1>

        <div className="flex items-center bg-white shadow-md rounded-xl px-4 py-2 border border-orange-500 w-full md:w-72">
          <Search size={18} className="text-orange-600" />
          <input
            type="text"
            placeholder="Search by name, email..."
            className="ml-3 w-full bg-transparent text-gray-900 placeholder-gray-500 focus:outline-none"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* ⭐ TABLE */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-orange-50 text-gray-700 uppercase">
            <tr>
              <th className="px-4 py-2">#</th>
              <th className="px-4 py-2">Photo</th>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Email</th>
              <th className="px-4 py-2">Phone</th>
              <th className="px-4 py-2">Gender</th>
              <th className="px-4 py-2 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-6 text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              currentUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-50 border-t">
                  <td className="px-4 py-3">{indexOfFirst + index + 1}</td>
                  <td className="px-4 py-3">
                    <img
                      src={user.profileImage || "/default-avatar.png"}
                      className="w-10 h-10 rounded-md object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <span className="block">{user.fullName}</span>
                    <span className="block bg-orange-100 text-xs w-fit py-0.5 pb-1 text-orange-900 font-semibold px-2 border border-orange-400 rounded-lg">
                      {user.userId}
                    </span>
                  </td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3">{user.phone}</td>
                  <td className="px-4 py-3">{user.gender || "N/A"}</td>
                  <td className="px-4 py-3 flex gap-2 justify-center">
                    <button
                      className="p-2 bg-green-100 text-green-600 rounded-md"
                      onClick={() => handleView(user)}
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      className="p-2 bg-blue-100 text-blue-600 rounded-md"
                      onClick={() => handleEdit(user)}
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      className="p-2 bg-red-100 text-red-600 rounded-md"
                      onClick={() => handleDelete(user._id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* ⭐ MOBILE VIEW (Premium Cards) */}
      <div className="block md:hidden space-y-4">
        {currentUsers.length === 0 ? (
          <p className="text-center text-gray-500">No users found</p>
        ) : (
          currentUsers.map((user) => (
            <div
              key={user._id}
              className="bg-white rounded-2xl shadow-md p-4 flex flex-col gap-3"
            >
              {/* Top Section */}
              <div className="flex items-center gap-4">
                <img
                  src={user.profileImage || "/default-avatar.png"}
                  alt={user.fullName}
                  className="w-14 h-14 rounded-md object-cover border-2 border-orange-500"
                />

                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-base">
                    {user.fullName}
                  </h3>
                  <p className="text-xs text-gray-500 truncate w-40">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-500">{user.phone}</p>
                </div>

                <span className="text-[11px] px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium">
                  {user.gender || "User"}
                </span>
              </div>

              {/* Divider */}
              <div className="h-1 bg-gray-100" />

              {/* Action Buttons */}
              <div className="flex justify-around">
                <button
                  onClick={() => handleView(user)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-green-50 text-green-600 text-xs font-medium active:scale-95 transition"
                >
                  <Eye size={14} /> View
                </button>

                <button
                  onClick={() => handleEdit(user)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-blue-50 text-blue-600 text-xs font-medium active:scale-95 transition"
                >
                  <Edit size={14} /> Edit
                </button>

                <button
                  onClick={() => handleDelete(user._id)}
                  className="flex items-center gap-1 px-3 py-2 rounded-xl bg-red-50 text-red-600 text-xs font-medium active:scale-95 transition"
                >
                  <Trash2 size={14} /> Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {filteredUsers.length > USERS_PER_PAGE && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
        />
      )}

      {/* View Modal */}
      {showViewModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3 overflow-auto">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 md:p-8 relative flex flex-col md:flex-row gap-4">
            <button
              className="absolute top-3 right-3 text-gray-400 hover:text-red-500"
              onClick={() => setShowViewModal(false)}
            >
              <X size={22} />
            </button>
            <div className="flex flex-col items-center md:items-start md:w-1/3 text-center md:text-left gap-2">
              <img
                src={selectedUser.profileImage || "/default-avatar.png"}
                alt={selectedUser.fullName}
                className="w-24 h-24 rounded-md object-cover shadow-sm"
              />
              <h2 className="text-xl font-bold text-orange-500">
                {selectedUser.fullName}
              </h2>
              <p className="text-gray-500 text-sm">
                {selectedUser.userId || "User"}
              </p>
            </div>

            <div className="flex-1 flex flex-col gap-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm text-sm">
                  <p className="text-gray-600 font-medium">Email</p>
                  <p className="text-gray-800">{selectedUser.email}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm text-sm">
                  <p className="text-gray-600 font-medium">Phone</p>
                  <p className="text-gray-800">{selectedUser.phone}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-lg shadow-sm text-sm">
                  <p className="text-gray-600 font-medium">Gender</p>
                  <p className="text-gray-800">
                    {selectedUser.gender || "N/A"}
                  </p>
                </div>
              </div>

              {Array.isArray(selectedUser.address) &&
                selectedUser.address.length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">
                      Address
                    </h3>
                    {selectedUser.address.map((addr, idx) => (
                      <div
                        key={idx}
                        className="bg-gray-50 p-3 rounded-lg shadow-sm text-sm mb-2"
                      >
                        <p>
                          <strong>Type:</strong> {addr.addressType || "Home"}
                        </p>
                        <p>
                          <strong>Country:</strong> {addr.country}
                        </p>
                        <p>
                          <strong>State:</strong> {addr.state}
                        </p>
                        <p>
                          <strong>City:</strong> {addr.city}
                        </p>
                        <p>
                          <strong>Pincode:</strong> {addr.pincode}
                        </p>
                        <p>
                          <strong>Landmark:</strong> {addr.landmark}
                        </p>
                        {addr.isDefault && (
                          <p className="text-green-600 font-semibold text-xs mt-1">
                            ✅ Default
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal (same as your code but address updated) */}
      {showEditModal && selectedUser && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50 p-3 overflow-auto">
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-xl p-6 md:p-8 mx-2">
            <button
              onClick={() => setShowEditModal(false)}
              className="absolute top-3 right-3 text-red-500 hover:text-red-700"
            >
              <X size={22} />
            </button>
            <h2 className="text-xl font-bold mb-4 text-gray-800">Edit User</h2>

            {/* Profile Image Upload */}
            {/* <div className="flex flex-col items-center mb-4">
              <img
                src={previewImage || "/default-avatar.png"}
                alt="Preview"
                className="w-24 h-24 rounded-full object-cover shadow-sm"
              />
              <label className="mt-2 flex items-center gap-2 px-3 py-1 bg-gray-100 text-gray-700 rounded-lg cursor-pointer hover:bg-gray-200 text-sm">
                <Upload size={16} /> Change
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      setFormData({ ...formData, profileImage: file });
                      setPreviewImage(URL.createObjectURL(file));
                    }
                  }}
                />
              </label>
            </div> */}

            <form
              onSubmit={handleEditSubmit}
              className="grid grid-cols-1 md:grid-cols-2 gap-3"
            >
              {["fullName", "email"].map((field) => (
                <div className="flex flex-col" key={field}>
                  <label className="text-gray-600 text-sm mb-1">
                    {field.charAt(0).toUpperCase() + field.slice(1)}
                  </label>
                  <input
                    type={field === "email" ? "email" : "text"}
                    value={formData[field]}
                    onChange={(e) =>
                      setFormData({ ...formData, [field]: e.target.value })
                    }
                    className="px-3 py-2 rounded-lg shadow-sm focus:outline
                    focus:ring-2 focus:ring-orange-500 text-sm bg-gray-50"
                  />
                </div>
              ))}

              <div className="col-span-1 md:col-span-2 flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 text-sm"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:opacity-90"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
