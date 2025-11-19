import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/axios';
import type { RootState } from '../store/store';

// API URL is read from VITE_API_URL via the api client

interface AdminSubscription {
  id: string;
  userId: string;
  userName: string;
  planName: string;
  status: 'active' | 'expired' | 'cancelled';
  startDate: string;
  endDate: string;
}

export default function AdminSubscriptions() {
  const { token, user } = useSelector((state: RootState) => state.auth);
  const [subscriptions, setSubscriptions] = useState<AdminSubscription[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token || user?.role !== 'admin') {
      setError('Unauthorized. Admin access required.');
      return;
    }
    const fetchSubscriptions = async () => {
      setIsLoading(true);
      try {
        const res = await api.get('/admin/subscriptions');
        setSubscriptions(res.data);
      } catch {
        setError('Failed to fetch subscriptions');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSubscriptions();
  }, [token, user]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8 text-black dark:text-white">Admin - All Subscriptions</h1>
        {error && <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 p-4 rounded mb-6">{error}</div>}
        {isLoading ? (
          <p className="dark:text-gray-300">Loading subscriptions...</p>
        ) : (
          <div className="text-black bg-white dark:bg-slate-800 rounded shadow-lg overflow-x-auto md:overflow-hidden">
            <table className="w-full ">
              <thead className="bg-gray-200 dark:bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left dark:text-white">User</th>
                  <th className="px-6 py-3 text-left dark:text-white">Plan</th>
                  <th className="px-6 py-3 text-left dark:text-white">Status</th>
                  <th className="px-6 py-3 text-left dark:text-white">Start Date</th>
                  <th className="px-6 py-3 text-left dark:text-white">End Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b dark:border-slate-700 hover:bg-gray-50 dark:hover:bg-slate-700">
                    <td className="px-6 py-3 dark:text-gray-300">{sub.userName}</td>
                    <td className="px-6 py-3 dark:text-gray-300">{sub.planName}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-white ${sub.status === 'active' ? 'bg-green-600 dark:bg-green-700' : 'bg-red-600 dark:bg-red-700'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-3 dark:text-gray-300">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3 dark:text-gray-300">{new Date(sub.endDate).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
