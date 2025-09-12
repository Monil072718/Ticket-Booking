import mongoose, { Schema, Document, models } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description?: string;
  date: Date;
  venue: string;
  price: number;
  availableSeats: number;
  image?: string;
  createdBy?: mongoose.Schema.Types.ObjectId; // admin reference
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // SEO-friendly slug
    description: { type: String },
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Who created the event
  },
  { timestamps: true }
);

const Event = models.Event || mongoose.model<IEvent>("Event", EventSchema);
export default Event;
