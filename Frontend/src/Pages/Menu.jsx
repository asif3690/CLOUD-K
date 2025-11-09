// src/Pages/Menu.jsx
import React, { useState } from "react";
import Input from "../Components/Input.jsx";
import Loader from "../Components/Loader.jsx";
import Table from "../Components/Table.jsx";
import useFetch from "../Hooks/useFetch.jsx";
import api from "../api/api";
import { API_ENDPOINTS } from "../utils/constants";

export default function Menu() {
  const { data: menu, loading, setData } = useFetch(API_ENDPOINTS.menu);

  const [form, setForm] = useState({
    NAME: "",
    DESCRIPTION: "",
    PRICE: "",
    AVAILABLE: true,
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.NAME || !form.PRICE) {
      alert("⚠️ Please enter item name and price");
      return;
    }
    try {
      const { data } = await api.post(API_ENDPOINTS.menu, form);
      setData([...menu, data]);
      alert("✅ Menu item added!");
      setForm({ NAME: "", DESCRIPTION: "", PRICE: "", AVAILABLE: true });
    } catch (err) {
      console.error("Add menu error:", err);
      alert("❌ Failed to add item");
    }
  };

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Menu Items</h2>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow-sm mb-6"
      >
        <Input
          label="Name"
          name="NAME"
          value={form.NAME}
          onChange={handleChange}
          placeholder="Enter item name"
        />
        <Input
          label="Description"
          name="DESCRIPTION"
          value={form.DESCRIPTION}
          onChange={handleChange}
          placeholder="Optional description"
        />
        <Input
          label="Price"
          name="PRICE"
          type="number"
          value={form.PRICE}
          onChange={handleChange}
          placeholder="Enter price"
        />

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="AVAILABLE"
            checked={form.AVAILABLE}
            onChange={(e) =>
              setForm({ ...form, AVAILABLE: e.target.checked })
            }
            className="w-4 h-4 accent-blue-600"
          />
          Available
        </label>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition-all"
        >
          ➕ Add Menu Item
        </button>
      </form>

      {loading ? (
        <Loader />
      ) : (
        <Table columns={["ITEM_ID", "NAME", "PRICE", "AVAILABLE"]} data={menu} />
      )}
    </div>
  );
}
