import http from './http';
import { getCurrentUser } from './authService';

const API_URL = "/transactions/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

// Get purchase history for the logged-in customer
export const getCustomerTransactions = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + 'history/customer', { headers });
  return res.data;
};

// Get sales history for the logged-in farmer
export const getFarmerTransactions = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + 'history/farmer', { headers });
  return res.data;
};

export const buyCrop = async (cropId, quantity) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }

  const res = await http.post(
    API_URL,
    { cropId, quantity },
    { headers }
  );

  return res.data;
};

// Get all transactions (admin only)
export const getAllTransactions = async (searchQuery = '') => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + `all?search=${searchQuery}`, { headers });
  return res.data;
};
