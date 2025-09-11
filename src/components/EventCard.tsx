"use client";
import Link from "next/link";
type Props = {
  event: any;
};

export default function EventCard({ event }: Props) {
  return (
    <div className="border rounded-lg shadow p-4 bg-white">
      <img src={event.image || "/default-event.jpg"} alt={event.title} className="rounded w-full h-40 object-cover" />
      <h2 className="text-lg font-bold mt-3">{event.title}</h2>
      <p className="text-gray-600">{new Date(event.date).toLocaleDateString()}</p>
      <p className="mt-2 line-clamp-2">{event.description}</p>
      <Link href={`/events/${event.slug}`} className="text-blue-600 mt-3 inline-block">View Details →</Link>
    </div>
  );
}