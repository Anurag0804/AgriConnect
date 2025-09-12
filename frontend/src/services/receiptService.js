import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/receipts/";

const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

export const createReceipt = async (orderId) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.post(API_URL, { order: orderId }, { headers });
  return res.data;
};

export const getFarmerReceipts = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'farmer', { headers });
  return res.data;
};

export const getCustomerReceipts = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + 'customer', { headers });
  return res.data;
};

export const updateReceiptStatus = async (receiptId, paymentStatus) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.put(API_URL + receiptId, { paymentStatus }, { headers });
  return res.data;
};

// Get all receipts (admin only)
export const getAllReceipts = async (searchQuery = '') => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + `all?search=${searchQuery}`, { headers });
  return res.data;
};
