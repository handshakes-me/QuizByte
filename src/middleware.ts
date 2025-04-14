import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value; // Get token from cookies

  if (!token) {
    console.log("token not found!")
    // return NextResponse.redirect(new URL("/login", req.url));
  }

  const { pathname } = req.nextUrl;

  // Define public and protected routes
  const publicRoutes = ["/", "/login", "/signup", "/reset-password", "forgot-password", "verify-email"];
  const protectedRoutes = ["/dashboard", "/profile"];

  if (protectedRoutes.includes(pathname) && !token) {
    // If user is not logged in, redirect to login
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (publicRoutes.includes(pathname) && token) {
    // If user is logged in and visits public pages, redirect to dashboard
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next(); // Continue if everything is fine
}
