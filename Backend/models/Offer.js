const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema(
  {
    offerId: {
      type: String,
      required: true,
      unique: true,
    },
    offerTitle: {
      type: String,
      required: true,
      trim: true,
    },
    offerImage: {
      type: String, // image ka URL store hoga
      required: true,
    },
    offerPercentage: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },
    status: {
      type: String,
      default: "active",
      enum: ["active", "inactive"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Offer", offerSchema);
