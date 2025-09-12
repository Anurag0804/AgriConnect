import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/analytics/";

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
  const res = await axios.get(API_URL + 'stats', { headers });
  return res.data;
};
