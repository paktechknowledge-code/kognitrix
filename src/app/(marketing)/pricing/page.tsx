import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Check, Zap } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description: "Kognitrix AI pricing — affordable pay-per-use credits and monthly plans. Start free with 50 credits.",
};

const plans = [
  {
    name: "Free Trial",
    price: "$0",
    period: "one-time",
    credits: "50 credits",
    description: "Try all services risk-free",
    features: ["All 6 AI services", "Web + API + MCP access", "5 req/min rate limit", "50 requests/day"],
    cta: "Get Started Free",
    popular: false,
  },
  {
    name: "Starter",
    price: "$29",
    period: "/month",
    credits: "500 credits/mo",
    description: "For individuals and small teams",
    features: ["All 6 AI services", "Web + API + MCP access", "30 req/min rate limit", "1,000 requests/day", "Email support"],
    cta: "Subscribe",
    popular: false,
  },
  {
    name: "Pro",
    price: "$79",
    period: "/month",
    credits: "1,500 credits/mo",
    description: "For growing businesses",
    features: ["All 6 AI services", "Web + API + MCP access", "60 req/min rate limit", "5,000 requests/day", "Priority support", "Usage analytics"],
    cta: "Subscribe",
    popular: true,
  },
];

const creditPacks = [
  { name: "Starter Pack", credits: 100, price: 8 },
  { name: "Growth Pack", credits: 500, price: 35 },
  { name: "Pro Pack", credits: 1000, price: 60 },
  { name: "Mega Pack", credits: 2000, price: 100 },
];

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Badge variant="secondary" className="mb-4">Simple Pricing</Badge>
            <h1 className="text-4xl font-bold mb-4">
              Pay for what you use. <span className="gradient-text">Nothing more.</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Start free with 50 credits. Buy credit packs or subscribe for monthly allowances. Same pricing for humans and AI agents.
            </p>
          </div>

          {/* Monthly Plans */}
          <h2 className="text-2xl font-bold mb-6 text-center">Monthly Plans</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
            {plans.map((plan) => (
              <Card key={plan.name} className={`relative ${plan.popular ? "border-primary shadow-lg shadow-primary/10" : ""}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <Badge className="gradient-bg border-0">Most Popular</Badge>
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                  <CardDescription>{plan.description}</CardDescription>
                  <div className="pt-2">
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-muted-foreground">{plan.period}</span>
                  </div>
                  <p className="text-sm text-primary font-medium">{plan.credits}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((f) => (
                      <li key={f} className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-4 h-4 text-emerald-500 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={plan.popular ? "gradient" : "outline"}
                    className="w-full"
                    asChild
                  >
                    <Link href="/signup">{plan.cta}</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Credit Packs */}
          <h2 className="text-2xl font-bold mb-6 text-center">Credit Packs (One-Time)</h2>
          <p className="text-center text-muted-foreground mb-8">No subscription needed. Buy credits when you need them.</p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {creditPacks.map((pack) => (
              <Card key={pack.name} className="text-center">
                <CardContent className="pt-6">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Zap className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-1">{pack.name}</h3>
                  <p className="text-2xl font-bold mb-1">${pack.price}</p>
                  <p className="text-sm text-primary mb-1">{pack.credits.toLocaleString()} credits</p>
                  <p className="text-xs text-muted-foreground mb-4">
                    ${(pack.price / pack.credits).toFixed(2)}/credit
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <Link href="/signup">Buy Now</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Credit Costs */}
          <h2 className="text-2xl font-bold mb-6 text-center">Service Credit Costs</h2>
          <div className="max-w-2xl mx-auto">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-3 font-semibold">Service</th>
                    <th className="text-right p-3 font-semibold">Credits/Request</th>
                    <th className="text-right p-3 font-semibold">~Cost (Pro Pack)</th>
                  </tr>
                </thead>
                <tbody className="text-muted-foreground">
                  {[
                    { name: "AI Translator", credits: 3, cost: 0.18 },
                    { name: "AI Data Extractor", credits: 4, cost: 0.24 },
                    { name: "AI Content Generator", credits: 5, cost: 0.30 },
                    { name: "AI Document Analyzer", credits: 6, cost: 0.36 },
                    { name: "AI Code Assistant", credits: 8, cost: 0.48 },
                    { name: "AI Image Generator", credits: 10, cost: 0.60 },
                  ].map((s) => (
                    <tr key={s.name} className="border-b border-border">
                      <td className="p-3">{s.name}</td>
                      <td className="p-3 text-right">{s.credits} credits</td>
                      <td className="p-3 text-right">${s.cost.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
