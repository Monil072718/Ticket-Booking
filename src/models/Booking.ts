import mongoose, { Schema, Document, models } from "mongoose";

export interface IBooking extends Document {
  user: mongoose.Schema.Types.ObjectId;   // ref to User
  event: mongoose.Schema.Types.ObjectId;  // ref to Event
  seats: number;
  totalPrice: number;
  city: string;
  state: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    event: { type: Schema.Types.ObjectId, ref: "Event", required: true },
    seats: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
  },
  { timestamps: true }
);

const Booking = models.Booking || mongoose.model<IBooking>("Booking", BookingSchema);
export default Booking;
