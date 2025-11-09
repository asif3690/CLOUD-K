import React from "react";

export default function Table({ columns, data }) {
  if (!data || data.length === 0)
    return <p className="text-gray-500">No data found</p>;

  return (
    <div className="overflow-x-auto border rounded-md">
      <table className="min-w-full text-sm text-left">
        <thead className="bg-blue-600 text-white">
          <tr>
            {columns.map((col) => (
              <th key={col} className="px-4 py-2">
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i} className="border-b hover:bg-gray-100">
              {columns.map((col) => (
                <td key={col} className="px-4 py-2">
                  {row[col]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
