import { useState, useEffect } from 'react';
import { getAllReceipts, deleteReceipt } from '../services/receiptService';

export default function ReceiptList({ searchTerm }) {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReceipts();
  }, [searchTerm]);

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      const data = await getAllReceipts(searchTerm);
      setReceipts(data);
    } catch (err) {
      setError('Failed to fetch receipts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (receiptId) => {
    if (window.confirm('Are you sure you want to delete this receipt?')) {
      try {
        await deleteReceipt(receiptId);
        fetchReceipts();
      } catch (err) {
        setError('Failed to delete receipt.');
        console.error(err);
      }
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
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {receipts.map((receipt) => (
            <tr key={receipt._id}>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.order?._id}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.order?.customer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.order?.farmer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{receipt.paymentStatus}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(receipt.createdAt).toLocaleDateString()}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <button onClick={() => handleDelete(receipt._id)} className="text-red-600 hover:text-red-900 ml-4">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
