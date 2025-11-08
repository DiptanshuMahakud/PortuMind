import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Report from "@/models/Report";
import connectToDatabase from "@/utils/mongodb";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { symbol, portfolio, portfolioShare, latestData, messages } = body;

    const token = req.cookies.get("token")?.value;
    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const investorId = decoded.sub;

    // ✅ Initialize Gemini model
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // ✅ Construct contextual system prompt
    let systemContext = `You are an expert financial analyst assistant. 
You are analyzing stock ${symbol} for an investor.
`;

    if (portfolio) {
      systemContext += `Investor holds ${portfolio.quantity} shares at an average price of $${portfolio.avgPrice}.\n`;
    }

    if (portfolioShare) {
      systemContext += `This stock represents approximately ${portfolioShare}% of their total portfolio.\n`;
    }

    if (latestData?.length) {
      const recentPrices = latestData
        .map(
          (d) =>
            `${d.date}: open ${d.open}, high ${d.high}, low ${d.low}, close ${d.close}, volume ${d.volume}`
        )
        .join("\n");
      systemContext += `Recent price data:\n${recentPrices}\n`;
    }

    systemContext +=
      "When answering, refer to recent performance and portfolio context. Be concise and insightful.\n";

    // ✅ Combine context + user’s last message
    const lastMessage = messages[messages.length - 1];
    const prompt = `${systemContext}\nUser: ${lastMessage.content}`;

    // ✅ Get AI reply from Gemini
    const result = await model.generateContent(prompt);
    const reply = result.response.text();

    // ✅ Save chat history to MongoDB
    const report = await Report.findOne({ investorId, symbol });

    if (report) {
      report.chatHistory.push(
        { role: "user", message: lastMessage.content },
        { role: "model", message: reply }
      );
      await report.save();
    } else {
      await Report.create({
        investorId,
        symbol,
        chatHistory: [
          { role: "user", message: lastMessage.content },
          { role: "model", message: reply },
        ],
        createdAt: new Date(),
      });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json({ error: "Chat failed" }, { status: 500 });
  }
}
