"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type EventType = {
  _id: string;
  title: string;
  date: string;
  venue: string;
  price: number;
  availableSeats: number;
};

export default function AdminDashboard() {
  const [events, setEvents] = useState<EventType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("/api/events", { credentials: "include" });
        const data = await res.json();
        if (!res.ok || !data.success) throw new Error(data.error || "Failed to fetch events");
        setEvents(data.events);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    try {
      const res = await fetch(`/api/events?id=${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || "Delete failed");
      setEvents(events.filter((ev) => ev._id !== id));
      alert("Event deleted successfully");
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/admin/edit/${id}`);
  };

  if (loading) return <p className="p-6">Loading events...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">📊 Admin Dashboard</h1>

      {events.length === 0 ? (
        <p>No events found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-blue-700 text-white">
                <th className="border border-gray-300 px-4 py-2">Title</th>
                <th className="border border-gray-300 px-4 py-2">Date</th>
                <th className="border border-gray-300 px-4 py-2">Venue</th>
                <th className="border border-gray-300 px-4 py-2">Price</th>
                <th className="border border-gray-300 px-4 py-2">Available Seats</th>
                <th className="border border-gray-300 px-4 py-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => (
                <tr key={ev._id} className="text-center">
                  <td className="border px-4 py-2">{ev.title}</td>
                  <td className="border px-4 py-2">{new Date(ev.date).toLocaleDateString()}</td>
                  <td className="border px-4 py-2">{ev.venue}</td>
                  <td className="border px-4 py-2">₹{ev.price}</td>
                  <td className="border px-4 py-2">{ev.availableSeats}</td>
                  <td className="border px-4 py-2 space-x-2">
                    <button onClick={() => handleEdit(ev._id)} className="bg-yellow-400 text-black px-3 py-1 rounded">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(ev._id)} className="bg-red-500 text-white px-3 py-1 rounded">
                      Delete
                    </button>
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
