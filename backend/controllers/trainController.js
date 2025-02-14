import { pool } from "../config/db.js";

// ✅ Get all trains
export const getTrains = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM trains");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching trains:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ✅ Get a train by ID
export const getTrainById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query("SELECT * FROM trains WHERE id = $1", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Train not found" });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error("Error fetching train:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
