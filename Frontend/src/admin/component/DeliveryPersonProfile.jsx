import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  User,
  Phone,
  Mail,
  Car,
  ShieldCheck,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
  HeartPulse,
  UserCheck,
  FileText,
} from "lucide-react";

const DeliveryPersonProfile = ({ deliveryPersonId }) => {
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!deliveryPersonId) return;

    const fetchProfile = async () => {
      try {
        const authData = JSON.parse(sessionStorage.getItem("admin"));
        const token = authData?.token;

        const res = await axios.get(
          `/api/delivery-persons/getDeliveryPersonById/${deliveryPersonId}`,
          { headers: { Authorization: `Bearer ${token}` } },
        );

        setPerson(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [deliveryPersonId]);

  /* ---------- Loading ---------- */
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <div className="w-8 h-8 border-2 border-blue-400 border-t-transparent rounded-full animate-spin mb-3"></div>
        <p className="text-sm text-gray-500">Loading profile...</p>
      </div>
    );
  }

  /* ---------- No Data ---------- */
  if (!person) {
    return (
      <div className="text-center py-10">
        <XCircle size={40} className="text-red-400 mx-auto mb-2" />
        <p className="font-semibold text-gray-700">Profile not found</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 min-h-screen p-4">
      <div className=" space-y-2">
        {/* ================= HEADER ================= */}
        <div className="bg-white rounded-2xl shadow-lg p-4 flex gap-4">
          <div className="relative">
            <img
              src={person.profileImage || "/avatar.png"}
              alt="Profile"
              className="w-20 h-20 rounded-xl object-cover shadow-md"
            />
            <div className="absolute -bottom-1 -right-1 bg-emerald-500 p-1.5 rounded-lg shadow">
              <UserCheck size={14} className="text-white" />
            </div>
          </div>

          <div className="flex-1">
            <h1 className="text-lg font-bold text-gray-800">
              {person.fullName}
            </h1>

            <div className="flex flex-wrap items-center gap-2 mt-1">
              <span className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full shadow-sm">
                <ShieldCheck size={14} />
                {person.deliveryBoyId}
              </span>

              <span
                className={`px-2 py-1 text-xs font-semibold rounded-full shadow-sm ${
                  person.isActive
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-red-100 text-red-700"
                }`}
              >
                {person.isActive ? "Active" : "Inactive"}
              </span>
            </div>

            <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
              <MapPin size={14} />
              {person.address?.current || "Location not set"}
            </p>
          </div>
        </div>

        {/* ================= STATS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          <StatCard
            icon={<Phone size={14} />}
            title="Phone"
            value={person.phone}
          />
          <StatCard
            icon={<Mail size={14} />}
            title="Email"
            value={person.email}
          />
          <StatCard
            icon={<Car size={14} />}
            title="Vehicle"
            value={person.vehicleDetails?.vehicleType}
          />
        </div>

        {/* ================= DETAILS ================= */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoCard title="Personal Info" icon={<User size={14} />}>
            <InfoRow
              icon={<Calendar size={14} />}
              label="DOB"
              value={person.dateOfBirth?.slice(0, 10)}
            />
            <InfoRow
              icon={<User size={14} />}
              label="Gender"
              value={person.gender}
            />
            <InfoRow
              icon={<HeartPulse size={14} />}
              label="Emergency"
              value={person.emergencyContact?.name}
            />
          </InfoCard>

          <InfoCard title="Address" icon={<MapPin size={14} />}>
            <InfoRow label="Permanent" value={person.address?.permanent} />
            <InfoRow label="Current" value={person.address?.current} />
            <InfoRow
              icon={<CheckCircle size={14} />}
              label="Approved"
              value={person.adminApproved ? "Yes" : "No"}
            />
          </InfoCard>

          <InfoCard title="Vehicle" icon={<Car size={14} />}>
            <InfoRow label="Type" value={person.vehicleDetails?.vehicleType} />
            <InfoRow
              label="Number"
              value={person.vehicleDetails?.vehicleNumber}
            />
            <InfoRow
              label="License"
              value={person.vehicleDetails?.licenseNumber}
            />
          </InfoCard>

          <InfoCard title="Verification" icon={<ShieldCheck size={14} />}>
            <InfoRow label="Availability" value={person.availabilityStatus} />
            <InfoRow
              icon={<FileText size={14} />}
              label="ID Type"
              value={person.idProof?.idType}
            />
            <InfoRow
              icon={<FileText size={14} />}
              label="ID Number"
              value={person.idProof?.idNumber}
            />
          </InfoCard>
        </div>
      </div>
    </div>
  );
};

/* ================= REUSABLE ================= */

const StatCard = ({ icon, title, value }) => (
  <div className="bg-white rounded-xl p-3 shadow-md">
    <div className="flex items-center gap-2 mb-1">
      <div className="p-1.5 bg-gray-100 rounded-md shadow-sm">{icon}</div>
      <p className="text-xs font-semibold text-gray-500">{title}</p>
    </div>
    <p className="text-sm font-bold text-gray-800 truncate">{value || "-"}</p>
  </div>
);

const InfoCard = ({ title, icon, children }) => (
  <div className="bg-white rounded-xl p-4 shadow-lg">
    <div className="flex items-center gap-2 mb-3 pb-2 shadow-sm rounded-md px-2">
      <div className="p-1.5 bg-blue-500 rounded-md text-white shadow">
        {icon}
      </div>
      <h3 className="text-sm font-bold text-gray-800">{title}</h3>
    </div>
    <div className="space-y-1">{children}</div>
  </div>
);

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-50">
    {icon && <div className="p-1 bg-gray-100 rounded shadow-sm">{icon}</div>}
    <div>
      <p className="text-xs text-gray-500">{label}</p>
      <p className="text-sm font-semibold text-gray-800">{value || "-"}</p>
    </div>
  </div>
);  

export default DeliveryPersonProfile;
