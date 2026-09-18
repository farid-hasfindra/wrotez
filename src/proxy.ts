import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const AUTH_COOKIE_NAME = "wreetfy_session";
const LEGACY_AUTH_COOKIE_NAME = "auth_token";
const LEGACY_AUTH_COOKIE_NAME_OLD = "breemous_session";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "novel-app-super-secret-key-change-in-production-2026"
);

const PROTECTED_ROUTES = [
  "/domains",
  "/dashboard",
  "/projects",
  "/novel",
  "/profile",
];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token =
    request.cookies.get(AUTH_COOKIE_NAME)?.value ??
    request.cookies.get(LEGACY_AUTH_COOKIE_NAME)?.value ??
    request.cookies.get(LEGACY_AUTH_COOKIE_NAME_OLD)?.value;

  let isAuthenticated = false;
  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isAuthenticated = true;
    } catch {
      isAuthenticated = false;
    }
  }

  const isProtectedRoute = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/domains/:path*",
    "/dashboard/:path*",
    "/projects/:path*",
    "/novel/:path*",
    "/profile/:path*",
  ],
};