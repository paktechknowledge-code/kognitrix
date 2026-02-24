// Dynamic client registration endpoint (RFC 7591)
// Required by Smithery to verify the auth server supports client registration
export async function POST() {
  return Response.json(
    {
      client_id: "kognitrix-mcp-client",
      client_name: "Kognitrix AI MCP",
      token_endpoint_auth_method: "none",
      grant_types: ["urn:ietf:params:oauth:grant-type:token-exchange"],
      response_types: ["code", "token"],
      redirect_uris: ["https://kognitrix.vercel.app/dashboard"],
    },
    {
      status: 201,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    },
  });
}
