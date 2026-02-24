"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser } from "@/hooks/useUser";
import { CreditsProvider, useCredits } from "@/context/CreditsContext";
import {
  LayoutDashboard, Zap, BarChart3, CreditCard, Key,
  Plug, Settings, HelpCircle, Menu, X, LogOut, ChevronRight, Activity,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const sidebarLinks = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/services", label: "Services", icon: Zap },
  { href: "/dashboard/usage", label: "Usage & Logs", icon: BarChart3 },
  { href: "/dashboard/billing", label: "Billing", icon: CreditCard },
  { href: "/dashboard/api-keys", label: "API Keys", icon: Key },
  { href: "/dashboard/mcp-setup", label: "MCP Setup", icon: Plug },
  { href: "/dashboard/settings", label: "Settings", icon: Settings },
  { href: "/dashboard/support", label: "Support", icon: HelpCircle },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, profile } = useUser();

  return (
    <CreditsProvider userId={user?.id}>
      <DashboardShell user={user} profile={profile}>
        {children}
      </DashboardShell>
    </CreditsProvider>
  );
}

function DashboardShell({
  user,
  profile,
  children,
}: {
  user: any;
  profile: any;
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { balance } = useCredits();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-card/80 backdrop-blur-xl border-r border-border/30 transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full relative">
          {/* Subtle grid in sidebar */}
          <div className="absolute inset-0 grid-bg opacity-30 pointer-events-none" />

          {/* Logo */}
          <div className="relative flex items-center justify-between h-16 px-4 border-b border-border/30">
            <Link href="/dashboard" className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg gradient-bg flex items-center justify-center glow-sm">
                <Zap className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-lg tracking-tight">
                Kognitrix<span className="text-primary">.ai</span>
              </span>
            </Link>
            <button
              className="lg:hidden p-1 text-muted-foreground hover:text-foreground"
              onClick={() => setSidebarOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Credits banner */}
          <div className="relative px-4 py-3 border-b border-border/30 bg-primary/5">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1 mono">
              <Activity className="w-3 h-3 text-emerald-400" />
              Credits Balance
            </div>
            <div className="text-2xl font-bold gradient-text mono">{balance}</div>
            <Link href="/dashboard/billing">
              <Button variant="outline" size="sm" className="mt-2 w-full text-xs mono">
                Buy Credits <ChevronRight className="w-3 h-3 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Nav links */}
          <nav className="relative flex-1 px-3 py-4 space-y-1 overflow-y-auto">
            {sidebarLinks.map((link) => {
              const isActive =
                link.href === "/dashboard"
                  ? pathname === "/dashboard"
                  : pathname.startsWith(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
                    isActive
                      ? "bg-primary/10 text-primary font-medium border border-primary/20 glow-sm"
                      : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* User section */}
          <div className="relative border-t border-border/30 p-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center text-sm font-medium text-primary">
                {profile?.full_name?.[0] || user?.email?.[0]?.toUpperCase() || "U"}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium truncate">
                  {profile?.full_name || "User"}
                </div>
                <div className="flex items-center gap-1">
                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0 mono border-primary/20">
                    {profile?.plan_type || "free_trial"}
                  </Badge>
                </div>
              </div>
            </div>
            <form action="/api/auth/signout" method="POST" className="w-full">
              <button
                type="submit"
                className="flex items-center gap-2 w-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-primary/5 rounded-lg transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 h-16 glass border-b border-border/30 flex items-center justify-between px-4 lg:px-8">
          <button
            className="lg:hidden p-2 -ml-2 text-muted-foreground hover:text-foreground"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="text-sm text-muted-foreground hidden lg:flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_6px_theme(colors.emerald.500)]" />
            <span className="mono">Welcome back, {profile?.full_name || "there"}</span>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="outline" className="text-xs mono border-primary/20">
              <Zap className="w-3 h-3 mr-1 text-primary" />
              {balance} credits
            </Badge>
            <Link href="/docs">
              <Button variant="ghost" size="sm" className="mono text-xs">Docs</Button>
            </Link>
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8 relative">
          <div className="absolute inset-0 grid-bg opacity-20 pointer-events-none" />
          <div className="relative">{children}</div>
        </main>
      </div>
    </div>
  );
}
