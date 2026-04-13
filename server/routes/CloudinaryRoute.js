import express from "express";
import multer from "multer";
import { uploadToCloudinary, deleteFromCloudinary } from "../config/CloudinaryConfig.js";

const Cloudrouter = express.Router();

/* Multer configuration */

const upload = multer({
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only image files are allowed"), false);
    }
    cb(null, true);
  }
});

/* Upload image */

Cloudrouter.post("/upload", upload.single("image"), async (req, res) => {

  if (!req.file) {
    return res.status(400).json({
      error: "No image file uploaded"
    });
  }

  try {

    const folder = req.body.folder || "reclaim/items";

    const result = await uploadToCloudinary(
      req.file.buffer,
      folder
    );

    res.json({
      message: "Image uploaded successfully",
      imageUrl: result.url,
      publicId: result.publicId
    });

  } catch (error) {

    console.error("Upload error:", error);

    res.status(500).json({
      error: "Image upload failed"
    });

  }

});

/* Delete image */

Cloudrouter.delete("/delete-image", async (req, res) => {

  const { publicId } = req.body;

  if (!publicId) {
    return res.status(400).json({
      error: "publicId is required"
    });
  }

  try {

    const result = await deleteFromCloudinary(publicId);

    res.json({
      message: "Image deleted successfully",
      result
    });

  } catch (error) {

    console.error("Delete error:", error);

    res.status(500).json({
      error: "Image deletion failed"
    });

  }

});

export default Cloudrouter;