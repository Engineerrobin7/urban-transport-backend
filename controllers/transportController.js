import pool from "../config/db.js";

export const getLiveData = async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM transport_data");
    res.json(rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};
