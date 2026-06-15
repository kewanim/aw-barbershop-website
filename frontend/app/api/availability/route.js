// GET /api/availability?barberId=...&date=YYYY-MM-DD&serviceId=...
// Returns the open start times for that barber/date/service combination.
import { NextResponse } from "next/server";
import { getAvailability } from "@/lib/store";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const barberId = searchParams.get("barberId");
  const date = searchParams.get("date");
  const serviceId = searchParams.get("serviceId");
  // Optional: ignore a specific booking (used when rescheduling it).
  const exclude = searchParams.get("exclude") || null;

  if (!barberId || !date || !serviceId) {
    return NextResponse.json(
      { error: "barberId, date and serviceId are required" },
      { status: 400 }
    );
  }

  const slots = await getAvailability(barberId, date, serviceId, exclude);
  return NextResponse.json({ count: slots.length, data: slots });
}
