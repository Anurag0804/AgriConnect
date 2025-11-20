import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { createCrop, getFarmerCrops } from '../services/cropService';
import { getFarmerOrders, updateOrderStatus } from '../services/orderService';
import { getFarmerTransactions } from '../services/transactionService';
import { getCurrentUser } from '../services/authService';
import { ArrowUpFromLine, History } from 'lucide-react';
import { createReceipt } from '../services/receiptService';
import WeatherCard from '../components/WeatherCard';

export default function DashboardFarmer() {
  const [crops, setCrops] = useState([]);
  const [orders, setOrders] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showConfirmed, setShowConfirmed] = useState(true);
  const [showRejected, setShowRejected] = useState(false);

  const [newCrop, setNewCrop] = useState({
    name: '',
    stock: '',
    pricePerKg: '',
    location: '',
  });

  const currentUser = getCurrentUser();

  const fetchData = useCallback(async () => {
    if (!currentUser) return;
    try {
      setLoading(true);
      const [cropsData, ordersData, historyData] = await Promise.all([
        getFarmerCrops(currentUser.userId),
        getFarmerOrders(),
        getFarmerTransactions(),
      ]);
      setCrops(cropsData);
      setOrders(ordersData);
      setHistory(historyData);
    } catch (err) {
      setError('Failed to fetch dashboard data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

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
      setNewCrop({ name: '', stock: '', pricePerKg: '', location: '' });
      fetchData();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to add crop.');
      console.error(err);
    }
  };

  const handleAcceptOrder = async (orderId) => {
  try {
    await updateOrderStatus(orderId, 'confirmed');
    await createReceipt(orderId); // ✅ create receipt automatically
    fetchData();
  } catch (err) {
    setError(err.response?.data?.error || 'Failed to accept order.');
    console.error(err);
  }
};

  const totalIncome = history.reduce((acc, tx) => acc + tx.totalPrice, 0);
  // Total sales count = number of transactions
  const totalSales = history.length;

// Last sale = latest transaction (sorted by createdAt)
   const lastSale = history.length > 0
  ? new Date(Math.max(...history.map(tx => new Date(tx.createdAt)))).toLocaleString()
  : 'No sales yet';


  const pendingOrders = orders.filter((order) => order.status === 'pending');
  const confirmedOrders = orders.filter((order) => order.status === 'confirmed');
  const rejectedOrders = orders.filter((order) => order.status === 'rejected');


  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Farmer Dashboard</h1>
        <Link
          to="/history/farmer"
          className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition"
        >
          <History className="inline-block mr-2" />
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
          <p className="text-3xl font-bold text-green-600">{totalSales}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <h3 className="text-lg font-semibold text-gray-600">Last Sale</h3>
          <p className="text-3xl font-bold text-red-600">{lastSale}</p>
        </div>
      </div>

      <WeatherCard />

      {/* Incoming Orders Section */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <h2 className="text-2xl font-bold text-primary mb-4">Incoming Orders</h2>
        {loading ? (
          <p>Loading orders...</p>
        ) : pendingOrders.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">CROP</th>
                <th className="py-2 px-4">QUANTITY (kg)</th>
                <th className="py-2 px-4">CUSTOMER</th>
                <th className="py-2 px-4">TOTAL PRICE</th>
                <th className="py-2 px-4">STATUS</th>
                <th className="py-2 px-4">ACTION</th>
              </tr>
            </thead>
            <tbody>
              {pendingOrders.map((order) => (
                <tr key={order._id} className="border-b border-gray-100">
                  <td className="py-2 px-4 font-semibold">{order.crop.name}</td>
                  <td className="py-2 px-4">{order.quantity}</td>
                  <td className="py-2 px-4">{order.customer.username}</td>
                  <td className="py-2 px-4">₹{order.totalPrice}</td>
                  <td className="py-2 px-4">{order.status}</td>
                  <td className="py-2 px-4">
                    <button
                      onClick={() => handleAcceptOrder(order._id)}
                      className="bg-green-600 text-white font-bold py-1 px-3 rounded-lg hover:bg-green-700 transition"
                    >
                      Accept
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No incoming orders.</p>
        )}
      </div>

      {/* Confirmed Orders Section (Collapsible) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div
          className="flex items-center cursor-pointer mb-4"
          onClick={() => setShowConfirmed((prev) => !prev)}
        >
          <span className={`mr-2 transition-transform ${showConfirmed ? 'rotate-90' : ''}`}>▶</span>
          <h2 className="text-2xl font-bold text-green-600">Confirmed Orders</h2>
        </div>
        {showConfirmed && (
          loading ? (
            <p>Loading orders...</p>
          ) : confirmedOrders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 px-4">CROP</th>
                  <th className="py-2 px-4">QUANTITY (kg)</th>
                  <th className="py-2 px-4">CUSTOMER</th>
                  <th className="py-2 px-4">TOTAL PRICE</th>
                  <th className="py-2 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {confirmedOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-semibold">{order.crop.name}</td>
                    <td className="py-2 px-4">{order.quantity}</td>
                    <td className="py-2 px-4">{order.customer.username}</td>
                    <td className="py-2 px-4">₹{order.totalPrice}</td>
                    <td className="py-2 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No confirmed orders.</p>
          )
        )}
      </div>

      {/* Rejected Orders Section (Collapsible) */}
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200 mb-8">
        <div
          className="flex items-center cursor-pointer mb-4"
          onClick={() => setShowRejected((prev) => !prev)}
        >
          <span className={`mr-2 transition-transform ${showRejected ? 'rotate-90' : ''}`}>▶</span>
          <h2 className="text-2xl font-bold text-red-600">Rejected Orders</h2>
        </div>
        {showRejected && (
          loading ? (
            <p>Loading orders...</p>
          ) : rejectedOrders.length > 0 ? (
            <table className="w-full text-left">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="py-2 px-4">CROP</th>
                  <th className="py-2 px-4">QUANTITY (kg)</th>
                  <th className="py-2 px-4">CUSTOMER</th>
                  <th className="py-2 px-4">TOTAL PRICE</th>
                  <th className="py-2 px-4">STATUS</th>
                </tr>
              </thead>
              <tbody>
                {rejectedOrders.map((order) => (
                  <tr key={order._id} className="border-b border-gray-100">
                    <td className="py-2 px-4 font-semibold">{order.crop.name}</td>
                    <td className="py-2 px-4">{order.quantity}</td>
                    <td className="py-2 px-4">{order.customer.username}</td>
                    <td className="py-2 px-4">₹{order.totalPrice}</td>
                    <td className="py-2 px-4">{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No rejected orders.</p>
          )
        )}
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
