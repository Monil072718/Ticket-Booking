"use client";
import { useEffect, useState } from "react";

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);

  useEffect(() => {
    fetch("/api/bookings")
      .then(res => res.json())
      .then(data => setBookings(data.bookings));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin - All Bookings</h1>
      <table className="w-full mt-4 border">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-2 border">User</th>
            <th className="p-2 border">Event</th>
            <th className="p-2 border">Tickets</th>
            <th className="p-2 border">Total Price</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((b: any) => (
            <tr key={b._id} className="border">
              <td className="p-2 border">{b.user?.name}</td>
              <td className="p-2 border">{b.event?.title}</td>
              <td className="p-2 border">{b.quantity}</td>
              <td className="p-2 border">${b.totalPrice}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
