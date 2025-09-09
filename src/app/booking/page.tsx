"use client";

import { useEffect, useState } from "react";

export default function UserBookings() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBookings() {
      const res = await fetch("/api/bookings?userId=USER123"); // 🔥 Replace with logged-in user
      const data = await res.json();
      setBookings(data.bookings || []);
      setLoading(false);
    }
    fetchBookings();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">My Bookings</h1>
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li key={b._id} className="border p-4 rounded">
              <p>Event: {b.eventId.title}</p>
              <p>Seats: {b.seats}</p>
              <p>Date: {new Date(b.createdAt).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
