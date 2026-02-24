import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "API & MCP Documentation",
  description: "Kognitrix AI API documentation — REST API and MCP server reference for humans and AI agents.",
};

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-2">API & MCP Documentation</h1>
        <p className="text-muted-foreground mb-8">
          Everything you need to integrate Kognitrix AI into your applications, scripts, and AI agent workflows.
        </p>

        {/* Auth */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Authentication</h2>
          <p className="text-muted-foreground mb-4">
            All API requests require an API key passed in the Authorization header. Get your key from the <a href="/dashboard/api-keys" className="text-primary hover:underline">API Keys page</a> in your dashboard.
          </p>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm mb-4">
            <code>{`Authorization: Bearer kgx_live_xxxxxxxxxxxx`}</code>
          </pre>
        </section>

        {/* Base URL */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Base URL</h2>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm">
            <code>{`https://kognitrix.vercel.app/api/v1`}</code>
          </pre>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Endpoints</h2>
          <div className="space-y-4">
            {[
              { method: "GET", path: "/services", desc: "List all available services", auth: false },
              { method: "GET", path: "/credits", desc: "Check your credit balance", auth: true },
              { method: "GET", path: "/usage", desc: "View usage history", auth: true },
              { method: "POST", path: "/generate/content", desc: "Generate content (5 credits)", auth: true },
              { method: "POST", path: "/generate/code", desc: "Generate/debug code (8 credits)", auth: true },
              { method: "POST", path: "/generate/image", desc: "Generate images (10 credits)", auth: true },
              { method: "POST", path: "/generate/document", desc: "Analyze documents (6 credits)", auth: true },
              { method: "POST", path: "/generate/extract", desc: "Extract structured data (4 credits)", auth: true },
              { method: "POST", path: "/generate/translate", desc: "Translate text (3 credits)", auth: true },
            ].map((ep) => (
              <div key={ep.path} className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50 border border-border">
                <Badge variant={ep.method === "GET" ? "success" : "default"} className="font-mono text-xs w-14 justify-center">
                  {ep.method}
                </Badge>
                <code className="text-sm font-mono text-primary">{ep.path}</code>
                <span className="text-sm text-muted-foreground flex-1">{ep.desc}</span>
                {ep.auth && <Badge variant="outline" className="text-xs">Auth</Badge>}
              </div>
            ))}
          </div>
        </section>

        {/* Example */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Quick Example</h2>

          <h3 className="text-lg font-semibold mb-2 mt-6">cURL</h3>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm mb-6">
            <code>{`curl -X POST https://kognitrix.vercel.app/api/v1/generate/content \\
  -H "Authorization: Bearer kgx_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "prompt": "Write a blog post about AI in 2026",
    "type": "blog",
    "tone": "professional"
  }'`}</code>
          </pre>

          <h3 className="text-lg font-semibold mb-2">Python</h3>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm mb-6">
            <code>{`import requests

response = requests.post(
    "https://kognitrix.vercel.app/api/v1/generate/content",
    headers={"Authorization": "Bearer kgx_live_your_key_here"},
    json={
        "prompt": "Write a blog post about AI in 2026",
        "type": "blog",
        "tone": "professional"
    }
)

data = response.json()
print(data["data"]["content"])
print(f"Credits remaining: {data['credits_remaining']}")`}</code>
          </pre>

          <h3 className="text-lg font-semibold mb-2">JavaScript</h3>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm mb-6">
            <code>{`const response = await fetch("https://kognitrix.vercel.app/api/v1/generate/content", {
  method: "POST",
  headers: {
    "Authorization": "Bearer kgx_live_your_key_here",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    prompt: "Write a blog post about AI in 2026",
    type: "blog",
    tone: "professional",
  }),
});

const data = await response.json();
console.log(data.data.content);
console.log("Credits remaining:", data.credits_remaining);`}</code>
          </pre>
        </section>

        {/* Response Format */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Response Format</h2>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm">
            <code>{`{
  "success": true,
  "data": {
    "content": "...",
    "word_count": 450,
    "tokens_used": 623
  },
  "credits_used": 5,
  "credits_remaining": 45,
  "request_id": "req_a1b2c3d4e5f6"
}`}</code>
          </pre>
        </section>

        {/* MCP */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">MCP Server (for AI Agents)</h2>
          <p className="text-muted-foreground mb-4">
            AI agents can connect to Kognitrix via the Model Context Protocol (MCP). Add this to your agent&apos;s MCP config:
          </p>
          <pre className="bg-secondary rounded-lg p-4 overflow-x-auto text-sm mb-4">
            <code>{`{
  "mcpServers": {
    "kognitrix": {
      "url": "https://kognitrix.vercel.app/api/mcp",
      "headers": {
        "Authorization": "Bearer kgx_live_your_key_here"
      }
    }
  }
}`}</code>
          </pre>
          <p className="text-muted-foreground mb-4">
            Available MCP tools: <code className="text-primary">kognitrix_generate_content</code>, <code className="text-primary">kognitrix_generate_code</code>, <code className="text-primary">kognitrix_generate_image</code>, <code className="text-primary">kognitrix_analyze_document</code>, <code className="text-primary">kognitrix_extract_data</code>, <code className="text-primary">kognitrix_translate</code>, <code className="text-primary">kognitrix_check_credits</code>, <code className="text-primary">kognitrix_list_services</code>.
          </p>
        </section>

        {/* Rate Limits */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Rate Limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-3 font-semibold">Plan</th>
                  <th className="text-left p-3 font-semibold">Requests/min</th>
                  <th className="text-left p-3 font-semibold">Requests/day</th>
                </tr>
              </thead>
              <tbody className="text-muted-foreground">
                <tr className="border-b border-border"><td className="p-3">Free Trial</td><td className="p-3">5</td><td className="p-3">50</td></tr>
                <tr className="border-b border-border"><td className="p-3">Starter</td><td className="p-3">30</td><td className="p-3">1,000</td></tr>
                <tr className="border-b border-border"><td className="p-3">Pro</td><td className="p-3">60</td><td className="p-3">5,000</td></tr>
                <tr><td className="p-3">Enterprise</td><td className="p-3">120</td><td className="p-3">20,000</td></tr>
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
