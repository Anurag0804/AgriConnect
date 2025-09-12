import { useState, useEffect, useCallback, useMemo } from 'react';
import { getCustomerReceipts, getFarmerReceipts, updateReceiptStatus } from '../../services/receiptService';
import { getCurrentUser } from '../../services/authService';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Memoize currentUser to keep stable reference across renders
  const currentUser = useMemo(() => getCurrentUser(), []);

  // fetchReceipts only depends on stable primitive fields
  const fetchReceipts = useCallback(async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      let receiptsData = [];
      if (currentUser.role === 'customer') {
        receiptsData = await getCustomerReceipts();
      } else if (currentUser.role === 'farmer') {
        receiptsData = await getFarmerReceipts();
      }
      const confirmedReceipts = receiptsData.filter(r => r.order?.status === 'confirmed');
      setReceipts(confirmedReceipts);
    } catch (err) {
      setError('Failed to fetch receipts.');
      console.error("❌ fetchReceipts error:", err);
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id, currentUser?.role]);

  // useEffect triggers fetchReceipts only when currentUser changes (which won't cause infinite loops due to memoization)
  useEffect(() => {
    fetchReceipts();
  }, [fetchReceipts]);


  const handlePaymentStatusUpdate = async (receiptId, newStatus) => {
    try {
      await updateReceiptStatus(receiptId, newStatus);
      fetchReceipts();
    } catch (err) {
      console.error('Failed to update payment status:', err);
      setError('Failed to update payment status.');
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {receipts.map((receipt) => (
            <div key={receipt._id} className="bg-white shadow-lg rounded-lg p-6 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Receipt for Order ID: {receipt.order._id}
              </h2>
              <p className="text-gray-600 mb-1"><strong>Order Status:</strong> {receipt.order.status}</p>
              <p className="text-gray-600 mb-1"><strong>Crop:</strong> {receipt.order.crop.name}</p>
              <p className="text-gray-600 mb-1"><strong>Quantity:</strong> {receipt.order.quantity} kg</p>
              <p className="text-gray-600 mb-1"><strong>Total Price:</strong> ₹{receipt.order.totalPrice}</p>
              <p className="text-gray-600 mb-1">
  <strong>{currentUser.role === 'farmer' ? 'Customer' : 'Farmer'}:</strong>{' '}
  {currentUser.role === 'farmer'
    ? receipt.order.customer?.name || receipt.order.customer?.username || 'Unknown Customer'
    : receipt.order.farmer?.name || receipt.order.farmer?.username || 'Unknown Farmer'}
</p>

              <p className="text-gray-600 mb-4">
                <strong>Payment Status:</strong>{' '}
                <span className={`font-bold ${receipt.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {receipt.paymentStatus.toUpperCase()}
                </span>
              </p>
              {currentUser.role === 'customer' && receipt.paymentStatus === 'unpaid' && receipt.order.status === 'confirmed' && (
                <button
                  onClick={() => handlePaymentStatusUpdate(receipt._id, 'paid')}
                  className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg transition duration-300"
                >
                  Mark as Paid
                </button>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>You have no receipts for confirmed orders.</p>
      )}
    </div>
  );
}
