import { NextResponse } from "next/server";
import { AUTH_COOKIE_NAME } from "@/lib/auth";

export async function POST() {
  const response = NextResponse.json({ success: true });

  // Clear all possible session cookie names
  response.cookies.set(AUTH_COOKIE_NAME, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });

  // Also clear legacy cookie names
  response.cookies.set("auth_token", "", { maxAge: 0, path: "/" });
  response.cookies.set("breemous_session", "", { maxAge: 0, path: "/" });
  response.cookies.set("wrotez_session", "", { maxAge: 0, path: "/" });

  return response;
}
