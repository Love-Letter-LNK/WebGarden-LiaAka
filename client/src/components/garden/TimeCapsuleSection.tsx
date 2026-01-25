import { Lock, NotebookPen } from "lucide-react";
import { Link } from "react-router-dom";
import { useIsAdmin } from "@/hooks/useIsAdmin";
import { TimeCapsuleTeasers } from "@/components/garden/TimeCapsuleTeasers";

export const TimeCapsuleSection = () => {
  const { data: isAdmin } = useIsAdmin();

  return (
    <div className="pixel-panel p-5 md:p-8">
      <div className="flex items-center justify-between gap-4 mb-4">
        <h2 className="text-xl md:text-2xl">Time Capsule</h2>
        <NotebookPen className="h-5 w-5 text-secondary" />
      </div>

      <p className="text-sm md:text-base text-muted-foreground max-w-prose">
        “Letters to the Future” lives here. Publik cuma bisa lihat teaser kotak terkunci,
        sedangkan admin bisa menulis & mengatur tanggal buka.
      </p>

      <TimeCapsuleTeasers />

      <div className="mt-5 flex items-center gap-3">
        <div className="pixel-chip">
          <Lock className="h-3 w-3" />
          <span>Owner write</span>
        </div>
        {isAdmin ? (
          <Link className="story-link text-sm" to="/admin">
            Manage letters
          </Link>
        ) : (
          <Link className="story-link text-sm" to="/auth">
            Admin login
          </Link>
        )}
      </div>
    </div>
  );
};

