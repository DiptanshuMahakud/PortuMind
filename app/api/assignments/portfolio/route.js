import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Assignments from "@/models/Assignments";
import Portfolio from "@/models/Portfolio";

export async function GET(req) {
  try {
    await connectToDatabase();

    const { searchParams } = new URL(req.url);
    const investorId = searchParams.get("investorId");
    const symbol = searchParams.get("symbol");

    // ✅ Auth check
    const token =
      req.cookies.get("token_analyst")?.value ||
      req.cookies.get("token_investor")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Verify this analyst is actually assigned to that investor+symbol
    const isAssigned = await Assignments.findOne({
      analystId: decoded.sub,
      investorId,
      "stocks": { $in: [symbol] },
      status: "accepted",
    });

    if (!isAssigned)
      return NextResponse.json(
        { error: "Forbidden — not assigned to this investor/stock" },
        { status: 403 }
      );

    // ✅ Fetch the investor's portfolio
    const portfolio = await Portfolio.findOne({ investorId });
    if (!portfolio)
      return NextResponse.json(
        { error: "Portfolio not found" },
        { status: 404 }
      );

    // Optionally filter to just the requested symbol
    const filteredHoldings = symbol
      ? portfolio.holdings.filter(
          (h) => h.symbol.toUpperCase() === symbol.toUpperCase()
        )
      : portfolio.holdings;

    return NextResponse.json({
      investorId,
      symbol,
      holdings: filteredHoldings,
    });
  } catch (err) {
    console.error("Assignment portfolio fetch error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
