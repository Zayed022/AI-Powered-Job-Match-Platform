import { Job } from "../models/job.model.js";

import { validationResult } from "express-validator";


const handleValidation = (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
};

const createJob = async (req, res) => {
  try {
    const { title, company, location, skills } = req.body;
    const job = await Job.create({ title, company, location, skills });
    res.status(201).json(job);
  } catch (err) {
    console.error("createJob:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getAllJobs = async (_req, res) => {
  try {
    const jobs = await Job.find({});
    res.json(jobs);
  } catch (err) {
    console.error("getAllJobs:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    if (!job) return res.status(404).json({ message: "Job not found" });
    res.json(job);
  } catch (err) {
    console.error("getJobById:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const updateJob = async (req, res) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ message: "Admin only" });

  handleValidation(req, res);

  try {
    const { title, company, location, skills } = req.body;
    const updated = await Job.findByIdAndUpdate(
      req.params.id,
      { title, company, location, skills },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Job not found" });
    res.json(updated);
  } catch (err) {
    console.error("updateJob:", err);
    res.status(500).json({ message: "Server error" });
  }
};

const deleteJob = async (req, res) => {
  if (!req.user?.isAdmin)
    return res.status(403).json({ message: "Admin only" });

  try {
    const deleted = await Job.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Job not found" });
    res.json({ message: "Job deleted" });
  } catch (err) {
    console.error("deleteJob:", err);
    res.status(500).json({ message: "Server error" });
  }
};


export {
    createJob,
    getAllJobs,
    getJobById,
    updateJob,
    deleteJob,
}
