import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Event from "../../../models/Event";
import Booking from "../../../models/Booking";

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { userId, eventId, seats } = await req.json();

    if (!userId || !eventId || !seats) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Atomic update: decrement seats only if enough available
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json({ error: "Not enough seats available" }, { status: 400 });
    }

    // Create booking
    const booking = await Booking.create({ userId, eventId, seats });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ error: "userId is required" }, { status: 400 });
    }

    const bookings = await Booking.find({ userId }).populate("eventId");
    return NextResponse.json({ bookings });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
