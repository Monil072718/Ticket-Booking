import { NextRequest, NextResponse } from "next/server";
import connectDB from "../../../lib/db";
import Event from "../../../models/Event";
import Booking from "../../../models/Booking";
import { requireUser } from "../../../lib/requireAuth";

// 🎟️ POST /api/bookings → Create booking
export async function POST(req: NextRequest) {
  try {
    const user = await requireUser(req);

    // ❌ Prevent admins from booking events
    if (user.role === "admin") {
      return NextResponse.json(
        { error: "Admins cannot book events" },
        { status: 403 }
      );
    }

    const { eventId, seats, city, state } = await req.json();

    if (!eventId || !seats || seats <= 0 || !city || !state) {
      return NextResponse.json(
        { error: "Missing booking fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // ✅ Ensure seats are available and decrease them atomically
    const updatedEvent = await Event.findOneAndUpdate(
      { _id: eventId, availableSeats: { $gte: seats } },
      { $inc: { availableSeats: -seats } },
      { new: true }
    );

    if (!updatedEvent) {
      return NextResponse.json(
        { error: "Not enough seats available" },
        { status: 400 }
      );
    }

    // ✅ Calculate total price
    const totalPrice = seats * updatedEvent.price;

    // ✅ Create booking
    const booking = await Booking.create({
      user: user._id,
      event: eventId,
      seats,
      city,
      state,
      totalPrice, // required field
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("BOOKING ERR", error);
    return NextResponse.json(
      { error: error.message || "Server error" },
      { status: 500 }
    );
  }
}


// 🎟️ GET /api/bookings → Get current user's bookings
export async function GET(req: NextRequest) {
  try {
    const user = await requireUser(req).catch(() => null);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const bookings = await Booking.find({ user: user._id })
      .populate("eventId", "title date venue price") // ✅ match schema
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json({ bookings }, { status: 200 });
  } catch (error: any) {
    console.error("BOOKINGS GET ERR", error);
    return NextResponse.json({ error: error.message || "Server error" }, { status: 500 });
  }
}

