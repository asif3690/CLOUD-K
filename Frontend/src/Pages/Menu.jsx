// src/Pages/Menu.jsx
import React, { useState } from "react";
import Input from "../Components/Input.jsx";
import Loader from "../Components/Loader.jsx";
import useFetch from "../Hooks/useFetch.jsx";
import api from "../api/api";
import { API_ENDPOINTS } from "../utils/constants";
import { Trash, Pencil } from "lucide-react";
import Table from "../Components/Table.jsx";

export default function Menu() {
  const { data: menu, loading, setData } = useFetch(API_ENDPOINTS.menu);

  const [form, setForm] = useState({
    NAME: "",
    DESCRIPTION: "",
    PRICE: "",
    AVAILABLE: true,
    CATEGORY: "",
  });

  const [editMode, setEditMode] = useState(false);
  const [editItemId, setEditItemId] = useState(null);

  // Handle inputs
  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  /* =====================================================
        ADD / UPDATE ITEM
  ===================================================== */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      PRICE: Number(form.PRICE),
      AVAILABLE: form.AVAILABLE ? 1 : 0,
    };

    try {
      if (editMode) {
        await api.put(`${API_ENDPOINTS.menu}/${editItemId}`, payload);
        alert("Item updated!");
      } else {
        await api.post(API_ENDPOINTS.menu, payload);
        alert("Item added!");
      }

      window.location.reload();
    } catch (err) {
      console.error("Menu save error:", err);
      alert("Failed to save item");
    }
  };

  /* =====================================================
        DELETE ITEM
  ===================================================== */
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this item?")) return;
    try {
      await api.delete(`${API_ENDPOINTS.menu}/${id}`);
      setData(menu.filter((item) => item.ITEM_ID !== id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  /* =====================================================
        ENABLE EDIT
  ===================================================== */
  const enableEdit = (item) => {
    setEditMode(true);
    setEditItemId(item.ITEM_ID);

    setForm({
      NAME: item.NAME,
      DESCRIPTION: item.DESCRIPTION,
      PRICE: item.PRICE,
      AVAILABLE: item.AVAILABLE,
      CATEGORY: item.CATEGORY || "",
    });
  };

  /* =====================================================
        TABLE COLUMNS
  ===================================================== */
  const columns = [
    { key: "ITEM_ID", label: "Item ID" },
    { key: "NAME", label: "Name" },
    { key: "CATEGORY", label: "Category" },
    { key: "PRICE", label: "Price" },
    { key: "AVAILABLE", label: "Available" },
    { key: "ACTIONS", label: "Actions" },
  ];

  /* =====================================================
        TABLE DATA (Clean mapping)
  ===================================================== */
  const tableData =
    menu?.map((item) => ({
      ITEM_ID: item.ITEM_ID,
      NAME: item.NAME,
      CATEGORY: item.CATEGORY || "-",
      PRICE: `₹${item.PRICE}`,
      AVAILABLE: item.AVAILABLE ? "Yes" : "No",

      ACTIONS: (
        <div className="flex gap-3">
          <button
            onClick={() => enableEdit(item)}
            className="text-blue-600 hover:text-blue-800"
          >
            <Pencil size={18} />
          </button>

          <button
            onClick={() => handleDelete(item.ITEM_ID)}
            className="text-red-600 hover:text-red-800"
          >
            <Trash size={18} />
          </button>
        </div>
      ),
    })) || [];

  return (
    <div className="p-4 md:p-6">
      <h2 className="text-3xl font-semibold text-gray-800 mb-6">Menu Items</h2>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-white p-6 rounded-lg shadow mb-6"
      >
        <Input
          label="Name"
          name="NAME"
          value={form.NAME}
          onChange={handleChange}
        />

        <Input
          label="Category"
          name="CATEGORY"
          value={form.CATEGORY}
          onChange={handleChange}
        />

        <Input
          label="Description"
          name="DESCRIPTION"
          value={form.DESCRIPTION}
          onChange={handleChange}
        />

        <Input
          label="Price"
          name="PRICE"
          type="number"
          value={form.PRICE}
          onChange={handleChange}
        />

        <label className="flex items-center gap-2 text-gray-700">
          <input
            type="checkbox"
            name="AVAILABLE"
            checked={form.AVAILABLE}
            onChange={(e) => setForm({ ...form, AVAILABLE: e.target.checked })}
            className="w-4 h-4 accent-blue-600"
          />
          Available
        </label>

        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
        >
          {editMode ? "Update Item" : "Add Item"}
        </button>
      </form>

      {/* TABLE */}
      {loading ? <Loader /> : <Table columns={columns} data={tableData} />}
    </div>
  );
}
