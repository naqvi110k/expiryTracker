import axios from 'axios';
import { getToken, setToken } from './authService';

const PRODUCTS_API_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';
const USERS_API_URL = PRODUCTS_API_URL.replace('/products', '/users');

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProfile = async () => {
  const response = await axios.get(`${USERS_API_URL}/me`, {
    headers: getAuthHeaders(),
  });
  return response.data.user;
};

export const updateProfile = async (profile) => {
  const response = await axios.put(`${USERS_API_URL}/me`, profile, {
    headers: getAuthHeaders(),
  });
  const { user, token } = response.data;
  if (token) {
    setToken(token);
  }
  return user;
};

export const deleteAccount = async () => {
  await axios.delete(`${USERS_API_URL}/me`, {
    headers: getAuthHeaders(),
  });
};

export const changePassword = async (passwordData) => {
  const response = await axios.put(`${USERS_API_URL}/me/password`, passwordData, {
    headers: getAuthHeaders(),
  });
  return response.data;
};

