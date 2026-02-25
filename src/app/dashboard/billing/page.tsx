"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { useCredits } from "@/context/CreditsContext";
import { createClient } from "@/lib/supabase/client";
import { CREDIT_PACKS, PLANS } from "@/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, CreditCard, Zap, ExternalLink } from "lucide-react";

interface Transaction {
  id: string;
  type: string;
  amount_usd: number;
  credits_added: number;
  status: string;
  created_at: string;
}

export default function BillingPage() {
  const { user, profile } = useUser();
  const { balance, fetchBalance } = useCredits();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    fetchBalance();
  }, [fetchBalance]);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchTransactions() {
      const supabase = createClient();
      const { data } = await supabase
        .from("transactions")
        .select("id, type, amount_usd, credits_added, status, created_at")
        .eq("user_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(20);
      setTransactions(data ?? []);
    }

    fetchTransactions();
  }, [user?.id]);

  const buildCheckoutUrl = (variantId: string) => {
    const storeSlug = "kognitrix";
    return `https://${storeSlug}.lemonsqueezy.com/checkout/buy/${variantId}?checkout[custom][user_id]=${user!.id}&checkout[email]=${encodeURIComponent(user!.email!)}&checkout[custom][source]=dashboard`;
  };

  const handleBuyPack = (packId: string) => {
    const pack = CREDIT_PACKS.find((p) => p.id === packId);
    if (!pack?.lemon_squeezy_variant_id) {
      alert("Payment not configured yet. Please try again later.");
      return;
    }
    window.open(buildCheckoutUrl(pack.lemon_squeezy_variant_id), "_blank");
  };

  const handleSubscribe = (planType: string) => {
    const plan = PLANS[planType];
    if (!plan?.lemon_squeezy_variant_id) {
      alert("Payment not configured yet. Please try again later.");
      return;
    }
    window.open(buildCheckoutUrl(plan.lemon_squeezy_variant_id), "_blank");
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Billing & Credits</h1>
        <p className="text-muted-foreground">
          Manage your credits, subscriptions, and payment history.
        </p>
      </div>

      {/* Current balance */}
      <Card className="border-primary/50">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Current Balance</div>
              <div className="text-4xl font-bold gradient-text">{balance} credits</div>
              <div className="text-sm text-muted-foreground mt-1">
                Plan: <Badge variant="secondary">{profile?.plan_type?.replace("_", " ") || "Free Trial"}</Badge>
              </div>
            </div>
            <CreditCard className="w-12 h-12 text-primary/30" />
          </div>
        </CardContent>
      </Card>

      {/* Credit Packs */}
      <div>
        <h2 className="text-xl font-bold mb-4">Buy Credit Packs</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {CREDIT_PACKS.map((pack) => (
            <Card key={pack.id} className="hover:border-primary/50 transition-colors">
              <CardContent className="p-5 text-center">
                <div className="text-2xl font-bold mb-1">{pack.credits}</div>
                <div className="text-sm text-muted-foreground mb-3">credits</div>
                <div className="text-xl font-bold gradient-text mb-4">
                  ${pack.price_usd}
                </div>
                <div className="text-xs text-muted-foreground mb-4">
                  ${(pack.price_usd / pack.credits * 100).toFixed(1)}¢ per credit
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => handleBuyPack(pack.id)}
                >
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div>
        <h2 className="text-xl font-bold mb-4">Subscription Plans</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Object.entries(PLANS)
            .filter(([key]) => key !== "pay_as_you_go")
            .map(([key, plan]) => {
              const isCurrent = profile?.plan_type === key;
              return (
                <Card
                  key={key}
                  className={`relative ${isCurrent ? "border-primary" : ""}`}
                >
                  {isCurrent && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <Badge className="gradient-bg border-0">Current</Badge>
                    </div>
                  )}
                  <CardContent className="p-5">
                    <h3 className="font-semibold mb-1">{plan.name}</h3>
                    <div className="text-2xl font-bold mb-1">
                      {plan.price_usd === 0 ? "Free" : `$${plan.price_usd}/mo`}
                    </div>
                    <p className="text-sm text-primary mb-4">
                      {plan.credits_per_month} credits/mo
                    </p>
                    <ul className="space-y-2 mb-4">
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500" />
                        {plan.requests_per_min} req/min
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500" />
                        {plan.requests_per_day} req/day
                      </li>
                      <li className="text-sm text-muted-foreground flex items-center gap-2">
                        <Check className="w-3 h-3 text-emerald-500" />
                        All 6 services
                      </li>
                    </ul>
                    <Button
                      variant={isCurrent ? "outline" : "gradient"}
                      className="w-full"
                      disabled={isCurrent}
                      onClick={() => handleSubscribe(key)}
                    >
                      {isCurrent ? "Current Plan" : "Subscribe"}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
        </div>
      </div>

      {/* Transaction History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5" />
            Transaction History
          </CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No transactions yet.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Type</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Amount</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Credits</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx.id} className="border-b border-border/50">
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">
                          {tx.type.replace("_", " ")}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 font-medium">${tx.amount_usd.toFixed(2)}</td>
                      <td className="py-3 px-2 text-emerald-500">+{tx.credits_added}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={tx.status === "completed" ? "success" : tx.status === "refunded" ? "destructive" : "secondary"}
                          className="text-xs"
                        >
                          {tx.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {new Date(tx.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
