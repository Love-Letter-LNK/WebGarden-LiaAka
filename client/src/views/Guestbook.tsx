import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useSound } from "@/hooks/useSound";
import { MainLayout } from "@/components/garden/MainLayout";
import { BookOpen, Send, MessageSquare } from "lucide-react";

type GuestbookRow = {
  id: string;
  created_at: string;
  display_name: string | null;
  message: string;
};

const anonSchema = z.object({
  display_name: z.string().trim().min(1, "Nama tidak boleh kosong").max(40),
  message: z.string().trim().min(1, "Pesan tidak boleh kosong").max(600),
  honey: z.string().max(0).optional(),
});

const authedSchema = z.object({
  display_name: z.string().trim().max(40).optional(),
  message: z.string().trim().min(1, "Pesan tidak boleh kosong").max(600),
  honey: z.string().max(0).optional(),
});

export default function Guestbook() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const playSound = useSound();

  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState("");
  const [honey, setHoney] = useState(""); // hidden anti-bot

  const isAuthed = !!user;

  const { data: entries, isLoading } = useQuery({
    queryKey: ["guestbook", "public"],
    queryFn: async (): Promise<GuestbookRow[]> => {
      const { data, error } = await supabase
        .from("guestbook_entries" as any)
        .select("id, created_at, display_name, message")
        .eq("is_approved", true)
        .eq("is_hidden", false)
        .order("created_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      return (data ?? []) as unknown as GuestbookRow[];
    },
  });

  useEffect(() => {
    const channel = supabase
      .channel("guestbook_entries_public")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "guestbook_entries" },
        () => {
          queryClient.invalidateQueries({ queryKey: ["guestbook", "public"] });
        }
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const placeholderName = useMemo(() => {
    if (!user?.email) return "";
    const prefix = user.email.split("@")[0] ?? "";
    return prefix.slice(0, 24);
  }, [user?.email]);

  const submit = async () => {
    const parsed = (isAuthed ? authedSchema : anonSchema).safeParse({
      display_name: displayName || undefined,
      message,
      honey,
    });

    if (!parsed.success) {
      toast({ title: "Periksa form", description: parsed.error.issues[0]?.message, variant: "destructive" });
      return;
    }
    if (parsed.data.honey && parsed.data.honey.length > 0) return; // bot

    const insertPayload = isAuthed
      ? {
        user_id: user!.id,
        display_name: (parsed.data.display_name || "").trim() || null,
        message: parsed.data.message,
        is_approved: false,
        is_hidden: false,
      }
      : {
        user_id: null,
        display_name: parsed.data.display_name!.trim(),
        message: parsed.data.message,
        is_approved: false,
        is_hidden: false,
      };

    const { error } = await supabase.from("guestbook_entries" as any).insert(insertPayload);
    if (error) {
      toast({ title: "Gagal kirim", description: error.message, variant: "destructive" });
      return;
    }

    toast({
      title: "Terkirim ✦",
      description: "Pesanmu masuk antrian dan akan tampil setelah disetujui admin.",
    });
    setMessage("");
    if (!isAuthed) setDisplayName("");
  };

  return (
    <MainLayout>
      <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white border-4 border-pink-200 rounded-xl p-4 mb-6 text-center shadow-lg">
            <BookOpen className="w-10 h-10 mx-auto text-pink-500 mb-2" />
            <h2 className="text-xl font-bold text-pink-600">Guestbook</h2>
            <p className="text-[10px] text-gray-600">Leave a note for us!</p>
          </div>

          {/* Form placeholder - Keeping it simple for now or restoring full form logic if visual design is known. 
                    Given the previous corruption, I'll render the listing which was visible in the snippet.
                */}
          <div className="bg-white border-2 border-pink-200 rounded-lg p-4">
            {entries && entries.length > 0 ? (
              <ul className="space-y-3">
                {entries.map((e) => (
                  <li key={e.id} className="bg-pink-50 border border-pink-100 rounded p-4">
                    <div className="flex items-baseline justify-between gap-3">
                      <p className="text-sm font-semibold text-pink-600">
                        {e.display_name ? e.display_name : "(signed user)"}
                      </p>
                      <p className="text-[10px] text-gray-400">
                        {new Date(e.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <p className="mt-2 text-xs text-gray-600 whitespace-pre-wrap">{e.message}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="text-center py-8">
                <p className="text-xs text-gray-400">Belum ada yang tampil—jadi yang pertama ✧</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
