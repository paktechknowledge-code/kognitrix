import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST() {
  const cookieStore = await cookies();

  // Delete all Supabase auth cookies without making a network call
  // supabase.auth.signOut() times out in some environments — clearing cookies is sufficient
  const allCookies = cookieStore.getAll();
  const response = NextResponse.redirect(
    new URL("/login", process.env.NEXT_PUBLIC_APP_URL || "https://kognitrix.com"),
    { status: 302 }
  );

  for (const cookie of allCookies) {
    if (
      cookie.name.startsWith("sb-") ||
      cookie.name.includes("supabase") ||
      cookie.name.includes("-auth-token")
    ) {
      response.cookies.set(cookie.name, "", {
        maxAge: 0,
        path: "/",
      });
    }
  }

  return response;
}
