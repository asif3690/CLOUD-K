// src/utils/constants.js

// 🔹 Base URL for your backend API
// Use environment variable if deployed, fallback to local server
export const API_BASE =
  import.meta.env.VITE_API_BASE || "http://localhost:5000/api";

// 🔹 Centralized API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: `${API_BASE}/auth/login`,
    register: `${API_BASE}/auth/register`,
    logout: `${API_BASE}/auth/logout`,
  },
  menu: `${API_BASE}/menu`,
  orders: `${API_BASE}/orders`,
};
