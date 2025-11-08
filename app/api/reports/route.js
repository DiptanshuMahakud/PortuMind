import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Report from "@/models/Report";

export async function GET(req) {
  try {
    await connectToDatabase();

    const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const investorId = decoded.sub;

    const reports = await Report.find({ investorId }).sort({ createdAt: -1 });

    return NextResponse.json(reports);
  } catch (err) {
    console.error("Error fetching reports:", err);
    return NextResponse.json({ error: "Failed to fetch reports" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();

    const token = req.cookies.get("token_investor")?.value || req.cookies.get("token_analyst")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const investorId = decoded.sub;

    const { symbol, aiSummary, aiRecommendation, suggestedAllocation, chatHistory } = await req.json();

    const newReport = await Report.create({
      investorId,
      symbol,
      aiSummary,
      aiRecommendation,
      suggestedAllocation,
      chatHistory,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Report saved successfully", report: newReport }, { status: 201 });
  } catch (err) {
    console.error("Error saving report:", err);
    return NextResponse.json({ error: "Failed to save report" }, { status: 500 });
  }
}
