// Tells MCP clients (Smithery, Claude Desktop, etc.) that this server
// uses Bearer token auth — not OAuth. Prevents 405 errors during discovery.
export async function GET() {
  return Response.json(
    {
      issuer: "https://kognitrix.vercel.app",
      authorization_endpoint: "https://kognitrix.vercel.app/dashboard",
      token_endpoint: "https://kognitrix.vercel.app/api/mcp",
      token_endpoint_auth_methods_supported: ["none"],
      grant_types_supported: ["urn:ietf:params:oauth:grant-type:token-exchange"],
      response_types_supported: ["token"],
      scopes_supported: [],
      bearer_token_instructions: "Get your API key from https://kognitrix.vercel.app/dashboard and pass it as: Authorization: Bearer kgx_live_...",
    },
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, OPTIONS",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
