import { useState, useEffect } from 'react';
import { getAllInventories } from '../services/inventoryService';

export default function InventoryList({ searchTerm }) {
  const [inventories, setInventories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchInventories();
  }, [searchTerm]);

  const fetchInventories = async () => {
    try {
      setLoading(true);
      const data = await getAllInventories(searchTerm);
      setInventories(data);
    } catch (err) {
      setError('Failed to fetch inventories.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading inventories...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Inventory Management</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (Kg)</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {inventories.map((inventory) => (
            <tr key={inventory._id}>
              <td className="px-6 py-4 whitespace-nowrap">{inventory.customer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{inventory.cropName}</td>
              <td className="px-6 py-4 whitespace-nowrap">{inventory.quantity}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
