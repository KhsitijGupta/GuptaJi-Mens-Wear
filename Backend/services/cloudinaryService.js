const cloudinary = require("cloudinary").v2;
const fs = require("fs");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const deleteLocalFile = (filePath) => {
  if (!filePath) return;
  try {
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
  } catch (error) {
    console.warn("Could not delete local file:", filePath, error.message);
  }
};

const uploadFile = async (filePath, folder = "ecommerce") => {
  if (!filePath) throw new Error("No file path provided for Cloudinary upload");

  const result = await cloudinary.uploader.upload(filePath, {
    folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: "auto",
  });

  deleteLocalFile(filePath);
  return result;
};

const uploadFiles = async (files, folder = "ecommerce") => {
  const uploads = await Promise.all(
    files.map(async (file) => {
      const result = await uploadFile(file.path, folder);
      return result;
    }),
  );

  return uploads;
};

module.exports = {
  uploadFile,
  uploadFiles,
  deleteLocalFile,
};
