// src/Components/Table.jsx
import React from "react";

export default function Table({ columns, data }) {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full bg-white">
        <thead className="bg-gray-100 text-gray-700">
          <tr>
            {columns.map((col) => (
              <th key={`head-${col.key}`} className="px-4 py-2 text-left">
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={row.ITEM_ID || `row-${rowIndex}`}
              className="border-t hover:bg-gray-50"
            >
              {columns.map((col, colIndex) => (
                <td key={`cell-${rowIndex}-${colIndex}`} className="px-4 py-2">
                  {row[col.key] !== undefined && row[col.key] !== null
                    ? row[col.key] // only the REAL value
                    : "-"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
