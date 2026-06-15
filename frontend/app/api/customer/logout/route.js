// POST /api/customer/logout — clears the customer cookie.
import { NextResponse } from "next/server";
import { CUSTOMER_COOKIE } from "@/lib/auth";

export async function POST() {
  const res = NextResponse.json({ ok: true });
  res.cookies.set(CUSTOMER_COOKIE, "", { httpOnly: true, path: "/", maxAge: 0 });
  return res;
}
