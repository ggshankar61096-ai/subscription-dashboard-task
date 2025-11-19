import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import api from '../api/axios';
import type { RootState, AppDispatch } from '../store/store';
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

  const getPlanTier = (name: string) => {
    const n = name?.toLowerCase() ?? '';
    if (n.includes('bron') || n.includes('basic')) {
      return {
        tier: 'Bronze',
        icon: '🥉',
        mainBadgeClass: 'w-full px-3 py-1 rounded text-white bg-[#cd7f32]',
        cornerBadgeClass: 'px-3 py-1 rounded text-xs font-bold text-white bg-[#cd7f32]',
      };
    }
    if (n.includes('silver') || n.includes('professional')) {
      return {
        tier: 'Silver',
        icon: '🥈',
        mainBadgeClass: 'w-full px-3 py-1 rounded text-black bg-gray-300',
        cornerBadgeClass: 'px-3 py-1 rounded text-xs font-bold text-black bg-gray-300',
      };
    }
    if (n.includes('gold') || n.includes('enterprise')) {
      return {
        tier: 'Gold',
        icon: '👑',
        mainBadgeClass: 'w-full px-3 py-1 rounded text-black bg-[rgb(245,202,7)]',
        cornerBadgeClass: 'px-3 py-1 rounded text-xs font-bold text-black bg-[rgb(245,202,7)]',
      };
    }
    return {
      tier: 'Basic',
      icon: '⭐',
      mainBadgeClass: 'w-full px-3 py-1 rounded text-black bg-gray-200',
      cornerBadgeClass: 'px-3 py-1 rounded text-xs font-bold text-black bg-gray-200',
    };
  };

  const getBadgeClasses = (name: string) => {
    return getPlanTier(name).mainBadgeClass;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-12 text-center bg-gray-300 p-3 text-blue-600 dark:text-white dark:bg-slate-700">Our Plans</h1>
        {subscribeMsg && (
          <div className="bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-200 p-4 rounded mb-8">{subscribeMsg}</div>
        )}
        {isLoading ? (
          <p className="text-center dark:text-gray-300">Loading plans...</p>
        ) : (
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan) => (
              <div key={plan.id} className="bg-white dark:bg-slate-800 p-8 rounded shadow-lg relative">
                <div className="absolute top-4 right-4 text-3xl">
                  {getPlanTier(plan.name).icon}
                </div>
                <h2 className={`text-2xl font-bold mb-2`}>
                  <span className={getBadgeClasses(plan.name)}>
                     {plan.name}
                  </span>
                </h2>
                <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-4">${plan.price}/month</p>
                <p className="text-gray-600 dark:text-gray-400 mb-6">{plan.duration} days duration</p>
                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="text-gray-700 dark:text-gray-300">✓ {feature}</li>
                  ))}
                </ul>
                <button
                  onClick={() => handleSubscribe(plan.id)}
                  className="w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800"
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
