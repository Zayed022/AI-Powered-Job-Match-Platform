// routes/recommendation.js
import express from "express";
import {verifyJWT} from "../middlewares/auth.middlewares.js";
import { getJobRecommendations } from "../controllers/recommendation.controllers.js";

const router = express.Router();
router.post("/", verifyJWT, getJobRecommendations);
export default router;
