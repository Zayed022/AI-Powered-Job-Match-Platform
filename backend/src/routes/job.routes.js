import express from "express";
import { body } from "express-validator";

import {
  getAllJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  searchJob,
} from "../controllers/job.controllers.js";
import { verifyJWTAdmin } from "../middlewares/auth.middlewares.js";

const router = express.Router();

// public
router.get("/", getAllJobs);
router.route("/delete-job").delete(deleteJob)
router.get("/search",searchJob)
router.get("/:id", getJobById);

// admin-protected
const jobValidators = [
  body("title").notEmpty().withMessage("Title required"),
  body("company").notEmpty().withMessage("Company required"),
  body("location").notEmpty().withMessage("Location required"),
  body("skills")
    .isArray({ min: 1 })
    .withMessage("Skills must be an array of strings"),
];

router.post("/", jobValidators, createJob);
router.put("/:id", jobValidators, updateJob);



export default router;
