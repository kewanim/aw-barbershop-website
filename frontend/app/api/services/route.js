// GET /api/services  — list services (optional ?category=Hair)
import { NextResponse } from "next/server";
import { listServices } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category") || undefined;
  const data = listServices({ category });
  return NextResponse.json({ count: data.length, data });
}
