import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { requireAdmin } from "@/lib/requireAuth";

// GET event by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  await connectDB();
  const event = await Event.findById(params.id).lean();
  if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
  return NextResponse.json(event);
}

// UPDATE event by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req as any);
    await connectDB();
    const body = await req.json();
    const updated = await Event.findByIdAndUpdate(params.id, body, { new: true });
    return NextResponse.json(updated);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// DELETE event by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    await requireAdmin(req as any);
    await connectDB();
    await Event.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
