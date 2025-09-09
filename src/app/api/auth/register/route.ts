import connectDB from "../../../../lib/db";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import { signToken } from "../../../../lib/auth";
import { serialize } from "cookie";
import { z } from "zod";

const RegisterSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = RegisterSchema.safeParse(body);

    if (!parsed.success) {
      return new Response(JSON.stringify({ error: "Invalid input" }), { status: 400 });
    }

    await connectDB();

    const exists = await User.findOne({ email: parsed.data.email });
    if (exists) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 409 });
    }

    const hashed = await bcrypt.hash(parsed.data.password, 10);

    const user = await User.create({
      name: parsed.data.name,
      email: parsed.data.email,
      password: hashed,
    });

    const token = signToken({ userId: user._id.toString(), role: user.role });
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return new Response(
      JSON.stringify({
        user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
      }),
      { status: 201, headers: { "Content-Type": "application/json", "Set-Cookie": cookie } }
    );
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message || "Server error" }), { status: 500 });
  }
}
