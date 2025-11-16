import React from "react";
import api from "../api/api";
import useFetch from "../Hooks/useFetch";
import { API_ENDPOINTS } from "../utils/constants";

export default function RiderDashboard() {
  const { data: orders, loading, fetchData } = useFetch(API_ENDPOINTS.orders);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/rider-status`, { status });
      fetchData();
      alert("Status updated!");
    } catch (err) {
      console.error(err);
      alert("Failed to update");
    }
  };

  return (
    <div className="p-6 mt-20">
      <h1 className="text-3xl font-bold mb-6">Rider Dashboard</h1>

      {loading ? (
        <p>Loading orders...</p>
      ) : orders.length === 0 ? (
        <p>No assigned orders yet.</p>
      ) : (
        orders.map((order) => (
          <div
            key={order.ORDER_ID}
            className="bg-white p-5 mb-4 rounded-lg shadow border"
          >
            <h2 className="text-xl font-bold">Order #{order.ORDER_ID}</h2>
            <p className="text-gray-600">Customer: {order.USERNAME}</p>
            <p className="text-gray-600">Status: {order.STATUS}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => updateStatus(order.ORDER_ID, "picked")}
                className="bg-blue-500 text-white px-3 py-2 rounded"
              >
                Picked
              </button>

              <button
                onClick={() => updateStatus(order.ORDER_ID, "delivering")}
                className="bg-yellow-500 text-white px-3 py-2 rounded"
              >
                Delivering
              </button>

              <button
                onClick={() => updateStatus(order.ORDER_ID, "delivered")}
                className="bg-green-500 text-white px-3 py-2 rounded"
              >
                Delivered
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
