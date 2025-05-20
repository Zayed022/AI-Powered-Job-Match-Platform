
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";


import { SkillInput } from "./SkillInput";


export default function UpdateJobs() {
  const navigate = useNavigate();

  
  const [jobs, setJobs] = useState([]);          // for list dropdown
  const [selectedId, setSelectedId] = useState("");
  const [job, setJob] = useState({
    title: "",
    company: "",
    location: "",
    skills: [],
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs"
        );
        setJobs(data);
      } catch (e) {
        toast.error("Cannot load jobs list");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  
  useEffect(() => {
    if (!selectedId) return;
    (async () => {
      try {
        const { data } = await axios.get(
          `https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/${selectedId}`
        );
        setJob({
          ...data,
          skills: data.skills || [],
        });
      } catch (e) {
        toast.error("Could not load job");
      }
    })();
  }, [selectedId]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedId) return toast.error("Select a job first");

    if (!job.title || !job.company || !job.location || !job.skills.length) {
      return toast.error("Fill in all required fields");
    }

    setSaving(true);
    try {
      await axios.put(
        `https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/${selectedId}`,
        job,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
          },
          withCredentials: true,
        }
      );
      toast.success("Job updated");
      navigate("/home-admin");
    } catch (err) {
      toast.error(err.response?.data?.message || "Update failed");
    } finally {
      setSaving(false);
    }
  };

 
  if (loading) return <p className="mt-10 text-center">Loading …</p>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Update Job</h1>

      {/* select job */}
      <label className="mb-6 block">
        <span className="mb-1 block text-sm font-medium">Choose job</span>
        <select
          className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}>
          <option value="">— Select —</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title} · {j.company}
            </option>
          ))}
        </select>
      </label>

      {/* form */}
      {selectedId && (
        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border bg-white p-8 shadow dark:bg-slate-800 dark:border-slate-700">
          {/* title */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Job title *</span>
            <input
              name="title"
              value={job.title}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* company */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Company *</span>
            <input
              name="company"
              value={job.company}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* location */}
          <label className="block">
            <span className="mb-1 block text-sm font-medium">Location *</span>
            <input
              name="location"
              value={job.location}
              onChange={handleChange}
              required
              className="w-full rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
            />
          </label>

          {/* skills */}
          <SkillInput
  skills={job.skills || []}
  setSkills={(s) => setJob((prev) => ({ ...prev, skills: s }))}
/>

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      )}
    </section>
  );
}
