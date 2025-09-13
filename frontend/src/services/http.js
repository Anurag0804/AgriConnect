import axios from 'axios';
import { getCurrentUser } from './authService';

const http = axios.create({
  baseURL: 'http://localhost:5000/api',
});

http.interceptors.request.use(
  (config) => {
    window.dispatchEvent(new CustomEvent('loading-start'));
    const user = getCurrentUser();
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    window.dispatchEvent(new CustomEvent('loading-stop'));
    return Promise.reject(error);
  }
);

http.interceptors.response.use(
  (response) => {
    window.dispatchEvent(new CustomEvent('loading-stop'));
    return response;
  },
  (error) => {
    window.dispatchEvent(new CustomEvent('loading-stop'));
    return Promise.reject(error);
  }
);

export default http;
