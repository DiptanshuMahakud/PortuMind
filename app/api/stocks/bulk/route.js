import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function POST(req) {

    const yf = new yahooFinance();
  try {
    const { symbols } = await req.json();
    if (!symbols || symbols.length === 0) {
      return NextResponse.json({ error: "Symbols required" }, { status: 400 });
    }

    const quotes = await yf.quote(symbols);

    // yahoo-finance2 returns either an array or a single object
    const formatted = Array.isArray(quotes)
      ? quotes.map((q) => ({
          symbol: q.symbol,
          currentPrice: q.regularMarketPrice,
        }))
      : [
          {
            symbol: quotes.symbol,
            currentPrice: quotes.regularMarketPrice,
          },
        ];

    return NextResponse.json({ prices: formatted });
  } catch (err) {
    console.error("Bulk price fetch error:", err);
    return NextResponse.json(
      { error: "Failed to fetch bulk prices" },
      { status: 500 }
    );
  }
}
