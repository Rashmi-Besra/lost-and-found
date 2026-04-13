import express from "express";
import dotenv from "dotenv";
import cors from "cors";

/* Routes */

import UserRouter from "./routes/AuthRoutes.js";
import Cloudrouter from "./routes/CloudinaryRoute.js";
import Reportrouter from "./routes/ReportRoute.js";
import FoundRouter from "./routes/FoundRoute.js";
import Matchrouter from "./routes/MatchRoute.js";
import ProfileRouter from "./routes/UserRoute.js";
import NearbyRoute from "./controllers/nearby.js";
import MailRouter from "./routes/Mailroute.js";

dotenv.config();

const app = express();

/* Middleware */

app.use(express.json());

app.use(
  cors({
    origin: [
      "https://los-n-found-p783.onrender.com", // production frontend
      "http://localhost:5173" // local Vite frontend
    ],
    credentials: true
  })
);

/* Health check */

app.get("/", (req, res) => {
  res.json({ message: "Reclaim API running successfully " });
});

/* API Routes */

app.use("/api/auth", UserRouter);
app.use("/api/cloudinary", Cloudrouter);

app.use("/api", Reportrouter);
app.use("/api", FoundRouter);
app.use("/api", Matchrouter);
app.use("/api", ProfileRouter);
app.use("/api", NearbyRoute);
app.use("/api", MailRouter);

/* Global Error Handler */

app.use((err, req, res, next) => {
  console.error("Server error:", err);
  res.status(500).json({
    error: "Internal server error"
  });
});

/* Start server */

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});