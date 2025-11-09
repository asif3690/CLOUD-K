import React from "react";

const getStatusBadge = (status) => {
  const statusLower = status?.toLowerCase();
  if (statusLower === "completed") {
    return "bg-green-100 text-green-700 border-green-200";
  } else if (statusLower === "pending") {
    return "bg-yellow-100 text-yellow-700 border-yellow-200";
  } else if (statusLower === "cancelled") {
    return "bg-red-100 text-red-700 border-red-200";
  }
  return "bg-gray-100 text-gray-700 border-gray-200";
};

export default function RecentOrderItem({ order }) {
  return (
    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200 hover:bg-gray-100 transition-colors">
      <div className="flex-1">
        <p className="font-semibold text-gray-800">Order #{order.ORDER_ID}</p>
        <p className="text-sm text-gray-600">{order.USERNAME}</p>
        <p className="text-xs text-gray-500 mt-1">
          {new Date(order.ORDER_DATE).toLocaleString()}
        </p>
      </div>
      <div className="flex items-center gap-4">
        <p className="font-bold text-gray-800">
          ${parseFloat(order.TOTAL_AMOUNT).toFixed(2)}
        </p>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(
            order.STATUS
          )}`}
        >
          {order.STATUS}
        </span>
      </div>
    </div>
  );
}