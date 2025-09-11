import connectDB from "../../lib/db";
import Event from "../../models/Event";
import EventCard from "@/components/EventCard";

export default async function EventsPage() {
  await connectDB();
  const events = await Event.find().sort({ date: 1 }).lean();

  return (
    <main className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">🎉 Upcoming Events</h1>

      {events.length === 0 ? (
        <p className="text-center text-gray-500">No events available right now.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((ev: any) => (
            <EventCard key={ev._id} event={ev} />
          ))}
        </div>
      )}
    </main>
  );
}
