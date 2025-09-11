"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CreateEventPage() {
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    date: "",
    venue: "",
    price: "",
    availableSeats: "",
    image: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("/api/auth/me");
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        if (data.user.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/");
        }
      } catch {
        router.push("/auth/login");
      } finally {
        setLoading(false);
      }
    };
    checkRole();
  }, [router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          availableSeats: Number(form.availableSeats),
          date: new Date(form.date).toISOString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to create event");
        return;
      }

      router.push("/events");
    } catch {
      setError("Something went wrong");
    }
  };

  if (loading) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) return null;

  return (
    <main className="max-w-lg mx-auto p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4 text-center">📝 Create Event</h1>
      {error && <p className="text-red-500">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="slug" placeholder="Slug (unique)" onChange={handleChange} className="w-full border p-2 rounded" required />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2 rounded" />
        <input type="datetime-local" name="date" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="venue" placeholder="Venue" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} className="w-full border p-2 rounded" required />
        <input name="image" placeholder="Image URL" onChange={handleChange} className="w-full border p-2 rounded" />

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition">
          Create Event
        </button>
      </form>
    </main>
  );
}
