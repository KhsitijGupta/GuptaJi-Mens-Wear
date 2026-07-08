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
const storage = multer.memoryStorage();

// File filter logic
const fileFilter = (req, file, cb) => {
  const imageRegex = /\.(jpg|jpeg|png|webp)$/i;
  const resumeRegex = /\.(pdf|doc|docx)$/i;

  const imageFields = ["profileImage", "licenseFile", "idProofFile"];

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

const uploadDeliveryPerson = multer({ storage, fileFilter, limits });
module.exports = uploadDeliveryPerson;
