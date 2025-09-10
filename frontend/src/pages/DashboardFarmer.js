import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { createCrop, getFarmerCrops } from '../services/cropService';
import { getFarmerTransactions } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import { ArrowUpFromLine } from 'lucide-react';

export default function DashboardFarmer() {
  const [crops, setCrops] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  const [newCrop, setNewCrop] = useState({
    name: '',
    stock: '',
    pricePerKg: '',
    location: '',
  });

  const currentUser = getCurrentUser();

  const fetchData = async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [cropsData, historyData] = await Promise.all([
        getFarmerCrops(currentUser.userId),
        getFarmerTransactions()
      ]);
      setCrops(cropsData);
      setHistory(historyData);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    setNewCrop({ ...newCrop, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      await createCrop(newCrop);
      setSuccess('Crop added successfully!');
      setNewCrop({ name: '', stock: '', pricePerKg: '', location: '' }); // Reset form
      fetchData(); // Refresh all dashboard data
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add crop.');
      console.error(err);
    }
  };

  const totalIncome = history.reduce((acc, tx) => acc + tx.totalPrice, 0);
  const lastSaleDate = history.length > 0 ? new Date(history[0].date).toLocaleDateString() : 'N/A';

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Farmer Dashboard</h1>
        <Link to="/history/farmer" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
          View Full Sales History
        </Link>
      </div>

      {/* Summary Section */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Income</h3>
          <p className="text-3xl font-bold text-green-600">₹{totalIncome.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Total Sales</h3>
          <p className="text-3xl font-bold text-green-600">{history.length}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Last Sale Date</h3>
          <p className="text-3xl font-bold text-green-600">{lastSaleDate}</p>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Add New Crop Form */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-primary mb-4">Add New Crop to Marketplace</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Crop Name</label>
              <input
                type="text"
                name="name"
                value={newCrop.name}
                onChange={handleChange}
                placeholder="e.g., Tomato"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Stock (in KG)</label>
              <input
                type="number"
                name="stock"
                value={newCrop.stock}
                onChange={handleChange}
                placeholder="e.g., 100"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Cost (per KG)</label>
              <input
                type="number"
                name="pricePerKg"
                value={newCrop.pricePerKg}
                onChange={handleChange}
                placeholder="e.g., 25"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Location</label>
              <input
                type="text"
                name="location"
                value={newCrop.location}
                onChange={handleChange}
                placeholder="e.g., Farm #1, Main Road"
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
            <button
              type="submit"
              className="w-full bg-primary text-white py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              <ArrowUpFromLine className="inline-block mr-2" />
              Submit Crop Data
            </button>
          </form>
        </div>

        {/* Farmer's Listed Crops */}
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h2 className="text-2xl font-bold text-primary mb-4">My Listed Crops (Inventory)</h2>
          {loading ? (
            <p>Loading your inventory...</p>
          ) : crops.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 px-4">VEGETABLE NAME</th>
                  <th className="py-2 px-4">WEIGHT (kg)</th>
                  <th className="py-2 px-4">PRICE (/kg)</th>
                </tr>
              </thead>
              <tbody>
                {crops.map((crop) => (
                  <tr key={crop._id} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-semibold">{crop.name}</td>
                    <td className="py-2 px-4">{crop.stock}</td>
                    <td className="py-2 px-4">₹{crop.pricePerKg}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>You have not listed any crops for sale.</p>
          )}
        </div>
      </div>
    </div>
  );
}
