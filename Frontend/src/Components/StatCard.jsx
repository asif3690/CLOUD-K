import React from "react";

export default function StatCard({ title, value, icon: Icon, color, bgLight, textColor }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-4">
        <div className={`${bgLight} p-3 rounded-lg`}>
          <Icon className={`${textColor}`} size={24} />
        </div>
      </div>
      <h3 className="text-gray-600 text-sm font-medium mb-1">{title}</h3>
      <p className="text-3xl font-bold text-gray-800">{value}</p>
    </div>
  );
}