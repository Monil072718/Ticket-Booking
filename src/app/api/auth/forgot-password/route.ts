import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    await connectDB();
    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: "No account with that email" }, { status: 404 });
    }

    // generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenHash = crypto.createHash("sha256").update(resetToken).digest("hex");

    user.resetPasswordToken = resetTokenHash;
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 minutes
    await user.save();

    // in real app, send via email (Nodemailer / SendGrid)
    const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    return NextResponse.json({
      message: "Password reset link generated",
      resetURL, // 👈 right now return in response for testing
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
