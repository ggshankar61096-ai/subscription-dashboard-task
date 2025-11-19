import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, setError, setLoading } from '../store/authSlice';
import api from '../api/axios';

// API URL is read from VITE_API_URL via the api client

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setLoading(true));
    try {
  const res = await api.post(`/auth/login`, { email, password });
      dispatch(setAuth({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      }));
      navigate(res.data.user.role === 'admin' ? '/admin/subscriptions' : '/dashboard');
    } catch (err: any) {
      const msg = err.response?.data?.message || 'Login failed';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-slate-900 w-full transition-colors">
      <div className="bg-white dark:bg-slate-800 p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-black dark:text-white">Login</h1>
        {localError && <p className="text-red-500 mb-4">{localError}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border dark:border-slate-600 rounded dark:bg-slate-700 dark:text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-black dark:text-gray-300">
          Don't have an account?{' '}
          <button
            onClick={() => navigate('/register')}
            className="text-blue-600 bg-white border border-blue-600 dark:text-blue-400 hover:underline"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
