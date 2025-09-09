// src/app/api/auth/login/route.ts
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { serialize } from "cookie";
import { z } from "zod";

const LoginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = LoginSchema.safeParse(body);
    if (!parsed.success) return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });

    await connectDB();
    const user = await User.findOne({ email: parsed.data.email });
    if (!user) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    const ok = await bcrypt.compare(parsed.data.password, user.password);
    if (!ok) return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401 });

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    const safeUser = { id: user._id.toString(), name: user.name, email: user.email, role: user.role };
    return new Response(JSON.stringify({ user: safeUser }), {
      status: 200,
      headers: { "Content-Type": "application/json", "Set-Cookie": cookie },
    });
  } catch (err: any) {
    console.error("LOGIN ERR", err);
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
