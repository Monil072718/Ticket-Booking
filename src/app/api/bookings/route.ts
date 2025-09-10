import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Event from "../../../models/Event";
import Booking from "../../../models/Booking";
import { requireUser } from "../../../lib/requireAuth";

// 🎟️ POST /api/bookings → Create booking
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req); // ✅ auth required
    const { eventId, seats } = await req.json();

    if (!eventId || !seats || seats <= 0) {
      return NextResponse.json({ error: "Invalid booking data" }, { status: 400 });
    }

    await connectDB();

    // ✅ Atomic update: decrement seats only if enough available
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Not enough seats available" }, { status: 400 });
    }

    // ✅ Create booking tied to logged-in user
    const booking = await Booking.create({
      user: user._id,
      event: eventId,
      seats,
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("BOOKING ERR", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

// 🎟️ GET /api/bookings → Get current user's bookings
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req); // ✅ only current user's bookings

    await connectDB();
    const bookings = await Booking.find({ user: user._id })
      .populate("event", "title date venue")
      .sort({ createdAt: -1 });

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
