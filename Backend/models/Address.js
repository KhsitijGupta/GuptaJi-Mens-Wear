const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
  name: { type: String, required: true },
  phone: { type: String, required: true },
  country: { type: String, required: true },
  pincode: { type: String, required: true },
  landmark: { type: String },
  city: { type: String, required: true },
  state: { type: String, required: true },
  addressType: {
    type: String,
    enum: ["HOME", "WORK", "OTHER"],
    default: "HOME",
  },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

module.exports = mongoose.model("Address", addressSchema);

// 🧩 Export schema properly for re-use
// module.exports = { addressSchema };
