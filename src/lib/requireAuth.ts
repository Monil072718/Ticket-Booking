// src/lib/requireAuth.ts
import connectDB from "../lib/db";
import User from "../models/User";
import { getTokenFromRequest, verifyToken } from "./auth";

export async function requireUser(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) {
    throw new Error("Unauthorized");
  }
  let decoded: any;
  try {
    decoded = verifyToken(token);
  } catch (err) {
    throw new Error("Invalid token");
  }
  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(req: Request) {
  const user = await requireUser(req);
  if ((user as any).role !== "admin") throw new Error("Forbidden");
  return user;
}
