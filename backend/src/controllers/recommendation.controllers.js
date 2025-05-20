import { CohereClient } from "cohere-ai";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";

const cohere = new CohereClient({
  apiKey: process.env.CO_API_KEY,   // ← set in .env
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
      max_tokens: 250,
      temperature: 0.5,
    });

    const generations = cohereRes.body?.generations;
    if (!generations || generations.length === 0) {
      return res.status(200).json({ matches: [] });
    }

    const matches = parseToCards(generations[0].text);
    res.json({ matches });

  } catch (err) {
    console.error("Recommendation Error:", err);
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
    const match = text.match(/\[.*\]/s); // Match JSON array
    if (!match) return [];
    return JSON.parse(match[0]).slice(0, 3);
  } catch (err) {
    console.error("Parsing error:", err);
    return [];
  }
}

