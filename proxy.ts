import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PRIVATE_PATHS = ["/profile", "/notes"];
const AUTH_PATHS = ["/sign-in", "/sign-up"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasSession =
    Boolean(request.cookies.get("accessToken")?.value) ||
    Boolean(request.cookies.get("refreshToken")?.value);

  if (!hasSession && matchesPath(pathname, PRIVATE_PATHS)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (hasSession && AUTH_PATHS.includes(pathname)) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
