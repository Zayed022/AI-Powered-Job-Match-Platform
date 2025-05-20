import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";


function JobCard({ job }) {
  if (!job) return null;
  return (
    <div className="rounded-2xl border bg-white p-6 shadow dark:bg-slate-800 dark:border-slate-700">
      <h2 className="mb-2 text-2xl font-semibold tracking-tight">{job.title}</h2>
      <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
        <strong>Company:</strong> {job.company}
      </p>
      <p className="mb-1 text-sm text-gray-600 dark:text-gray-300">
        <strong>Location:</strong> {job.location}
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        {job.skills.map((s) => (
          <span
            key={s}
            className="rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800 dark:bg-blue-900/30 dark:text-blue-300">
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}


export default function GetJobById() {
  const navigate = useNavigate();

  
  const [jobs, setJobs] = useState([]);      // for dropdown convenience
  const [jobId, setJobId] = useState("");
  const [job, setJob] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [searching, setSearching] = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs"
        );
        setJobs(data);
      } catch (_) {
        toast.error("Could not fetch jobs");
        navigate("/home-admin");
      } finally {
        setLoadingList(false);
      }
    })();
  }, [navigate]);

 
  const fetchJob = async () => {
    if (!jobId.trim()) return toast.error("Enter a job ID");
    setSearching(true);
    try {
      const { data } = await axios.get(
        `https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/${jobId.trim()}`
      );
      setJob(data);
    } catch (err) {
      setJob(null);
      toast.error(err.response?.data?.message || "Job not found");
    } finally {
      setSearching(false);
    }
  };


  if (loadingList) return <p className="mt-10 text-center">Loading …</p>;

  return (
    <section className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Find Job by ID</h1>

      {/* input row */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row">
        {/* free-text id */}
        <input
          type="text"
          placeholder="Paste job ObjectID…"
          value={jobId}
          onChange={(e) => setJobId(e.target.value)}
          className="flex-1 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* OR dropdown */}
        <select
          value=""
          onChange={(e) => setJobId(e.target.value)}
          className="w-full sm:w-56 rounded-md border px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">— pick from list —</option>
          {jobs.map((j) => (
            <option key={j._id} value={j._id}>
              {j.title} · {j.company}
            </option>
          ))}
        </select>

        <button
          onClick={fetchJob}
          disabled={searching}
          className="rounded-lg bg-blue-600 px-6 py-2.5 text-white font-semibold hover:bg-blue-700 disabled:opacity-60">
          {searching ? "Searching…" : "Find"}
        </button>
      </div>

      {/* result */}
      {job && <JobCard job={job} />}
    </section>
  );
}
