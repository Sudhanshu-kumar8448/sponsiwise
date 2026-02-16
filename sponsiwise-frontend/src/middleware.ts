import { NextRequest, NextResponse } from "next/server";
import { findRouteRule } from "@/lib/route-config";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

/**
 * Shape of the user object returned by GET /auth/me.
 * Only the fields the middleware needs are listed here.
 */
interface AuthUser {
  id: string;
  email: string;
  role: string;
}

/**
 * Next.js Middleware – runs server-side on every matched request BEFORE
 * any page renders.  It never touches JWTs in JavaScript; it simply
 * forwards the browser's cookies to the backend GET /auth/me endpoint
 * and acts on the response.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ── 1. Check if this path is protected ─────────────────────────────
  const rule = findRouteRule(pathname);

  // No protection rule ⇒ public route, let it through.
  if (!rule) {
    return NextResponse.next();
  }

  // ── 2. Verify authentication via backend ───────────────────────────
  const cookieHeader = request.headers.get("cookie") ?? "";

  let user: AuthUser;

  try {
    const res = await fetch(`${API_BASE_URL}/auth/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookieHeader,
      },
    });

    if (!res.ok) {
      // Backend says unauthenticated (401 or any non-2xx) ⇒ redirect to login.
      return redirectToLogin(request, pathname);
    }

    user = (await res.json()) as AuthUser;
  } catch {
    // Network error or backend unreachable ⇒ fail closed (redirect to login).
    return redirectToLogin(request, pathname);
  }

  // ── 3. Enforce role restriction (if any) ───────────────────────────
  if (rule.roles && rule.roles.length > 0) {
    if (!rule.roles.includes(user.role)) {
      // Authenticated but wrong role ⇒ unauthorized page.
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }
  }

  // ── 4. All checks passed ──────────────────────────────────────────
  return NextResponse.next();
}

// ─── Helper ────────────────────────────────────────────────────────────
function redirectToLogin(request: NextRequest, callbackPath: string) {
  const loginUrl = new URL("/login", request.url);
  loginUrl.searchParams.set("callbackUrl", callbackPath);
  return NextResponse.redirect(loginUrl);
}

// ─── Matcher ───────────────────────────────────────────────────────────
// Run middleware on every request EXCEPT Next.js internals and static files.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
