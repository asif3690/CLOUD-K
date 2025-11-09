import React, { createContext, useContext, useState } from "react";
import api from "../api/api";
import { API_ENDPOINTS } from "../utils/constants";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  const login = async (username, password) => {
    try {
      const res = await api.post(API_ENDPOINTS.login, { username, password });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
      return { ok: true };
    } catch (err) {
      return { ok: false, error: err?.response?.data?.error || "Login failed" };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
