import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const PRODUCTS_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
const AUTH_API_URL = PRODUCTS_API_URL.replace('/products', '/auth');
const TOKEN_KEY = 'auth_token';

export const getToken = () => localStorage.getItem(TOKEN_KEY);

export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const clearToken = () => {
  localStorage.removeItem(TOKEN_KEY);
};

export const register = async (username, password, phoneNumber) => {
  const response = await axios.post(`${AUTH_API_URL}/register`, {
    username,
    password,
    phoneNumber,
  });
  const { token, user } = response.data;
  setToken(token);
  return user;
};

export const login = async (username, password) => {
  const response = await axios.post(`${AUTH_API_URL}/login`, {
    username,
    password,
  });
  const { token, user } = response.data;
  setToken(token);
  return user;
};

export const logout = () => {
  clearToken();
};

export const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;
  try {
    return jwtDecode(token);
  } catch {
    clearToken();
    return null;
  }
};

export const isAuthenticated = () => !!getCurrentUser();


