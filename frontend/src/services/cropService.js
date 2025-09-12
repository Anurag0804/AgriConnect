import axios from 'axios';
import { getCurrentUser } from './authService';

const API_URL = "http://localhost:5000/api/crops/";

// Helper to get the auth token
const getAuthHeader = () => {
  const user = getCurrentUser();
  if (user && user.token) {
    return { Authorization: 'Bearer ' + user.token };
  } else {
    return {};
  }
};

// Get all available crops for the marketplace with filtering
export const getCrops = async (params) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

// Create a new crop listing
export const createCrop = async (cropData) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.post(API_URL, cropData, { headers });
  return res.data;
};

// Get all crops for a specific farmer
export const getFarmerCrops = async (farmerId) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + `farmer/${farmerId}`, { headers });
  return res.data;
};

// Get all crops (admin only)
export const getAllCrops = async (searchQuery = '') => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.get(API_URL + `all?search=${searchQuery}`, { headers });
  return res.data;
};

// Update a crop (admin only)
export const updateCrop = async (cropId, cropData) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.put(API_URL + cropId, cropData, { headers });
  return res.data;
};

// Delete a crop (admin only)
export const deleteCrop = async (cropId) => {
  const headers = getAuthHeader();
  if (!headers.Authorization) {
    throw new Error('No authorization token found. Please log in.');
  }
  const res = await axios.delete(API_URL + cropId, { headers });
  return res.data;
};
