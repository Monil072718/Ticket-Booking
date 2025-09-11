"use client";

import { useState } from "react";

type EventProps = {
  event: {
    _id: string;
    title: string;
    description?: string;
    date: string;
    venue: string;
    price: number;
    availableSeats: number;
    image?: string;
  };
};

export default function EventDetailClient({ event }: EventProps) {
  const [seats, setSeats] = useState(1);
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event._id, seats, city, state }),
        credentials: "include",
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      setSuccess(`🎉 Successfully booked ${seats} seat(s)!`);
      setCity("");
      setState("");
      setSeats(1);
    } catch {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <main className="max-w-5xl mx-auto p-6 grid md:grid-cols-2 gap-8">
      {/* Left: Event Info */}
      <div>
        <img src={event.image || "/default-event.jpg"} alt={event.title} className="rounded-lg w-full h-64 object-cover" />
        <h1 className="text-3xl font-bold mt-4">{event.title}</h1>
        <p className="text-gray-600 mt-2">{new Date(event.date).toLocaleString()}</p>
        <p className="mt-2">{event.description}</p>
        <p className="mt-3 font-semibold">📍 Venue: {event.venue}</p>
      </div>

      {/* Right: Booking Form */}
      <div className="border rounded-lg p-6 bg-white shadow">
        <h2 className="text-xl font-bold mb-3">🎟 Book Your Tickets</h2>
        <p>💰 Price per ticket: <b>₹{event.price}</b></p>
        <p>🎟 Available: {event.availableSeats}</p>

        {/* Seats */}
        <div className="mt-4">
          <label className="block text-sm font-medium">Seats</label>
          <input
            type="number"
            min={1}
            max={event.availableSeats}
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            className="w-24 border p-2 rounded"
          />
        </div>

        {/* City */}
        <div className="mt-4">
          <label className="block text-sm font-medium">City</label>
          <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        {/* State */}
        <div className="mt-4">
          <label className="block text-sm font-medium">State</label>
          <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full border p-2 rounded" required />
        </div>

        <button
          onClick={handleBooking}
          disabled={event.availableSeats === 0}
          className="mt-5 bg-green-600 text-white px-4 py-2 rounded w-full hover:bg-green-700 transition disabled:opacity-50"
        >
          {event.availableSeats > 0 ? "Book Ticket" : "Sold Out"}
        </button>

        {error && <p className="text-red-500 mt-3">{error}</p>}
        {success && <p className="text-green-600 mt-3">{success}</p>}
      </div>
    </main>
  );
}
