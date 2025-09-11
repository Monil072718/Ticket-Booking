import { NextRequest } from "next/server";
import jwt from "jsonwebtoken";
import User from "../models/User";
import connectDB from "./db";

export async function requireUser(req: NextRequest) {
  const token = req.cookies.get("token")?.value;
  if (!token) throw new Error("Unauthorized");

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET!);
    await connectDB();
    const user = await User.findById(decoded.userId).select("-password"); // use decoded.userId
    if (!user) throw new Error("Unauthorized");
    return user;
  } catch (err) {
    throw new Error("Unauthorized");
  }
}

export async function requireAdmin(req: NextRequest) {
  const user = await requireUser(req);
  if (user.role !== "admin") {
    throw new Error("Forbidden: Admins only");
  }
  return user;
}
