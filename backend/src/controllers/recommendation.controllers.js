import { CohereClient } from "cohere-ai";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

const cohere = new CohereClient({
  apiKey: process.env.CO_API_KEY,
});

// POST /api/recommendations  (JWT protected)
export const getJobRecommendations = async (req, res) => {
  try {
    console.log("Using Cohere Key:", process.env.CO_API_KEY);

    const user = await User.findById(req.user.id).lean();
    const jobs = await Job.find({}).lean();

    if (!user || jobs.length === 0) {
      return res.status(404).json({ message: "User or jobs not found" });
    }

    const maxJobs = 30;
    const prompt = buildPrompt(user, jobs.slice(0, maxJobs));
    console.log("Prompt to Cohere:", prompt);

    const cohereRes = await cohere.generate({
      model: "command",
      prompt,
      max_tokens: 300,
      temperature: 0.4,
    });

    console.log("Full Cohere Response:", JSON.stringify(cohereRes, null, 2));

    const generations = cohereRes?.generations;

    if (!generations || generations.length === 0) {
      console.warn("Cohere returned no generations.");
      return res.status(200).json({ matches: [] });
    }

    const rawText = generations[0].text;
    const matches = parseToCards(rawText);
    console.log("Raw Cohere Response Text:", rawText);
    res.json({ matches });
  } catch (err) {
    console.error("Recommendation Error:", err);
    res.status(500).json({ message: "AI service unavailable" });
  }
};

/* ---------- Helpers ---------- */

function buildPrompt(user, jobs) {
  return `
You are an expert technical recruiter. You will receive a user profile and a list of job postings. Your task is to return ONLY a JSON array (no extra text), containing the top 3 job matches. Each object in the array must have the fields: "title", "company", "location", and "reason".

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

Return the result as a valid JSON array ONLY, with no explanation or extra content.
Each job should include:
{
  "title": "...",
  "company": "...",
  "location": "...",
  "reason": "..."
}
`;
}

function parseToCards(text) {
  console.log("Raw text before parsing:", text);

  try {
    const start = text.indexOf("[");
    const end = text.lastIndexOf("]");

    if (start === -1 || end === -1 || start >= end) {
      console.warn("No valid JSON array found in text");
      return [];
    }

    const jsonStr = text.slice(start, end + 1);
    const parsed = JSON.parse(jsonStr);
    return Array.isArray(parsed) ? parsed.slice(0, 3) : [];
  } catch (err) {
    console.error("Parsing error:", err.message);
    console.log("Raw text that caused parse error:", text);
    return [];
  }
}
