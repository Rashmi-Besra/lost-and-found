import express from "express";
import { db } from "../config/firebaseConfig.js";
import { verifyUser } from "../middleware/authmiddle.js";

const Reportrouter = express.Router();

/* Report Lost Item */

Reportrouter.post("/report", verifyUser, async (req, res) => {

  try {

    const { category, description, location, imageUrl } = req.body;
    const userId = req.userId;

    /* Validation */

    if (!category || !description || !location?.lat || !location?.lng) {
      return res.status(400).json({
        error: "Category, description and valid location are required"
      });
    }

    const reportData = {

      userId,
      category,
      description,

      location: {
        lat: Number(location.lat),
        lng: Number(location.lng)
      },

      imageUrl: imageUrl || null,

      type: "lost",

      createdAt: new Date()

    };

    const docRef = await db.collection("reportedItems").add(reportData);

    return res.status(201).json({
      message: "Lost item reported successfully",
      id: docRef.id
    });

  } catch (error) {

    console.error("Report error:", error);

    return res.status(500).json({
      error: "Failed to submit report"
    });

  }

});

export default Reportrouter;