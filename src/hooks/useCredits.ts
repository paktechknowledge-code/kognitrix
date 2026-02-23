"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function useCredits(userId: string | undefined) {
  const [balance, setBalance] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const fetchBalance = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    const supabase = createClient();
    const { data, error } = await supabase
      .from("profiles")
      .select("credits_balance")
      .eq("id", userId)
      .single();
    if (data) setBalance(data.credits_balance);
    if (error) console.error("fetchBalance error:", error.message);
    setLoading(false);
  }, [userId]);

  // Auto-fetch when userId becomes available
  useEffect(() => {
    if (userId) {
      fetchBalance();
    }
  }, [userId, fetchBalance]);

  return { balance, loading, fetchBalance, setBalance };
}
