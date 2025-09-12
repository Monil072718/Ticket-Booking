// src/app/api/auth/me/route.ts
import { NextResponse } from "next/server";
import { requireUser } from "../../../../lib/requireAuth";
import connectDB from "../../../../lib/db";
import User from "../../../../models/User";

export type UserType = {
  _id: string;
  name: string;
  email: string;
  role: string;
};

export async function GET(req: Request) {
  try {
    // ✅ Get user from cookie token
    const user = await requireUser(req as any);

    await connectDB();

    // ✅ Always fetch latest role/info from DB
    const freshUser = (await User.findById(user._id)
      .select("-password")
      .lean()) as UserType | null; // ⬅️ type cast

    if (!freshUser) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user: {
        id: freshUser._id.toString(),
        name: freshUser.name,
        email: freshUser.email,
        role: freshUser.role, // ✅ role included
      },
    });
  } catch (err: any) {
    return NextResponse.json(
      { success: false, error: "Unauthorized" },
      { status: 401 }
    );
  }
}
