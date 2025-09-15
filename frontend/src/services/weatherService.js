import http from './http';

const getWeather = async (lat, lon) => {
  try {
    const response = await http.get(`/weather?lat=${lat}&lon=${lon}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching weather data:', error);
    throw error;
  }
};

const weatherService = {
  getWeather,
};

export default weatherService;
