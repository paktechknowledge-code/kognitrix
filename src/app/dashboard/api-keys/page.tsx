"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/lib/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Copy, Check, RefreshCw, Eye, EyeOff, AlertTriangle } from "lucide-react";

export default function ApiKeysPage() {
  const { user } = useUser();
  const [apiKey, setApiKey] = useState<string>("");
  const [revealed, setRevealed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [regenerating, setRegenerating] = useState(false);

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

  const handleCopy = () => {
    navigator.clipboard.writeText(apiKey);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRegenerate = async () => {
    if (!confirm("Are you sure? This will invalidate your current API key. All integrations using the old key will stop working.")) {
      return;
    }

    setRegenerating(true);
    try {
      const supabase = createClient();
      // Use cryptographically secure random values
      const bytes = new Uint8Array(32);
      crypto.getRandomValues(bytes);
      const hex = Array.from(bytes)
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");
      const key = `kgx_live_${hex}`;

      await supabase
        .from("profiles")
        .update({ api_key: key, api_key_created_at: new Date().toISOString() })
        .eq("id", user!.id);

      setApiKey(key);
    } finally {
      setRegenerating(false);
    }
  };

  const maskedKey = apiKey
    ? apiKey.substring(0, 12) + "•".repeat(20) + apiKey.substring(apiKey.length - 4)
    : "";

  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-2xl font-bold">API Keys</h1>
        <p className="text-muted-foreground">
          Manage your API key for REST API and MCP server access.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="w-5 h-5" />
            Your API Key
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 p-3 rounded-lg bg-secondary/50 border border-border font-mono text-sm overflow-hidden">
              {revealed ? apiKey : maskedKey}
            </div>
            <Button variant="ghost" size="sm" onClick={() => setRevealed(!revealed)}>
              {revealed ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </Button>
            <Button variant="ghost" size="sm" onClick={handleCopy}>
              {copied ? (
                <Check className="w-4 h-4 text-emerald-500" />
              ) : (
                <Copy className="w-4 h-4" />
              )}
            </Button>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleRegenerate}
              disabled={regenerating}
            >
              <RefreshCw className={`w-4 h-4 mr-2 ${regenerating ? "animate-spin" : ""}`} />
              Regenerate Key
            </Button>
            <div className="flex items-center gap-2 text-xs text-amber-500">
              <AlertTriangle className="w-3 h-3" />
              This will invalidate your current key
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Usage examples */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Start</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">cURL</Badge>
            </h3>
            <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs overflow-x-auto">
{`curl -X POST https://kognitrix.com/api/v1/generate/content \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"prompt": "Write a blog post about AI"}'`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">Python</Badge>
            </h3>
            <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs overflow-x-auto">
{`import requests

response = requests.post(
    "https://kognitrix.com/api/v1/generate/content",
    headers={"Authorization": "Bearer YOUR_API_KEY"},
    json={"prompt": "Write a blog post about AI"}
)
print(response.json())`}
            </pre>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-2 flex items-center gap-2">
              <Badge variant="outline">JavaScript</Badge>
            </h3>
            <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-xs overflow-x-auto">
{`const res = await fetch("https://kognitrix.com/api/v1/generate/content", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_API_KEY",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ prompt: "Write a blog post about AI" }),
});
const data = await res.json();`}
            </pre>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
