import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import connectToDatabase from "@/utils/mongodb";
import Report from "@/models/Report";

export async function PATCH(req, context) {
  try {
    await connectToDatabase();

    // ✅ Must await params in Next.js 15+ App Router
    const { id } = await context.params;
    const { analystNote, approvalStatus } = await req.json();

    const token =
      req.cookies.get("token_analyst")?.value ||
      req.cookies.get("token_investor")?.value;

    if (!token)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "analyst")
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const updated = await Report.findByIdAndUpdate(
      id,
      {
        analystId: decoded.sub,
        analystNote,
        approvalStatus,
      },
      { new: true }
    );

    if (!updated)
      return NextResponse.json({ error: "Report not found" }, { status: 404 });

    return NextResponse.json({ message: "Report updated", report: updated });
  } catch (err) {
    console.error("Error updating report:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
