// src/pages/DeleteJobs.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

/* -------------------------------------------------------------------------- */
/*                                   modal                                    */
/* -------------------------------------------------------------------------- */
function ConfirmModal({ show, onClose, onConfirm, title }) {
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50">
      <div className="w-full max-w-sm rounded-xl bg-white p-6 shadow-lg dark:bg-slate-800">
        <h3 className="mb-4 text-lg font-semibold">
          Delete “{title}”?
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          This action is <strong>irreversible.</strong>
        </p>

        <div className="mt-6 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="rounded-md border px-4 py-1.5 text-sm hover:bg-gray-100 dark:border-slate-600 dark:hover:bg-slate-700">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="rounded-md bg-red-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-red-700">
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                 main page                                  */
/* -------------------------------------------------------------------------- */
export default function DeleteJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [target, setTarget] = useState(null);         // job to delete
  const navigate = useNavigate();

  /* ---------- fetch list once ---------- */
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get(
          "https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs"
        );
        setJobs(data);
      } catch (_) {
        toast.error("Could not load jobs");
        navigate("/admin");
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  /* ---------- call delete ---------- */
  const deleteJob = async () => {
    if (!target) return;
    try {
      await axios.delete(
        `https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/${target._id}`,
        {
          withCredentials: true, // JWT cookie
        }
      );
      setJobs((prev) => prev.filter((j) => j._id !== target._id));
      toast.success("Job deleted");
    } catch (err) {
      toast.error(err.response?.data?.message || "Delete failed");
    } finally {
      setTarget(null);
    }
  };

  /* ---------------- UI ---------------- */
  if (loading) return <p className="mt-10 text-center">Loading …</p>;

  return (
    <section className="mx-auto max-w-5xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold tracking-tight">Delete Jobs</h1>

      {jobs.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300">No jobs available.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border shadow-sm dark:border-slate-700">
          <table className="min-w-full divide-y divide-gray-200 text-sm dark:divide-slate-700">
            <thead className="bg-gray-50 dark:bg-slate-800">
              <tr>
                <Th>Title</Th>
                <Th>Company</Th>
                <Th>Location</Th>
                <Th>Skills</Th>
                <th className="px-4 py-3 text-right"> </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
              {jobs.map((j) => (
                <tr key={j._id} className="hover:bg-gray-50 dark:hover:bg-slate-800/40">
                  <Td>{j.title}</Td>
                  <Td>{j.company}</Td>
                  <Td>{j.location}</Td>
                  <Td>
                    {j.skills.slice(0, 3).join(", ")}
                    {j.skills.length > 3 && "…"}
                  </Td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => setTarget(j)}
                      className="rounded-md bg-red-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-red-700">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* confirmation modal */}
      <ConfirmModal
        show={Boolean(target)}
        title={target?.title}
        onClose={() => setTarget(null)}
        onConfirm={deleteJob}
      />
    </section>
  );
}

/* ---------------- tiny helpers ---------------- */

function Th({ children }) {
  return (
    <th className="whitespace-nowrap px-4 py-3 text-left font-semibold text-gray-600 dark:text-gray-300">
      {children}
    </th>
  );
}
function Td({ children }) {
  return (
    <td className="whitespace-nowrap px-4 py-3 text-gray-800 dark:text-gray-100">
      {children}
    </td>
  );
}
