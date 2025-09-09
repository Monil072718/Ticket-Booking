// src/models/Event.ts
import mongoose, { Document } from "mongoose";

export interface IEvent extends Document {
  title: string;
  slug: string;
  description?: string;
  date: Date;
  time?: string;
  venue: string;
  price: number;
  availableSeats: number;
  image?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EventSchema = new mongoose.Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    description: String,
    date: { type: Date, required: true },
    time: String,
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: String,
  },
  { timestamps: true }
);

export default mongoose.models.Event || mongoose.model<IEvent>("Event", EventSchema);
