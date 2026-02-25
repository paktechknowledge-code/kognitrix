"use client";

import { useState } from "react";
import Link from "next/link";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Zap, FileText, Code, FileSearch, ImageIcon, Database, Languages,
  ArrowRight, Globe, Terminal, Plug, Check, ChevronDown, Sparkles,
  CreditCard, BarChart3, Shield, Bot, Cpu, Activity,
} from "lucide-react";

const services = [
  { icon: FileText, name: "AI Content Generator", desc: "Blog posts, articles, social media, marketing copy", credits: 5 },
  { icon: Code, name: "AI Code Assistant", desc: "Code generation, debugging, refactoring, review", credits: 8 },
  { icon: FileSearch, name: "AI Document Analyzer", desc: "Summarize, extract, analyze documents & contracts", credits: 6 },
  { icon: ImageIcon, name: "AI Image Generator", desc: "DALL-E powered image creation for marketing & design", credits: 10 },
  { icon: Database, name: "AI Data Extractor", desc: "Structured data extraction from unstructured text", credits: 4 },
  { icon: Languages, name: "AI Translator", desc: "Multi-language translation with context awareness", credits: 3 },
];

const faqs = [
  { q: "Who can use Kognitrix AI?", a: "Anyone — human developers, businesses, and AI agents. All customers get access to the Web dashboard, REST API, and MCP server." },
  { q: "Do I need a subscription?", a: "No. You can buy one-time credit packs starting at $8 for 100 credits. Subscriptions are optional and give you monthly credit allowances at better rates." },
  { q: "How does MCP access work?", a: "AI agents (like Claude Code) can connect directly to our MCP server. Add our endpoint to your agent's MCP config, authenticate with your API key, and the agent can discover and use all services natively." },
  { q: "What happens if a service fails?", a: "Credits are automatically refunded for server errors. If a request fails due to our infrastructure, you won't be charged." },
  { q: "Can AI agents sign up and pay?", a: "Yes. AI agents can create accounts, purchase credits via our API, and consume services. We support agent-to-agent commerce." },
  { q: "What AI models power the services?", a: "We use OpenAI's GPT-4o for text services and DALL-E 3 for image generation. We continuously evaluate and upgrade to the best available models." },
];

export default function HomePage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Navbar />
      <main className="dark">
        {/* Hero */}
        <section className="relative pt-32 pb-24 overflow-hidden">
          {/* Grid background */}
          <div className="absolute inset-0 grid-bg" />
          {/* Gradient orbs */}
          <div className="absolute top-20 left-1/4 w-[500px] h-[500px] bg-cyan-500/8 rounded-full blur-[120px]" />
          <div className="absolute top-40 right-1/4 w-[400px] h-[400px] bg-emerald-500/8 rounded-full blur-[100px]" />

          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge variant="secondary" className="mb-6 mono text-xs border-primary/20 bg-primary/5">
              <Activity className="w-3 h-3 mr-1.5 text-emerald-400" /> System Online &mdash; 50 Free Credits on Signup
            </Badge>
            <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
              Intelligence-as-a-Service{" "}
              <br className="hidden sm:block" />
              <span className="gradient-text">for Humans & Agents</span>
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto mb-10 leading-relaxed">
              6 powerful AI services accessible via Web Dashboard, REST API, and MCP Server.
              Pay per use. No subscriptions required. Built for developers and AI agents alike.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12">
              <Button variant="gradient" size="xl" asChild>
                <Link href="/signup">
                  <Bot className="w-5 h-5 mr-1" />
                  Get Started Free
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/docs">
                  <Terminal className="w-5 h-5 mr-1.5" />
                  View API Docs
                </Link>
              </Button>
            </div>

            {/* Access channels */}
            <div className="flex flex-wrap justify-center gap-8 text-sm text-muted-foreground">
              <span className="flex items-center gap-2 mono">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_6px_theme(colors.cyan.400)]" />
                <Globe className="w-4 h-4 text-cyan-400" /> Web Dashboard
              </span>
              <span className="flex items-center gap-2 mono">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_6px_theme(colors.emerald.400)]" />
                <Terminal className="w-4 h-4 text-emerald-400" /> REST API
              </span>
              <span className="flex items-center gap-2 mono">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 shadow-[0_0_6px_theme(colors.green.400)]" />
                <Plug className="w-4 h-4 text-green-400" /> MCP Server
              </span>
            </div>
          </div>
        </section>

        {/* Terminal Preview */}
        <section className="py-8 -mt-8">
          <div className="max-w-3xl mx-auto px-4">
            <div className="glass rounded-xl overflow-hidden glow-sm">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                <span className="w-3 h-3 rounded-full bg-red-500/60" />
                <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
                <span className="w-3 h-3 rounded-full bg-green-500/60" />
                <span className="text-xs text-muted-foreground mono ml-2">kognitrix-api</span>
              </div>
              <div className="p-5 mono text-sm space-y-2">
                <div className="text-muted-foreground">
                  <span className="text-cyan-400">$</span> curl -X POST https://kognitrix.com/api/v1/generate/content \
                </div>
                <div className="text-muted-foreground pl-4">
                  -H &quot;Authorization: Bearer kgx_live_...&quot; \
                </div>
                <div className="text-muted-foreground pl-4">
                  -d &apos;{`{"prompt": "Write a product launch email", "tone": "professional"}`}&apos;
                </div>
                <div className="mt-3 pt-3 border-t border-border/20">
                  <span className="text-emerald-400">{"{"}</span>
                  <span className="text-foreground/80"> &quot;success&quot;: </span>
                  <span className="text-green-400">true</span>
                  <span className="text-foreground/80">, &quot;credits_used&quot;: </span>
                  <span className="text-cyan-400">5</span>
                  <span className="text-foreground/80">, &quot;credits_remaining&quot;: </span>
                  <span className="text-cyan-400">45</span>
                  <span className="text-emerald-400"> {"}"}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Bar */}
        <section className="border-y border-border/30 glass py-10 mt-8">
          <div className="max-w-5xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { val: "50", label: "Free credits on signup" },
              { val: "6", label: "AI services" },
              { val: "3", label: "Access channels" },
              { val: "60%+", label: "Cost savings vs direct API" },
            ].map((s) => (
              <div key={s.label}>
                <div className="text-3xl font-bold gradient-text mono">{s.val}</div>
                <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Services */}
        <section className="py-24 relative">
          <div className="absolute inset-0 grid-bg opacity-30" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 mono text-xs border-primary/20 bg-primary/5">
                <Cpu className="w-3 h-3 mr-1.5" /> Services
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Powerful AI Services</h2>
              <p className="text-muted-foreground max-w-xl mx-auto">Every service works via Web, API, and MCP. Same quality, same pricing.</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((s) => (
                <Card key={s.name} className="group hover:border-primary/40 hover:glow-sm neon-border">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20 group-hover:glow-sm transition-all">
                        <s.icon className="w-5 h-5 text-primary" />
                      </div>
                      <Badge variant="outline" className="text-xs mono border-primary/20">{s.credits} credits</Badge>
                    </div>
                    <h3 className="font-semibold mb-2">{s.name}</h3>
                    <p className="text-sm text-muted-foreground">{s.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 glass" />
          <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 mono text-xs border-primary/20 bg-primary/5">
                <Zap className="w-3 h-3 mr-1.5" /> Workflow
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">How It Works</h2>
              <p className="text-muted-foreground">Three steps. Three access channels. Unlimited possibilities.</p>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { step: "01", icon: CreditCard, title: "Sign Up & Get Credits", desc: "Create a free account, get 50 credits instantly. Buy more credits or subscribe anytime." },
                { step: "02", icon: Zap, title: "Choose Your Channel", desc: "Use services via the web dashboard, call our REST API from code, or connect via MCP from your AI agent." },
                { step: "03", icon: BarChart3, title: "Get Results & Scale", desc: "Receive high-quality AI outputs. Track usage, monitor costs, and scale with your needs." },
              ].map((s) => (
                <div key={s.step} className="text-center group">
                  <div className="text-5xl font-bold text-primary/15 mb-4 mono">{s.step}</div>
                  <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4 group-hover:glow-sm transition-all">
                    <s.icon className="w-7 h-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-24 relative">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <Badge variant="secondary" className="mb-4 mono text-xs border-primary/20 bg-primary/5">
                <CreditCard className="w-3 h-3 mr-1.5" /> Pricing
              </Badge>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Simple, Transparent Pricing</h2>
              <p className="text-muted-foreground">Start free. Pay as you grow. No hidden fees.</p>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {[
                { name: "Free Trial", price: "$0", credits: "50 credits", features: ["All 6 services", "Web + API + MCP", "5 req/min"], popular: false },
                { name: "Starter", price: "$29/mo", credits: "500 credits/mo", features: ["All 6 services", "30 req/min", "Email support"], popular: false },
                { name: "Pro", price: "$79/mo", credits: "1,500 credits/mo", features: ["All 6 services", "60 req/min", "Priority support"], popular: true },
              ].map((p) => (
                <Card key={p.name} className={`relative ${p.popular ? "border-primary/50 glow-sm" : ""}`}>
                  {p.popular && <div className="absolute -top-3 left-1/2 -translate-x-1/2"><Badge className="gradient-bg border-0 shadow-lg shadow-primary/20">Most Popular</Badge></div>}
                  <CardContent className="p-6">
                    <h3 className="font-semibold mb-1 mono text-sm">{p.name}</h3>
                    <div className="text-3xl font-bold mb-1">{p.price}</div>
                    <p className="text-sm text-primary mono mb-4">{p.credits}</p>
                    <ul className="space-y-2 mb-6">
                      {p.features.map((f) => (
                        <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                          <Check className="w-4 h-4 text-emerald-500" /> {f}
                        </li>
                      ))}
                    </ul>
                    <Button variant={p.popular ? "gradient" : "outline"} className="w-full" asChild>
                      <Link href="/signup">Get Started</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mono">
              Or buy credit packs: <Link href="/pricing" className="text-primary hover:underline">100 for $8 &bull; 500 for $35 &bull; 1,000 for $60 &bull; 2,000 for $100</Link>
            </p>
          </div>
        </section>

        {/* Security */}
        <section className="py-20 relative overflow-hidden">
          <div className="absolute inset-0 glass" />
          <div className="relative max-w-5xl mx-auto px-4 text-center">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-6 pulse-glow">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-3">Secure & Private</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Encrypted data at rest, Row Level Security on all tables, TLS on all connections.
              We never sell your data. GDPR and CCPA compliant.
            </p>
            <div className="flex flex-wrap justify-center gap-6 mt-8 mono text-xs text-muted-foreground">
              {["HMAC-SHA256 Webhooks", "Timing-Safe Auth", "Row Level Security", "HSTS Enforced"].map((item) => (
                <span key={item} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/30 bg-secondary/30">
                  <Check className="w-3 h-3 text-emerald-500" /> {item}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-24 relative">
          <div className="absolute inset-0 grid-bg opacity-20" />
          <div className="relative max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-3">
              {faqs.map((faq, i) => (
                <div key={i} className="border border-border/30 rounded-xl overflow-hidden glass">
                  <button
                    className="w-full flex items-center justify-between p-5 text-left hover:bg-primary/5 transition-colors"
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  >
                    <span className="font-medium pr-4">{faq.q}</span>
                    <ChevronDown className={`w-5 h-5 text-muted-foreground shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} />
                  </button>
                  {openFaq === i && (
                    <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed">{faq.a}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-24 relative overflow-hidden">
          <div className="absolute inset-0 gradient-bg opacity-5" />
          <div className="absolute inset-0 grid-bg" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px]" />
          <div className="relative max-w-3xl mx-auto px-4 text-center">
            <h2 className="text-3xl sm:text-5xl font-bold mb-4">
              Start Building with{" "}
              <span className="gradient-text">Kognitrix AI</span>
            </h2>
            <p className="text-lg text-muted-foreground mb-10">
              50 free credits. 6 AI services. 3 access channels. Zero risk.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button variant="gradient" size="xl" asChild>
                <Link href="/signup">
                  <Sparkles className="w-5 h-5 mr-1" />
                  Create Free Account
                  <ArrowRight className="w-5 h-5 ml-1" />
                </Link>
              </Button>
              <Button variant="outline" size="xl" asChild>
                <Link href="/docs">
                  <Terminal className="w-5 h-5 mr-1.5" />
                  Read the Docs
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
