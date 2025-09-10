import { useState, useEffect } from 'react';
import { getFarmerReceipts, getCustomerReceipts, updateReceiptStatus } from '../../services/receiptService';
import { getCurrentUser } from '../../services/authService';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      let receiptsData;
      if (currentUser.role === 'farmer') {
        receiptsData = await getFarmerReceipts();
      } else {
        receiptsData = await getCustomerReceipts();
      }
      setReceipts(receiptsData);
    } catch (err) {
      setError('Failed to fetch receipts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReceipts();
  }, []);

  const handleUpdateStatus = async (receiptId, status) => {
    try {
      await updateReceiptStatus(receiptId, status);
      fetchReceipts();
    } catch (err) {
      setError('Failed to update receipt status.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Receipts</h1>
      {loading ? (
        <p>Loading receipts...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : receipts.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Payment Status</th>
              {currentUser.role === 'customer' && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {receipts.map((receipt) => (
              <tr key={receipt._id} className="border-b border-gray-100">
                <td className="py-2 px-4 font-semibold">{receipt.orderConfirmation.order._id}</td>
                <td className="py-2 px-4">{receipt.paymentStatus}</td>
                {currentUser.role === 'customer' && (
                  <td className="py-2 px-4">
                    {receipt.paymentStatus === 'unpaid' && (
                      <button
                        onClick={() => handleUpdateStatus(receipt._id, 'paid')}
                        className="bg-green-600 text-white font-bold py-1 px-2 rounded-lg hover:bg-green-700 transition"
                      >
                        Mark as Paid
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no receipts.</p>
      )}
    </div>
  );
}
