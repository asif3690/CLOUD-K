import React from "react";

export default function OrderStatusCard({ title, value, icon: Icon, color, bg, border }) {
  return (
    <div className={`${bg} ${border} border rounded-lg p-4 flex items-center gap-4`}>
      <div className={`${color}`}>
        <Icon size={32} />
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>{value}</p>
      </div>
    </div>
  );
}