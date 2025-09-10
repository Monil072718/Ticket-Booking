"use client";

import { useEffect, useState } from "react";

type Booking = {
  _id: string;
  seats: number;
  createdAt: string;
  event: {
    _id: string;
    title: string;
    date: string;
    venue: string;
  };
};

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const res = await fetch("/api/bookings");
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Failed to load bookings");
          return;
        }

        setBookings(data.bookings);
      } catch (err) {
        setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <p className="p-6">Loading your bookings...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">🎟️ My Bookings</h1>

      {bookings.length === 0 ? (
        <p>You have no bookings yet.</p>
      ) : (
        <ul className="space-y-4">
          {bookings.map((b) => (
            <li
              key={b._id}
              className="border p-4 rounded shadow-sm bg-white"
            >
              <h2 className="text-lg font-semibold">{b.event.title}</h2>
              <p>Date: {new Date(b.event.date).toLocaleString()}</p>
              <p>Venue: {b.event.venue}</p>
              <p>Seats booked: {b.seats}</p>
              <p className="text-sm text-gray-500">
                Booked on: {new Date(b.createdAt).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
