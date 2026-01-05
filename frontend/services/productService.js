import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';

const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getProducts = async () => {
  try {
    const response = await axios.get(API_URL, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const createProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error creating product:', error);
    throw error;
  }
};

export const updateProduct = async (id, updatedData) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, updatedData, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (id) => {
  try {
    await axios.delete(`${API_URL}/${id}`, {
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

export const sendExpiryAlert = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/alert`,
      { productId: id },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending alert:', error);
    throw error;
  }
};