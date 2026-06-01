import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

const authSecret =
  process.env.AUTH_SECRET ?? process.env.NEXTAUTH_SECRET;

export default withAuth(
  function middleware(req) {
    const role = req.nextauth.token?.role;

    const path = req.nextUrl.pathname;

    if (path.startsWith("/admin") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/orders", req.url));
    }

    if (path.startsWith("/dashboard") && role !== "ADMIN") {
      return NextResponse.redirect(new URL("/orders", req.url));
    }

    if (path.startsWith("/orders") && role === "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: authSecret,
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname;

        if (
          path.startsWith("/admin") ||
          path.startsWith("/dashboard") ||
          path.startsWith("/orders")
        ) {
          return !!token;
        }

        return true;
      },
    },
    pages: {
      signIn: "/login",
      error: "/login",
    },
  }
);

export const config = {
  matcher: [
    "/admin",
    "/admin/:path*",
    "/dashboard",
    "/dashboard/:path*",
    "/orders",
    "/orders/:path*",
  ],
};
