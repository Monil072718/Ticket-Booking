"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { id } = params;

  const [form, setForm] = useState({
    title: "",
    description: "",
    date: "",
    venue: "",
    price: "",
    availableSeats: "",
    image: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);


//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const res = await fetch(`/api/events`);
//         const data = await res.json();
//         const event = data.events.find((ev: any) => ev._id === id);
//         if (event) {
//           setForm({
//             title: event.title,
//             description: event.description || "",
//             date: new Date(event.date).toISOString().slice(0, 16),
//             venue: event.venue,
//             price: String(event.price),
//             availableSeats: String(event.availableSeats),
//             image: event.image || "",
//           });
//         }
//       } catch {
//         alert("Failed to load event");
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchEvent();
//   }, [id]);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/me", { credentials: "include" });
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        if (data.user.role !== "admin") {
          router.push("/"); // redirect non-admins
        } else {
          setIsAdmin(true);
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkAuth();
  }, [router]);

  if (loading) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) return null;

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id,
          ...form,
          price: Number(form.price),
          availableSeats: Number(form.availableSeats),
        }),
      });
      if (!res.ok) throw new Error("Failed to update event");
      alert("Event updated successfully");
      router.push("/admin");
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (loading) return <p className="p-6">Loading event...</p>;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Event</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2" />
        <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2" />
        <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full border p-2" />
        <input name="venue" value={form.venue} onChange={handleChange} className="w-full border p-2" />
        <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border p-2" />
        <input type="number" name="availableSeats" value={form.availableSeats} onChange={handleChange} className="w-full border p-2" />
        <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Update Event
        </button>
      </form>
    </main>
  );
}
