// models/ApplicationBanner.js
const mongoose = require("mongoose");

const applicationSmallBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String, // store the image URL or path like /uploads/applicationBanner/12345.jpg
      required: true,
      trim: true,
    },
    order: { type: Number, default: 0 }, // important!
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("ApplicationSmallBanner", applicationSmallBannerSchema);
