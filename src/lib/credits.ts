import { createServiceClient } from "@/lib/supabase/server";
import { generateRequestId } from "@/lib/utils";
import type { AccessChannel } from "@/types";

interface DeductCreditsParams {
  userId: string;
  serviceId: string; // UUID or slug like "content-generator"
  creditsUsed: number;
  requestPayload: Record<string, unknown>;
  responseTokens: number;
  modelUsed: string;
  latencyMs: number;
  status: "success" | "error";
  channel: AccessChannel;
  ipAddress: string;
  costToUs: number;
}

// UUID regex
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Cache service slug -> UUID mapping
let serviceCache: Record<string, string> | null = null;

async function resolveServiceUuid(
  supabase: ReturnType<typeof createServiceClient>,
  serviceId: string
): Promise<string | null> {
  // Already a UUID — use directly
  if (UUID_REGEX.test(serviceId)) return serviceId;

  // It's a slug — look up the UUID
  if (!serviceCache) {
    const { data } = await supabase.from("services").select("id, slug");
    if (data) {
      serviceCache = {};
      for (const s of data) serviceCache[s.slug] = s.id;
    }
  }
  return serviceCache?.[serviceId] ?? null;
}

export async function deductCredits(params: DeductCreditsParams): Promise<{
  requestId: string;
  newBalance: number;
}> {
  const supabase = createServiceClient();
  const requestId = generateRequestId();

  // Deduct credits atomically via RPC
  const { data: newBalance, error: updateError } = await supabase.rpc(
    "deduct_credits",
    {
      p_user_id: params.userId,
      p_amount: params.creditsUsed,
    }
  );

  if (updateError) {
    throw new Error(`Failed to deduct credits: ${updateError.message}`);
  }

  // Resolve service ID to UUID
  const serviceUuid = await resolveServiceUuid(supabase, params.serviceId);

  if (serviceUuid) {
    const { error: logError } = await supabase.from("usage_logs").insert({
      id: requestId,
      user_id: params.userId,
      service_id: serviceUuid,
      credits_used: params.creditsUsed,
      request_payload: params.requestPayload,
      response_tokens: params.responseTokens,
      model_used: params.modelUsed,
      latency_ms: params.latencyMs,
      status: params.status,
      channel: params.channel,
      ip_address: params.ipAddress,
      cost_to_us: params.costToUs,
    });

    if (logError) {
      console.error("Failed to insert usage log:", logError.message);
    }
  } else {
    console.error(`Could not resolve service UUID for: ${params.serviceId}`);
  }

  return {
    requestId,
    newBalance: newBalance ?? 0,
  };
}

export async function addCredits(
  userId: string,
  amount: number
): Promise<number> {
  const supabase = createServiceClient();

  const { data, error } = await supabase.rpc("add_credits", {
    p_user_id: userId,
    p_amount: amount,
  });

  if (error) {
    throw new Error(`Failed to add credits: ${error.message}`);
  }

  return data ?? 0;
}
