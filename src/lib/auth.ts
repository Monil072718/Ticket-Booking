import jwt from "jsonwebtoken";
import { parse } from "cookie";

const JWT_SECRET = process.env.JWT_SECRET as string;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

export function signToken(payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

// 🔥 Add this function back
export function getTokenFromRequest(req: Request) {
  const cookieHeader = req.headers.get("cookie") || "";
  const cookies = parse(cookieHeader);
  return cookies.token || null;
}
