// app/api/auth/logout/route.ts
import { serialize } from "cookie";

export async function POST() {
  const cookie = serialize("token", "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: 0 });
  return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "Set-Cookie": cookie } });
}
