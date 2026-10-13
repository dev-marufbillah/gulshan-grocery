import NextAuth from "next-auth";
import { authConfig } from "./auth.config";
import { NextResponse } from "next/server";

// Middleware এর জন্য শুধু Edge-safe config ব্যবহার করছি
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  // @ts-expect-error role exists
  const role = req.auth?.user?.role;

  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isLoginRoute = nextUrl.pathname === "/admin/login";

  if (isAdminRoute) {
    if (!isLoggedIn && !isLoginRoute) {
      return NextResponse.redirect(new URL("/admin/login", nextUrl));
    }
    
    if (isLoggedIn && !isLoginRoute && role !== "superadmin" && role !== "admin") {
      return NextResponse.redirect(new URL("/", nextUrl));
    }

    if (isLoggedIn && isLoginRoute) {
      return NextResponse.redirect(new URL("/admin", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};