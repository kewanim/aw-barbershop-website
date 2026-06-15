// /api/appointments
//   GET  — list bookings (admin only; optional ?status=confirmed|pending|cancelled)
//   POST — create a booking (PUBLIC: customers book without an account)
import { NextResponse } from "next/server";
import { listBookings, createBooking } from "@/lib/store";
import { getCurrentStaff } from "@/lib/auth";

export async function GET(request) {
  // Listing all bookings is staff-only (it exposes customer contact details).
  const staff = await getCurrentStaff();
  if (!staff) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status") || undefined;
  const data = await listBookings({ status });
  return NextResponse.json({ count: data.length, data });
}

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createBooking(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  }
  return NextResponse.json({ data: result.data }, { status: 201 });
}
