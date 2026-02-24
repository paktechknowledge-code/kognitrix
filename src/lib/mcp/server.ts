import { MCP_TOOLS } from "./tools";
import { authenticateApiRequest, checkCredits, ApiError } from "@/lib/api-auth";
import { deductCredits } from "@/lib/credits";
import { createServiceClient } from "@/lib/supabase/server";
import { generateContent } from "@/lib/openai/services/content";
import { generateCode } from "@/lib/openai/services/code";
import { generateImage } from "@/lib/openai/services/image";
import { analyzeDocument } from "@/lib/openai/services/document";
import { extractData } from "@/lib/openai/services/extract";
import { translateText } from "@/lib/openai/services/translate";
import type { Profile } from "@/types";

interface McpRequest {
  jsonrpc: "2.0";
  id: number | string;
  method: string;
  params?: Record<string, unknown>;
}

interface McpResponse {
  jsonrpc: "2.0";
  id: number | string;
  result?: unknown;
  error?: { code: number; message: string };
}

export async function handleMcpRequest(
  request: McpRequest,
  user: Profile,
  ip: string
): Promise<McpResponse> {
  const { id, method, params } = request;

  try {
    switch (method) {
      case "initialize":
        return {
          jsonrpc: "2.0",
          id,
          result: {
            protocolVersion: "2024-11-05",
            capabilities: { tools: {} },
            serverInfo: {
              name: "kognitrix-ai",
              version: "1.0.0",
            },
          },
        };

      case "tools/list":
        return {
          jsonrpc: "2.0",
          id,
          result: { tools: MCP_TOOLS },
        };

      case "tools/call":
        return await handleToolCall(id, params as { name: string; arguments: Record<string, unknown> }, user, ip);

      default:
        return {
          jsonrpc: "2.0",
          id,
          error: { code: -32601, message: `Method not found: ${method}` },
        };
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal error";
    return {
      jsonrpc: "2.0",
      id,
      error: { code: -32603, message },
    };
  }
}

async function handleToolCall(
  id: number | string,
  params: { name: string; arguments: Record<string, unknown> },
  user: Profile,
  ip: string
): Promise<McpResponse> {
  const { name, arguments: args } = params;
  const supabase = createServiceClient();

  switch (name) {
    case "kognitrix_list_services": {
      const { data } = await supabase.from("services").select("*").eq("is_active", true);
      return { jsonrpc: "2.0", id, result: { content: [{ type: "text", text: JSON.stringify(data, null, 2) }] } };
    }

    case "kognitrix_check_credits": {
      return {
        jsonrpc: "2.0",
        id,
        result: {
          content: [{ type: "text", text: JSON.stringify({ credits_balance: user.credits_balance, plan: user.plan_type }) }],
        },
      };
    }

    case "kognitrix_generate_content": {
      return await executeService(id, "content-generator", 5, user, ip, async () => {
        return await generateContent(args as unknown as Parameters<typeof generateContent>[0]);
      });
    }

    case "kognitrix_generate_code": {
      return await executeService(id, "code-assistant", 8, user, ip, async () => {
        return await generateCode(args as unknown as Parameters<typeof generateCode>[0]);
      });
    }

    case "kognitrix_generate_image": {
      return await executeService(id, "image-generator", 10, user, ip, async () => {
        return await generateImage(args as unknown as Parameters<typeof generateImage>[0]);
      });
    }

    case "kognitrix_analyze_document": {
      return await executeService(id, "document-analyzer", 6, user, ip, async () => {
        return await analyzeDocument(args as unknown as Parameters<typeof analyzeDocument>[0]);
      });
    }

    case "kognitrix_extract_data": {
      return await executeService(id, "data-extractor", 4, user, ip, async () => {
        return await extractData(args as unknown as Parameters<typeof extractData>[0]);
      });
    }

    case "kognitrix_translate": {
      return await executeService(id, "translator", 3, user, ip, async () => {
        return await translateText(args as unknown as Parameters<typeof translateText>[0]);
      });
    }

    default:
      return { jsonrpc: "2.0", id, error: { code: -32601, message: `Unknown tool: ${name}` } };
  }
}

async function executeService(
  id: number | string,
  slug: string,
  creditCost: number,
  user: Profile,
  ip: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  serviceFn: () => Promise<{ result: any; tokens: number; cost: number }>
): Promise<McpResponse> {
  checkCredits(user, creditCost);

  const startTime = Date.now();
  const { result, tokens, cost } = await serviceFn();
  const latency = Date.now() - startTime;

  // Pass slug directly — credits.ts resolveServiceUuid handles slug→UUID lookup
  const { requestId, newBalance } = await deductCredits({
    userId: user.id,
    serviceId: slug,
    creditsUsed: creditCost,
    requestPayload: {},
    responseTokens: tokens,
    modelUsed: "gpt-4o",
    latencyMs: latency,
    status: "success",
    channel: "mcp",
    ipAddress: ip,
    costToUs: cost,
  });

  return {
    jsonrpc: "2.0",
    id,
    result: {
      content: [{
        type: "text",
        text: JSON.stringify({
          ...result,
          credits_used: creditCost,
          credits_remaining: newBalance,
          request_id: requestId,
        }, null, 2),
      }],
    },
  };
}
