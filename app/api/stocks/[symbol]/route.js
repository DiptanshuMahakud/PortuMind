import { NextResponse } from "next/server";
import yahooFinance from "yahoo-finance2";

export async function GET(req, context) {
  try {
    const { symbol } = await context.params;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const yf = new yahooFinance();

    // Live quote
    const quote = await yf.quote(symbol);

    // Historical 30-day data
    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 30);

    const history = await yf.chart(symbol, {
      period1: start,
      period2: end,
      interval: "1d",
    });

    const response = {
      symbol,
      currentPrice: quote.regularMarketPrice,
      open: quote.regularMarketOpen,
      previousClose: quote.regularMarketPreviousClose,
      dayHigh: quote.regularMarketDayHigh,
      dayLow: quote.regularMarketDayLow,
      currency: quote.currency,
      history: history?.quotes?.map((q) => ({
        date: q.date,
        open: q.open,
        close: q.close,
        high: q.high,
        low: q.low,
        volume: q.volume, // ✅ added volume field
      })),
    };

    return NextResponse.json(response);
  } catch (err) {
    console.error("Stock API error:", err);
    return NextResponse.json(
      { error: "Failed to fetch stock data" },
      { status: 500 }
    );
  }
}
