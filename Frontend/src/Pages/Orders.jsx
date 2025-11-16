// src/Pages/Orders.jsx
import React, { useState, useEffect } from "react";
import Loader from "../Components/Loader.jsx";
import useFetch from "../Hooks/useFetch.jsx";
import api from "../api/api";
import { useAuth } from "../Context/AuthContext.jsx";
import { API_ENDPOINTS } from "../utils/constants";

export default function Orders() {
  const { user } = useAuth();
  const { data: orders, loading, fetchData } = useFetch(API_ENDPOINTS.orders);

  const [riders, setRiders] = useState([]);

  /* =====================================================
     FETCH RIDERS (ADMIN / CHEF ONLY)
  ===================================================== */
  useEffect(() => {
    if (user?.role === "admin" || user?.role === "chef") {
      loadRiders();
    }
  }, [user]);

  const loadRiders = async () => {
    try {
      const res = await api.get("/auth/riders");
      console.log("Riders fetched:", res.data);
      setRiders(res.data); // [{ USER_ID, USERNAME, EMAIL, ROLE }]
    } catch (err) {
      console.error("Error loading riders:", err);
    }
  };

  /* =====================================================
     ASSIGN RIDER
  ===================================================== */
  const assignRider = async (orderId, riderUsername) => {
    if (!riderUsername) return;

    try {
      await api.put(`/orders/${orderId}/assign`, { rider: riderUsername });
      alert("Rider assigned successfully!");
      fetchData();
    } catch (err) {
      console.error("Assign rider error:", err);
      alert("Failed to assign rider");
    }
  };

  /* =====================================================
     UI
  ===================================================== */
  return (
    <div className="p-4 md:p-6 mt-16">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Orders</h2>

      {loading ? (
        <Loader />
      ) : orders?.length > 0 ? (
        <div className="overflow-x-auto bg-white p-4 rounded-lg shadow">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="p-3 text-left">Order ID</th>
                <th className="p-3 text-left">Customer</th>
                <th className="p-3 text-left">Total</th>
                <th className="p-3 text-left">Order Date</th>
                <th className="p-3 text-left">Status</th>

                {(user?.role === "admin" || user?.role === "chef") && (
                  <th className="p-3 text-left">Assign Rider</th>
                )}
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr
                  key={order.ORDER_ID}
                  className="border-b hover:bg-gray-50 transition"
                >
                  <td className="p-3 font-semibold">{order.ORDER_ID}</td>
                  <td className="p-3">{order.USERNAME}</td>
                  <td className="p-3">₹{order.TOTAL_AMOUNT}</td>
                  <td className="p-3">
                    {new Date(order.ORDER_DATE).toLocaleString()}
                  </td>

                  <td className="p-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        order.STATUS === "pending"
                          ? "bg-yellow-200 text-yellow-800"
                          : order.STATUS === "processing"
                          ? "bg-blue-200 text-blue-800"
                          : order.STATUS === "assigned"
                          ? "bg-purple-200 text-purple-800"
                          : order.STATUS === "delivering"
                          ? "bg-orange-200 text-orange-800"
                          : order.STATUS === "delivered"
                          ? "bg-green-300 text-green-900"
                          : order.STATUS === "completed"
                          ? "bg-green-200 text-green-800"
                          : "bg-red-200 text-red-800"
                      }`}
                    >
                      {order.STATUS.toUpperCase()}
                    </span>
                  </td>

                  {(user?.role === "admin" || user?.role === "chef") && (
                    <td className="p-3">
                      <select
                        className="border px-3 py-2 rounded"
                        defaultValue=""
                        onChange={(e) =>
                          assignRider(order.ORDER_ID, e.target.value)
                        }
                      >
                        <option value="">Select Rider</option>

                        {riders.length === 0 ? (
                          <option disabled>No riders found</option>
                        ) : (
                          riders.map((r) => (
                            <option key={r.USER_ID} value={r.USERNAME}>
                              {r.USERNAME}
                            </option>
                          ))
                        )}
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-gray-500 text-center">
          No orders found.
        </div>
      )}
    </div>
  );
}
