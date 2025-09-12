"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Event = {
  _id: string;
  title: string;
  date: string;
  venue: string;
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const res = await fetch("/api/auth/me", { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
      } else {
        router.push("/auth/login"); // redirect if not logged in
      }
    };

    const fetchEvents = async () => {
      const res = await fetch("/api/events");
      if (res.ok) {
        const data = await res.json();
        setEvents(data);
      }
    };

    fetchUser();
    fetchEvents();
    setLoading(false);
  }, [router]);

  if (loading) return <p className="p-6">Loading...</p>;

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold">Welcome, {user?.name || "Guest"} 🎉</h1>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => router.push("/events")}
          className="bg-blue-600 text-white p-4 rounded shadow"
        >
          View Events
        </button>
        <button
          onClick={() => router.push("/booking")}
          className="bg-green-600 text-white p-4 rounded shadow"
        >
          My Bookings
        </button>
      </div>

      <h2 className="text-xl font-semibold mt-8 mb-4">Upcoming Events</h2>
      <ul className="space-y-3">
        {events.map((ev) => (
          <li
            key={ev._id}
            className="p-4 border rounded shadow-sm flex justify-between"
          >
            <div>
              <h3 className="font-bold">{ev.title}</h3>
              <p>{new Date(ev.date).toLocaleString()}</p>
              <p className="text-gray-600">{ev.venue}</p>
            </div>
            <button
              onClick={() => router.push(`/events/${ev._id}`)}
              className="bg-indigo-600 text-white px-3 py-1 rounded"
            >
              Register
            </button>
          </li>
        ))}
      </ul>
    </main>
  );
}
