"use client";

import { useState } from "react";

export default function BookEvent({ event }: { event: any }) {
  const [seats, setSeats] = useState(1);
  const [message, setMessage] = useState("");

  const handleBooking = async () => {
    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "USER123", // 🔥 Replace with logged-in user
          eventId: event._id,
          seats,
        }),
      });

      const data = await res.json();
      if (data.success) {
        setMessage("Booking confirmed!");
      } else {
        setMessage(data.error || "Booking failed");
      }
    } catch (err) {
      setMessage("Something went wrong");
    }
  };

  return (
    <div className="mt-6">
      <label>
        Seats:
        <input
          type="number"
          min="1"
          max={event.availableSeats}
          value={seats}
          onChange={(e) => setSeats(Number(e.target.value))}
          className="border p-2 ml-2"
        />
      </label>
      <button
        onClick={handleBooking}
        className="ml-4 bg-blue-600 text-white px-4 py-2 rounded"
      >
        Book Now
      </button>
      {message && <p className="mt-2 text-green-600">{message}</p>}
    </div>
  );
}
