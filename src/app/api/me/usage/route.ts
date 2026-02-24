import { createClient, createServiceClient } from "@/lib/supabase/server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient();
    const { data: { session } } = await supabase.auth.getSession();

    if (!session?.user) {
      return NextResponse.json({ logs: [], total: 0 }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "0");
    const pageSize = parseInt(searchParams.get("pageSize") || "20");
    const channel = searchParams.get("channel") || "";

    const service = createServiceClient();

    let query = service
      .from("usage_logs")
      .select("id, service_id, credits_used, status, channel, latency_ms, model_used, created_at", {
        count: "exact",
      })
      .eq("user_id", session.user.id)
      .order("created_at", { ascending: false })
      .range(page * pageSize, (page + 1) * pageSize - 1);

    if (channel) {
      query = query.eq("channel", channel);
    }

    const { data, count } = await query;

    // Sum ALL credits used (not just current page)
    const { data: sumData } = await service
      .from("usage_logs")
      .select("credits_used")
      .eq("user_id", session.user.id);

    const totalCreditsUsed = sumData?.reduce((sum, l) => sum + l.credits_used, 0) ?? 0;

    return NextResponse.json({
      logs: data ?? [],
      total: count ?? 0,
      total_credits_used: totalCreditsUsed,
    });
  } catch {
    return NextResponse.json({ logs: [], total: 0 }, { status: 500 });
  }
}
