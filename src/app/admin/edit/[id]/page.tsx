"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditEventPage() {
  const { id } = useParams(); // get event id from URL
  const router = useRouter();

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

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ Fetch event details by ID
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch event");

        setForm({
          title: data.title,
          slug: data.slug,
          description: data.description || "",
          date: new Date(data.date).toISOString().slice(0, 16), // prefill datetime-local
          venue: data.venue,
          price: data.price.toString(),
          availableSeats: data.availableSeats.toString(),
          image: data.image || ""
        });
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchEvent();
  }, [id]);

  // ✅ Handle form update
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Submit updated event
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/events/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          availableSeats: Number(form.availableSeats),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to update event");
        return;
      }

      router.push("/admin"); // back to dashboard
    } catch (err) {
      setError("Something went wrong");
    }
  };

  if (loading) return <p className="p-6">Loading event details...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;

  return (
    <main className="max-w-md mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">✏️ Edit Event</h1>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <label className="block">
          <span className="font-medium">Title</span>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Slug</span>
          <input name="slug" value={form.slug} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Description</span>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Date</span>
          <input type="datetime-local" name="date" value={form.date} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Venue</span>
          <input name="venue" value={form.venue} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Price</span>
          <input type="number" name="price" value={form.price} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Available Seats</span>
          <input type="number" name="availableSeats" value={form.availableSeats} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <label className="block">
          <span className="font-medium">Image URL</span>
          <input name="image" value={form.image} onChange={handleChange} className="w-full border p-2 rounded" />
        </label>

        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
          Save Changes
        </button>
      </form>
    </main>
  );
}
