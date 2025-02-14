import express from "express";
import { getLiveData } from "../controllers/transportController.js";

const router = express.Router();

router.get("/live", getLiveData); // Fetch live bus/train data

export default router;
