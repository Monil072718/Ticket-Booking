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
    image: ""
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const router = useRouter();

  // 🔐 Check if user is admin
  useEffect(() => {
    const checkRole = async () => {
      try {
        const res = await fetch("/api/auth/me"); // we'll create this endpoint later
        if (!res.ok) {
          router.push("/auth/login");
          return;
        }
        const data = await res.json();
        if (data.user.role === "admin") {
          setIsAdmin(true);
        } else {
          router.push("/"); // non-admins go home
        }
      } catch (err) {
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
    } catch (err) {
      setError("Something went wrong");
    }
  };

  if (loading) return <p className="p-6">Checking permissions...</p>;
  if (!isAdmin) return null;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Create Event</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <input name="title" placeholder="Title" onChange={handleChange} className="w-full border p-2" />
        <input name="slug" placeholder="Slug (unique)" onChange={handleChange} className="w-full border p-2" />
        <textarea name="description" placeholder="Description" onChange={handleChange} className="w-full border p-2" />
        <input type="datetime-local" name="date" onChange={handleChange} className="w-full border p-2" />
        <input name="venue" placeholder="Venue" onChange={handleChange} className="w-full border p-2" />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} className="w-full border p-2" />
        <input type="number" name="availableSeats" placeholder="Available Seats" onChange={handleChange} className="w-full border p-2" />
        <input name="image" placeholder="Image URL" onChange={handleChange} className="w-full border p-2" />
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">Create Event</button>
      </form>
    </main>
  );
}
