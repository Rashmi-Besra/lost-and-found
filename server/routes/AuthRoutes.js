import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cors from "cors";
import { db } from "../config/firebaseConfig.js";
import { verifyUser } from "../middleware/authmiddle.js";

dotenv.config();

const UserRouter = express.Router();
UserRouter.use(cors());

/* Generate JWT */

const generateToken = (uid) => {
  return jwt.sign({ uid }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
};

/* SIGNUP */

UserRouter.post("/signup", verifyUser, async (req, res) => {
  try {

    const { uid, email } = req.user;

    const {
      fullName,
      rollNumber,
      branch,
      year,
      hostelName,
      password
    } = req.body;

    if (!fullName || !rollNumber || !branch || !year || !hostelName || !password) {
      return res.status(400).json({
        error: "All fields are required"
      });
    }

    /* Check if user already exists */

    const userRef = db.collection("users").doc(uid);
    const existingUser = await userRef.get();

    if (existingUser.exists) {
      return res.status(400).json({
        error: "User already exists"
      });
    }

    /* Hash password */

    const hashedPassword = await bcrypt.hash(password, 10);

    /* Save user */

    await userRef.set({
      uid,
      fullName,
      rollNumber,
      branch,
      year,
      hostelName,
      email,
      password: hashedPassword,
      createdAt: new Date()
    });

    const token = generateToken(uid);

    res.status(201).json({
      message: "Student registered successfully",
      token
    });

  } catch (error) {

    console.error("Signup error:", error);

    res.status(500).json({
      error: "Signup failed",
      details: error.message
    });

  }
});


/* LOGIN */

UserRouter.post("/login", async (req, res) => {

  try {

    const { email, password } = req.body;

    const userSnapshot = await db
      .collection("users")
      .where("email", "==", email)
      .get();

    if (userSnapshot.empty) {
      return res.status(404).json({
        error: "User not found"
      });
    }

    const userDoc = userSnapshot.docs[0];
    const userData = userDoc.data();

    const isValidPassword = await bcrypt.compare(password, userData.password);

    if (!isValidPassword) {
      return res.status(401).json({
        error: "Invalid credentials"
      });
    }

    const token = generateToken(userData.uid);

    return res.status(200).json({
      message: "Login successful",
      token,
      user: {
        uid: userData.uid,
        fullName: userData.fullName,
        rollNumber: userData.rollNumber,
        branch: userData.branch,
        year: userData.year,
        hostelName: userData.hostelName,
        email: userData.email
      }
    });

  } catch (error) {

    console.error("Login error:", error);

    return res.status(500).json({
      error: error.message
    });

  }

});

export default UserRouter;