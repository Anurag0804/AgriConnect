import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getCrops } from '../services/cropService';
import { buyCrop } from '../services/transactionService';

export default function DashboardCustomer() {
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCrops = async () => {
    try {
      setLoading(true);
      const data = await getCrops();
      setCrops(data);
    } catch (err) {
      setError('Failed to fetch crops. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCrops();
  }, []);

  const handleBuy = async (crop) => {
    const quantity = prompt(`How many kg of ${crop.name} would you like to buy? (Available: ${crop.stock} kg)`);
    
    if (!quantity) return; // User cancelled the prompt

    const quantityNum = parseFloat(quantity);
    if (isNaN(quantityNum) || quantityNum <= 0) {
      alert('Please enter a valid positive number for the quantity.');
      return;
    }

    if (quantityNum > crop.stock) {
      alert(`You cannot buy more than the available stock of ${crop.stock} kg.`);
      return;
    }

    try {
      await buyCrop(crop._id, quantityNum);
      alert('Purchase successful!');
      // Refresh the crop list to show updated stock
      fetchCrops(); 
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred during the purchase.';
      alert(`Purchase failed: ${errorMessage}`);
      console.error(err);
    }
  };

  if (loading && !crops.length) { // Show initial loading state
    return <div className="text-center p-8">Loading available crops...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Marketplace</h1>
        <div>
          <Link to="/inventory/customer" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition mr-2">
            My Inventory
          </Link>
          <Link to="/history/customer" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            Purchase History
          </Link>
        </div>
      </div>

      {loading && <p className="text-center mb-4">Refreshing crop list...</p>}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {crops.length > 0 ? (
          crops.map((crop) => (
            <div key={crop._id} className="bg-white p-6 rounded-lg shadow-md border border-gray-200 hover:shadow-xl transition">
              <h2 className="text-2xl font-serif font-bold text-green-800">{crop.name}</h2>
              <p className="text-gray-600 mb-4">Sold by: {crop.farmer.username}</p>
              <div className="space-y-2 mb-4">
                <p><span className="font-semibold">Price:</span> ₹{crop.pricePerKg} / kg</p>
                <p><span className="font-semibold">Available Stock:</span> {crop.stock} kg</p>
                <p className="text-sm text-gray-500"><span className="font-semibold">Location:</span> {crop.location || 'Not specified'}</p>
              </div>
              <button
                onClick={() => handleBuy(crop)}
                className="w-full bg-secondary text-gray-900 font-bold py-2 px-4 rounded-lg hover:bg-yellow-500 transition"
              >
                Buy Now
              </button>
            </div>
          ))
        ) : (
          <p>No crops are currently available in the marketplace.</p>
        )}
      </div>
    </div>
  );
}
