// POST /api/customer/register — { name, email, password }
// Creates a customer account and signs them in (sets the customer cookie).
import { NextResponse } from "next/server";
import { createCustomer } from "@/lib/store";
import { createCustomerSession, CUSTOMER_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const result = await createCustomer(body);
  if (result.error) {
    return NextResponse.json({ error: result.error }, { status: result.status || 400 });
  }

  const res = NextResponse.json({ data: result.data }, { status: 201 });
  res.cookies.set(CUSTOMER_COOKIE, createCustomerSession(result.data), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
