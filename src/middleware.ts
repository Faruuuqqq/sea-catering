import { auth } from "@/app/api/auth/[...nextauth]/route";

export default auth((req) => {

  if (!req.auth && req.nextUrl.pathname !== "/login") {

    const newUrl = new URL("/login", req.nextUrl.origin);
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname);
    return Response.redirect(newUrl);
  }
});

export const config = {
  matcher: ["/subscription", "/dashboard/:path*"],
};