import axios from 'axios';
import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/products';

// Get auth headers
const getAuthHeaders = () => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
};

/**
 * Get expiry trends data
 */
export const getExpiryTrends = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/analytics/expiry-trends`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching expiry trends:', error);
        throw error;
    }
};

/**
 * Get category distribution data
 */
export const getCategoryDistribution = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/analytics/category-distribution`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching category distribution:', error);
        throw error;
    }
};

/**
 * Get waste metrics data
 */
export const getWasteMetrics = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/analytics/waste-metrics`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching waste metrics:', error);
        throw error;
    }
};

/**
 * Get inventory statistics
 */
export const getInventoryStats = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/analytics/inventory-stats`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching inventory stats:', error);
        throw error;
    }
};

/**
 * Get monthly expiry forecast
 */
export const getMonthlyForecast = async () => {
    try {
        const response = await axios.get(
            `${API_URL}/analytics/monthly-forecast`,
            { headers: getAuthHeaders() }
        );
        return response.data;
    } catch (error) {
        console.error('Error fetching monthly forecast:', error);
        throw error;
    }
};

/**
 * Fetch all analytics data at once
 */
export const getAllAnalytics = async () => {
    try {
        const [trends, categories, waste, stats, forecast] = await Promise.all([
            getExpiryTrends(),
            getCategoryDistribution(),
            getWasteMetrics(),
            getInventoryStats(),
            getMonthlyForecast()
        ]);

        return {
            trends,
            categories,
            waste,
            stats,
            forecast
        };
    } catch (error) {
        console.error('Error fetching all analytics:', error);
        throw error;
    }
};
