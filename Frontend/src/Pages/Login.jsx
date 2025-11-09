import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext.jsx";
import { ChefHat } from "lucide-react";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await login(username, password);
    if (res.ok) navigate("/");
    else setError(res.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-rose-400 via-orange-300 to-amber-200 relative overflow-hidden">
      {/* Subtle grid pattern background */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/diamond-upholstery.png')] opacity-10"></div>

      {/* Card */}
      <div className="relative bg-white/20 backdrop-blur-lg border border-white/30 rounded-2xl shadow-2xl p-8 w-[90%] max-w-md text-center">
        <div className="flex justify-center mb-5">
          <div className="bg-linear-to-r from-rose-500 to-orange-400 p-3 rounded-full shadow-lg">
            <ChefHat className="text-white w-8 h-8" />
          </div>
        </div>

        <h2 className="text-3xl font-extrabold text-white mb-3 drop-shadow-lg">
          Cloud Kitchen Login
        </h2>
        <p className="text-amber-50 mb-6 text-sm opacity-90">
          Manage your menu, orders, and kitchen workflow
        </p>

        {error && (
          <p className="text-sm bg-red-500/20 text-red-200 py-2 mb-3 rounded">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Username (admin / chef / rider)"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 rounded-md bg-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <input
            type="password"
            placeholder="Password (admin123 / chef123 / rider123)"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 rounded-md bg-white/30 text-white placeholder-white/80 focus:outline-none focus:ring-2 focus:ring-rose-300"
          />
          <button
            type="submit"
            className="w-full bg-linear-to-r from-rose-500 to-orange-400 hover:opacity-90 text-white py-3 rounded-md font-semibold shadow-md transition"
          >
            Sign In
          </button>
        </form>

        <p className="mt-6 text-white/90 text-sm opacity-80">
          Demo users: <b>admin/admin123</b> • <b>chef/chef123</b> • <b>rider/rider123</b>
        </p>
      </div>
    </div>
  );
}
