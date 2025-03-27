// middleware.ts
import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;
    
    // Protect dashboard routes
    if (path.startsWith("/dashboard")) {
      // If user is not authenticated, redirect to login
      if (!token) {
        return NextResponse.redirect(new URL("/login", req.url));
      }

      // Admin can access everything
      if (token.role === "ADMIN") {
        return NextResponse.next();
      }

      // Handle specific role restrictions
      if (token.role === "TRANSPORTIST" && !path.includes("/dashboard/tracking")) {
        // Transportist can only access tracking pages
        return NextResponse.redirect(new URL("/dashboard/tracking", req.url));
      }

      // EMPLOYEE can access everything except user management
      if (token.role === "EMPLOYEE" && path.includes("/dashboard/users")) {
        return NextResponse.redirect(new URL("/dashboard", req.url));
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

// Specify which routes this middleware applies to
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/api/admin/:path*",
  ],
};