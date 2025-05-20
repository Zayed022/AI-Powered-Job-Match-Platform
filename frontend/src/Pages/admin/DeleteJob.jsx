
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const DeleteJob = () => {
  const [jobId, setJobId] = useState("");

  const handleDelete = async (e) => {
    e.preventDefault();

    if (!jobId) {
      toast.error("Please enter a Job ID.");
      return;
    }

    const confirmDelete = window.confirm(
      `Are you sure you want to delete job with ID: ${jobId}?`
    );
    if (!confirmDelete) return;

    try {
      const res = await axios.delete(
        "https://ai-powered-job-match-platform-1.onrender.com/api/v1/jobs/delete-job",
        {
          data: { jobId },
        }
      );
      toast.success(res.data.message || "Job deleted successfully");
      setJobId("");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Something went wrong while deleting"
      );
    }
  };

  return (
    <div className="max-w-xl mx-auto px-6 py-10 bg-white shadow-xl rounded-xl">
      <h1 className="text-2xl font-semibold text-gray-800 mb-6">Delete Job</h1>
      <form onSubmit={handleDelete} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Enter Job ID to Delete
          </label>
          <input
            type="text"
            name="jobId"
            value={jobId}
            onChange={(e) => setJobId(e.target.value)}
            required
            className="mt-1 w-full border border-gray-300 rounded-md px-4 py-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., 65fa8341b3e12345abcd1234"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
        >
          Delete Job
        </button>
      </form>
    </div>
  );
};

export default DeleteJob;
