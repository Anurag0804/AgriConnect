import { useState, useEffect } from 'react';
import { getFarmerOrderConfirmations, getCustomerOrderConfirmations } from '../../services/orderConfirmationService';
import { createReceipt } from '../../services/receiptService';
import { getCurrentUser } from '../../services/authService';

export default function OrderConfirmations() {
  const [orderConfirmations, setOrderConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  const fetchOrderConfirmations = async () => {
    try {
      setLoading(true);
      let orderConfirmationsData;
      if (currentUser.role === 'farmer') {
        orderConfirmationsData = await getFarmerOrderConfirmations();
      } else {
        orderConfirmationsData = await getCustomerOrderConfirmations();
      }
      setOrderConfirmations(orderConfirmationsData);
    } catch (err) {
      setError('Failed to fetch order confirmations.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderConfirmations();
  }, []);

  const handleCreateReceipt = async (orderConfirmationId) => {
    try {
      await createReceipt(orderConfirmationId);
      fetchOrderConfirmations();
    } catch (err) {
      setError('Failed to create receipt.');
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">Order Confirmations</h1>
      {loading ? (
        <p>Loading order confirmations...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orderConfirmations.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4">Order ID</th>
              <th className="py-2 px-4">Status</th>
              {currentUser.role === 'farmer' && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orderConfirmations.map((oc) => (
              <tr key={oc._id} className="border-b border-gray-100">
                <td className="py-2 px-4 font-semibold">{oc.order._id}</td>
                <td className="py-2 px-4">{oc.status}</td>
                {currentUser.role === 'farmer' && (
                  <td className="py-2 px-4">
                    {oc.status === 'confirmed' && (
                      <button
                        onClick={() => handleCreateReceipt(oc._id)}
                        className="bg-blue-600 text-white font-bold py-1 px-2 rounded-lg hover:bg-blue-700 transition"
                      >
                        Create Receipt
                      </button>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>You have no order confirmations.</p>
      )}
    </div>
  );
}
