import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export const authMiddleware = withAuth(
  function middleware(req) {
    // If not logged in, send to /login
    if (!req.nextauth.token) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token
    }
  }
);

export const config = {
  matcher: [
    "/dashboard/:path*",
  ],
};
