// app/events/[slug]/page.tsx
import connectDB from "../../../lib/db";
import Event from "../../../models/Event";

type Props = { params: { slug: string } };

export default async function EventPage({ params }: Props) {
  await connectDB();

  const ev = await Event.findOne({ slug: params.slug }).lean();

  if (!ev) return <div>Not found</div>;

  // Convert MongoDB document into serializable object
  const event = {
    ...ev,
    _id: ev._id.toString(),
    date: ev.date ? new Date(ev.date).toISOString() : null,
  };

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-2">{event.description}</p>
      <p className="mt-2">Date: {event.date ? new Date(event.date).toLocaleString() : "TBA"}</p>
      <p className="mt-2">Venue: {event.venue}</p>
      <p className="mt-2">Available Seats: {event.availableSeats}</p>
      {/* Later: add booking button */}
    </main>
  );
}
