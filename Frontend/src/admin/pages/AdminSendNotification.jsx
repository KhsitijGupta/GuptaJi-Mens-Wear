import React, { useState, useEffect } from "react";import api from '@/utils/api';
import Swal from "sweetalert2";

const AdminSendNotification = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  // Simple filters only
  const [searchText, setSearchText] = useState("");
  const [filterDate, setFilterDate] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const fetchNotifications = async () => {
    try {
      const authData = JSON.parse(sessionStorage.getItem("admin"));
      const token = authData?.token;

      const res = await api.get("/api/fire/admin/get-notification/admin", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setNotifications(res.data.notifications || []);
    } catch (error) {
      console.error("Fetch error:", error);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to fetch notifications",
        confirmButtonColor: "#bd2858",
      });
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Simple search (title + body) + date filter
  const filteredNotifications = notifications.filter((item) => {
    const matchesSearch =
      !searchText ||
      item.title.toLowerCase().includes(searchText.toLowerCase()) ||
      item.body.toLowerCase().includes(searchText.toLowerCase());

    const matchesDate =
      !filterDate ||
      new Date(item.sentAt).toDateString() ===
        new Date(filterDate).toDateString();

    return matchesSearch && matchesDate;
  });

  const handleSend = async () => {
    if (!title.trim() || !body.trim()) {
      return Swal.fire({
        icon: "warning",
        title: "Warning!",
        text: "Title and Message are required",
        confirmButtonColor: "#bd2858",
      });
    }

    try {
      setLoading(true);

      const authData = JSON.parse(sessionStorage.getItem("admin"));
      const token = authData?.token;

      if (!token) {
        return Swal.fire({
          icon: "error",
          title: "Session Expired!",
          text: "Please login again.",
          confirmButtonColor: "#bd2858",
        });
      }

      const res = await api.post(
        "/api/fire/admin/send-all",
        { title, body },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Success!",
        html: `✅ Success: ${res.data.success}<br>❌ Failed: ${res.data.failure}`,
        confirmButtonColor: "#bd2858",
      });

      setTitle("");
      setBody("");
      fetchNotifications();
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: error.response?.data?.message || "Error sending notification",
        confirmButtonColor: "#bd2858",
      });
    } finally {
      setLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchText("");
    setFilterDate("");
    Swal.fire({
      icon: "success",
      title: "Filters Cleared!",
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 1500,
      timerProgressBar: true,
    });
  };

  return (
    <div className="font-sans text-slate-800">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold">Admin Notifications</h2>
          <p className="text-sm text-slate-500 mt-1">
            Send push notifications to all registered users and track history.
          </p>
        </div>
      </div>

      {/* Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-start">
        {/* Send Card */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">Quick Send</span>
            <span className="px-2 py-1 text-xs bg-blue-50 text-blue-700 rounded-full border border-blue-200 font-medium">
              Broadcast
            </span>
          </div>

          <label className="block font-medium text-sm text-slate-700 mb-1">
            Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter notification title"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all mb-3"
          />

          <label className="block font-medium text-sm text-slate-700 mb-1">
            Message
          </label>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="4"
            placeholder="Enter notification message"
            className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all resize-vertical min-h-[110px] mb-3"
          />

          <p className="text-xs text-slate-500 mb-4">
            This will be sent to all devices subscribed to your app topic.
          </p>

          <button
            onClick={handleSend}
            disabled={loading}
            className={`w-full py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 text-sm transition-all ${
              loading
                ? "bg-[#811c3c] cursor-not-allowed"
                : "bg-[#bd2858] hover:bg-[#811c3c] shadow-md hover:shadow-lg cursor-pointer"
            } text-white`}
          >
            {loading ? (
              <>
                <div
                  className="w-3.5 h-3.5 rounded-full border-2 border-white/60 border-t-transparent animate-spin"
                  style={{ animationDuration: "0.6s" }}
                />
                Sending...
              </>
            ) : (
              "Send Notification"
            )}
          </button>
        </div>

        {/* History Card - Simple Filters */}
        <div className="bg-white rounded-2xl p-6 shadow-xl border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <span className="text-lg font-semibold">
              All Sent Notifications
            </span>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500">
                Total: {filteredNotifications.length}
              </span>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="px-3 py-1 text-xs bg-purple-100 hover:bg-purple-200 text-slate-700 rounded-lg font-medium transition-all"
              >
                {showFilters ? "Hide" : "Filters"}
              </button>
            </div>
          </div>

          {/* Simple Filter Controls */}
          {showFilters && (
            <div className="bg-purple-50 p-4 rounded-xl border border-slate-200 mb-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                     Search 
                  </label>
                  <input
                    type="text"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    placeholder="Type to search..."
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 mb-1">
                    📅 Filter by Date
                  </label>
                  <input
                    type="date"
                    value={filterDate}
                    onChange={(e) => setFilterDate(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="flex gap-2 mt-3">
                <button
                  onClick={clearFilters}
                  className="px-4 py-1.5 text-xs bg-purple-200 hover:bg-purple-300 text-slate-700 rounded-lg font-medium transition-all flex items-center gap-1"
                >
                  Clear All
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-[270px] overflow-y-auto rounded-xl border border-slate-200 bg-purple-50">
            {filteredNotifications.length === 0 ? (
              <div className="p-8 text-sm text-slate-500 text-center">
                {searchText || filterDate
                  ? "No notifications match your search. Try adjusting filters."
                  : "No notifications found yet. Send the first one."}
              </div>
            ) : (
              filteredNotifications.map((item) => (
                <div
                  key={item._id}
                  className="p-4 border-b border-slate-100 bg-white hover:bg-purple-50 transition-colors last:border-b-0"
                >
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-semibold text-sm text-slate-900">
                      {item.title}
                    </span>
                    <span className="text-xs text-slate-500">
                      {new Date(item.sentAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.body}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSendNotification;
