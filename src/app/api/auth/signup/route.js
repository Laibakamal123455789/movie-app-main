import jwt from "jsonwebtoken";
import { User } from "@/models/userModel";
import bcrypt from "bcrypt";
import { NextResponse } from "next/server";

const JWT_SECRET = "your_secret_key";
export async function POST(req) {
  try {
    const data = await req.json();

    const { firstName, lastName, phone, city, email, password } = data;
    if (!firstName || !lastName || !phone || !city || !email || !password) {
      return NextResponse.json({
        success: false,
        message: "All fields are required",
      });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: "Email is already registered",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      firstName,
      lastName,
      phone,
      city,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    const token = jwt.sign(
      {
        id: newUser._id,
      },
      JWT_SECRET
    );

    return NextResponse.json({ success: true, token, user: newUser });
  } catch (error) {
    console.error("Signup Error:", error);
    return NextResponse.json({
      success: false,
      message: "Error during signup",
    });
  }
}
