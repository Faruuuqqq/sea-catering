import { auth } from "@/app/api/auth/[...nextauth]/route";
import { NextResponse } from 'next/server';

export default auth((req) => {
  const userRole = req.auth?.user?.role;
  const isLoggedIn = !!req.auth;
  
  if (req.nextUrl.pathname.startsWith("/admin") && userRole !== "ADMIN") {
    return NextResponse.redirect(new URL("/", req.url));
  }

  if (!isLoggedIn) {
    const newUrl = new URL("/login", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/subscription", "/dashboard", "/admin/:path*"],
};