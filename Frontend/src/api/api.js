// src/api/api.js
import axios from "axios";
import { API_BASE } from "../utils/constants.js";

const api = axios.create({
  baseURL: API_BASE,
});

// 🔹 Automatically attach JWT token to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;
