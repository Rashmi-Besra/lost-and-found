import { v2 as cloudinary } from "cloudinary";
import streamifier from "streamifier";
import dotenv from "dotenv";

dotenv.config();

/* Configure Cloudinary */

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/* Upload image to Cloudinary */

export const uploadToCloudinary = async (
  fileBuffer,
  folder = "reclaim/lost-items"
) => {
  return new Promise((resolve, reject) => {
    try {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder,
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            console.error("Cloudinary Upload Error:", error);
            return reject(error);
          }

          resolve({
            url: result.secure_url,
            publicId: result.public_id,
          });
        }
      );

      streamifier.createReadStream(fileBuffer).pipe(stream);
    } catch (error) {
      reject(error);
    }
  });
};

/* Delete image from Cloudinary */

export const deleteFromCloudinary = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);

    return result;
  } catch (error) {
    console.error("Cloudinary Delete Error:", error);
    throw error;
  }
};