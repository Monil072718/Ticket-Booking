import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "./src/lib/auth";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // If no token, redirect to login
  if (!token) {
    if (req.nextUrl.pathname.startsWith("/dashboard") || req.nextUrl.pathname.startsWith("/events/create")) {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = verifyToken(token);

    // ✅ Restrict /events/create only for admin
    if (req.nextUrl.pathname.startsWith("/events/create") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  } catch (err) {
    // Invalid token → logout user
    return NextResponse.redirect(new URL("/auth/login", req.url));
  }
}

// ✅ Apply only to protected routes
export const config = {
  matcher: ["/dashboard/:path*", "/events/create"],
};
