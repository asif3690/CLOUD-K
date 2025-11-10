// ❌ Wrong: missing `/api` at the end of the base URL
export const API_BASE =
  import.meta.env.VITE_API_BASE?.replace(/\/$/, "") || "https://cloud-k.onrender.com";

export const API_ENDPOINTS = {
  auth: {
    login: "/auth/login",
    register: "/auth/register",
    logout: "/auth/logout",
  },
  menu: "/menu",
  orders: "/orders",
};
