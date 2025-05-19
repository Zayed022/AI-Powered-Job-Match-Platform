import { CohereClient } from "cohere-ai";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

const cohere = new CohereClient({
  apiKey: process.env.COHERE_API_KEY,   // ← set in .env
});

// POST /api/recommendations  (JWT protected)
export const getJobRecommendations = async (req, res) => {
  try {
    /* 1) Gather user + jobs */
    const user = await User.findById(req.user.id).lean();
    const jobs = await Job.find({}).lean();

    /* 2) Craft prompt */
    const prompt = buildPrompt(user, jobs);

    /* 3) Call Cohere */
    const { body } = await cohere.generate({
      model: "command-r",
      prompt,
      max_tokens: 250,
      temperature: 0.5,
    });

    /* 4) Parse Cohere text → JS array */
    const matches = parseToCards(body.generations[0].text);

    res.json({ matches });               // → frontend
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "AI service unavailable" });
  }
};

/* ---------- helpers ---------- */

function buildPrompt(user, jobs) {
  return `
You are an expert tech recruiter.

USER PROFILE
Name: ${user.name}
Experience: ${user.yearsExperience} years
Skills: ${user.skills.join(", ")}
Preferred type: ${user.preferredJobType}
Location: ${user.location}

JOB LIST (${jobs.length} total)
${jobs
  .map(
    (j, i) =>
      `${i + 1}. ${j.title} at ${j.company} – ${j.location} – skills: ${j.skills.join(
        ", "
      )}`
  )
  .join("\n")}

TASK
Choose the 3 best-fit jobs. For each, output:
- title
- company
- location
- one-sentence reason

Return as JSON array of objects.
`;
}

function parseToCards(text) {
  try {
    // Cohere already returns valid JSON when asked; quick safety net:
    const jsonStart = text.indexOf("[");
    const json = text.slice(jsonStart);
    return JSON.parse(json).slice(0, 3);   // top 3 only
  } catch {
    return []; // fallback empty
  }
}
