const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure directory exists
const ensureDirectoryExists = (dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
};

// Multer storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let folder;

    if (file.fieldname === "profileImage") {
      folder = path.join(__dirname, "..", "uploads", "profileImage");
    } else if (file.fieldname === "websiteBannerImage") {
      folder = path.join(__dirname, "..", "uploads", "websiteBanner");
    } else if (file.fieldname === "applicationBannerImage") {
      folder = path.join(__dirname, "..", "uploads", "applicationBanner");
    } else if (file.fieldname === "applicationSmallBannerImage") {
      folder = path.join(__dirname, "..", "uploads", "applicationSmallBanner");
    } else if (file.fieldname === "blogImage") {
      folder = path.join(__dirname, "..", "uploads", "blog");
    } else if (file.fieldname === "categoryImage") {
      folder = path.join(__dirname, "..", "uploads", "Categroy");
    } else if (file.fieldname === "subCategoryImage") {
      folder = path.join(__dirname, "..", "uploads", "Subcategory");
    } else if (file.fieldname === "productImage") {
      folder = path.join(__dirname, "..", "uploads", "product");
    } else if (file.fieldname === "offerImage") {
      folder = path.join(__dirname, "..", "uploads", "offers");
    } else {
      return cb(new Error("Invalid file field name"), null);
    }

    ensureDirectoryExists(folder);
    cb(null, folder);
  },

  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

// File filter logic
const fileFilter = (req, file, cb) => {
  const imageRegex = /\.(jpg|jpeg|png|webp|avif)$/i;
  const resumeRegex = /\.(pdf|doc|docx)$/i;

  const imageFields = [
    "profileImage",
    "offerImage",
    "websiteBannerImage",
    "applicationBannerImage",
    "applicationSmallBannerImage",
    "blogImage",
    "categoryImage",
    "subCategoryImage",
    "productImage",
  ];

  if (
    imageFields.includes(file.fieldname) &&
    imageRegex.test(file.originalname)
  ) {
    cb(null, true);
  } else if (
    file.fieldname === "resume" &&
    resumeRegex.test(file.originalname)
  ) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type."), false);
  }
};

const limits = {
  fileSize: 5 * 1024 * 1024, // 10MB
};

const upload = multer({ storage, fileFilter, limits });
module.exports = upload;
