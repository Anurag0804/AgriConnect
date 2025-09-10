import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/order-confirmations/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

// Create a new order confirmation
export const createOrderConfirmation = async (orderId) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.post(API_URL, { order: orderId }, { headers });
  return res.data;
};

// Get all order confirmations for a farmer
export const getFarmerOrderConfirmations = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'farmer', { headers });
  return res.data;
};

// Get all order confirmations for a customer
export const getCustomerOrderConfirmations = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'customer', { headers });
  return res.data;
};
