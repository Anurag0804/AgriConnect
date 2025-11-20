import React from 'react';
import { Package, MapPin, Scale, CheckCircle, Truck } from 'lucide-react';

const MyDeliveries = ({ orders, onUpdateStatus }) => {
    
    const getStatusInfo = (status) => {
        switch (status) {
            case 'assigned':
                return { text: 'Assigned', color: 'text-blue-600', icon: <Truck className="w-4 h-4" /> };
            case 'picked-up':
                return { text: 'Picked Up', color: 'text-yellow-600', icon: <Truck className="w-4 h-4 animate-pulse" /> };
            case 'delivered':
                return { text: 'Delivered', color: 'text-green-600', icon: <CheckCircle className="w-4 h-4" /> };
            default:
                return { text: status, color: 'text-gray-500', icon: null };
        }
    };

    return (
        <div className="p-4 bg-white shadow-md rounded-lg mt-8">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">My Deliveries</h2>
            {orders.length === 0 ? (
                <p className="text-gray-500">You have no active deliveries.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {orders.map(order => {
                        const statusInfo = getStatusInfo(order.status);
                        return (
                            <div key={order._id} className="border p-4 rounded-lg shadow-lg bg-gray-50 hover:shadow-xl transition-shadow duration-300 flex flex-col justify-between">
                                <div>
                                    <div className="flex items-center mb-2">
                                        <Package className="w-5 h-5 mr-2 text-green-600" />
                                        <h3 className="text-lg font-semibold text-gray-900">{order.crop.name}</h3>
                                    </div>
                                    <div className="text-gray-700 space-y-2 mb-4">
                                        <p className="flex items-center"><Scale className="w-4 h-4 mr-2 text-gray-500" /><strong>Quantity:</strong> {order.quantity} kg</p>
                                        <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-red-500" /><strong>Pickup:</strong> {order.farmer.address}</p>
                                        <p className="flex items-center"><MapPin className="w-4 h-4 mr-2 text-blue-500" /><strong>Dropoff:</strong> {order.customer.address}</p>
                                        <p className={`flex items-center font-bold ${statusInfo.color}`}>
                                            {statusInfo.icon}<span className="ml-2">{statusInfo.text}</span>
                                        </p>
                                    </div>
                                </div>
                                <div className="mt-auto">
                                    {order.status === 'assigned' && (
                                        <button
                                            onClick={() => onUpdateStatus(order._id, 'picked-up')}
                                            className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-300"
                                        >
                                            Mark as Picked Up
                                        </button>
                                    )}
                                    {order.status === 'picked-up' && (
                                        <button
                                            onClick={() => onUpdateStatus(order._id, 'delivered')}
                                            className="w-full bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors duration-300"
                                        >
                                            Mark as Delivered
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default MyDeliveries;
