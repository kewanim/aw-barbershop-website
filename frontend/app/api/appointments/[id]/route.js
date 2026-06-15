// /api/appointments/[id]
//   GET    — fetch one booking
//   PUT    — update a booking (partial; used by admin to confirm/cancel)
//   DELETE — remove a booking
//
// Note: in Next.js 15+/16, the dynamic `params` object is async and must be
// awaited.
import { NextResponse } from "next/server";
import { getBooking, updateBooking, deleteBooking } from "@/lib/store";
import { getCurrentStaff } from "@/lib/auth";

// All operations on a specific booking are staff-only.
async function requireStaff() {
  const staff = await getCurrentStaff();
  return staff
    ? null
    : NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(_request, { params }) {
  const denied = await requireStaff();
  if (denied) return denied;

  const { id } = await params;
  const booking = await getBooking(id);
  if (!booking) {
    return NextResponse.json({ error: "Booking not found" }, { status: 404 });
  }
  return NextResponse.json({ data: booking });
}

export async function PUT(request, { params }) {
  const denied = await requireStaff();
  if (denied) return denied;

  const { id } = await params;
  let patch;
  try {
    patch = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await updateBooking(id, patch);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  }
  return NextResponse.json({ data: result.data });
}

export async function DELETE(_request, { params }) {
  const denied = await requireStaff();
  if (denied) return denied;

  const { id } = await params;
  const result = await deleteBooking(id);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  }
  return NextResponse.json({ data: result.data, message: "Booking deleted" });
}
