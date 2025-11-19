import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { setAuth, setError, setLoading } from '../store/authSlice';
import api from '../api/axios';

// API URL is read from VITE_API_URL via the api client

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setLocalError('Passwords do not match');
      return;
    }
    dispatch(setLoading(true));
    try {
  const res = await api.post(`/auth/register`, { name, email, password });
      dispatch(setAuth({
        token: res.data.token,
        refreshToken: res.data.refreshToken,
        user: res.data.user,
      }));
      navigate('/dashboard');
    } catch (err: unknown) {
      // Handle Axios error shape
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyErr = err as any;
      const msg = anyErr?.response?.data?.message || 'Registration failed';
      setLocalError(msg);
      dispatch(setError(msg));
    } finally {
      dispatch(setLoading(false));
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 text-black">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6">Register</h1>
        {localError && <p className="text-red-500 mb-4">{localError}</p>}
        <form onSubmit={handleRegister} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border rounded text-white"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border rounded text-white"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded text-white"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full px-4 py-2 border rounded text-white"
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <button
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
