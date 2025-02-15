import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";
import pool from "./config/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// 🔥 API Route for fetching buses
app.get("/api/buses", async (req, res) => {
    const { from, to } = req.query;

    // Check if at least one parameter is provided
    if (!from && !to) {
        return res.status(400).json({ error: "At least one parameter ('from' or 'to') is required." });
    }

    let query = "SELECT * FROM buses WHERE 1=1"; // Base query
    let values = [];

    if (from) {
        query += " AND LOWER(from_location) = LOWER($1)";
        values.push(from);
    }

    if (to) {
        query += " AND LOWER(to_location) = LOWER($" + (values.length + 1) + ")";
        values.push(to);
    }

    try {
        const result = await pool.query(query, values);
        return res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Failed to retrieve buses" });
    }
});

// Root Route
app.get("/", (req, res) => {
    res.send("🚀 Welcome to the Urban Transport API!");
});

// Start Server
app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
