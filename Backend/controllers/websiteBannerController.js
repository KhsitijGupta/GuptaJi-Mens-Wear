const WebsiteBanner = require("../models/WebsiteBanner");
const fs = require("fs");
const path = require("path");
const { uploadFile } = require("../services/cloudinaryService");

module.exports.uploadWebsiteBanner = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const uploadedImage = await uploadFile(req.file, "websiteBanner");
    const websiteBanner = new WebsiteBanner({
      image: uploadedImage.secure_url,
    });

    await websiteBanner.save();
    res.status(201).json(websiteBanner);
  } catch (err) {
    res.status(500).json({ message: "Banner upload failed", error: err });
  }
};

module.exports.getAllWebsiteBanners = async (req, res) => {
  try {
    const websiteBanners = await WebsiteBanner.find().sort({ createdAt: -1 });
    res.status(200).json(websiteBanners);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch banners", error: err });
  }
};

module.exports.deleteWebsiteBanner = async (req, res) => {
  try {
    const websiteBanner = await WebsiteBanner.findByIdAndDelete(req.params.id);
    if (!websiteBanner) {
      return res.status(404).json({ message: "Banner not found" });
    }

    // Optionally delete the image file from disk
    const filePath = path.join(__dirname, "..", websiteBanner.image);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    console.log(filePath);

    res.status(200).json({ message: "Banner deleted" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete banner", error: err });
  }
};
