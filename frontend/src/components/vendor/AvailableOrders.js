import React from 'react';
import { Package, MapPin, Scale } from 'lucide-react';

const AvailableOrders = ({ orders, onAccept }) => {
    return (
        <div className="p-4 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Available Orders</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">No available orders at the moment.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map(order => (
                        <div key={order._id} className="border p-4 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                            <div>
                                <div className="flex items-center mb-2">
                                    <Package className="w-5 h-5 mr-2 text-green-600" />
                                    <h3 className="text-lg font-semibold text-gray-900">{order.crop.name}</h3>
                                </div>
                                <div className="text-gray-700 space-y-2">
                                    <p className="flex items-center"><Scale className="w-4 h-4 mr-2 text-gray-500" /><strong>Quantity:</strong> {order.quantity} kg</p>
                                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /><strong>Pickup:</strong> {order.farmer.address}</p>
                                    <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /><strong>Dropoff:</strong> {order.customer.address}</p>
                                </div>
                            </div>
                            <button
                                onClick={() => onAccept(order._id)}
                                className="w-full bg-green-600 text-white px-4 py-2 rounded-lg mt-4 hover:bg-green-700 transition-colors duration-300"
                            >
                                Accept Order
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AvailableOrders;
