import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";


export async function POST(req) {
  try {
    await connectToDatabase();
    const { name, email, password, role } = await req.json();

    const existing = await User.findOne({ email });
    if (existing)
      return NextResponse.json({ error: "Email already registered" }, { status: 400 });

    const hashed = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashed,
      role, // investor or analyst
    });

    return NextResponse.json({
      message: "Signup successful",
      user: { name: newUser.name, email: newUser.email, role: newUser.role },
    });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
