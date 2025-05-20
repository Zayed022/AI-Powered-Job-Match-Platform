// CreateJobs.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { SkillInput } from "./SkillInput"

function CreateJobs() {
  const navigate = useNavigate();

  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    skills: [],
  });

  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!job.title || !job.company || !job.location || !job.skills.length) {
      toast.error("Fill in all required fields");
      return;
    }
    console.log("Submitting job:", job);


    setSaving(true);
    try {
      await axios.post(
        "https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/",
        job,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Job created");
      navigate("/home-admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Could not create the job listing");
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Create Job</h1>

      <form
        onSubmit={handleSubmit}
        className="space-y-6 rounded-2xl border bg-white p-8 shadow dark:bg-slate-800 dark:border-slate-700"
      >
        {/* title */}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Job title *</span>
          <input
            name="title"
            value={job.title}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Senior React Developer"
            required
          />
        </label>

        {/* company */}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Company *</span>
          <input
            name="company"
            value={job.company}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Acme Inc."
            required
          />
        </label>

        {/* location */}
        <label className="block">
          <span className="mb-1 block text-sm font-medium">Location *</span>
          <input
            name="location"
            value={job.location}
            onChange={handleChange}
            className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Remote / New York / Berlin …"
            required
          />
        </label>

        {/* skills */}
        <SkillInput
  skills={job.skills || []}
  setSkills={(s) => setJob((prev) => ({ ...prev, skills: s }))}
/>


        {/* submit button */}
        <button
          type="submit"
          disabled={saving}
          className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving ? "Creating…" : "Create Job"}
        </button>
      </form>
    </section>
  );
}

export default CreateJobs;
