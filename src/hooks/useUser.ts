"use client";

import { useEffect, useRef, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  // Keep a ref so we never clear state due to a transient network failure
  const lastKnownUser = useRef<User | null>(null);

  useEffect(() => {
    const supabase = createClient();

    async function fetchProfile(u: User) {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", u.id)
        .single();
      if (data) setProfile(data as Profile);
    }

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        lastKnownUser.current = session.user;
        setUser(session.user);
        await fetchProfile(session.user);
      }
      setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          const u = session?.user ?? null;
          if (u) {
            lastKnownUser.current = u;
            setUser(u);
            await fetchProfile(u);
          }
        } else if (event === "SIGNED_OUT") {
          // Only truly sign out if we have no last known user cookie
          // This prevents MCP/API calls from wiping the UI state
          const hasCookie = document.cookie
            .split(";")
            .some((c) => c.trim().startsWith("sb-") && c.includes("-auth-token="));

          if (!hasCookie) {
            lastKnownUser.current = null;
            setUser(null);
            setProfile(null);
          }
          // Otherwise ignore — likely a transient token refresh failure
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, profile, loading };
}
