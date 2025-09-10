import { useContext, useEffect } from 'react';
import GlobalContext from '../../context/GlobalState';
import { updateOrderStatus } from '../../services/orderService';
import { getCurrentUser } from '../../services/authService';

export default function Orders() {
  const { orders, loading, error, fetchData } = useContext(GlobalContext);
  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleUpdateStatus = async (orderId, status) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">My Orders</h1>
      {loading ? (
        <p>Loading orders...</p>
      ) : !orders || orders.length === 0 ? (
        <p>You have no orders.</p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr className="border-b-2 border-gray-200">
              <th className="py-2 px-4">Crop</th>
              <th className="py-2 px-4">Quantity (kg)</th>
              <th className="py-2 px-4">Total Price</th>
              <th className="py-2 px-4">Status</th>
              {currentUser && currentUser.role === 'farmer' && <th className="py-2 px-4">Actions</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order._id} className="border-b border-gray-100">
                <td className="py-2 px-4 font-semibold">{order.crop.name}</td>
                <td className="py-2 px-4">{order.quantity}</td>
                <td className="py-2 px-4">₹{order.totalPrice}</td>
                <td className="py-2 px-4">{order.status}</td>
                {currentUser && currentUser.role === 'farmer' && (
                  <td className="py-2 px-4">
                    {order.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'confirmed')}
                          className="bg-green-600 text-white font-bold py-1 px-2 rounded-lg hover:bg-green-700 transition mr-2"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(order._id, 'rejected')}
                          className="bg-red-600 text-white font-bold py-1 px-2 rounded-lg hover:bg-red-700 transition"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
