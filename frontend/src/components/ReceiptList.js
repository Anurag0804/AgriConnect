import { useState, useEffect } from 'react';
import { getAllReceipts } from '../services/receiptService';
import { useLocation } from 'react-router-dom';

export default function ReceiptList() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    fetchReceipts();
  }, [searchQuery]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await getAllReceipts(searchQuery);
      setReceipts(data);
    } catch (err) {
      setError('Failed to fetch receipts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading receipts...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Receipt Management</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order ID</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment Status</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {receipts.map((receipt) => (
            <tr key={receipt._id}>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.order}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.customer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.farmer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.paymentStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(receipt.createdAt).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
