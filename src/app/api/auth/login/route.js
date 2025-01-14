import jwt from "jsonwebtoken";
import { User } from "@/models/userModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const JWT_SECRET = "your_secret_key";

export async function POST(req) {
  const data = await req.json();
  try {
    const user = await User.findOne({ email: data.email });

      if (!user) {

        return NextResponse.json({ success: false, message: "Invalid email or password" });
      }

      const isPasswordValid = await bcrypt.compare(data.password, user.password);

      if (!isPasswordValid) {
        return NextResponse.json({ success: false, message: "Invalid email or password" });
      }

        const token = jwt.sign({
          id:user._id
        },
        JWT_SECRET
      )
     
    return NextResponse.json({ success: true, token, user });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ success: false, message: "Error during login" });
  }
}
