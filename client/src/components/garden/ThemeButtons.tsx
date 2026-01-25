import { Droplet, Heart } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "next-themes";

type ThemeButtonsProps = {
  /** If true, render compact labels (mobile). */
  compact?: boolean;
  className?: string;
};

export const ThemeButtons = ({ compact = false, className }: ThemeButtonsProps) => {
  const { theme, setTheme } = useTheme();
  const current = theme === "blue" ? "blue" : "pink";

  const base =
    "pixel-chip transition-transform active:translate-x-[2px] active:translate-y-[2px]";
  const active = "bg-accent";

  return (
    <div className={cn("flex items-center gap-2", className)} role="group" aria-label="Theme">
      <button
        type="button"
        className={cn(base, current === "pink" && active)}
        aria-pressed={current === "pink"}
        onClick={() => setTheme("pink")}
      >
        <Heart className="pixel-heart h-3.5 w-3.5" />
        <span className={cn(compact ? "sr-only" : "hidden lg:inline")}>Pink</span>
      </button>
      <button
        type="button"
        className={cn(base, current === "blue" && active)}
        aria-pressed={current === "blue"}
        onClick={() => setTheme("blue")}
      >
        <Droplet className="pixel-droplet h-3.5 w-3.5" />
        <span className={cn(compact ? "sr-only" : "hidden lg:inline")}>Blue</span>
      </button>
    </div>
  );
};
