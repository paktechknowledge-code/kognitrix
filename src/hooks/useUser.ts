"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { Profile } from "@/types";
import type { User } from "@supabase/supabase-js";

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = useCallback(async (u: User) => {
    try {
      const res = await fetch("/api/me");
      if (!res.ok) return;
      const data = await res.json();
      if (data.profile) setProfile(data.profile as Profile);
    } catch {
      // Keep existing profile on error
    }
  }, []);

  useEffect(() => {
    const supabase = createClient();

    async function init() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        fetchProfile(session.user);
      }
      setLoading(false);
    }

    init();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event: string, session: any) => {
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED" || event === "USER_UPDATED") {
          const u = session?.user ?? null;
          if (u) {
            setUser(u);
            fetchProfile(u);
          }
        }
        // SIGNED_OUT intentionally ignored — server signout route handles redirect
      }
    );

    return () => subscription.unsubscribe();
  }, [fetchProfile]);

  return { user, profile, loading };
}
