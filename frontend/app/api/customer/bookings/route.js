// GET /api/customer/bookings — the signed-in customer's booking & payment history.
import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/lib/auth";
import { listBookingsByCustomer } from "@/lib/store";

export async function GET() {
  const customer = await getCurrentCustomer();
  if (!customer) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }
  const data = await listBookingsByCustomer(customer.id);
  return NextResponse.json({ count: data.length, data });
}
