// src/pages/FindMyMatches.jsx
import { useState } from 'react';


import { Loader2 } from 'lucide-react';
import axios from 'axios';

const FindMyMatches = () => {
  const [loading, setLoading] = useState(false);
  const [matches, setMatches] = useState([]);

  const fetchRecommendations = async () => {
    setLoading(true);
    try {
      const { data } = await axios.post(
        'https://ai-powered-job-match-platform-1.onrender.com/api/v1/recommend/', // matches your route
        {},                     // no payload needed; backend uses JWT to identify user
        { withCredentials: true } // include cookies if using cookie auth
      );
      setMatches(data.matches);
    } catch (err) {
      console.error('Error:', err);
      alert('Failed to get recommendations');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">AI Job Recommendations</h2>
        <div onClick={fetchRecommendations} disabled={loading}>
          {loading ? (
            <span className="flex items-center gap-2">
              <Loader2 className="animate-spin w-4 h-4" /> Fetching...
            </span>
          ) : (
            'Find My Matches'
          )}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((job, idx) => (
          <div key={idx} className="border shadow-sm hover:shadow-lg transition">
            <div className="p-4 space-y-2">
              <h3 className="text-lg font-bold">{job.title}</h3>
              <p className="text-sm text-muted-foreground">{job.company}</p>
              <p className="text-sm">{job.location}</p>
              <p className="text-sm italic text-gray-500">{job.reason}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FindMyMatches;
