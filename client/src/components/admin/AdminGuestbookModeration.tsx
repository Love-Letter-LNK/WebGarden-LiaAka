import { useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

type PendingRow = {
  id: string;
  created_at: string;
  user_id: string | null;
  display_name: string | null;
  message: string;
  is_hidden: boolean;
  is_approved: boolean;
};

export function AdminGuestbookModeration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["guestbook", "pending"],
    queryFn: async (): Promise<PendingRow[]> => {
      const { data, error } = await supabase
        .from("guestbook_entries" as any)
        .select("id, created_at, user_id, display_name, message, is_hidden, is_approved")
        .eq("is_approved", false)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as PendingRow[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("guestbook_entries_admin")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guestbook_entries" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["guestbook", "pending"] });
        }
      )
      .subscribe();
    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const approve = async (id: string) => {
    const { data: auth } = await supabase.auth.getUser();
    const adminId = auth.user?.id ?? null;
    const { error } = await supabase
      .from("guestbook_entries" as any)
      .update({ is_approved: true, approved_at: new Date().toISOString(), approved_by: adminId })
      .eq("id", id);
    if (error) {
      toast({ title: "Approve gagal", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Approved ✦" });
    await refetch();
  };

  const hide = async (id: string) => {
    const { error } = await supabase.from("guestbook_entries" as any).update({ is_hidden: true }).eq("id", id);
    if (error) {
      toast({ title: "Hide gagal", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Hidden" });
    await refetch();
  };

  const del = async (id: string) => {
    const { error } = await supabase.from("guestbook_entries" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Delete gagal", description: error.message, variant: "destructive" });
      return;
    }
    toast({ title: "Deleted" });
    await refetch();
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-base">Guestbook approvals</h2>
        <p className="text-sm text-muted-foreground">Pending: {data?.length ?? 0}</p>
      </div>

      {isLoading ? (
        <p className="text-sm text-muted-foreground">Loading...</p>
      ) : data && data.length > 0 ? (
        <ul className="space-y-3">
          {data.map((row) => (
            <li key={row.id} className="pixel-frame p-4">
              <div className="flex items-baseline justify-between gap-3">
                <p className="text-sm font-semibold">{row.display_name ?? "(signed user)"}</p>
                <p className="text-[11px] text-muted-foreground">
                  {new Date(row.created_at).toLocaleString()}
                </p>
              </div>
              <p className="mt-2 text-sm whitespace-pre-wrap">{row.message}</p>

              <div className="mt-3 flex flex-wrap gap-2">
                <Button onClick={() => approve(row.id)}>Approve</Button>
                <Button variant="outline" onClick={() => hide(row.id)}>
                  Hide
                </Button>
                <Button variant="destructive" onClick={() => del(row.id)}>
                  Delete
                </Button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-sm text-muted-foreground">Tidak ada yang pending ✦</p>
      )}
    </div>
  );
}
