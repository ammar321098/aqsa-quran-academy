import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const authSession =
    request.cookies.get("better-auth.session_token")?.value ||
    request.cookies.get("__Secure-better-auth.session_token")?.value;

  const rollSession = request.cookies.get("roll_session")?.value;

  if (!authSession && !rollSession) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
