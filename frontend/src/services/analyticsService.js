import http from './http';
import { getCurrentUser } from './authService';

const API_URL = "/analytics/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

export const getPlatformStats = async () => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await http.get(API_URL + 'stats', { headers });
  return res.data;
};
