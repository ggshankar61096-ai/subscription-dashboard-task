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
    <div className="min-h-screen bg-gray-50 py-12 text-black">
      <div className="max-w-7xl mx-auto px-4">
        <h1 className="text-4xl font-bold mb-8">Admin - All Subscriptions</h1>
        {error && <div className="bg-red-100 text-red-700 p-4 rounded mb-6">{error}</div>}
        {isLoading ? (
          <p>Loading subscriptions...</p>
        ) : (
          <div className="bg-white rounded shadow-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left">User</th>
                  <th className="px-6 py-3 text-left">Plan</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Start Date</th>
                  <th className="px-6 py-3 text-left">End Date</th>
                </tr>
              </thead>
              <tbody>
                {subscriptions.map((sub) => (
                  <tr key={sub.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-3">{sub.userName}</td>
                    <td className="px-6 py-3">{sub.planName}</td>
                    <td className="px-6 py-3">
                      <span className={`px-3 py-1 rounded text-white ${sub.status === 'active' ? 'bg-green-600' : 'bg-red-600'}`}>
                        {sub.status}
                      </span>
                    </td>
                    <td className="px-6 py-3">{new Date(sub.startDate).toLocaleDateString()}</td>
                    <td className="px-6 py-3">{new Date(sub.endDate).toLocaleDateString()}</td>
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
