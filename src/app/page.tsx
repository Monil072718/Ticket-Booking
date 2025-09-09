// app/page.tsx
import EventCard from "@/components/EventCard";

async function fetchEvents() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/events`, { next: { revalidate: 10 } });
  if (!res.ok) return [];
  return res.json();
}

export default async function Home() {
  const events = await fetchEvents();
  return (
    <main className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl mb-6">Upcoming Events</h1>
      <div className="grid gap-4">
        {events.map((ev: any) => (
          <EventCard key={ev._id} event={ev} />
        ))}
      </div>
    </main>
  );
}
