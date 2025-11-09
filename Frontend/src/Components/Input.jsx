import React from "react";

export default function Input({ label, name, type = "text", value, onChange }) {
  return (
    <div className="flex flex-col">
      <label htmlFor={name} className="text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        className="border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-400 outline-none"
      />
    </div>
  );
}
