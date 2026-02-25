import { NextResponse, type NextRequest } from "next/server";

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
  "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
};

function applySecurityHeaders(response: NextResponse) {
  Object.entries(SECURITY_HEADERS).forEach(([k, v]) =>
    response.headers.set(k, v)
  );
}

function hasSession(request: NextRequest): boolean {
  for (const cookie of request.cookies.getAll()) {
    if (
      (cookie.name.startsWith("sb-") && cookie.name.endsWith("-auth-token")) ||
      cookie.name === "supabase-auth-token"
    ) {
      return !!cookie.value;
    }
  }
  return false;
}

export async function middleware(request: NextRequest) {
  const response = NextResponse.next({ request });
  applySecurityHeaders(response);

  const pathname = request.nextUrl.pathname;
  const isLoggedIn = hasSession(request);

  // Protect dashboard routes — redirect to login if no session cookie
  if (pathname.startsWith("/dashboard") && !isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.searchParams.set("redirect", pathname);
    const redirectResponse = NextResponse.redirect(url);
    applySecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  // Redirect logged-in users away from auth pages
  if ((pathname === "/login" || pathname === "/signup") && isLoggedIn) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    const redirectResponse = NextResponse.redirect(url);
    applySecurityHeaders(redirectResponse);
    return redirectResponse;
  }

  return response;
}

export const config = {
  matcher: ["/dashboard/:path*", "/login", "/signup"],
};
