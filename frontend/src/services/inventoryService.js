import http from './http';
import { getCurrentUser } from './authService';

const API_URL = "/inventory/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  }
  return {};
};

// Get inventory for the logged-in customer
export const getCustomerInventory = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + 'customer', { headers });
  return res.data;
};

// Get all inventories (admin only)
export const getAllInventories = async (searchQuery = '') => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + `all?search=${searchQuery}`, { headers });
  return res.data;
};
