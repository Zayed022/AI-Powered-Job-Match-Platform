import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';



export default function Profile() {
  const navigate = useNavigate();

  
  const [form, setForm] = useState({
    name: '',
    location: '',
    yearsExperience: '',
    skills: [],           // multi-select
    preferredJobType: '', // remote / onsite / any
  });

  const [loading, setLoading]   = useState(true);
  const [saving,  setSaving]    = useState(false);

  
  useEffect(() => {
    (async () => {
      try {
        const { data } = await axios.get("https://ai-powered-job-match-platform-1.onrender.com/api/v1/users/profile", {
          headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
          withCredentials: true,
        });
        setForm({
          ...data,
          yearsExperience: data.yearsExperience?.toString() || '',
          skills: data.skills || [],
        });
      } catch (err) {
        toast.error(err.response?.data?.message || 'Could not load profile');
        if (err.response?.status === 401) navigate('/login');
      } finally {
        setLoading(false);
      }
    })();
  }, [navigate]);

  /* ---------- derived completion ---------- */
  const completion = useMemo(() => {
    const points = [
      form.name,
      form.location,
      form.yearsExperience,
      form.skills.length,
      form.preferredJobType,
    ];
    const filled = points.filter(Boolean).length;
    return Math.round((filled / points.length) * 100);
  }, [form]);

  /* ---------- handlers ---------- */
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSkillToggle = skill => {
    setForm(prev => {
      const exists = prev.skills.includes(skill);
      return {
        ...prev,
        skills: exists
          ? prev.skills.filter(s => s !== skill)
          : [...prev.skills, skill],
      };
    });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form, yearsExperience: Number(form.yearsExperience) };
      const { data } = await axios.put("https://ai-powered-job-match-platform-1.onrender.com/api/v1/users/profile", payload, {
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
        withCredentials: true,
      });
      setForm({
        ...data,
        yearsExperience: data.yearsExperience?.toString() || '',
        skills: data.skills || [],
      });
      toast.success('Profile updated');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setSaving(false);
    }
  };

  
  if (loading) return <p className="mt-10 text-center">Loading…</p>;

  return (
    <section className="flex justify-center px-4 py-8">
      <div className="w-full max-w-2xl rounded-2xl border p-8 shadow-sm bg-white">
        {/* ----- progress bar ----- */}
        <div className="mb-6">
          <div className="flex justify-between mb-1 text-sm font-medium">
            <span>Profile completeness</span>
            <span>{completion}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-gray-200">
            <div
              style={{ width: `${completion}%` }}
              className={`h-full rounded-full transition-all
                          ${completion === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
            />
          </div>
        </div>

        {/* ----- form ----- */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <Input
            label="Full name"
            name="name"
            value={form.name}
            onChange={handleChange}
          />

          <Input
            label="Location"
            name="location"
            value={form.location}
            onChange={handleChange}
          />

          <Input
            label="Years of experience"
            name="yearsExperience"
            type="number"
            min="0"
            value={form.yearsExperience}
            onChange={handleChange}
          />

          {/* skills toggle list; adjust to your catalogue */}
          <SkillPicker
            selected={form.skills}
            onToggle={handleSkillToggle}
            catalogue={['JavaScript', 'Python', 'React', 'Node', 'SQL']}
          />

          <Select
            label="Preferred job type"
            name="preferredJobType"
            value={form.preferredJobType}
            onChange={handleChange}
            options={[
              { label: 'Remote', value: 'remote' },
              { label: 'On-site', value: 'onsite' },
              { label: 'Any', value: 'any' },
            ]}
          />

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-lg bg-blue-600 py-2.5 text-white font-semibold
                       disabled:opacity-60 disabled:cursor-not-allowed">
            {saving ? 'Saving…' : 'Save changes'}
          </button>
        </form>
      </div>
    </section>
  );
}

/* -------------------------------- helper components -------------------------------- */

function Input({ label, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <input
        {...props}
        className="w-full rounded-md border px-3 py-2 outline-none
                   focus:ring-2 focus:ring-blue-500"
      />
    </label>
  );
}

function Select({ label, options, ...props }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm font-medium">{label}</span>
      <select
        {...props}
        className="w-full rounded-md border px-3 py-2 outline-none
                   focus:ring-2 focus:ring-blue-500">
        <option value="">Select…</option>
        {options.map(o => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </label>
  );
}

function SkillPicker({ catalogue, selected, onToggle }) {
  return (
    <div>
      <span className="mb-1 block text-sm font-medium">Skills</span>
      <div className="flex flex-wrap gap-2">
        {catalogue.map(skill => {
          const active = selected.includes(skill);
          return (
            <button
              key={skill}
              type="button"
              onClick={() => onToggle(skill)}
              className={`rounded-full border px-3 py-1 text-sm
                         ${active
                           ? 'bg-blue-500 text-white border-blue-500'
                           : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {skill}
            </button>
          );
        })}
      </div>
    </div>
  );
}
