"use client";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    fetch("/api/events")
      .then(res => res.json())
      .then(data => setEvents(data.events));
  }, []);

  const deleteEvent = async (id: string) => {
    await fetch(`/api/events/${id}`, { method: "DELETE" });
    setEvents(events.filter((e: any) => e._id !== id));
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Admin Dashboard - Events</h1>
      <ul className="mt-4 space-y-4">
        {events.map((event: any) => (
          <li key={event._id} className="border p-4 flex justify-between">
            <div>
              <h2 className="font-semibold">{event.title}</h2>
              <p>{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div className="space-x-2">
              <button className="bg-yellow-500 px-3 py-1 rounded">Edit</button>
              <button onClick={() => deleteEvent(event._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
