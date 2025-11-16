// src/Components/Input.jsx
import React from "react";

export default function Input({ label, name, type = "text", value, onChange, placeholder }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="font-medium text-gray-700">{label}</label>
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full p-3 border rounded-md focus:ring focus:ring-blue-300 outline-none"
      />
    </div>
  );
}
