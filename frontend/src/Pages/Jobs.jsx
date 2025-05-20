import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

 // adjust if your route is different

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs", {
          headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
          withCredentials: true,
        });
        setJobs(data);
      } catch (err) {
        toast.error(err.response?.data?.message || "Could not fetch jobs");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p className="mt-10 text-center">Loading jobs…</p>;

  if (!jobs.length)
    return <p className="mt-10 text-center text-gray-600">No jobs found.</p>;

  return (
    <section className="px-4 py-8 flex justify-center">
      <div className="w-full max-w-5xl grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))}
      </div>
    </section>
  );
}

/* ----------------------------- helper card ----------------------------- */

function JobCard({ job }) {
  return (
    <article className="rounded-2xl border shadow-sm p-6 flex flex-col bg-white hover:shadow-md transition-shadow">
      <h3 className="text-lg font-semibold mb-1">{job.title}</h3>
      <p className="text-sm text-gray-700 mb-2">{job.company}</p>

      <div className="flex items-center gap-1 text-sm text-gray-500 mb-4">
        <MapPinIcon className="w-4 h-4" />
        {job.location}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {job.skills.map((skill) => (
          <span
            key={skill}
            className="px-2 py-0.5 rounded-full text-xs bg-blue-50 text-blue-600 border border-blue-200"
          >
            {skill}
          </span>
        ))}
      </div>

      {/* extra space for future actions like Apply button */}
    </article>
  );
}

/* ----------------------------- icons ----------------------------- */
function MapPinIcon(props) {
  return (
    <svg
      {...props}
      fill="none"
      strokeWidth={1.5}
      stroke="currentColor"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 10a3 3 0 11-6 0 3 3 0 016 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 10c0 7.5-7.5 12-7.5 12S4.5 17.5 4.5 10a7.5 7.5 0 1115 0z"
      />
    </svg>
  );
}
