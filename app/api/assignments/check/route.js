import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Assignments from "@/models/Assignments";
import User from "@/models/User";

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { sub: investorId } = decoded;

    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    const assignment = await Assignments.findOne({
      investorId,
      stocks: symbol,
    }).populate("analystId", "name email");

    if (!assignment)
      return NextResponse.json({ message: "No analyst assigned" }, { status: 200 });

    return NextResponse.json({
      assigned: true,
      analyst: assignment.analystId,
      status: assignment.status,
    });
  } catch (err) {
    console.error("Check Assignment Error:", err);
    return NextResponse.json(
      { error: "Failed to check assignment" },
      { status: 500 }
    );
  }
}

// /api/assignments/check?symbol=AAPL