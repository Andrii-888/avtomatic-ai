import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next 16 renamed the `middleware` file convention to `proxy`.
// Simple site-wide password gate: requires a valid `demo-auth` cookie,
// otherwise redirects to /login. Disabled when DEMO_PASSWORD is unset.
export function proxy(request: NextRequest) {
  const password = process.env.DEMO_PASSWORD;
  if (!password) return NextResponse.next();

  const auth = request.cookies.get("demo-auth")?.value;
  if (auth === password) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = "/login";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    // Gate everything except the login page, Next internals and static assets.
    "/((?!login|_next/static|_next/image|icon.svg|favicon.ico).*)",
  ],
};
