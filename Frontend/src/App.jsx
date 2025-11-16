// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider, useAuth } from "./Context/AuthContext.jsx";

import Navbar from "./Components/Navbar.jsx";
import Login from "./Pages/Login.jsx";
import Dashboard from "./Pages/Dashboard.jsx";
import Menu from "./Pages/Menu.jsx";
import Orders from "./Pages/Orders.jsx";
import RiderDashboard from "./Pages/RiderDashboard.jsx";

function ProtectedRoute({ children, roles }) {
  const { user } = useAuth();

  // Not logged in → go to login
  if (!user) return <Navigate to="/login" />;

  // User logged in but role not allowed
  if (roles && !roles.includes(user.role)) return <Navigate to="/" />;

  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <Router>

        {/* Navbar only for logged-in users */}
        <NavbarWrapper />

        <Routes>

          {/* LOGIN */}
          <Route path="/login" element={<Login />} />

          {/* DASHBOARD (Home Page) */}
          <Route
            path="/"
            element={
              <ProtectedRoute roles={["admin", "chef", "customer"]}>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          {/* MENU PAGE */}
          <Route
            path="/menu"
            element={
              <ProtectedRoute roles={["admin", "chef", "customer"]}>
                <Menu />
              </ProtectedRoute>
            }
          />

          {/* ORDERS PAGE */}
          <Route
            path="/orders"
            element={
              <ProtectedRoute roles={["admin", "chef", "customer", "rider"]}>
                <Orders />
              </ProtectedRoute>
            }
          />

          {/* RIDER DASHBOARD */}
          <Route
            path="/rider"
            element={
              <ProtectedRoute roles={["rider"]}>
                <RiderDashboard />
              </ProtectedRoute>
            }
          />

          {/* FALLBACK */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

/* Navbar visible only after login */
function NavbarWrapper() {
  const { user } = useAuth();
  return user ? <Navbar /> : null;
}
