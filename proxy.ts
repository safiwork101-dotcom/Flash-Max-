import { NextRequest, NextResponse } from "next/server";

const publicPaths = new Set(["/account", "/contact", "/privacy", "/terms"]);

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isPublicPage = publicPaths.has(pathname);
  const isInternalPath =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/_next/") ||
    pathname === "/favicon.ico";

  if (isPublicPage || isInternalPath) {
    return NextResponse.next();
  }

  if (!request.cookies.get("flashmax_session")?.value) {
    const loginUrl = new URL("/account", request.url);
    loginUrl.searchParams.set("next", `${pathname}${search}`);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"],
};
