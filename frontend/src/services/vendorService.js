import http from './http';

export const getAvailableOrders = async () => {
    const response = await http.get('/vendors/orders/available');
    return response.data;
};

export const acceptOrder = async (orderId) => {
    const response = await http.put(`/vendors/orders/${orderId}/accept`);
    return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
    const response = await http.put(`/vendors/orders/${orderId}/status`, { status });
    return response.data;
};

export const getVendorOrderHistory = async () => {
    const response = await http.get('/vendors/history');
    return response.data;
};
