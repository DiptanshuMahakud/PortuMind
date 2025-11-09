import { NextResponse } from "next/server";
import connectToDatabase from "@/utils/mongodb";

export async function GET() {
  await connectToDatabase();
  return NextResponse.json({ message: "Database connection successful!" });
}
