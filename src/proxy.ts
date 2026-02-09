import createMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./routing";

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow password page and API routes through without auth check
  if (pathname === "/password" || pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Check access cookie
  const hasAccess = request.cookies.get("site_access")?.value === "granted";
  if (!hasAccess) {
    return NextResponse.redirect(new URL("/password", request.url));
  }

  // Authenticated — run next-intl middleware
  return intlMiddleware(request);
}

export const config = {
  matcher: ["/((?!_next|_vercel|.*\\..*).*)"],
};
