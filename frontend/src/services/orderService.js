import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/orders/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

// Create a new order
export const createOrder = async (orderData) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.post(API_URL, orderData, { headers });
  return res.data;
};

// Get all orders for a farmer
export const getFarmerOrders = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'farmer', { headers });
  return res.data;
};

// Get all orders for a customer
export const getCustomerOrders = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'customer', { headers });
  return res.data;
};

// Update an order status
export const updateOrderStatus = async (orderId, status) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.put(API_URL + orderId, { status }, { headers });
  return res.data;
};

// Get all orders (admin only)
export const getAllOrders = async (searchQuery = '') => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + `all?search=${searchQuery}`, { headers });
  return res.data;
};
