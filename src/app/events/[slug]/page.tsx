import connectDB from "../../../lib/db";
import Event from "../../../models/Event";

type Props = { params: { slug: string } };

export default async function EventPage({ params }: Props) {
  await connectDB();
  const ev = await Event.findOne({ slug: params.slug }).lean();
  if (!ev) return <div className="p-6">Event not found</div>;

  return (
    <main className="max-w-3xl mx-auto p-6">
      <h1 className="text-3xl font-bold">{ev.title}</h1>
      <p className="mt-2 text-gray-700">{ev.description}</p>
      <p className="mt-2">📅 {new Date(ev.date).toLocaleString()}</p>
      <p>📍 {ev.venue}</p>
      <p>🎟️ Available: {ev.availableSeats}</p>
      <p>💰 Price: ₹{ev.price}</p>
      {/* Later: Add booking button here */}
    </main>
  );
}
