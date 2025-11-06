// lib/auth.js
import jwt from "jsonwebtoken";
import connectToDatabase from "./mongodb";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error("JWT_SECRET not defined");

export async function getUserFromRequest(req) {
  // In App Router server handlers, cookies can be read from req.headers.get('cookie')
  const cookieHeader = req.headers.get("cookie") || "";
  const token = cookieHeader.split(";").map(c => c.trim()).find(c => c.startsWith("token="))?.split("=")[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    await connectToDatabase();
    const user = await User.findById(decoded.sub).select("-password");
    return user;
  } catch (err) {
    return null;
  }
}
