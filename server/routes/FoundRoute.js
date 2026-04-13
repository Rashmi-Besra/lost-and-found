import express from "express";
import { db } from "../config/firebaseConfig.js";
import { verifyUser } from "../middleware/authmiddle.js";

const FoundRouter = express.Router();

/* Report Found Item */

FoundRouter.post("/found", verifyUser, async (req, res) => {

  try {

    const { category, description, location, imageUrl } = req.body;
    const userId = req.userId;

    /* Validate input */

    if (!category || !description || !location?.lat || !location?.lng) {
      return res.status(400).json({
        error: "Category, description, and valid location are required"
      });
    }

    const foundData = {

      userId,
      category,
      description,

      location: {
        lat: Number(location.lat),
        lng: Number(location.lng)
      },

      imageUrl: imageUrl || null,

      createdAt: new Date(),
      type: "found"

    };

    const docRef = await db.collection("foundItems").add(foundData);

    return res.status(201).json({
      message: "Found item reported successfully",
      id: docRef.id
    });

  } catch (error) {

    console.error("Found item error:", error);

    return res.status(500).json({
      error: "Failed to submit found item report"
    });

  }

});

export default FoundRouter;