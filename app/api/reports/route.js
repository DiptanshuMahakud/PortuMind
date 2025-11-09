import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Report from "@/models/Report";

export async function GET(req) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get("investorId");
    const symbol = searchParams.get("symbol");

    const token =
      req.cookies.get("token_investor")?.value ||
      req.cookies.get("token_analyst")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const query = {};

    // 🧠 Role-based logic
    if (decoded.role === "investor") {
      // Investor only sees their own reports
      query.investorId = decoded.sub;
    } else if (decoded.role === "analyst") {
      if (investorId) {
        // If analyst is fetching for a specific investor (review case)
        query.investorId = investorId;
      } else {
        // Otherwise, fetch only reports they have reviewed
        query.analystId = decoded.sub;
      }
    }

    // 🔠 Case-insensitive symbol matching
    if (symbol) {
      query.symbol = { $regex: new RegExp(`^${symbol}$`, "i") };
    }

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .populate("investorId", "name email")
      .populate("analystId", "name email");

    return NextResponse.json({ reports });
  } catch (err) {
    console.error("Error fetching reports:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req) {
  try {
    await connectToDatabase();
    const { symbol, investorId, aiSummary, aiRecommendation, suggestedAllocation, chatHistory } =
      await req.json();

    // 🧩 Investor is identified from cookie
    const token =
      req.cookies.get("token_investor")?.value ||
      req.cookies.get("token_analyst")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const investor =
      investorId || (decoded.role === "investor" ? decoded.sub : null);

    if (!investor)
      return NextResponse.json({ error: "Missing investorId" }, { status: 400 });

    // 🧩 Create and save the report
    const newReport = await Report.create({
      investorId: investor,
      symbol,
      aiSummary,
      aiRecommendation,
      suggestedAllocation,
      chatHistory,
      createdAt: new Date(),
    });

    return NextResponse.json({ message: "Report saved", report: newReport });
  } catch (err) {
    console.error("Error saving report:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
