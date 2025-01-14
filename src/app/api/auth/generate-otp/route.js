import { User } from "@/models/userModel";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import crypto from "crypto";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function POST(req) {
  const data = await req.json();
  try {
    const user = await User.findOne({ email: data.email });

    if (!user) {
      return NextResponse.json({ success: true, message: "If this email exists, OTP has been sent." });
    }
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpiry = Date.now() + 15 * 60 * 1000;

    user.otp = otp;
    user.otpExpiry = otpExpiry;

    await user.save({ validateModifiedOnly: true});

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Password Reset OTP",
      text: `Your OTP for password reset is: ${otp}`,
    });

    return NextResponse.json({ success: true, message: "OTP sent to email" });
  } catch (error) {
    console.error("Generate OTP Error:", error);
    return NextResponse.json({ success: false, message: "Error generating OTP" });
  }
}
