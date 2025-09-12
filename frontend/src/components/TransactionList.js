import { useState, useEffect } from 'react';
import { getAllTransactions } from '../services/transactionService';
import { useLocation } from 'react-router-dom';

export default function TransactionList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const location = useLocation();

  const searchQuery = new URLSearchParams(location.search).get('search') || '';

  useEffect(() => {
    fetchTransactions();
  }, [searchQuery]);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await getAllTransactions(searchQuery);
      setTransactions(data);
    } catch (err) {
      setError('Failed to fetch transactions.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading transactions...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mt-6">
      <h2 className="text-2xl font-bold mb-4">Transaction History</h2>
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Crop</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Farmer</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity (Kg)</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Price</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {transactions.map((transaction) => (
            <tr key={transaction._id}>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.crop?.name}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.customer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.farmer?.username}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.quantity}</td>
              <td className="px-6 py-4 whitespace-nowrap">{transaction.totalPrice}</td>
              <td className="px-6 py-4 whitespace-nowrap">{new Date(transaction.date).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
