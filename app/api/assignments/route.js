// app/api/assignments/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Assignments from "@/models/Assignments";

export async function GET(req) {
  await connectToDatabase();
  const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
  const { sub, role } = jwt.verify(token, process.env.JWT_SECRET);
  console.log(role);
  if (role !== "analyst") return NextResponse.json({ error: "Forbidden" }, { status: 403 });

  const assignments = await Assignments.find({ analystId: sub }).populate("investorId", "name email");
  return NextResponse.json(assignments);
}

// GET /api/reports?investorId=xyz&symbol=AAPL

