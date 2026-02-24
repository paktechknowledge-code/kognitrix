"use client";

import { useEffect, useState } from "react";
import { useUser } from "@/hooks/useUser";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { BarChart3, Filter, ChevronLeft, ChevronRight } from "lucide-react";

interface UsageLog {
  id: string;
  service_id: string;
  credits_used: number;
  status: string;
  channel: string;
  latency_ms: number;
  model_used: string;
  created_at: string;
}

const PAGE_SIZE = 20;

export default function UsagePage() {
  const { user } = useUser();
  const [logs, setLogs] = useState<UsageLog[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(0);
  const [filterChannel, setFilterChannel] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) return;

    async function fetchLogs() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page: String(page), pageSize: String(PAGE_SIZE) });
        if (filterChannel) params.set("channel", filterChannel);
        const res = await fetch(`/api/me/usage?${params}`);
        if (!res.ok) return;
        const data = await res.json();
        setLogs(data.logs ?? []);
        setTotal(data.total ?? 0);
      } catch {
        // Keep existing state
      } finally {
        setLoading(false);
      }
    }

    fetchLogs();
  }, [user?.id, page, filterChannel]);

  const totalPages = Math.ceil(total / PAGE_SIZE);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Usage & Logs</h1>
        <p className="text-muted-foreground">
          Track all your API requests and credit usage.
        </p>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <Filter className="w-4 h-4 text-muted-foreground" />
        <span className="text-sm text-muted-foreground">Channel:</span>
        {["", "web", "api", "mcp"].map((ch) => (
          <Button
            key={ch}
            variant={filterChannel === ch ? "default" : "outline"}
            size="sm"
            onClick={() => {
              setFilterChannel(ch);
              setPage(0);
            }}
          >
            {ch || "All"}
          </Button>
        ))}
      </div>

      {/* Stats summary */}
      <div className="grid sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Total Requests</div>
            <div className="text-2xl font-bold">{total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Credits Used (Page)</div>
            <div className="text-2xl font-bold">
              {logs.reduce((sum, l) => sum + l.credits_used, 0)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-sm text-muted-foreground">Avg Latency (Page)</div>
            <div className="text-2xl font-bold">
              {logs.length > 0
                ? Math.round(
                    logs.reduce((sum, l) => sum + l.latency_ms, 0) / logs.length
                  )
                : 0}
              ms
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Logs table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Request Logs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading...</div>
          ) : logs.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No usage logs found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Service</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Status</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Channel</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Credits</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Latency</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Model</th>
                    <th className="text-left py-3 px-2 font-medium text-muted-foreground">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((log) => (
                    <tr key={log.id} className="border-b border-border/50 hover:bg-secondary/30">
                      <td className="py-3 px-2 font-medium">{log.service_id}</td>
                      <td className="py-3 px-2">
                        <Badge
                          variant={log.status === "success" ? "success" : "destructive"}
                          className="text-xs"
                        >
                          {log.status}
                        </Badge>
                      </td>
                      <td className="py-3 px-2">
                        <Badge variant="outline" className="text-xs">{log.channel}</Badge>
                      </td>
                      <td className="py-3 px-2">{log.credits_used}</td>
                      <td className="py-3 px-2">{log.latency_ms}ms</td>
                      <td className="py-3 px-2 text-muted-foreground">{log.model_used}</td>
                      <td className="py-3 px-2 text-muted-foreground">
                        {new Date(log.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-border">
              <span className="text-sm text-muted-foreground">
                Page {page + 1} of {totalPages} ({total} total)
              </span>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 0}
                  onClick={() => setPage((p) => p - 1)}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages - 1}
                  onClick={() => setPage((p) => p + 1)}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
