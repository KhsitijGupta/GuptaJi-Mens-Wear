const mongoose = require("mongoose");

const websiteBannerSchema = new mongoose.Schema(
  {
    image: {
      type: String, // store the image URL or path like /uploads/banner/12345.jpg
      required: true,
      trim: true,
    },
  },
  {
    timestamps: true, // optional: adds createdAt and updatedAt
  }
);

module.exports = mongoose.model("WebsiteBanner", websiteBannerSchema);
