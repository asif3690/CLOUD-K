// src/Components/SectionHeader.jsx
import React from "react";

export default function SectionHeader({ icon: Icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-1 flex items-center gap-2">
        {Icon && <Icon size={24} className="text-blue-600" />}
        {title}
      </h2>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
}