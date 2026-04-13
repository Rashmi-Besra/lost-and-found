import { auth } from "../config/firebaseConfig.js";

export const verifyUser = async (req, res, next) => {
  try {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split("Bearer ")[1];

    if (!token) {
      return res.status(401).json({
        message: "Invalid authorization format",
      });
    }

    const decodedToken = await auth.verifyIdToken(token);

    // Attach user info to request
    req.user = decodedToken;
    req.userId = decodedToken.uid;

    next();

  } catch (error) {

    console.error("Token Verification Error:", error);

    return res.status(403).json({
      message: "Unauthorized access",
    });

  }
};