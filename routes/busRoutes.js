import express from "express";
import { body, validationResult } from "express-validator";
import pool from "../db.js";

const router = express.Router();

// 🟢 GET: Fetch All Buses
router.get("/", async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM buses ORDER BY id ASC");
    res.json(result.rows);
  } catch (error) {
    console.error("Error fetching buses:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// 🟢 POST: Add a New Bus (With Validation)
router.post(
  "/",
  [
    body("name").notEmpty().withMessage("Bus name is required"),
    body("route").notEmpty().withMessage("Route is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, route } = req.body;
      const newBus = await pool.query(
        "INSERT INTO buses (name, route) VALUES ($1, $2) RETURNING *",
        [name, route]
      );
      res.status(201).json(newBus.rows[0]);
    } catch (error) {
      console.error("Error adding bus:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// 🟢 PUT: Update a Bus
router.put(
  "/:id",
  [
    body("name").notEmpty().withMessage("Bus name is required"),
    body("route").notEmpty().withMessage("Route is required"),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      const { name, route } = req.body;
      const { id } = req.params;

      const updatedBus = await pool.query(
        "UPDATE buses SET name = $1, route = $2 WHERE id = $3 RETURNING *",
        [name, route, id]
      );

      if (updatedBus.rows.length === 0) {
        return res.status(404).json({ error: "Bus not found" });
      }

      res.json(updatedBus.rows[0]);
    } catch (error) {
      console.error("Error updating bus:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
);

// 🟢 DELETE: Remove a Bus
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBus = await pool.query("DELETE FROM buses WHERE id = $1 RETURNING *", [id]);

    if (deletedBus.rows.length === 0) {
      return res.status(404).json({ error: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    console.error("Error deleting bus:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
