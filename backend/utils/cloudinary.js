const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const cloudinaryUploadImage = async (fileToUpload, resource_type = "auto") => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload(
      fileToUpload,
      { resource_type },
      (error, result) => {
        if (error) {
          reject(error);
        } else {
          resolve({ url: result.secure_url });
        }
      }
    );
  });
};

module.exports = { cloudinaryUploadImage };
