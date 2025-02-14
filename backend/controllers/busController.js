import { pool } from "../config/db.js";

// ✅ Get all buses
export const getBuses = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM buses");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get a bus by ID
export const getBusById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM buses WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Bus not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
