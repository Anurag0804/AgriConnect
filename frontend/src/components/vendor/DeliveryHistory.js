import React from 'react';

const DeliveryHistory = ({ orders }) => {
    return (
        <div className="card">
            <h2 className="text-xl font-bold mb-4">Delivery History</h2>
            {orders.length === 0 ? (
                <p>You have no completed deliveries.</p>
            ) : (
                <ul className="space-y-4">
                    {orders.map(order => (
                        <li key={order._id} className="border p-4 rounded-lg">
                            <p><strong>Crop:</strong> {order.crop.name}</p>
                            <p><strong>Quantity:</strong> {order.quantity} kg</p>
                            <p><strong>Delivered On:</strong> {new Date(order.updatedAt).toLocaleDateString()}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default DeliveryHistory;
