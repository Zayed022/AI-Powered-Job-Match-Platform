import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { toast } from 'react-hot-toast';  
import axios from 'axios';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);

 
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { name, email, password } = form;

    // quick client-side guard (mirrors backend check)
    if (!name || !email || !password) {
      toast.error('Please fill out all fields');
      return;
    }

    try {
      setLoading(true);
      const { data } = await axios.post('https://ai-powered-job-match-platform-1.onrender.com/api/v1/users/register', form);   // << route ✔
      toast.success(data.message);                               // “User registered successfully”
      navigate('/login');                                        // redirect
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Something went wrong – please try again';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  /*  ---------------- UI ----------------  */
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Create account</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* name */}
          <div>
            <label className="block mb-1 font-medium">Name</label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="John Doe"
            />
          </div>

          {/* email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="john@example.com"
            />
          </div>

          {/* password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="••••••••"
            />
          </div>

          {/* submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Creating…' : 'Sign up'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Already have an account?{' '}
          <Link
            className="text-blue-600 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
}
