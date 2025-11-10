import axios from "axios";
import { API_BASE } from "../utils/constants.js";

// ❌ This will break — because baseURL doesn't include `/api`
const api = axios.create({
  baseURL: API_BASE || "https://cloud-k.onrender.com/api",
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
