import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from "axios"
import { toast } from 'react-hot-toast';  // 

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [creds, setCreds] = useState({ email: '', password: '' });

  /* ------------- handlers ------------- */
  const handleChange = (e) =>
    setCreds({ ...creds, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password } = creds;

    // local guard (mirrors 400 from backend)
    if (!email || !password) {
      toast.error('Please enter email & password');
      return;
    }

    try {
      setLoading(true);

      /* ---- call backend ---- */
      const { data } = await axios.post('https://ai-powered-job-match-platform-1.onrender.com/api/v1/users/login', creds);
      // data = { message, user, token }

      
      localStorage.setItem('accessToken', data.token);
      toast.success(data.message);      // “User logged in successfully”

      // redirect to dashboard / jobs page
      navigate('/');
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        'Login failed, please try again';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Log in</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* email */}
          <div>
            <label className="block mb-1 font-medium">Email</label>
            <input
              type="email"
              name="email"
              value={creds.email}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
              placeholder="you@example.com"
            />
          </div>

          {/* password */}
          <div>
            <label className="block mb-1 font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={creds.password}
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
            {loading ? 'Signing in…' : 'Log in'}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don’t have an account?{' '}
          <button
            onClick={() => navigate('/signup')}
            className="text-blue-600 hover:underline"
          >
            Create one
          </button>
        </p>
      </div>
    </div>
  );
}
