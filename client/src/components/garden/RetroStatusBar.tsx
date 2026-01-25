import { useEffect, useMemo, useState } from "react";
import { useTheme } from "next-themes";

type RetroStatusBarProps = {
  /** If false, renders nothing (for "optional" usage). */
  enabled?: boolean;
  /** A fake last update date (YYYY-MM-DD). */
  lastUpdate?: string;
  /** Starting number for the fake visitor counter. */
  baseVisitors?: number;
  /** Increment counter once per browser session. */
  incrementPerSession?: boolean;
};

export const RetroStatusBar = ({
  enabled = true,
  lastUpdate = "2011-10-12",
  baseVisitors = 5743,
  incrementPerSession = true,
}: RetroStatusBarProps) => {
  const { theme } = useTheme();
  const [visitors, setVisitors] = useState<number>(baseVisitors);

  const storageKey = useMemo(() => "retro_visitors_v1", []);
  const sessionKey = useMemo(() => "retro_visitors_session_v1", []);

  useEffect(() => {
    if (!enabled) return;

    try {
      const stored = Number(localStorage.getItem(storageKey) ?? "");
      const initial = Number.isFinite(stored) && stored > 0 ? stored : baseVisitors;

      let next = initial;
      if (!incrementPerSession || !sessionStorage.getItem(sessionKey)) {
        next = initial + 1;
        sessionStorage.setItem(sessionKey, "1");
      }

      localStorage.setItem(storageKey, String(next));
      setVisitors(next);
    } catch {
      // ignore storage failures (private mode, etc.)
      setVisitors(baseVisitors);
    }
  }, [baseVisitors, enabled, incrementPerSession, sessionKey, storageKey]);

  if (!enabled) return null;

  const padded = String(visitors).padStart(6, "0");
  const skin = theme === "blue" ? "Blue" : "Pink";

  return (
    <div className="pixel-panel p-3 md:p-4">
      <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="pixel-chip">Visitors</span>
          <span className="font-mono text-muted-foreground">{padded}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pixel-chip">Skin</span>
          <span className="font-mono text-muted-foreground">{skin}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="pixel-chip">Last Update</span>
          <span className="font-mono text-muted-foreground">{lastUpdate}</span>
        </div>
      </div>
    </div>
  );
};
