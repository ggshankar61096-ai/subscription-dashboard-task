import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import type { RootState } from '../store/store';
import { logout } from '../store/authSlice';

export default function Navbar() {
  const { user, token } = useSelector((state: RootState) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold">
          SubDash
        </Link>
        <div className="flex gap-6 items-center">
          {token ? (
            <>
              <Link to="/plans" className="hover:underline">Plans</Link>
              {user?.role === 'admin' ? (
                <Link to="/admin/subscriptions" className="hover:underline">Admin</Link>
              ) : (
                <Link to="/dashboard" className="hover:underline">Dashboard</Link>
              )}
              <div className="flex items-center gap-4">
                <span className="text-sm">{user?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                >
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:underline">Login</Link>
              <Link to="/register" className="bg-green-600 px-4 py-2 rounded hover:bg-green-700">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
