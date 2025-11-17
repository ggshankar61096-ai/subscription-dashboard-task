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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <div className="bg-white p-8 rounded shadow-lg mb-6">
          <h2 className="text-2xl font-bold mb-4">Profile</h2>
          <p className="text-lg"><strong>Name:</strong> {user?.name}</p>
          <p className="text-lg"><strong>Email:</strong> {user?.email}</p>
          <p className="text-lg"><strong>Role:</strong> {user?.role}</p>
        </div>
        <div className="bg-white p-8 rounded shadow-lg">
          <h2 className="text-2xl font-bold mb-4">Current Subscription</h2>
          {isLoading ? (
            <p>Loading subscription...</p>
          ) : subscription ? (
            <div>
              <p className="text-lg"><strong>Status:</strong> <span className={`font-bold ${subscription.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>{subscription.status}</span></p>
              <p className="text-lg"><strong>Start Date:</strong> {new Date(subscription.startDate).toLocaleDateString()}</p>
              <p className="text-lg"><strong>End Date:</strong> {new Date(subscription.endDate).toLocaleDateString()}</p>
            </div>
          ) : (
            <p>No active subscription. <a href="/plans" className="text-blue-600 hover:underline">Browse plans</a></p>
          )}
        </div>
      </div>
    </div>
  );
}
