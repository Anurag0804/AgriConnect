import { useState, useEffect } from 'react';
import { getAllReceipts, updateReceiptStatus } from '../../services/receiptService'; // Changed import
import { getCurrentUser } from '../../services/authService';

export default function Receipts() {
  const [receipts, setReceipts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const currentUser = getCurrentUser();

  const fetchReceipts = async () => {
    try {
      setLoading(true);
      // Use getAllReceipts instead of conditional farmer/customer receipts
      const receiptsData = await getAllReceipts();
      setReceipts(receiptsData);
    } catch (err) {
      setError('Failed to fetch receipts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchReceipts();
    }
  }, [currentUser?.userId]);

  // Function to handle payment status update (if needed, keep for now)
  const handlePaymentStatusUpdate = async (receiptId, newStatus) => {
    try {
      await updateReceiptStatus(receiptId, newStatus);
      fetchReceipts(); // Re-fetch receipts to update the list
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
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Receipt for Order ID: {receipt.order._id}</h2>
              <p className="text-gray-600 mb-1"><strong>Crop:</strong> {receipt.order.crop.name}</p>
              <p className="text-gray-600 mb-1"><strong>Quantity:</strong> {receipt.order.quantity} kg</p>
              <p className="text-gray-600 mb-1"><strong>Total Price:</strong> ₹{receipt.order.totalPrice}</p>
              <p className="text-gray-600 mb-1">
                <strong>{currentUser.role === 'farmer' ? 'Customer' : 'Farmer'}:</strong>{' '}
                {currentUser.role === 'farmer' ? receipt.order.user.name : receipt.order.farmer.name}
              </p>
              <p className="text-gray-600 mb-4">
                <strong>Payment Status:</strong>{' '}
                <span className={`font-bold ${receipt.paymentStatus === 'paid' ? 'text-green-600' : 'text-red-600'}`}>
                  {receipt.paymentStatus.toUpperCase()}
                </span>
              </p>
              {/* Optional: Add a button to change status if current user is customer and status is unpaid */}
              {currentUser.role === 'customer' && receipt.paymentStatus === 'unpaid' && (
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
