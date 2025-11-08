import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Assignments from "@/models/Assignments";
import User from "@/models/User";

export async function POST(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { sub: investorId, role } = decoded;
    console.log(role);
    if (role !== "investor")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const { analystEmail, symbol } = await req.json();

    // find analyst by email
    const analyst = await User.findOne({ email: analystEmail, role: "analyst" });
    if (!analyst)
      return NextResponse.json({ error: "Analyst not found" }, { status: 404 });

    // check if already assigned
    const existing = await Assignments.findOne({
      investorId,
      analystId: analyst._id,
      stocks: symbol,
    });
    if (existing)
      return NextResponse.json(
        { message: "Request already exists or analyst assigned" },
        { status: 400 }
      );

    // create new pending assignment
    const newAssignment = await Assignments.create({
      investorId,
      analystId: analyst._id,
      stocks: [symbol],
      status: "pending",
    });

    return NextResponse.json({
      message: `Request sent to ${analyst.email}`,
      assignment: newAssignment,
    });
  } catch (err) {
    console.error("Assignment Request Error:", err);
    return NextResponse.json(
      { error: "Failed to send request" },
      { status: 500 }
    );
  }
}
