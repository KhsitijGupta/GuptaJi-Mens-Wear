const cloudinary = require("cloudinary").v2;
const { Readable } = require("stream");

cloudinary.config({
  secure: true,
});

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      },
    );

    const readable = new Readable();
    readable._read = () => {};
    readable.push(buffer);
    readable.push(null);
    readable.pipe(uploadStream);
  });

const uploadFile = async (file, folder = "ecommerce") => {
  if (!file) throw new Error("No file provided for Cloudinary upload");

  const options = {
    folder,
    use_filename: true,
    unique_filename: true,
    overwrite: false,
    resource_type: "auto",
  };

  try {
    if (Buffer.isBuffer(file)) {
      return await uploadBuffer(file, options);
    }

    if (file.buffer) {
      return await uploadBuffer(file.buffer, options);
    }

    throw new Error(
      "Invalid file object for Cloudinary upload. Expecting multer memory buffer.",
    );
  } catch (err) {
    console.error("========== CLOUDINARY ERROR ==========");
    console.dir(err, { depth: null });
    console.error("======================================");
    throw err;
  }
};
const uploadFiles = async (files, folder = "ecommerce") => {
  const uploads = await Promise.all(
    files.map(async (file) => {
      if (!file) return null;
      return uploadFile(file, folder);
    }),
  );
  return uploads.filter(Boolean);
};

module.exports = {
  uploadFile,
  uploadFiles,
};
