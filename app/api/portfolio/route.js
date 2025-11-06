import { NextResponse } from "next/server";
import Portfolio from "@/models/Portfolio";
import connectToDatabase from "@/utils/mongodb";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "investor")
      return NextResponse.json({ error: "Access denied" }, { status: 403 });

    const { holdings } = await req.json();

    let portfolio = await Portfolio.findOne({ investorId: decoded.sub });
    if (portfolio) {
      portfolio.holdings = holdings;
      await portfolio.save();
    } else {
      portfolio = await Portfolio.create({ investorId: decoded.sub, holdings });
    }

    return NextResponse.json({ message: "Portfolio saved", portfolio });
  } catch (err) {
    console.error("Portfolio error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    await connectToDatabase();
    const token = req.cookies.get("token")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const portfolio = await Portfolio.findOne({ investorId: decoded.sub });
    return NextResponse.json({ portfolio });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
