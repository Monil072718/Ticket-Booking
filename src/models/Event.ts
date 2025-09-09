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
}

const EventSchema = new Schema<IEvent>(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: String,
    date: { type: Date, required: true },
    venue: { type: String, required: true },
    price: { type: Number, required: true },
    availableSeats: { type: Number, required: true },
    image: String,
  },
  { timestamps: true }
);

export default models.Event || mongoose.model<IEvent>("Event", EventSchema);
  