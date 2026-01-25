import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { CalendarHeart } from "lucide-react";
import { Link } from "react-router-dom";

type Milestone = {
  id: string;
  title: string;
  description: string | null;
  happened_on: string | null;
};

export const JourneyTimeline = () => {
  const { data, isLoading } = useQuery({
    queryKey: ["milestones-public"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("milestones" as any)
        .select("id,title,description,happened_on")
        .eq("is_published", true)
        .order("happened_on", { ascending: true, nullsFirst: false })
        .order("created_at", { ascending: true });

      if (error) throw error;
      return (data ?? []) as unknown as Milestone[];
    },
  });

  return (
    <div className="pixel-panel p-5 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-6">
        <h2 className="text-xl md:text-2xl">Our Journey</h2>
        <CalendarHeart className="h-5 w-5 text-primary" />
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-16 rounded-xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : !data || data.length === 0 ? (
        <div className="pixel-panel p-4 md:p-5 bg-muted/40">
          <p className="text-sm text-muted-foreground">
            Belum ada milestone yang dipublish—tapi story kita udah jalan.
          </p>
          <p className="mt-2 text-xs text-muted-foreground">
            Admin bisa tambah dari halaman <Link className="story-link" to="/auth">login</Link>.
          </p>
        </div>
      ) : (
        <ol className="relative pl-6">
          <div className="absolute left-[11px] top-0 bottom-0 w-[2px] bg-border" />

          {data.map((m) => (
            <li key={m.id} className="relative pb-6">
              <div className="absolute left-[4px] top-[2px] h-4 w-4 rounded bg-secondary border-2" />
              <div className="pixel-panel p-4 md:p-5">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-sm md:text-base">{m.title}</h3>
                  {m.happened_on && (
                    <span className="text-xs text-muted-foreground font-mono">
                      {m.happened_on}
                    </span>
                  )}
                </div>
                {m.description && (
                  <p className="mt-2 text-sm text-muted-foreground">
                    {m.description}
                  </p>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
};
