import http from './http';

const getNearestFarmers = async (lat, lon, radius = 10000) => { // Added default radius
  try {
    const response = await http.get(`/users/nearest-farmers?lat=${lat}&lon=${lon}&radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest farmers:', error);
    throw error;
  }
};

const getNearestCustomers = async (lat, lon, radius = 10000) => { // Added default radius
  try {
    const response = await http.get(`/users/nearest-customers?lat=${lat}&lon=${lon}&radius=${radius}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching nearest customers:', error);
    throw error;
  }
};

const locationService = {
  getNearestFarmers,
  getNearestCustomers,
};

export default locationService;
