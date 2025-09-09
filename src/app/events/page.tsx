import connectDB from "../../lib/db";
import Event from "../../models/Event";
import Link from "next/link";

export default async function EventsPage() {
  await connectDB();
  const events = await Event.find().sort({ date: 1 }).lean();

  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Upcoming Events</h1>
      <div className="space-y-6">
        {events.map((ev: any) => (
          <div key={ev._id} className="border p-4 rounded shadow">
            <h2 className="text-xl font-semibold">
              <Link href={`/events/${ev.slug}`}>{ev.title}</Link>
            </h2>
            <p className="text-gray-600">{new Date(ev.date).toLocaleDateString()}</p>
            <p className="mt-2">{ev.description?.slice(0, 100)}...</p>
            <Link href={`/events/${ev.slug}`} className="text-blue-600 mt-2 inline-block">
              View Details
            </Link>
          </div>
        ))}
      </div>
    </main>
  );
}
