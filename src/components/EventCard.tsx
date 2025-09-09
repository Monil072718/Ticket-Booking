"use client";
import Link from "next/link";

export default function EventCard({ event }: { event: any }) {
  return (
    <div className="border p-4 rounded">
      <h2 className="text-xl">{event.title}</h2>
      <p>{new Date(event.date).toLocaleString()}</p>
      <p>{event.venue}</p>
      <p>Price: ₹{event.price}</p>
      <Link href={`/events/${event.slug}`} className="underline">View</Link>
    </div>
  );
}
