import axios from 'axios';

const http = axios.create({
  baseURL: 'http://localhost:5000/api',
});

http.interceptors.request.use(
  (config) => {
    window.dispatchEvent(new CustomEvent('loading-start'));
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
