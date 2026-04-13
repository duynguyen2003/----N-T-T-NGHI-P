import axios from 'axios';

const API_URL = 'http://localhost:5000/api/admin';

// Reusable axios instance for admin requests
export const adminAxios = axios.create({
  baseURL: API_URL,
});

// Setup interceptor to inject tokens
adminAxios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const adminApi = {
  // 1. Dashboard API
  getDashboardStats: async () => {
    const res = await adminAxios.get('/dashboard');
    return res.data;
  },

  // 2. Users API
  getUsers: async ({ page = 1, limit = 10, search = '' }) => {
    const res = await axios.get(`http://localhost:5000/api/users`, {
      params: { page, limit, search },
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return res.data;
  },

  updateUser: async (userId, data) => {
    const res = await axios.put(`http://localhost:5000/api/users/${userId}`, data, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return res.data;
  },

  deleteUser: async (userId) => {
    const res = await axios.delete(`http://localhost:5000/api/users/${userId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    });
    return res.data;
  }
};
