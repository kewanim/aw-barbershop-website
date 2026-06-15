// POST /api/customer/login — { email, password }
import { NextResponse } from "next/server";
import { verifyCustomerCredentials } from "@/lib/store";
import { createCustomerSession, CUSTOMER_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { email, password } = body;
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
  }

  const customer = await verifyCustomerCredentials(email, password);
  if (!customer) {
    return NextResponse.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const res = NextResponse.json({ data: customer });
  res.cookies.set(CUSTOMER_COOKIE, createCustomerSession(customer), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
