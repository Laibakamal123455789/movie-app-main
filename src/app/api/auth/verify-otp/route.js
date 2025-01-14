import { User } from "@/models/userModel";
import { NextResponse } from "next/server";

export async function POST(req) {
  const data = await req.json();
  try {
  
    const user = await User.findOne({ email: data.email });
    if (!user) {
      return NextResponse.json({ success: false, message: "User not found" });
    }

    if (!user.otp) {
      return NextResponse.json({ success: false, message: "OTP not generated" });
    }

    if (user.otp !== data.otp) {
      return NextResponse.json({ success: false, message: "Incorrect OTP" });
    }

    if (Date.now() > user.otpExpiry) {
      return NextResponse.json({ success: false, message: "OTP has expired" });
    }

    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save({ validateModifiedOnly: true });

    return NextResponse.json({ success: true, message: "OTP verified successfully" });
  } catch (error) {
    console.error("Verify OTP Error:", error);
    return NextResponse.json({ success: false, message: "Error verifying OTP" });
  }
}
