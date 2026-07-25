import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
import { AUTH_ROUTES } from "@/lib/auth/constant";

/**
 * Cookie presence only — NOT full DB validation.
 * Full check = getServerSession in layouts/actions.
 */

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionCookie = getSessionCookie(request);

  const authPages = new Set<string>([
    AUTH_ROUTES.login,
    AUTH_ROUTES.register,
    AUTH_ROUTES.forgotPassword,
    AUTH_ROUTES.resetPassword,
    AUTH_ROUTES.verifyEmail,
  ]);

  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/admin");

  if (isProtected && !sessionCookie) {
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.login;
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  if (authPages.has(pathname) && sessionCookie) {
    if (pathname === AUTH_ROUTES.verifyEmail) {
      return NextResponse.next();
    }
    const url = request.nextUrl.clone();
    url.pathname = AUTH_ROUTES.dashboard;
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
