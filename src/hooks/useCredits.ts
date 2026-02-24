"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

const CREDITS_UPDATE_EVENT = "kognitrix:credits-updated";

export function broadcastCreditsUpdate() {
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent(CREDITS_UPDATE_EVENT));
  }
}

export function useCredits(userId: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    try {
      const res = await fetch("/api/me");
      if (!res.ok) return;
      const data = await res.json();
      if (data.profile?.credits_balance != null) {
        setBalance(data.profile.credits_balance);
      }
    } catch {
      // Keep existing balance
    }
  }, [userId]);

  // Initial fetch
  useEffect(() => {
    if (userId) fetchBalance();
  }, [userId, fetchBalance]);

  // Realtime via Supabase Broadcast (no RLS — pure pub/sub)
  useEffect(() => {
    if (!userId) return;

    const supabase = createClient();
    const channel = supabase
      .channel(`user:${userId}`)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .on("broadcast", { event: "credits_updated" }, (msg: any) => {
        const payload = msg.payload;
        if (payload?.credits_balance != null) {
          setBalance(payload.credits_balance);
        }
        // Dispatch with full payload so dashboard page can update totals instantly
        window.dispatchEvent(
          new CustomEvent(CREDITS_UPDATE_EVENT, { detail: payload })
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  // Re-fetch on tab focus
  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === "visible" && userId) fetchBalance();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => document.removeEventListener("visibilitychange", onVisible);
  }, [userId, fetchBalance]);

  return { balance, loading, fetchBalance, setBalance };
}
