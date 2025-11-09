import React from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { LogOut, UtensilsCrossed, User, ChefHat } from "lucide-react";

export default function Navbar() {
  const { logout, user } = useAuth();

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/menu", label: "Menu" },
    { to: "/orders", label: "Orders" },
  ];

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm fixed top-0 left-0 right-0 z-50">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16">
          {/* Left: Brand */}
          <div className="flex items-center gap-3">
            <div className="bg-linear-to-br from-blue-500 to-blue-600 p-2.5 rounded-xl shadow-md">
              <ChefHat size={22} className="text-white" />
            </div>
            <div>
              <span className="font-bold text-xl text-gray-800 block leading-none">
                Cloud Kitchen
              </span>
              <span className="text-xs text-gray-500 font-medium">
                Management System
              </span>
            </div>
          </div>

          {/* Center: Navigation Links */}
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `font-semibold text-sm px-4 py-2 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "text-white bg-blue-600 shadow-md"
                      : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right: User Info + Logout */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-linear-to-r from-blue-50 to-indigo-50 px-4 py-2 rounded-lg border border-blue-200">
              <div className="bg-blue-600 p-1.5 rounded-full">
                <User size={14} className="text-white" />
              </div>
              <span className="text-sm font-bold text-gray-700">
                {user?.role ? user.role.toUpperCase() : "GUEST"}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center gap-2 bg-linear-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}