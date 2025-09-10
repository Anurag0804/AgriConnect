import { useContext } from 'react';
import GlobalContext from '../context/GlobalState';
import { Link } from 'react-router-dom';

export default function CustomerInventory() {
  const { inventory, loading, error } = useContext(GlobalContext);

  if (loading) {
    return <div className="text-center p-8">Loading your cart...</div>;
  }

  if (error) {
    return <div className="text-center p-8 text-red-500">{error.message}</div>;
  }

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold text-primary mb-6">My Cart</h1>
      <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
        {inventory.length > 0 ? (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="py-2 px-4">VEGETABLE NAME</th>
                <th className="py-2 px-4">WEIGHT (kg)</th>
                <th className="py-2 px-4">LAST PURCHASE PRICE (/kg)</th>
              </tr>
            </thead>
            <tbody>
              {inventory.map((item) => (
                <tr key={item._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-2 px-4 font-semibold">{item.cropName}</td>
                  <td className="py-2 px-4">{item.weight.toFixed(2)}</td>
                  <td className="py-2 px-4">₹{item.purchasePrice.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Your cart is empty. Visit the marketplace to buy crops!</p>
        )}
      </div>
      <div className="mt-6">
        <Link to="/customer" className="text-green-600 font-medium hover:underline">
          &larr; Back to Marketplace
        </Link>
      </div>
    </div>
  );
}
