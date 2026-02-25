import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import crypto from "crypto";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }

    const service = createServiceClient();
    let { data: profile } = await service
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    // Auto-create profile on first login if it doesn't exist
    // (replaces the database trigger which caused auth failures)
    if (!profile) {
      const apiKey = "kgx_live_" + crypto.randomBytes(32).toString("hex");
      const fullName =
        session.user.user_metadata?.full_name ||
        session.user.user_metadata?.name ||
        session.user.email?.split("@")[0] ||
        "";

      const { data: newProfile, error } = await service
        .from("profiles")
        .insert({
          id: session.user.id,
          full_name: fullName,
          avatar_url: session.user.user_metadata?.avatar_url || "",
          api_key: apiKey,
          credits_balance: 50,
          plan_type: "free_trial",
        })
        .select("*")
        .single();

      if (error) {
        console.error("Failed to auto-create profile:", error.message);
      } else {
        profile = newProfile;
      }
    }

    return NextResponse.json({ user: session.user, profile });
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error("/api/me error:", message);
    return NextResponse.json({ error: message, user: null, profile: null }, { status: 500 });
  }
}
