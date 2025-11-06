import { NextResponse } from "next/server";
import { connectDB } from "@/utils/mongodb";

export async function GET() {
  await connectDB();
  return NextResponse.json({ message: "Database connection successful!" });
}
