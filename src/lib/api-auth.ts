import { createServiceClient } from "@/lib/supabase/server";
import type { Profile, AccessChannel } from "@/types";
import { PLANS } from "@/types";

interface AuthResult {
  user: Profile;
  channel: AccessChannel;
}

export async function authenticateApiRequest(
  request: Request,
  channel: AccessChannel = "api"
): Promise<AuthResult> {
  const authHeader = request.headers.get("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Missing or invalid Authorization header. Use: Bearer kgx_live_xxx");
  }

  const apiKey = authHeader.replace("Bearer ", "").trim();

  if (!apiKey.startsWith("kgx_live_") && !apiKey.startsWith("kgx_test_")) {
    throw new ApiError(401, "Invalid API key format. Keys start with kgx_live_ or kgx_test_");
  }

  const supabase = createServiceClient();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("api_key", apiKey)
    .single();

  if (error || !profile) {
    throw new ApiError(401, "Invalid API key");
  }

  // Allow caller to override channel via header (e.g. web dashboard sends X-Channel: web)
  const channelOverride = request.headers.get("X-Channel") as AccessChannel | null;
  const resolvedChannel: AccessChannel =
    channelOverride && ["web", "api", "mcp"].includes(channelOverride)
      ? channelOverride
      : channel;

  return { user: profile as Profile, channel: resolvedChannel };
}

export function checkCredits(user: Profile, requiredCredits: number): void {
  if (user.credits_balance < requiredCredits) {
    throw new ApiError(
      402,
      `Insufficient credits. Required: ${requiredCredits}, Available: ${user.credits_balance}. Purchase more at https://kognitrix.vercel.app/dashboard/billing`
    );
  }
}

const MAX_TEXT_INPUT_LENGTH = 50_000; // ~12,500 tokens
const MAX_PROMPT_LENGTH = 10_000; // ~2,500 tokens

export function validateInput(
  body: Record<string, unknown>,
  type: "prompt" | "text"
): void {
  const field = type === "prompt" ? "prompt" : "text";
  const value = body[field];
  const maxLen = type === "prompt" ? MAX_PROMPT_LENGTH : MAX_TEXT_INPUT_LENGTH;

  if (!value || typeof value !== "string") {
    throw new ApiError(400, `Missing required field: ${field} (string)`);
  }

  if (value.length > maxLen) {
    throw new ApiError(
      400,
      `${field} exceeds maximum length of ${maxLen.toLocaleString()} characters`
    );
  }

  // Reject null bytes which can cause issues in some systems
  if (value.includes("\0")) {
    throw new ApiError(400, `${field} contains invalid characters`);
  }
}

// In-memory rate limiter — per-instance sliding window
// For multi-instance production, replace with Redis/Upstash
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

// Clean up expired entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, val] of rateLimitStore) {
    if (val.resetAt < now) rateLimitStore.delete(key);
  }
}, 60_000);

export function checkRateLimit(user: Profile): void {
  const plan = PLANS[user.plan_type];
  if (!plan) return;

  const key = `rate:${user.id}`;
  const now = Date.now();
  const windowMs = 60_000; // 1 minute window

  const entry = rateLimitStore.get(key);

  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return;
  }

  entry.count++;

  if (entry.count > plan.requests_per_min) {
    throw new ApiError(
      429,
      `Rate limit exceeded. Your plan allows ${plan.requests_per_min} requests/minute. Upgrade at https://kognitrix.vercel.app/dashboard/billing`
    );
  }
}

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = "ApiError";
  }
}

const SECURITY_HEADERS: Record<string, string> = {
  "X-Content-Type-Options": "nosniff",
  "X-Frame-Options": "DENY",
  "X-XSS-Protection": "1; mode=block",
  "Referrer-Policy": "strict-origin-when-cross-origin",
  "Permissions-Policy": "camera=(), microphone=(), geolocation=()",
};

export function secureJson(data: unknown, status = 200) {
  return Response.json(data, {
    status,
    headers: SECURITY_HEADERS,
  });
}

export function errorResponse(error: unknown) {
  if (error instanceof ApiError) {
    return Response.json(
      { success: false, error: error.message },
      { status: error.status, headers: SECURITY_HEADERS }
    );
  }
  // Don't leak internal error details to clients
  console.error("Unexpected error:", error);
  return Response.json(
    { success: false, error: "Internal server error" },
    { status: 500, headers: SECURITY_HEADERS }
  );
}
