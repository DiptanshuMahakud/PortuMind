import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Assignments from "@/models/Assignments";

export async function POST(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { sub: analystId, role } = decoded;
    if (role !== "analyst")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { investorId, symbol, action } = await req.json();

    const assignment = await Assignments.findOne({
      investorId,
      analystId,
      stocks: symbol,
    });
    if (!assignment)
      return NextResponse.json({ error: "Assignment not found" }, { status: 404 });

    assignment.status = action === "accept" ? "accepted" : "declined";
    await assignment.save();

    return NextResponse.json({
      message: `Request ${action}ed successfully.`,
      assignment,
    });
  } catch (err) {
    console.error("Assignment Respond Error:", err);
    return NextResponse.json(
      { error: "Failed to update request" },
      { status: 500 }
    );
  }
}
