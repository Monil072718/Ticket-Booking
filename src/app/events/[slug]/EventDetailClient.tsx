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
        body: JSON.stringify({
          eventId: event._id,
          seats,
          city,
          state,
        }),
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
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
   
  };
  return (
    <div className="border p-4 rounded mt-6 bg-white shadow">
      <h2 className="text-lg font-bold mb-2">Book Your Tickets</h2>
      <p>💰 Price per ticket: ₹{event.price}</p>
      <p>🎟️ Available: {event.availableSeats}</p>

      {/* Seats */}
      <div className="flex items-center gap-2 mt-4">
        <label htmlFor="seats">Seats:</label>
        <input
          id="seats"
          type="number"
          min={1}
          max={event.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="w-20 border p-1 rounded"
        />
      </div>

      {/* City */}
      <div className="mt-4">
        <label className="block text-sm font-medium">City</label>
        <input
          type="text"
          value={city}
          onChange={(e) => setCity(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter your city"
          required
        />
      </div>

      {/* State */}
      <div className="mt-4">
        <label className="block text-sm font-medium">State</label>
        <input
          type="text"
          value={state}
          onChange={(e) => setState(e.target.value)}
          className="w-full border p-2 rounded"
          placeholder="Enter your state"
          required
        />
      </div>

      <button
        onClick={handleBooking}
        disabled={event.availableSeats === 0}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50 w-full"
      >
        {event.availableSeats > 0 ? "Book Ticket" : "Sold Out"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
