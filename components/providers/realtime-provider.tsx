// components/providers/realtime-provider.tsx
"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useQueryClient } from "@tanstack/react-query";
import type { RealtimeChannel } from "@supabase/supabase-js";

// ← di luar component, tidak ikut re-render
let channel: RealtimeChannel | null = null;

export function RealtimeProvider({ children }: { children: React.ReactNode }) {
  const queryClient = useQueryClient();

  useEffect(() => {
    // Kalau channel sudah ada dan aktif, jangan buat baru
    if (channel) return;

    channel = supabase
      .channel("realtime_global")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["events"] });
          queryClient.invalidateQueries({ queryKey: ["events_home"] });
          queryClient.invalidateQueries({ queryKey: ["events_list"] });
        },
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "participants" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["participants"] });
          queryClient.invalidateQueries({ queryKey: ["events"] });
          queryClient.invalidateQueries({ queryKey: ["events_home"] });
          queryClient.invalidateQueries({ queryKey: ["events_list"] });
        },
      )
      .subscribe((status) => {
        console.log("[Realtime] status:", status);
      });

    // Tidak ada cleanup — channel hidup selama app hidup
    return () => {};
  }, [queryClient]);

  return <>{children}</>;
}
