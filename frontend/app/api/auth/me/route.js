// GET /api/auth/me  — returns the signed-in staff member, or 401.
import { NextResponse } from "next/server";
import { getCurrentStaff } from "@/lib/auth";

export async function GET() {
  const staff = await getCurrentStaff();
  if (!staff) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  return NextResponse.json({ data: staff });
}
