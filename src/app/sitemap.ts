// app/sitemap.ts
import { MetadataRoute } from "next";
import connectDB from "./lib/db";
import Event from "./models/Event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  await connectDB();

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const events = await Event.find({}, "slug updatedAt createdAt").lean();

  const pages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/events`, lastModified: new Date() },
    // individual events
    ...events.map((e) => ({
      url: `${baseUrl}/events/${e.slug}`,
      lastModified: e.updatedAt ?? e.createdAt,
    })),
  ];

  return pages;
}
