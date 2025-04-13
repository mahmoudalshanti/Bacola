import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./lib/utils";

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }

  try {
    const decoded = await verifyToken(token);

    const pathname = req.nextUrl.pathname;
    if (pathname.startsWith("/dashboard") && decoded?.role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url));
    }

    if (decoded.role === "admin") {
      const requestHeaders = new Headers(req.headers);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);
      requestHeaders.set("x-user-id", decoded.id);

      return NextResponse.next({
        request: { headers: requestHeaders },
      });
    }
  } catch (error) {
    return NextResponse.redirect(new URL("/sign-in", req.url));
  }
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
