import React from "react";
import Navbar from "./Navbar.jsx";
import { Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 flex flex-col">
      {/* Fixed Navbar */}
      <Navbar />

      {/* Page Content */}
      <main className="flex-1 pt-20 px-4 md:px-6 lg:px-8 pb-8 overflow-y-auto">
        <div className="max-w-7xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Optional Footer */}
      <footer className="bg-white border-t border-gray-200 py-4 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <p className="text-center text-sm text-gray-600">
            © {new Date().getFullYear()} Cloud Kitchen Management System. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}