"use client";
import { useEffect, useState } from "react";

export default function AdminSales() {
  const [sales, setSales] = useState([]);

  useEffect(() => {
    fetch("/api/sales")
      .then(res => res.json())
      .then(data => setSales(data.sales));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin - Sales Summary</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">Event ID</th>
            <th className="p-2 border">Tickets Sold</th>
            <th className="p-2 border">Total Revenue</th>
          </tr>
        </thead>
        <tbody>
          {sales.map((s: any) => (
            <tr key={s._id} className="border">
              <td className="p-2 border">{s._id}</td>
              <td className="p-2 border">{s.totalTickets}</td>
              <td className="p-2 border">${s.totalRevenue}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
