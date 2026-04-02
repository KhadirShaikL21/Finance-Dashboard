// API Service to handle all backend calls
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Set common headers
const getHeaders = (isFormData = false) => {
  const headers = {
    'Content-Type': isFormData ? 'multipart/form-data' : 'application/json',
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Wrapper for API calls
const apiCall = async (endpoint, method = 'GET', data = null) => {
  try {
    const config = {
      method,
      headers: getHeaders(),
    };

    if (data) {
      config.body = JSON.stringify(data);
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'API Error');
    }

    return result;
  } catch (error) {
    throw error;
  }
};

// Auth Services
export const authService = {
  register: (userData) => apiCall('/users/register', 'POST', userData),
  login: (email, password) => apiCall('/users/login', 'POST', { email, password }),
  getCurrentUser: () => apiCall('/users/profile/me', 'GET'),
};

// User Services
export const userService = {
  getAllUsers: () => apiCall('/users', 'GET'),
  getUserById: (id) => apiCall(`/users/${id}`, 'GET'),
  updateUser: (id, userData) => apiCall(`/users/${id}`, 'PUT', userData),
  deleteUser: (id) => apiCall(`/users/${id}`, 'DELETE'),
};

// Record Services
export const recordService = {
  createRecord: (recordData) => apiCall('/records', 'POST', recordData),
  getRecords: (filters = {}) => {
    const params = new URLSearchParams();
    if (filters.type) params.append('type', filters.type);
    if (filters.category) params.append('category', filters.category);
    if (filters.startDate) params.append('startDate', filters.startDate);
    if (filters.endDate) params.append('endDate', filters.endDate);
    if (filters.page) params.append('page', filters.page);
    if (filters.limit) params.append('limit', filters.limit);

    return apiCall(`/records?${params.toString()}`, 'GET');
  },
  getRecordById: (id) => apiCall(`/records/${id}`, 'GET'),
  updateRecord: (id, recordData) => apiCall(`/records/${id}`, 'PUT', recordData),
  deleteRecord: (id) => apiCall(`/records/${id}`, 'DELETE'),
};

// Summary Services
export const summaryService = {
  getTotals: () => apiCall('/summary/totals', 'GET'),
  getByCategory: () => apiCall('/summary/by-category', 'GET'),
  getMonthlyTrends: () => apiCall('/summary/monthly', 'GET'),
  getRecentActivity: (limit = 10) => apiCall(`/summary/recent?limit=${limit}`, 'GET'),
  getDashboardSummary: () => apiCall('/summary/dashboard', 'GET'),
  getAnalystInsights: () => apiCall('/summary/analyst-insights', 'GET'),
};

export default {
  authService,
  userService,
  recordService,
  summaryService,
};
