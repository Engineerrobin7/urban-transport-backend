import express from "express";
import pool from "../config/db.js";

const router = express.Router();

// Get buses based on `from` and `to` query parameters
router.get("/", async (req, res) => {
    const { from, to } = req.query;
    let query = "SELECT * FROM buses";
    const values = [];
    const conditions = [];

    if (from) {
        conditions.push("LOWER(from_location) = LOWER($1)");
        values.push(from);
    }
    if (to) {
        conditions.push("LOWER(to_location) = LOWER($" + (values.length + 1) + ")");
        values.push(to);
    }

    if (conditions.length > 0) {
        query += " WHERE " + conditions.join(" AND ");
    }

    try {
        const result = await pool.query(query, values);
        res.json(result.rows);
    } catch (err) {
        console.error("Database error:", err);
        res.status(500).json({ error: "Failed to retrieve buses" });
    }
});

export default router;
