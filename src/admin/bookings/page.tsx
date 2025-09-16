"use client";

import { useEffect, useState } from "react";

type BookingType = {
  _id: string;
  user: { name: string; email: string };
  event: { title: string; date: string; venue: string; price: number };
  seats: number;
  totalPrice: number;
  city: string;
  state: string;
  createdAt: string;
};

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<BookingType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings", { credentials: "include" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch bookings");
        setBookings(data.bookings);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  if (loading) return <p className="p-6">Loading bookings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📑 Admin Bookings Management</h1>

      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border px-4 py-2">User</th>
                <th className="border px-4 py-2">Event</th>
                <th className="border px-4 py-2">Seats</th>
                <th className="border px-4 py-2">Total Price</th>
                <th className="border px-4 py-2">City</th>
                <th className="border px-4 py-2">State</th>
                <th className="border px-4 py-2">Booked On</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((b) => (
                <tr key={b._id} className="text-center">
                  <td className="border px-4 py-2">
                    {b.user?.name} <br />
                    <span className="text-sm text-gray-500">{b.user?.email}</span>
                  </td>
                  <td className="border px-4 py-2">
                    {b.event?.title} <br />
                    <span className="text-sm text-gray-500">
                      {new Date(b.event?.date).toLocaleDateString()} | {b.event?.venue}
                    </span>
                  </td>
                  <td className="border px-4 py-2">{b.seats}</td>
                  <td className="border px-4 py-2">₹{b.totalPrice}</td>
                  <td className="border px-4 py-2">{b.city}</td>
                  <td className="border px-4 py-2">{b.state}</td>
                  <td className="border px-4 py-2">
                    {new Date(b.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  );
}
