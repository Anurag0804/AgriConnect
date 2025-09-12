import AnalyticsDashboard from '../components/AnalyticsDashboard';
import { Link } from 'react-router-dom';
import { Users, Leaf, Package, Receipt, ShoppingCart } from 'lucide-react';
import { useState } from 'react';

export default function DashboardAdmin() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-primary mb-6">Admin Dashboard</h1>
      <AnalyticsDashboard />

      <div className="mt-8">
        <input
          type="text"
          placeholder="Search users, crops, transactions..."
          className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Link to={`/admin/users?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <Users className="w-12 h-12 text-blue-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">User Management</h2>
        </Link>

        <Link to={`/admin/crops?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <Leaf className="w-12 h-12 text-green-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Crop Management</h2>
        </Link>

        <Link to={`/admin/inventory?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <Package className="w-12 h-12 text-purple-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Inventory Management</h2>
        </Link>

        <Link to={`/admin/transactions?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <ShoppingCart className="w-12 h-12 text-red-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Transaction History</h2>
        </Link>

        <Link to={`/admin/orders?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <Receipt className="w-12 h-12 text-yellow-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Order Management</h2>
        </Link>

        <Link to={`/admin/receipts?search=${searchQuery}`} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center justify-center text-center">
          <Receipt className="w-12 h-12 text-orange-500 mb-3" />
          <h2 className="text-xl font-semibold text-gray-800">Receipt Management</h2>
        </Link>
      </div>
    </div>
  );
}
