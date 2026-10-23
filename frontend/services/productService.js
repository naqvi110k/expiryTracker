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

export const sendTelegramAlert = async (id) => {
  try {
    const response = await axios.post(
      `${API_URL}/telegram-alert`,
      { productId: id },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error sending Telegram alert:', error);
    throw error;
  }
};

export const generateExpiryReport = async () => {
  try {
    const response = await axios.get(`${API_URL}/report`, {
      headers: getAuthHeaders(),
      responseType: 'blob', // Important for PDF download
    });
    
    // Create a blob link to download
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `expiry-report-${Date.now()}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    
    return { success: true };
  } catch (error) {
    console.error('Error generating report:', error);
    throw error;
  }
};

export const bulkImportProducts = async (file, onProgress) => {
  try {
    const token = getToken();
    if (!token) {
      throw new Error('Authentication required');
    }

    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post(`${API_URL}/bulk-import`, formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        // Don't set Content-Type header, let browser set it with boundary
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(percentCompleted);
        }
      },
    });

    return response.data;
  } catch (error) {
    console.error('Error importing products:', error);
    throw error;
  }
};

export const extractProductDetails = async (base64Image) => {
  try {
    const response = await axios.post(
      `${API_URL}/extract`,
      { image: base64Image },
      { headers: getAuthHeaders() }
    );
    return response.data;
  } catch (error) {
    console.error('Error extracting product details:', error);
    const message = error.response?.data?.message || error.message || 'Failed to extract product details from image';
    throw new Error(message);
  }
};
