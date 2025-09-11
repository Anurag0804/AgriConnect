import { useState, useEffect } from 'react';
import { getAllOrderConfirmations } from '../../services/orderConfirmationService';
import { getCurrentUser } from '../../services/authService';

export default function OrderConfirmations() {
  const [orderConfirmations, setOrderConfirmations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchOrderConfirmations = async () => {
      try {
        setLoading(true);
        const orderConfirmationsData = await getAllOrderConfirmations();
        setOrderConfirmations(orderConfirmationsData);
      } catch (err) {
        setError('Failed to fetch order confirmations.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrderConfirmations();
    }
  }, [currentUser?.userId]);

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
              <th className="py-2 px-4">Crop</th>
              <th className="py-2 px-4">Quantity (kg)</th>
              <th className="py-2 px-4">Total Price</th>
              <th className="py-2 px-4">{currentUser.role === 'farmer' ? 'Customer' : 'Farmer'}</th>
              <th className="py-2 px-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {orderConfirmations.map((oc) => (
              <tr key={oc._id} className="border-b border-gray-100">
                <td className="py-2 px-4 font-semibold">{oc.order._id}</td>
                <td className="py-2 px-4">{oc.order.crop.name}</td>
                <td className="py-2 px-4">{oc.order.quantity}</td>
                <td className="py-2 px-4">₹{oc.order.totalPrice}</td>
                <td className="py-2 px-4">{currentUser.role === 'farmer' ? oc.order.user.name : oc.order.farmer.name}</td>
                <td className="py-2 px-4">{oc.status}</td>
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