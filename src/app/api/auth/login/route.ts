import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { serialize } from "cookie";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required" }), { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });
    }

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return new Response(
      JSON.stringify({
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      }),
      { status: 200, headers: { "Content-Type": "application/json", "Set-Cookie": cookie } }
    );
  } catch (err: any) {
    console.error("LOGIN ERR", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
