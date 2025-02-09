import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import busRoutes from "./routes/busRoutes.js";
import pool from "./config/db.js";


// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev")); // Logs API requests
app.use(express.json()); // Parse JSON request body

// API Routes
app.use("/api/buses", busRoutes);

// Root Route
app.get("/", (req, res) => {
  res.send("🚀 Welcome to the Urban Transport API!");
});

// Start Server
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
