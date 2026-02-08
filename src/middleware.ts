import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Uniquement en production
  if (process.env.NODE_ENV === "production") {
    const authHeader = request.headers.get("authorization");

    if (!authHeader) {
      return new NextResponse("Authentication required", {
        status: 401,
        headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
      });
    }

    try {
      const [scheme, credentials] = authHeader.split(" ");

      if (scheme !== "Basic") {
        return new NextResponse("Invalid auth scheme", { status: 401 });
      }

      const decodedAuth = Buffer.from(credentials, "base64").toString();
      const [username, password] = decodedAuth.split(":");

      const expectedUsername = process.env.BASIC_AUTH_USERNAME || "admin";
      const expectedPassword = process.env.BASIC_AUTH_PASSWORD;

      if (!expectedPassword) {
        console.error("BASIC_AUTH_PASSWORD not set");
        return NextResponse.next();
      }

      if (username === expectedUsername && password === expectedPassword) {
        return NextResponse.next();
      }

      return new NextResponse("Invalid credentials", { status: 401 });
    } catch (error) {
      return new NextResponse("Authentication failed", { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
