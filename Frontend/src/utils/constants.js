// src/utils/constants.js

// 🔹 Base URL for your backend API
// Use environment variable if deployed, fallback to your Render backend
export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "http://localhost:5000/api";

// 🔹 Centralized API endpoints
export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  menu: "/menu",
  orders: "/orders",
};
