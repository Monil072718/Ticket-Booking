// app/api/events/route.ts
import connectDB from "../../lib/db";
import Event from "../../models/Event";
import { z } from "zod";
import { requireAdmin } from "../../lib/requireAuth";

const CreateEventSchema = z.object({
  title: z.string(),
  slug: z.string(),
  description: z.string().optional(),
  date: z.string(), // ISO
  time: z.string().optional(),
  venue: z.string(),
  price: z.number(),
  availableSeats: z.number(),
  image: z.string().optional(),
});

export async function GET() {
  await connectDB();
  const events = await Event.find().sort({ date: 1 });
  return new Response(JSON.stringify(events), { status: 200, headers: { "Content-Type": "application/json" } });
}

export async function POST(req: Request) {
  try {
    await requireAdmin(req); // throws if not admin
    const body = await req.json();
    const parsed = CreateEventSchema.parse(body);
    await connectDB();
    const exists = await Event.findOne({ slug: parsed.slug });
    if (exists) return new Response(JSON.stringify({ error: "Slug already used" }), { status: 409 });
    const ev = await Event.create({ ...parsed, date: new Date(parsed.date) });
    return new Response(JSON.stringify(ev), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Unauthorized" }), { status: 403 });
  }
}
