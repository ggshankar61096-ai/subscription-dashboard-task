import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import type { RootState, AppDispatch } from '../store/store';
import { setSubscription, setLoading, setError } from '../store/subscriptionSlice';

// API URL is read from VITE_API_URL via the api client

export default function Dashboard() {
  const { subscription, isLoading } = useSelector((state: RootState) => state.subscription);
  const { token, user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!token) return;
    const fetchSubscription = async () => {
      dispatch(setLoading(true));
      try {
        const res = await api.get('/my-subscription');
        dispatch(setSubscription(res.data));
      } catch {
        dispatch(setError('Failed to fetch subscription'));
      } finally {
        dispatch(setLoading(false));
      }
    };
    fetchSubscription();
  }, [token, dispatch]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-10 transition-colors">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-center p-3 text-blue-600 bg-gray-300 dark:bg-slate-900 dark:text-white">Dashboard</h1>
        <div className="bg-white dark:bg-slate-800 p-8 rounded shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-white">Profile</h2>
          <p className="text-lg text-black dark:text-gray-300"><strong>Name:</strong> {user?.name}</p>
          <p className="text-lg text-black dark:text-gray-300"><strong>Email:</strong> {user?.email}</p>
          <p className="text-lg text-black dark:text-gray-300"><strong>Role:</strong> {user?.role}</p>
        </div>
        <div className="bg-white dark:bg-slate-800 p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4 text-blue-600 dark:text-white">Current Subscription</h2>
          {isLoading ? (
            <p className="text-black dark:text-gray-300">Loading subscription...</p>
          ) : subscription ? (
            <div>
              <p className="text-lg text-black dark:text-gray-300"><strong>Plan:</strong> {subscription.name}</p>
              <p className="text-lg text-black dark:text-gray-300"><strong>Status:</strong> <span className={`font-bold ${subscription.status === 'active' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>{subscription.status}</span></p>
              <p className="text-lg text-black dark:text-gray-300"><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
              <p className="text-lg text-black dark:text-gray-300"><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <p className="dark:text-gray-300">No active subscription. <a href="/plans" className="text-blue-600 dark:text-blue-400 hover:underline">Browse plans</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
