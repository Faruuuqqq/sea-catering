import { auth } from "@/auth";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/admin")) {
    if (isLoggedIn && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
});

export const config = {
  matcher: ["/subscription", "/dashboard", "/admin/:path*"],
};