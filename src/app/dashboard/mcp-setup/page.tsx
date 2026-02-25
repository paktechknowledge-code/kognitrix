"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plug, Copy, Check, Terminal, Zap } from "lucide-react";

export default function McpSetupPage() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState("");
  const [copiedConfig, setCopiedConfig] = useState(false);
  const [copiedEndpoint, setCopiedEndpoint] = useState(false);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchKey() {
      const supabase = createClient();
      const { data } = await supabase
        .from("profiles")
        .select("api_key")
        .eq("id", user!.id)
        .single();
      if (data) setApiKey(data.api_key);
    }

    fetchKey();
  }, [user?.id]);

  const mcpEndpoint = "https://kognitrix.com/api/mcp";

  const mcpConfig = JSON.stringify(
    {
      mcpServers: {
        "kognitrix-ai": {
          url: mcpEndpoint,
          headers: {
            Authorization: `Bearer ${apiKey || "YOUR_API_KEY"}`,
          },
        },
      },
    },
    null,
    2
  );

  const copyConfig = () => {
    navigator.clipboard.writeText(mcpConfig);
    setCopiedConfig(true);
    setTimeout(() => setCopiedConfig(false), 2000);
  };

  const copyEndpoint = () => {
    navigator.clipboard.writeText(mcpEndpoint);
    setCopiedEndpoint(true);
    setTimeout(() => setCopiedEndpoint(false), 2000);
  };

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">MCP Server Setup</h1>
        <p className="text-muted-foreground">
          Connect AI agents like Claude Code, Cursor, or custom agents to Kognitrix via MCP (Model Context Protocol).
        </p>
      </div>

      {/* What is MCP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plug className="w-5 h-5" />
            What is MCP?
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>
            MCP (Model Context Protocol) allows AI agents to discover and use tools natively.
            Instead of making REST API calls, agents connect to our MCP server and can use all 6
            Kognitrix AI services as native tools.
          </p>
          <p>
            This means Claude Code, Cursor, or any MCP-compatible agent can generate content,
            code, images, and more — directly through their tool-use interface.
          </p>
        </CardContent>
      </Card>

      {/* MCP Endpoint */}
      <Card>
        <CardHeader>
          <CardTitle>MCP Endpoint</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm">
              {mcpEndpoint}
            </div>
            <Button variant="ghost" size="sm" onClick={copyEndpoint}>
              {copiedEndpoint ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Terminal className="w-5 h-5" />
            Agent Configuration
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Add this configuration to your AI agent&apos;s MCP settings:
          </p>

          <div className="relative">
            <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs overflow-x-auto">
              {mcpConfig}
            </pre>
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-2 right-2"
              onClick={copyConfig}
            >
              {copiedConfig ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Available tools */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Available MCP Tools
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { name: "generate_content", desc: "Generate blog posts, articles, marketing copy", credits: 5 },
              { name: "generate_code", desc: "Generate, debug, refactor, or review code", credits: 8 },
              { name: "generate_image", desc: "Create images with DALL-E 3", credits: 10 },
              { name: "analyze_document", desc: "Summarize, extract, or analyze documents", credits: 6 },
              { name: "extract_data", desc: "Extract structured data from text", credits: 4 },
              { name: "translate_text", desc: "Translate text between 50+ languages", credits: 3 },
              { name: "check_credits", desc: "Check your credit balance", credits: 0 },
              { name: "list_services", desc: "List all available services", credits: 0 },
            ].map((tool) => (
              <div
                key={tool.name}
                className="flex items-center justify-between p-3 rounded-lg border border-border hover:bg-secondary/30"
              >
                <div>
                  <code className="text-sm font-medium text-primary">{tool.name}</code>
                  <p className="text-xs text-muted-foreground mt-0.5">{tool.desc}</p>
                </div>
                {tool.credits > 0 && (
                  <Badge variant="outline" className="text-xs">
                    {tool.credits} credits
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
