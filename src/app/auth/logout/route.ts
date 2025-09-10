import { NextResponse } from "next/server";
import { serialize } from "cookie";

export async function POST() {
  // Clear cookie by setting it to empty with maxAge = 0
  const cookie = serialize("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0, // expires immediately
  });

  return NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200, headers: { "Set-Cookie": cookie } }
  );
}
