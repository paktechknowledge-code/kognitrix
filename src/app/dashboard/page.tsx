"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useUser } from "@/hooks/useUser";
import { useCredits } from "@/hooks/useCredits";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Zap, BarChart3, CreditCard, ArrowRight, Clock,
  TrendingUp, Activity,
} from "lucide-react";

interface UsageSummary {
  total_requests: number;
  total_credits: number;
  recent_logs: Array<{
    id: string;
    service_id: string;
    credits_used: number;
    status: string;
    channel: string;
    created_at: string;
  }>;
}

export default function DashboardPage() {
  const { user, profile } = useUser();
  const { balance, fetchBalance } = useCredits(user?.id);
  const [usage, setUsage] = useState<UsageSummary>({
    total_requests: 0,
    total_credits: 0,
    recent_logs: [],
  });

  const fetchUsage = useCallback(async () => {
    if (!user?.id) return;
    try {
      const res = await fetch("/api/me/usage?page=0&pageSize=3");
      if (!res.ok) return;
      const data = await res.json();
      setUsage({
        total_requests: data.total ?? 0,
        total_credits: data.total_credits_used ?? 0,
        recent_logs: data.logs ?? [],
      });
    } catch {
      // Keep existing state on error
    }
  }, [user?.id]);

  // Initial fetch + realtime updates from broadcast
  useEffect(() => {
    fetchUsage();
    const onUpdate = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.total_requests != null && detail?.total_credits_used != null) {
        // Update totals instantly from broadcast payload
        setUsage((prev) => ({
          ...prev,
          total_requests: detail.total_requests,
          total_credits: detail.total_credits_used,
          // Prepend new log entry and keep only 3
          recent_logs: [
            {
              id: detail.request_id,
              service_id: detail.service_id,
              credits_used: detail.credits_used,
              status: "success",
              channel: detail.channel,
              created_at: detail.created_at,
            },
            ...prev.recent_logs,
          ].slice(0, 3),
        }));
      } else {
        // Fallback: re-fetch from server
        fetchUsage();
      }
    };
    window.addEventListener("kognitrix:credits-updated", onUpdate);
    return () => window.removeEventListener("kognitrix:credits-updated", onUpdate);
  }, [fetchUsage]);

  const stats = [
    {
      label: "Credits Balance",
      value: balance,
      icon: CreditCard,
      color: "text-emerald-500",
      href: "/dashboard/billing",
    },
    {
      label: "Total Requests",
      value: usage.total_requests,
      icon: Activity,
      color: "text-blue-500",
      href: "/dashboard/usage",
    },
    {
      label: "Credits Used",
      value: usage.total_credits,
      icon: TrendingUp,
      color: "text-purple-500",
      href: "/dashboard/usage",
    },
    {
      label: "Plan",
      value: profile?.plan_type?.replace("_", " ") || "Free Trial",
      icon: Zap,
      color: "text-amber-500",
      href: "/dashboard/billing",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your Kognitrix AI usage and account.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Link key={stat.label} href={stat.href}>
            <Card className="hover:border-primary/50 transition-colors cursor-pointer">
              <CardContent className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-5 h-5 ${stat.color}`} />
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick actions */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Link href="/dashboard/services">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <Zap className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Use Services</h3>
              <p className="text-sm text-muted-foreground">
                Generate content, code, images & more
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/api-keys">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <BarChart3 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">API Access</h3>
              <p className="text-sm text-muted-foreground">
                Get your API key for REST & MCP
              </p>
            </CardContent>
          </Card>
        </Link>
        <Link href="/dashboard/billing">
          <Card className="hover:border-primary/50 transition-colors cursor-pointer h-full">
            <CardContent className="p-5 flex flex-col items-center text-center">
              <CreditCard className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold mb-1">Buy Credits</h3>
              <p className="text-sm text-muted-foreground">
                Top up credits or subscribe to a plan
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Recent activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          {usage.recent_logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <Activity className="w-10 h-10 mx-auto mb-3 opacity-50" />
              <p>No activity yet. Start using services to see your usage here.</p>
              <Link href="/dashboard/services">
                <Button variant="outline" className="mt-4">
                  Explore Services <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {usage.recent_logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-center justify-between py-2 border-b border-border last:border-0"
                >
                  <div className="flex items-center gap-3">
                    <Badge
                      variant={log.status === "success" ? "success" : "destructive"}
                      className="text-xs"
                    >
                      {log.status}
                    </Badge>
                    <div>
                      <div className="text-sm font-medium">{log.service_id}</div>
                      <div className="text-xs text-muted-foreground">
                        via {log.channel} &bull;{" "}
                        {new Date(log.created_at).toLocaleString()}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">
                    -{log.credits_used} credits
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
