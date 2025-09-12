// src/lib/requireAuth.ts
import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "../models/User";
import connectDB from "./db";

/**
 * ✅ Require a logged-in user
 */
export async function requireUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);

    await connectDB();

    // Handle both `id` and `userId` just in case
    const userId = decoded.id || decoded.userId;
    const user = await User.findById(userId).select("-password");

    if (!user) throw new Error("Unauthorized");
    return user; // returns {id, email, role, ...}
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

/**
 * ✅ Require an admin user
 */
export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);

  if (user.role !== "admin") {
    throw new Error("Forbidden: Admins only");
  }

  return user;
}
