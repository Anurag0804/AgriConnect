import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth/";

export const register = async (data) => {
  return await axios.post(API_URL + "register", data);
};

export const login = async (data) => {
  const res = await axios.post(API_URL + "login", data);
  if (res.data.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
