// src/utils/constants.js

export const API_BASE = import.meta.env.VITE_API_BASE; 
// Example: http://localhost:5000/api

export const API_ENDPOINTS = {
  login: "/auth/login",
  register: "/auth/register",
  menu: "/menu",
  orders: "/orders",
};
