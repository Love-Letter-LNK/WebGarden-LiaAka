import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Lock, Unlock } from "lucide-react";

type MessageTeaser = {
  id: string;
  title: string | null;
  deliver_on: string | null;
  created_at: string;
};

function isLocked(deliverOn: string | null): boolean {
  if (!deliverOn) return true;
  // deliver_on is a date; compare by local midnight
  const d = new Date(deliverOn + "T00:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  return d.getTime() > today.getTime();
}

export function TimeCapsuleTeasers() {
  const { data, isLoading } = useQuery({
    queryKey: ["message-teasers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("message_teasers" as any)
        .select("id,title,deliver_on,created_at")
        .order("deliver_on", { ascending: false, nullsFirst: false })
        .order("created_at", { ascending: false })
        .limit(12);
      if (error) throw error;
      return (data ?? []) as unknown as MessageTeaser[];
    },
  });

  if (isLoading) {
    return (
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-24 rounded-xl bg-muted animate-pulse" />
        ))}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="mt-5 pixel-panel p-4 md:p-5 bg-muted/40">
        <p className="text-sm text-muted-foreground">
          Belum ada surat yang disiapkan—nanti bakal muncul sebagai “locked box” di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-3">
      {data.map((t) => {
        const locked = isLocked(t.deliver_on);
        return (
          <div key={t.id} className="pixel-panel p-3 md:p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs text-muted-foreground">letter</p>
                <p className="mt-1 text-sm md:text-base">
                  {t.title?.trim() ? t.title : "(untitled)"}
                </p>
                <p className="mt-2 text-xs text-muted-foreground">
                  deliver: {t.deliver_on ?? "unknown"}
                </p>
              </div>
              <span className="pixel-chip header-chip">
                {locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                <span>{locked ? "locked" : "ready"}</span>
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
