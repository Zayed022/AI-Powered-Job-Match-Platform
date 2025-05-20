import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function SearchJobs() {
  const [query, setQuery] = useState("");
  const [location, setLocation] = useState("");
  const [skills, setSkills] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const searchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(
        `http://localhost:4020/api/v1/jobs/search`,
        {
          params: {
            query,
            location,
            skills,
          },
        }
      );
      setResults(data);
    } catch (err) {
      toast.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    searchJobs();
  }, []);

  return (
    <section className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="mb-6 text-3xl font-bold">Search & Filter Jobs</h1>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <input
          type="text"
          placeholder="Search by title…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="rounded-md border p-2 dark:bg-slate-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Location…"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="rounded-md border p-2 dark:bg-slate-800 dark:text-white"
        />
        <input
          type="text"
          placeholder="Skills (comma separated)"
          value={skills}
          onChange={(e) => setSkills(e.target.value)}
          className="rounded-md border p-2 dark:bg-slate-800 dark:text-white"
        />
      </div>

      <button
        onClick={searchJobs}
        className="mt-4 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700">
        Search
      </button>

      <div className="mt-10">
        {loading ? (
          <p>Loading…</p>
        ) : results.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-300">No jobs found.</p>
        ) : (
          <ul className="space-y-4">
            {results.map((job) => (
              <li
                key={job._id}
                className="rounded-lg border p-4 shadow-sm dark:border-slate-700 dark:bg-slate-800">
                <h3 className="text-lg font-semibold">{job.title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {job.company} — {job.location}
                </p>
                <p className="text-sm text-gray-700 dark:text-gray-200">
                  Skills: {job.skills.join(", ")}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}