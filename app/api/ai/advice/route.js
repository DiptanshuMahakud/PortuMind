import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

function extractJSONFromMarkdown(text) {
  try {
    // Remove markdown fences if they exist
    const clean = text
      .replace(/```json/i, "")
      .replace(/```/g, "")
      .trim();
    return JSON.parse(clean);
  } catch (err) {
    console.warn("⚠️ Failed to parse structured JSON, returning raw text");
    return { rawText: text };
  }
}

export async function POST(req) {
  try {
    const { symbol, historicalData, portfolioShare, avgPrice } = await req.json();

    if (!symbol || !historicalData?.length)
      return NextResponse.json({ error: "Missing required data" }, { status: 400 });

    const prompt = `
    Return ONLY valid JSON. Do not include markdown fences (\`\`\`json).
    You are a professional stock analyst.
    Analyze the stock ${symbol} using the following historical data:
    ${historicalData.map(d => `Date: ${d.date}, Close: ${d.close}`).join("\n")}
    The investor holds ${portfolioShare}% of their portfolio at an average price of ${avgPrice}.
    Provide a JSON response only:
    {
      "recommendation": "BUY|HOLD|SELL",
      "reason": "short explanation",
      "suggestedAllocation": number
    }`;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });
    const result = await model.generateContent(prompt);

    const text = result.response.text();
    const parsed = extractJSONFromMarkdown(text);

    return NextResponse.json({ symbol, aiAdvice: parsed });
  } catch (err) {
    console.error("Gemini AI error:", err);
    return NextResponse.json({ error: "AI analysis failed" }, { status: 500 });
  }
}
