// POST /api/auth/login  — { username, password }
// On success sets an httpOnly session cookie and returns the staff member.
import { NextResponse } from "next/server";
import { verifyStaffCredentials } from "@/lib/store";
import { createSession, SESSION_COOKIE, SESSION_MAX_AGE } from "@/lib/auth";

export async function POST(request) {
  let body;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { username, password } = body;
  if (!username || !password) {
    return NextResponse.json(
      { error: "Username and password are required" },
      { status: 400 }
    );
  }

  const staff = await verifyStaffCredentials(username, password);
  if (!staff) {
    return NextResponse.json(
      { error: "Invalid username or password" },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ data: staff });
  res.cookies.set(SESSION_COOKIE, createSession(staff), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
  return res;
}
