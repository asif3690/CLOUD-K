// src/Pages/Orders.jsx
import React from "react";
import Loader from "../Components/Loader.jsx";
import Table from "../Components/Table.jsx";
import useFetch from "../Hooks/useFetch.jsx";
import { API_ENDPOINTS } from "../utils/constants";

export default function Orders() {
  const { data: orders, loading } = useFetch(API_ENDPOINTS.orders);

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Orders</h2>

      {loading ? (
        <Loader />
      ) : orders && orders.length > 0 ? (
        <Table
          columns={[
            "ORDER_ID",
            "USERNAME",
            "TOTAL_AMOUNT",
            "ORDER_DATE",
            "STATUS",
          ]}
          data={orders}
        />
      ) : (
        <div className="bg-white p-6 rounded-lg shadow-sm text-gray-500 text-center">
          No orders found.
        </div>
      )}
    </div>
  );
}
