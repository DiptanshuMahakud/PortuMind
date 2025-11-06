// Input -> 
// POST http://localhost:3000/api/auth/register
// Headers: Content-Type: application/json
// Body:
// {
//   "name":"Test Investor",
//   "email":"test@investor.com",
//   "password":"pass123",
//   "role":"investor"
// }

// Response -> 
// {
//     "message": "User created",
//     "user": {
//         "id": "690cb06cda7cf71a107c5b72",
//         "name": "Diptanshu",
//         "email": "diptanshumahakud@gmail.com",
//         "role": "investor"
//     }
// }


import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";
import User from "@/models/User";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { serialize } from "cookie";

const SALT_ROUNDS = 10;
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";
const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error("Please define JWT_SECRET in .env.local");
}

export async function POST(req) {
  try {
    const body = await req.json();
    const { name, email, password, role } = body;

    // Basic validation
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Optional: enforce password strength
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    await connectToDatabase();

    // Check if user exists
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return NextResponse.json({ error: "User with that email already exists" }, { status: 409 });
    }

    // Hash password
    const hashed = await bcrypt.hash(password, SALT_ROUNDS);

    // Create user
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashed,
      role: role === "analyst" ? "analyst" : "investor",
    });

    // Create JWT payload (keep it minimal)
    const tokenPayload = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };

    const token = jwt.sign(tokenPayload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // Set HttpOnly cookie
    const cookie = serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
    });

    const res = NextResponse.json({
      message: "User created",
      user: { id: user._id.toString(), name: user.name, email: user.email, role: user.role },
    }, { status: 201 });

    res.headers.set("Set-Cookie", cookie);

    return res;
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}


