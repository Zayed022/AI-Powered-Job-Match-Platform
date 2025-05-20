import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

/* ---------- axios base ---------- */


export default function Navbar() {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [isAuthed, setIsAuthed] = useState(
    Boolean(localStorage.getItem('accessToken'))
  );

  /* keep auth state in sync when tabs/windows change */
  useEffect(() => {
    const sync = () => setIsAuthed(Boolean(localStorage.getItem('accessToken')));
    window.addEventListener('storage', sync);
    return () => window.removeEventListener('storage', sync);
  }, []);

  /* --------- actions --------- */
 const handleLogout = async () => {
  try {
    // Tell the server to clear its cookies / session
    await axios.post(
      'https://ai-powered-job-match-platform-1.onrender.com/api/v1/users/logout',
      {},
      { withCredentials: true }          // keep cookies with the call
    );
  } catch {
    /* network / 5xx issues aren't fatal for a client-side logout */
  } finally {
    // 1 ) clear any client-side token
    localStorage.removeItem('accessToken');
    setIsAuthed(false);

    // 2 ) feedback
    toast.success('Logged out');

    // 3 ) navigation
    if (pathname.startsWith('/admin')) {
      navigate('/');                     // bump off admin first
    }
    navigate('/login');                  // go to signin page
  }
};


  /* --------- render --------- */
  return (
    <nav className="bg-white/30 backdrop-blur-md shadow-md px-6 py-3 sticky top-0 z-50 border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* --- Brand / logo --- */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-extrabold tracking-tight text-gray-900"
          >
            AI-Powered&nbsp;<span className="text-blue-600">Job Match</span>
          </Link>

          {/* --- right side buttons --- */}
          <div className="flex items-center gap-3">
            {/* Admin */}
            <button
              onClick={() => navigate('/register-admin')}
              className="inline-flex rounded-lg bg-orange-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
            >
              Admin
            </button>

            {/* Auth */}
            {isAuthed ? (
              <button
                onClick={handleLogout}
                className="inline-flex rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="inline-flex rounded-lg bg-blue-600 px-4 py-1.5 text-sm font-medium text-white hover:bg-blue-700 transition"
              >
                Login&nbsp;/&nbsp;Register
              </button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
