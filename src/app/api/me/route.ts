import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ user: null, profile: null }, { status: 401 });
    }

    // Service client bypasses RLS — always returns data
    const service = createServiceClient();
    const { data: profile } = await service
      .from("profiles")
      .select("*")
      .eq("id", session.user.id)
      .single();

    return NextResponse.json({ user: session.user, profile });
  } catch {
    return NextResponse.json({ user: null, profile: null }, { status: 500 });
  }
}
