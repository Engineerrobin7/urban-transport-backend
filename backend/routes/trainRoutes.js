import express from "express";
import { getTrains, getTrainById } from "../controllers/trainController.js";

const router = express.Router();

router.get("/", getTrains);  // Get all trains
router.get("/:id", getTrainById); // Get train by ID

export default router;
