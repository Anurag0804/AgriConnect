import { useState, useEffect } from 'react';
import { getPlatformStats } from '../services/analyticsService';

export default function AnalyticsDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const data = await getPlatformStats();
        setStats(data);
      } catch (err) {
        setError('Failed to fetch analytics data.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Platform Analytics</h2>
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Users</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalUsers}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Customers</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalCustomers}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Farmers</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalFarmers}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Admins</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalAdmins}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Crops</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalCrops}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Transactions</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalTransactions}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Orders</h3>
            <p className="text-3xl font-bold text-primary">{stats.totalOrders}</p>
          </div>
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="text-lg font-semibold">Total Revenue</h3>
            <p className="text-3xl font-bold text-primary">${stats.totalRevenue ? stats.totalRevenue.toFixed(2) : '0.00'}</p>
          </div>
        </div>
      )}
    </div>
  );
}
