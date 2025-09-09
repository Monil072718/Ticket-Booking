import { getTokenFromRequest, verifyToken } from "../../../../lib/auth";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export async function GET(req: Request) {
  try {
    const token = getTokenFromRequest(req);
    if (!token) {
      return new Response(JSON.stringify({ error: "Not authenticated" }), { status: 401 });
    }

    const decoded = verifyToken(token) as any;
    await connectDB();

    // ✅ Always fetch latest role from DB
    const user = await User.findById(decoded.userId).select("-password").lean();
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    return new Response(JSON.stringify({ user }), { status: 200 });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: "Invalid token" }), { status: 401 });
  }
}
