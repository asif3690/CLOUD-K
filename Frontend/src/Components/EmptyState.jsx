// src/Components/EmptyState.jsx
import React from "react";

export default function EmptyState({ icon: Icon, message }) {
  return (
    <div className="text-center py-12 text-gray-500">
      {Icon && <Icon size={48} className="mx-auto mb-3 opacity-30" />}
      <p className="text-lg">{message}</p>
    </div>
  );
}