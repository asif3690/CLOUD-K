// src/App.jsx
import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Menu from "./Pages/Menu.jsx";
import Orders from "./Pages/Orders.jsx";
import Layout from "./Components/Layout.jsx";
import { useAuth } from "./Context/AuthContext.jsx";

function ProtectedRoute({ children }) {
  const auth = useAuth();

  if (!auth) {
    return <Navigate to="/login" replace />;
  }

  const { user } = auth;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route */}
        <Route path="/login" element={<Login />} />

        {/* Protected Layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/orders" element={<Orders />} />
        </Route>

        {/* Redirect unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
