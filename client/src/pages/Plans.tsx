import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import { RootState, AppDispatch } from '../store/store';
import { setPlans, setLoading, setError } from '../store/subscriptionSlice';

// API URL is read from VITE_API_URL via the api client

export default function Plans() {
  const { plans, isLoading } = useSelector((state: RootState) => state.subscription);
  const { token } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch<AppDispatch>();
  const [subscribeMsg, setSubscribeMsg] = useState('');

  useEffect(() => {
    const fetchPlans = async () => {
      dispatch(setLoading(true));
      try {
  const res = await api.get('/plans');
        dispatch(setPlans(res.data));
      } catch {
          dispatch(setError('Failed to fetch plans'));
        } finally {
        dispatch(setLoading(false));
      }
    };
    fetchPlans();
  }, [dispatch]);

  const handleSubscribe = async (planId: string) => {
    if (!token) {
      setSubscribeMsg('Please login first');
      return;
    }
    try {
      await api.post(`/subscribe/${planId}`);
      setSubscribeMsg('Subscribed successfully!');
      setTimeout(() => setSubscribeMsg(''), 3000);
    } catch {
      setSubscribeMsg('Subscription failed');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center">Our Plans</h1>
        {subscribeMsg && (
          <div className="bg-green-100 text-green-700 p-4 rounded mb-8">{subscribeMsg}</div>
        )}
        {isLoading ? (
          <p className="text-center">Loading plans...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white p-8 rounded shadow-lg">
                <h2 className="text-2xl font-bold mb-2">{plan.name}</h2>
                <p className="text-3xl font-bold text-blue-600 mb-4">${plan.price}/month</p>
                <p className="text-gray-600 mb-6">{plan.duration} days duration</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700">✓ {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700"
                >
                  Subscribe
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
