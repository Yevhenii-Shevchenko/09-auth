import { parse } from "cookie";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import { checkSession } from "@/lib/api/serverApi";

const PRIVATE_PATHS = ["/profile", "/notes"];
const AUTH_PATHS = ["/sign-in", "/sign-up"];

function matchesPath(pathname: string, paths: string[]) {
  return paths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

function applySetCookieHeader(
  response: NextResponse,
  setCookie: string | string[] | undefined,
) {
  if (!setCookie) {
    return;
  }

  const cookieArray = Array.isArray(setCookie) ? setCookie : [setCookie];

  for (const cookieStr of cookieArray) {
    const parsed = parse(cookieStr);
    const options = {
      expires: parsed.Expires ? new Date(parsed.Expires) : undefined,
      path: parsed.Path,
      maxAge: parsed["Max-Age"] ? Number(parsed["Max-Age"]) : undefined,
    };

    if (parsed.accessToken) {
      response.cookies.set("accessToken", parsed.accessToken, options);
    }

    if (parsed.refreshToken) {
      response.cookies.set("refreshToken", parsed.refreshToken, options);
    }
  }
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const response = NextResponse.next();
  let hasSession = Boolean(accessToken);

  if (!accessToken && refreshToken) {
    try {
      const sessionResponse = await checkSession({
        cookies: cookieStore.toString(),
      });

      applySetCookieHeader(response, sessionResponse.headers["set-cookie"]);
      hasSession = sessionResponse.data.success;
    } catch {
      hasSession = false;
    }
  }

  if (!hasSession && matchesPath(pathname, PRIVATE_PATHS)) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (hasSession && AUTH_PATHS.includes(pathname)) {
    const redirectResponse = NextResponse.redirect(new URL("/", request.url));

    for (const cookie of response.cookies.getAll()) {
      redirectResponse.cookies.set(cookie);
    }

    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/profile/:path*", "/notes/:path*", "/sign-in", "/sign-up"],
};
