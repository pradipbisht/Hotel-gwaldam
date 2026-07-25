import { NextRequest, NextResponse } from "next/server";

/**
 * Edge-safe middleware (no better-auth / no @/ path aliases).
 * Only checks cookie *presence* — layouts still run getServerSession for real auth.
 *
 * Better Auth default cookie names:
 *   better-auth.session_token
 *   __Secure-better-auth.session_token  (HTTPS / production)
 */
const SESSION_COOKIE_NAMES = [
  "better-auth.session_token",
  "__Secure-better-auth.session_token",
  "better-auth.session_data",
  "__Secure-better-auth.session_data",
] as const;

const LOGIN = "/login";
const DASHBOARD = "/dashboard";
const VERIFY_EMAIL = "/verify-email";

const AUTH_PAGES = new Set([
  LOGIN,
  "/register",
  "/forgot-password",
  "/reset-password",
  VERIFY_EMAIL,
]);

function hasSessionCookie(request: NextRequest): boolean {
  for (const name of SESSION_COOKIE_NAMES) {
    if (request.cookies.get(name)?.value) return true;
  }
  // Fallback: any cookie starting with better-auth session prefix
  for (const { name, value } of request.cookies.getAll()) {
    if (!value) continue;
    if (
      name.includes("better-auth.session_token") ||
      name.includes("better-auth.session_data")
    ) {
      return true;
    }
  }
  return false;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = hasSessionCookie(request);

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/admin");

  if (isProtected && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = LOGIN;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (AUTH_PAGES.has(pathname) && sessionCookie) {
    if (pathname === VERIFY_EMAIL) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = DASHBOARD;
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/bookings/:path*",
    "/admin/:path*",
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/verify-email",
  ],
};
