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

app.get("/api/buses", async (req, res) => {
    const { from, to } = req.query;
    let query = "SELECT * FROM buses";
    const values = [];

    if (from && to) {
        query += " WHERE from_location = $1 AND to_location = $2";
        values.push(from, to);
    } else if (from) {
        query += " WHERE from_location = $1";
        values.push(from);
    } else if (to) {
        query += " WHERE to_location = $1";
        values.push(to);
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
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
