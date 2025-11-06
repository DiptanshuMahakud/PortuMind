import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Report from "@/models/Report";
import connectToDatabase from "@/utils/mongodb";
import jwt from "jsonwebtoken";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export async function POST(req) {
  try {
    await connectToDatabase();
    const { symbol, messages } = await req.json();
    const token = req.cookies.get("token")?.value;

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const investorId = decoded.sub;

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // Send last message to Gemini
    const lastMessage = messages[messages.length - 1];
    const result = await model.generateContent(lastMessage.content);
    const reply = result.response.text();

    // ✅ Save chat history to MongoDB
    const report = await Report.findOne({ investorId, symbol });

    if (report) {
      // Append to existing chat
      report.chatHistory.push(
        { role: "user", message: lastMessage.content },
        { role: "model", message: reply }
      );
      await report.save();
    } else {
      // Create new chat thread
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
