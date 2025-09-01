import { useState, useEffect } from 'react';
import { getFarmerHistory } from '../services/transactionService';
import { Link } from 'react-router-dom';

export default function FarmerHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const data = await getFarmerHistory();
        setHistory(data);
      } catch (err) {
        setError('Failed to fetch sales history.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (loading) {
    return <div className="text-center p-8">Loading sales history...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">My Sales History</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {history.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">TXN ID</th>
                <th className="py-2 px-4">VEGETABLE NAME</th>
                <th className="py-2 px-4">SOLD DATE</th>
                <th className="py-2 px-4">WEIGHT SOLD (kg)</th>
                <th className="py-2 px-4">EARNING</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx) => (
                <tr key={tx._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 text-sm text-gray-500">{tx._id}</td>
                  <td className="py-2 px-4 font-semibold">{tx.crop ? tx.crop.name : 'N/A'}</td>
                  <td className="py-2 px-4">{new Date(tx.date).toLocaleDateString()}</td>
                  <td className="py-2 px-4">{tx.quantity}</td>
                  <td className="py-2 px-4">₹{tx.totalPrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You have no sales history.</p>
        )}
      </div>
      <div className="mt-6">
        <Link to="/farmer" className="text-green-600 font-medium hover:underline">
          &larr; Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
