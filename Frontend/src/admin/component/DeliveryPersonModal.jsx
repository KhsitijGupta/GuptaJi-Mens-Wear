import React from "react";
import { X } from "lucide-react";

const DeliveryPersonModal = ({
  showModal,
  setShowModal,
  formData,
  handleChange,
  handleSave,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 overflow-y-auto p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-bold">
            {formData._id ? "Edit Delivery Person" : "Add Delivery Person"}
          </h2>
          <button
            onClick={() => setShowModal(false)}
            className="text-amber-500 hover:text-amber-600"
          >
            <X size={20} />
          </button>
        </div>

        {/* FORM */}
        <div className="space-y-8 mt-6">
          {/* Personal Info */}
          <Section title="Personal Information">
            <Input label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} />
            <Select
              label="Gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              options={["Male", "Female", "Other"]}
            />
            <Input type="date" label="Date of Birth" name="dateOfBirth" value={formData.dateOfBirth} onChange={handleChange} />
            <Input type="email" label="Email" name="email" value={formData.email} onChange={handleChange} />
            <Input label="Phone" name="phone" value={formData.phone} onChange={handleChange} />
            <Input label="Permanent Address" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} />
            <Input label="Current Address" name="currentAddress" value={formData.currentAddress} onChange={handleChange} />
            <FileInput label="Profile Image" name="profileImage" onChange={handleChange} />
          </Section>

          {/* Vehicle Info */}
          <Section title="Vehicle Information">
            <Select
              label="Vehicle Type"
              name="vehicleType"
              value={formData.vehicleType}
              onChange={handleChange}
              options={["E-Bike", "E-Loader", "Bike", "Car", "Van"]}
            />
            <Input label="Vehicle Number" name="vehicleNumber" value={formData.vehicleNumber} onChange={handleChange} />
            <Input label="License Number" name="licenseNumber" value={formData.licenseNumber} onChange={handleChange} />
            <FileInput label="License File" name="licenseFile" onChange={handleChange} />
          </Section>

          {/* ID Info */}
          <Section title="ID Information">
            <Select
              label="ID Type"
              name="idType"
              value={formData.idType}
              onChange={handleChange}
              options={["Aadhar", "PAN", "Driving License", "Voter ID"]}
            />
            <Input label="ID Number" name="idNumber" value={formData.idNumber} onChange={handleChange} />
            <FileInput label="ID Proof File" name="idProofFile" onChange={handleChange} />
          </Section>
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6 border-t pt-4">
          <button
            onClick={() => setShowModal(false)}
            className="px-6 py-2 rounded-xl bg-gray-200 text-gray-600 font-semibold"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-7 py-2 rounded-xl text-white bg-linear-to-br from-[#ff5954] via-[#a73c3c] to-[#31155a] font-semibold"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeliveryPersonModal;

/* ---------------- SMALL REUSABLE UI PARTS ---------------- */

const Section = ({ title, children }) => (
  <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
    <label className="block text-lg font-semibold text-gray-800 mb-4 border-b pb-2">
      {title}
    </label>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
      {children}
    </div>
  </div>
);

const Input = ({ label, type = "text", ...props }) => (
  <div>
    <label className="text-gray-700 font-medium mb-1 block">{label}</label>
    <input
      type={type}
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
    />
  </div>
);

const Select = ({ label, options, ...props }) => (
  <div>
    <label className="text-gray-700 font-medium mb-1 block">{label}</label>
    <select
      {...props}
      className="w-full px-4 py-3 rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-amber-500 outline-none shadow-sm"
    >
      <option value="">Select {label}</option>
      {options.map((opt) => (
        <option key={opt} value={opt}>
          {opt}
        </option>
      ))}
    </select>
  </div>
);

const FileInput = ({ label, ...props }) => (
  <div>
    <label className="text-gray-700 font-medium mb-2 block">{label}</label>
    <input
      type="file"
      {...props}
      className="block w-full text-sm text-gray-500
      file:mr-4 file:py-2 file:px-4
      file:rounded-lg file:border-0
      file:text-sm file:font-medium
      file:bg-amber-50 file:text-amber-600
      hover:file:bg-amber-100 cursor-pointer"
    />
  </div>
);
