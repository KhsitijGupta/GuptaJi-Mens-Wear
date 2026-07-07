// controllers/applicationBannerController.js
const ApplicationBanner = require("../models/ApplicationSmallBanner");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../services/cloudinaryService");

// Upload banner
module.exports.uploadApplicationSmallBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    // Set order as the last one
    const lastBanner = await ApplicationBanner.findOne().sort({ order: -1 });
    const newOrder = lastBanner ? lastBanner.order + 1 : 0;

    const uploadedImage = await uploadFile(
      req.file.path,
      "applicationSmallBanner",
    );
    const applicationBanner = new ApplicationBanner({
      image: uploadedImage.secure_url,
      order: newOrder,
    });

    await applicationBanner.save();
    res.status(201).json(applicationBanner);
  } catch (err) {
    res.status(500).json({ message: "Banner upload failed", error: err });
  }
};

// Get all banners sorted by order
module.exports.getAllApplicationSmallBanners = async (req, res) => {
  try {
    const applicationBanners = await ApplicationBanner.find().sort({
      order: 1,
    });
    res.status(200).json(applicationBanners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners", error: err });
  }
};

// Delete banner
module.exports.deleteApplicationSmallBanner = async (req, res) => {
  try {
    const applicationBanner = await ApplicationBanner.findByIdAndDelete(
      req.params.id,
    );
    if (!applicationBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Optionally delete the image file from disk
    const filePath = path.join(__dirname, "..", applicationBanner.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.status(200).json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner", error: err });
  }
};

// ✅ Reorder banners
module.exports.reorderApplicationSmallBanners = async (req, res) => {
  try {
    const { banners } = req.body; // [{ _id, order }]
    if (!banners || !Array.isArray(banners)) {
      return res.status(400).json({ message: "Invalid banners data" });
    }

    const updatePromises = banners.map((b) =>
      ApplicationBanner.findByIdAndUpdate(b._id, { order: b.order }),
    );

    await Promise.all(updatePromises);

    res.status(200).json({ message: "Banners reordered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to reorder banners", error: err });
  }
};
