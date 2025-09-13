import http from './http';

const API_URL = "/auth/";

export const register = async (data) => {
  return await http.post(API_URL + "register", data);
};

export const login = async (data) => {
  const res = await http.post(API_URL + "login", data);
  if (res.data.token) {
    localStorage.setItem("user", JSON.stringify(res.data));
    window.dispatchEvent(new CustomEvent('user-changed'));
  }
  return res.data;
};

export const logout = () => {
  localStorage.removeItem("user");
  window.dispatchEvent(new CustomEvent('user-changed'));
};

export const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("user"));
};
