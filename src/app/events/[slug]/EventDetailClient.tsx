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
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleBooking = async () => {
    setError("");
    setSuccess("");

    try {
      // Later this will hit our /api/bookings
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventId: event._id,
          seats: seats,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Booking failed");
        return;
      }

      setSuccess(`🎉 Successfully booked ${seats} seat(s)!`);
    } catch (err) {
      setError("Something went wrong. Please try again.");
    }
  };

  return (
    <div className="border p-4 rounded mt-6">
      <h2 className="text-lg font-bold mb-2">Book Your Tickets</h2>
      <p>Price per ticket: ₹{event.price}</p>
      <p>Available: {event.availableSeats}</p>

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

      <button
        onClick={handleBooking}
        disabled={event.availableSeats === 0}
        className="mt-4 bg-green-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {event.availableSeats > 0 ? "Book Ticket" : "Sold Out"}
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}
      {success && <p className="text-green-600 mt-2">{success}</p>}
    </div>
  );
}
