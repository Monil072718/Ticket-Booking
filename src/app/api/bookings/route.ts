// app/api/bookings/route.ts
import connectDB from "../../../lib/db";
import Event from "../../../models/Event";
import Booking from "../../../models/Booking";
import { z } from "zod";
import { requireUser } from "../../../lib/requireAuth";

const BookSchema = z.object({
  eventId: z.string(),
  seats: z.number().min(1),
});

export async function POST(req: Request) {
  try {
    const user = await requireUser(req);
    const body = await req.json();
    const parsed = BookSchema.parse(body);

    await connectDB();

    // attempt atomic decrement of availableSeats
    const ev = await Event.findOneAndUpdate(
      { _id: parsed.eventId, availableSeats: { $gte: parsed.seats } },
      { $inc: { availableSeats: -parsed.seats } },
      { new: true }
    );

    if (!ev) {
      return new Response(JSON.stringify({ error: "Not enough seats" }), { status: 400 });
    }

    const total = parsed.seats * ev.price;
    const booking = await Booking.create({
      user: user._id,
      event: ev._id,
      seatsBooked: parsed.seats,
      totalAmount: total,
      paymentStatus: "pending", // integrate payment gateway to update to 'paid'
    });

    return new Response(JSON.stringify(booking), { status: 201 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Unauthorized" }), { status: 401 });
  }
}
