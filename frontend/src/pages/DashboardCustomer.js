import { useState, useEffect, useContext,  useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getCrops } from '../services/cropService';
import { createOrder } from '../services/orderService';
import GlobalContext from '../context/GlobalState';
import { History, ShoppingCart } from 'lucide-react';
import { buyCrop } from '../services/transactionService';
import { Search, X } from 'lucide-react';


export default function DashboardCustomer() {
  const { fetchData } = useContext(GlobalContext);
  const [crops, setCrops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // State for filters
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'createdAt_desc',
  });

  const fetchCrops = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        search: filters.search || undefined,
        location: filters.location || undefined,
        minPrice: filters.minPrice || undefined,
        maxPrice: filters.maxPrice || undefined,
        sortBy: filters.sortBy,
      };
      const data = await getCrops(params);
      setCrops(data);
    } catch (err) {
      setError('Failed to fetch crops. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCrops();
    }, 500); // Debounce API calls

    return () => clearTimeout(timer);
  }, [fetchCrops]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      search: '',
      location: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'createdAt_desc',
    });
  };

  const handleBuy = async (crop) => {
    const quantity = prompt(`How many kg of ${crop.name} would you like to buy? (Available: ${crop.stock} kg)`);
    
    if (!quantity) return;

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
      await createOrder({ crop: crop._id, farmer: crop.farmer._id, quantity: quantityNum, totalPrice: quantityNum * crop.pricePerKg });
      alert('Order placed successfully! The farmer will confirm your order shortly.');
      fetchCrops();
    } catch (err) {
      const errorMessage = err.response?.data?.error || 'An error occurred while placing the order.';
      alert(`Order failed: ${errorMessage}`);
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-primary">Marketplace</h1>
        <div>
          <Link to="/my-cart" className="bg-green-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-green-700 transition mr-2">
            <ShoppingCart className="inline-block mr-2" />
            My Cart
          </Link>
          <Link to="/history/customer" className="bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 transition">
            <History className="inline-block mr-2" />
            Purchase History
          </Link>
        </div>
      </div>

      {/* Filter Section */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-6 border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Search Input */}
          <div className="relative md:col-span-3 lg:col-span-2">
            <input
              type="text"
              name="search"
              placeholder="Search for crops..."
              value={filters.search}
              onChange={handleFilterChange}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          </div>

          {/* Location Filter */}
          <input
            type="text"
            name="location"
            placeholder="Filter by location..."
            value={filters.location}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          />

          {/* Price Filters */}
          <div className="flex items-center space-x-2">
            <input
              type="number"
              name="minPrice"
              placeholder="Min Price"
              value={filters.minPrice}
              onChange={handleFilterChange}
              className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
            <span>-</span>
            <input
              type="number"
              name="maxPrice"
              placeholder="Max Price"
              value={filters.maxPrice}
              onChange={handleFilterChange}
              className="w-full px-2 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
            />
          </div>

          {/* Sort By Dropdown */}
          <select
            name="sortBy"
            value={filters.sortBy}
            onChange={handleFilterChange}
            className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
          >
            <option value="createdAt_desc">Newest First</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="name_asc">Name: A to Z</option>
            <option value="name_desc">Name: Z to A</option>
          </select>

          <button
            onClick={clearFilters}
            className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 flex items-center justify-center"
          >
            <X size={16} className="mr-1" /> Clear
          </button>
        </div>
      </div>

      {loading && <p className="text-center mb-4">Loading crops...</p>}
      {error && <div className="text-center p-8 text-red-500">{error}</div>}

      {!loading && !error && (
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
            <p className="text-center md:col-span-2 lg:col-span-3 text-gray-500">No crops match the current filters.</p>
          )}
        </div>
      )}
    </div>
  );
}
