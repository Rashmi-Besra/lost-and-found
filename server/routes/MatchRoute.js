import express from "express";
import { matchUserItems } from "../controllers/matchControl.js";
import { verifyUser } from "../middleware/authmiddle.js";

const Matchrouter = express.Router();

/* Get matches for logged-in user */

Matchrouter.get("/matches", verifyUser, async (req, res) => {

  try {

    const userId = req.userId;

    const matches = await matchUserItems(userId);

    return res.status(200).json({
      success: true,
      count: matches.length,
      matches
    });

  } catch (error) {

    console.error("Error fetching matches:", error);

    return res.status(500).json({
      error: "Failed to fetch matches"
    });

  }

});

export default Matchrouter;