"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { useCredits, broadcastCreditsUpdate } from "@/hooks/useCredits";
import { useEffect } from "react";
import { SERVICES_CONFIG } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2, Copy, Check } from "lucide-react";
import Link from "next/link";

export default function ServicePlaygroundPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const service = SERVICES_CONFIG.find((s) => s.slug === slug);

  const { user } = useUser();
  const { balance, fetchBalance } = useCredits(user?.id);

  const [prompt, setPrompt] = useState("");
  const [extraField, setExtraField] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string>("");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  if (!service) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Service Not Found</h1>
        <Link href="/dashboard/services">
          <Button variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
          </Button>
        </Link>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setError("");
    setResult("");

    try {
      let body: Record<string, unknown> = {};

      switch (slug) {
        case "content-generator":
          body = { prompt, type: extraField || "blog" };
          break;
        case "code-assistant":
          body = { prompt, language: extraField || undefined };
          break;
        case "image-generator":
          body = { prompt, size: "1024x1024" };
          break;
        case "document-analyzer":
          body = { text: prompt, action: extraField || "summarize" };
          break;
        case "data-extractor":
          body = { text: prompt };
          break;
        case "translator":
          body = { text: prompt, target_language: extraField || "Spanish" };
          break;
      }

      const res = await fetch(service.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${(await getApiKey())}`,
          "X-Channel": "web",
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Request failed");
      } else {
        setResult(JSON.stringify(data.data, null, 2));
        broadcastCreditsUpdate();
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  async function getApiKey() {
    const { createClient } = await import("@/lib/supabase/client");
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("api_key")
      .eq("id", user?.id)
      .single();
    return data?.api_key || "";
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getExtraFieldConfig = () => {
    switch (slug) {
      case "content-generator":
        return { label: "Content Type", placeholder: "blog, social, marketing, article, email" };
      case "code-assistant":
        return { label: "Language", placeholder: "python, javascript, typescript, etc." };
      case "document-analyzer":
        return { label: "Action", placeholder: "summarize, extract, analyze, qa" };
      case "translator":
        return { label: "Target Language", placeholder: "Spanish, French, German, etc." };
      default:
        return null;
    }
  };

  const extraConfig = getExtraFieldConfig();

  return (
    <div className="space-y-6 max-w-4xl">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/services">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="w-4 h-4 mr-1" /> Back
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">{service.name}</h1>
          <p className="text-muted-foreground">{service.short_description}</p>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Badge variant="outline">{service.credit_cost} credits per request</Badge>
        <Badge variant="secondary">Balance: {balance} credits</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Try it out</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {slug === "document-analyzer" || slug === "data-extractor" || slug === "translator"
                ? "Input Text"
                : "Prompt"}
            </label>
            <textarea
              className="w-full min-h-[120px] p-3 rounded-lg bg-secondary/50 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
              placeholder={
                slug === "content-generator"
                  ? "Write a blog post about the future of AI..."
                  : slug === "code-assistant"
                  ? "Create a React hook for debouncing..."
                  : slug === "image-generator"
                  ? "A futuristic city skyline at sunset..."
                  : slug === "document-analyzer"
                  ? "Paste your document text here..."
                  : slug === "data-extractor"
                  ? "Paste unstructured text to extract data from..."
                  : "Enter text to translate..."
              }
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
          </div>

          {extraConfig && (
            <div>
              <label className="text-sm font-medium mb-2 block">
                {extraConfig.label}
              </label>
              <Input
                placeholder={extraConfig.placeholder}
                value={extraField}
                onChange={(e) => setExtraField(e.target.value)}
              />
            </div>
          )}

          <Button
            variant="gradient"
            className="w-full"
            onClick={handleSubmit}
            disabled={loading || !prompt.trim() || balance < service.credit_cost}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...
              </>
            ) : balance < service.credit_cost ? (
              "Insufficient Credits"
            ) : (
              `Generate (${service.credit_cost} credits)`
            )}
          </Button>

          {error && (
            <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
              {error}
            </div>
          )}

          {result && (
            <div className="relative">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Result</span>
                <Button variant="ghost" size="sm" onClick={handleCopy}>
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </Button>
              </div>
              <pre className="p-4 rounded-lg bg-secondary/50 border border-border text-sm overflow-auto max-h-[400px] whitespace-pre-wrap">
                {result}
              </pre>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
