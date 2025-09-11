import connectDB from "@/lib/db";
import User from "@/models/User";
import crypto from "crypto";
import { NextResponse } from "next/server";
import { sendMail } from "@/lib/mail";

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
    user.resetPasswordExpire = Date.now() + 1000 * 60 * 15; // 15 min
    await user.save();

    const resetURL = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    // Free email template
    const emailHTML = `
      <div style="font-family: Arial, sans-serif; padding: 20px; background: #f9f9f9;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hi ${user.name || "User"},</p>
        <p>You requested a password reset. Click the button below to reset your password:</p>
        <a href="${resetURL}" 
          style="display: inline-block; padding: 10px 20px; margin-top: 10px; background: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p style="margin-top: 20px;">If you didn’t request this, please ignore this email.</p>
        <p style="font-size: 12px; color: #777;">This link is valid for 15 minutes.</p>
      </div>
    `;

    await sendMail(user.email, "Reset your password", emailHTML);

    return NextResponse.json({ message: "Reset email sent successfully" });
  } catch (err: any) {
    console.error("FORGOT-PASSWORD ERR:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
