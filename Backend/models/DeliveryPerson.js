const mongoose = require("mongoose");

const DeliveryPersonSchema = new mongoose.Schema({
  deliveryBoyId: { type: String, required: true, unique: true },
  fullName: { type: String, required: true },
  gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
  dateOfBirth: { type: Date },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  isActive: { type: Boolean, default: false },
  adminApproved: { type: Boolean, default: true },
  profileImage: { type: String },

  joinDate: { type: Date, default: Date.now },
  address: {
    permanent: { type: String },
    current: { type: String },
  },

  role: {
    type: String,
    // enum: ["delivery_person", "user", "admin"], // 🔥 updated
    default: "delivery_person",
  },

  vehicleDetails: {
    vehicleType: { type: String, required: true },
    vehicleNumber: { type: String, required: true },
    licenseNumber: { type: String, required: true },
    licenseFile: { type: String },
  },

  assignedAreas: [{ type: String }],

  availabilityStatus: {
    type: String,
    enum: ["Available", "On Delivery", "Not Available"],
    default: "Available",
  },

  emergencyContact: {
    name: { type: String },
    relation: { type: String },
    phone: { type: String },
  },

  idProof: {
    idType: { type: String },
    idNumber: { type: String },
    idFile: { type: String },
  },
  /* 🔥 NEW FIELD */
  assignedOrders: [
    {
      orderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order",
        required: true,
      },
      assignedAt: {
        type: Date,
        default: Date.now,
      },
      status: {
        type: String,
        enum: ["Assigned", "Picked Up", "Delivered", "Cancelled"],
        default: "Assigned",
      },
    },
  ],

  /* -------------------- 🔥 ACCOUNTING CORE -------------------- */

  walletBalance: {
    type: Number,
    default: 0,
    min: 0,
  },

  cashInHand: {
    type: Number,
    default: 0,
    min: 0,
  },

  lastSettlementAt: {
    type: Date,
    default: null,
  },

  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("DeliveryPerson", DeliveryPersonSchema);
