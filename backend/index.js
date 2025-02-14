import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import pool from "./config/db.js"; // PostgreSQL database connection

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev")); // Logs API requests
app.use(express.json()); // Parse JSON request body

// API Route to fetch buses based on user input
app.get("/api/buses", async (req, res) => {
    const { from, to } = req.query;

    // Check if "from" and "to" are provided
    if (!from || !to) {
        return res.status(400).json({ error: "Both 'from' and 'to' parameters are required." });
    }

    let query = "SELECT * FROM buses WHERE from_location ILIKE $1 AND to_location ILIKE $2";
    const values = [from, to];

    try {
        const result = await pool.query(query, values);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "No buses available for this route." });
        }

        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to retrieve buses" });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 Welcome to the Urban Transport API!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
});
