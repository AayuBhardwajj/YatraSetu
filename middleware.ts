import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("zipp_token")?.value;
  const role = req.cookies.get("zipp_role")?.value;
  const path = req.nextUrl.pathname;

  // Root redirect
  if (path === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Admin protection
  if (path.startsWith("/admin")) {
    if (!token || role !== "admin") return NextResponse.redirect(new URL("/login", req.url));
  }

  // Driver protection
  if (path.startsWith("/driver")) {
    if (!token || role !== "driver") return NextResponse.redirect(new URL("/login", req.url));
  }

  // User protection (home, booking, negotiate, tracking, payment)
  const userPaths = ["/home", "/booking", "/negotiate", "/tracking", "/payment", "/activity", "/wallet", "/profile"];
  if (userPaths.some(p => path.startsWith(p))) {
    if (!token || role !== "rider") return NextResponse.redirect(new URL("/login", req.url));
  }

  // Login redirect if already logged in
  if (path === "/login" && token && role) {
    if (role === "admin") return NextResponse.redirect(new URL("/admin/dashboard", req.url));
    if (role === "driver") return NextResponse.redirect(new URL("/driver/dashboard", req.url));
    if (role === "rider") return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/login",
    "/home/:path*",
    "/booking/:path*",
    "/negotiate/:path*",
    "/tracking/:path*",
    "/payment/:path*",
    "/activity/:path*",
    "/wallet/:path*",
    "/profile/:path*",
    "/driver/:path*",
    "/admin/:path*",
  ]
};
