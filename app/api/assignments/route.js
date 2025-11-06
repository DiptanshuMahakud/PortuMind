// app/api/assignments/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/lib/mongodb";
import Assignment from "@/models/Assignment";

export async function GET(req) {
  await connectToDatabase();
  const token = req.cookies.get("token")?.value;
  const { sub, role } = jwt.verify(token, process.env.JWT_SECRET);
  if (role !== "analyst") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const assignments = await Assignment.find({ analystId: sub }).populate("investorId", "name email");
  return NextResponse.json(assignments);
}

// GET /api/reports?investorId=xyz&symbol=AAPL

