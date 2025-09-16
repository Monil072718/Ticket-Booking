import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Event from "@/models/Event";
import { requireAdmin } from "@/lib/requireAuth";

// ✅ Get all events
export async function GET() {
  try {
    await connectDB();
    const events = await Event.find().sort({ date: 1 }).lean();
    return NextResponse.json({ success: true, events }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ Create new event (Admin only)
export async function POST(req: Request) {
  try {
    await requireAdmin(req as any);
    await connectDB();
    const body = await req.json();
    const event = await Event.create(body);
    return NextResponse.json({ success: true, event }, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ Update event (Admin only)
export async function PUT(req: NextRequest) {
  try {
    await requireAdmin(req); // 🔒 Ensure only admin can update
    await connectDB();

    const { id, ...updateData } = await req.json();

    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID is required" }, { status: 400 });
    }

    const updatedEvent = await Event.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedEvent) {
      return NextResponse.json({ success: false, error: "Event not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, event: updatedEvent }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ✅ Delete event (Admin only)
export async function DELETE(req: Request) {
  try {
    await requireAdmin(req as any);
    await connectDB();

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ success: false, error: "Event ID required" }, { status: 400 });
    }

    await Event.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Event deleted" }, { status: 200 });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}