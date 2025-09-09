// lib/requireAuth.ts
import { getTokenFromRequest, verifyToken } from "./auth";
import connectDB from "./db";
import User from "../models/User";

export async function requireUser(req: Request) {
  const token = getTokenFromRequest(req);
  if (!token) throw new Error("Unauthorized");
  const decoded: any = verifyToken(token);
  await connectDB();
  const user = await User.findById(decoded.userId).select("-password");
  if (!user) throw new Error("Unauthorized");
  return user;
}

export async function requireAdmin(req: Request) {
  const user = await requireUser(req);
  if (user.role !== "admin") throw new Error("Forbidden");
  return user;
}
