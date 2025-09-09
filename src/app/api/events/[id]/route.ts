// app/api/events/[id]/route.ts
import connectDB from "../../../../lib/db";
import Event from "../../../../models/Event";
import { requireAdmin } from "../../../../lib/requireAuth";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const ev = await Event.findById(params.id);
  if (!ev) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
  return new Response(JSON.stringify(ev));
}

// PUT and DELETE for admin
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    const body = await req.json();
    await connectDB();
    const ev = await Event.findByIdAndUpdate(params.id, body, { new: true });
    if (!ev) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify(ev));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Forbidden" }), { status: 403 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req);
    await connectDB();
    const ev = await Event.findByIdAndDelete(params.id);
    if (!ev) return new Response(JSON.stringify({ error: "Not found" }), { status: 404 });
    return new Response(JSON.stringify({ ok: true }));
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Forbidden" }), { status: 403 });
  }
}
