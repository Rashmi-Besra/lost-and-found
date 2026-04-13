import express from "express";
import { getUserProfile, updateUserProfile } from "../controllers/UserControl.js";
import { verifyUser } from "../middleware/authmiddle.js";

const ProfileRouter = express.Router();

/* Get logged-in user's profile */

ProfileRouter.get("/profile", verifyUser, getUserProfile);

/* Update logged-in user's profile */

ProfileRouter.put("/update-profile", verifyUser, updateUserProfile);

export default ProfileRouter;