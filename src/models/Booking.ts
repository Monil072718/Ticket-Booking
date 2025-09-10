import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  userId: string;
  eventId: string;
  seats: number;
  createdAt: Date;
  city: string;
  state: string;
}

const BookingSchema = new Schema<IBooking>(
  {
    userId: { type: String, required: true },
    eventId: { type: String, required: true },
    seats: { type: Number, required: true, min: 1 },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

export default models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
