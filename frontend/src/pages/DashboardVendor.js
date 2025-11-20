import React, { useState, useEffect } from 'react';
import AvailableOrders from '../components/vendor/AvailableOrders';
import MyDeliveries from '../components/vendor/MyDeliveries';
import DeliveryHistory from '../components/vendor/DeliveryHistory';
import { getAvailableOrders, acceptOrder, updateOrderStatus, getVendorOrderHistory } from '../services/vendorService';
import { getMyDeliveries } from '../services/orderService'; // Assuming you have a function to get orders assigned to vendor

const DashboardVendor = () => {
    const [availableOrders, setAvailableOrders] = useState([]);
    const [myDeliveries, setMyDeliveries] = useState([]);
    const [deliveryHistory, setDeliveryHistory] = useState([]);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            const [available, deliveries, history] = await Promise.all([
                getAvailableOrders(),
                getMyDeliveries(), // You might need to create this service function
                getVendorOrderHistory()
            ]);
            setAvailableOrders(available);
            setMyDeliveries(deliveries);
            setDeliveryHistory(history);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const handleAcceptOrder = async (orderId) => {
        try {
            await acceptOrder(orderId);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error accepting order:', error);
        }
    };

    const handleUpdateStatus = async (orderId, status) => {
        try {
            await updateOrderStatus(orderId, status);
            fetchData(); // Refresh data
        } catch (error) {
            console.error('Error updating order status:', error);
        }
    };

    return (
        <div className="container mx-auto p-4 space-y-8">
            <h1 className="text-2xl font-bold mb-4">Vendor Dashboard</h1>
            
            <AvailableOrders orders={availableOrders} onAccept={handleAcceptOrder} />
            <MyDeliveries orders={myDeliveries} onUpdateStatus={handleUpdateStatus} />
            <DeliveryHistory orders={deliveryHistory} />
        </div>
    );
};

export default DashboardVendor;
