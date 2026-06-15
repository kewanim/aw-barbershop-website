// GET /api/barbers  — list barbers (optional ?available=true)
import { NextResponse } from "next/server";
import { listBarbers } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const available = searchParams.get("available") === "true";
  const data = listBarbers({ available });
  return NextResponse.json({ count: data.length, data });
}
