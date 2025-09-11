import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/receipts/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

// Create a new receipt
export const createReceipt = async (orderId) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.post(API_URL, { order: orderId }, { headers });
  return res.data;
};

// Get all receipts
export const getAllReceipts = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL, { headers });
  return res.data;
};

// Get all receipts for a farmer
export const getFarmerReceipts = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'farmer', { headers });
  return res.data;
};

// Get all receipts for a customer
export const getCustomerReceipts = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'customer', { headers });
  return res.data;
};

// Update a receipt payment status
export const updateReceiptStatus = async (receiptId, paymentStatus) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.put(API_URL + receiptId, { paymentStatus }, { headers });
  return res.data;
};
