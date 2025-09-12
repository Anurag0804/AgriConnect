import { useState, useEffect } from 'react';
import { getCustomerOrders } from '../services/orderService';
import { getCurrentUser } from '../services/authService';

export default function MyCart() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getCustomerOrders();
        const pendingOrders = ordersData.filter(order => order.status === 'pending');
        setOrders(pendingOrders);
      } catch (err) {
        setError('Failed to fetch cart items.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (currentUser) {
      fetchOrders();
    }
  }, [currentUser?.userId]);

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">My Cart</h1>
      {loading ? (
        <p>Loading cart items...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : orders.length > 0 ? (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4">CROP</th>
              <th className="py-2 px-4">QUANTITY (kg)</th>
              <th className="py-2 px-4">FARMER</th>
              <th className="py-2 px-4">TOTAL PRICE</th>
              <th className="py-2 px-4">STATUS</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-100">
                <td className="py-2 px-4 font-semibold">{order.crop.name}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">{order.farmer.username}</td>
                <td className="py-2 px-4">₹ {order.totalPrice}</td>
                <td className="py-2 px-4">{order.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>Your cart is empty.</p>
      )}
    </div>
  );
}
