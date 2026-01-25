import React, { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type SfxSettings = {
  muted: boolean;
  volume: number; // 0..1
  hoverEnabled: boolean;
};

type SfxContextValue = {
  settings: SfxSettings;
  setMuted: (muted: boolean) => void;
  setVolume: (volume: number) => void;
  setHoverEnabled: (enabled: boolean) => void;
  playClick: () => void;
  playHover: () => void;
};

const STORAGE_KEY = "retro_garden_sfx_v1";

const defaultSettings: SfxSettings = {
  muted: false,
  volume: 0.2,
  hoverEnabled: true,
};

const SfxContext = createContext<SfxContextValue | undefined>(undefined);

function clamp01(n: number) {
  return Math.max(0, Math.min(1, n));
}

function prefersReducedMotion() {
  if (typeof window === "undefined") return false;
  return window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false;
}

export function SfxProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<SfxSettings>(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return defaultSettings;
      const parsed = JSON.parse(raw) as Partial<SfxSettings>;
      return {
        muted: !!parsed.muted,
        volume: clamp01(typeof parsed.volume === "number" ? parsed.volume : defaultSettings.volume),
        hoverEnabled:
          typeof parsed.hoverEnabled === "boolean" ? parsed.hoverEnabled : defaultSettings.hoverEnabled,
      };
    } catch {
      return defaultSettings;
    }
  });

  // Audio engine (created lazily after first user gesture)
  const audioCtxRef = useRef<AudioContext | null>(null);
  const readyRef = useRef(false);
  const lastHoverElRef = useRef<EventTarget | null>(null);
  const lastHoverAtRef = useRef(0);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  const ensureReady = useCallback(() => {
    if (typeof window === "undefined") return;
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || (window as any).webkitAudioContext;
      audioCtxRef.current = Ctx ? new Ctx() : null;
    }
    if (audioCtxRef.current && audioCtxRef.current.state === "suspended") {
      // resume must be called from a user gesture handler
      void audioCtxRef.current.resume();
    }
    readyRef.current = true;
  }, []);

  const beep = useCallback(
    (opts: {
      freq: number;
      durationMs: number;
      gain: number;
      type?: OscillatorType;
      startOffsetMs?: number;
    }) => {
      const ctx = audioCtxRef.current;
      if (!ctx) return;
      const now = ctx.currentTime + (opts.startOffsetMs ?? 0) / 1000;

      const osc = ctx.createOscillator();
      const g = ctx.createGain();

      osc.type = opts.type ?? "square";
      osc.frequency.setValueAtTime(opts.freq, now);

      const vol = clamp01(settings.volume) * (settings.muted ? 0 : 1);
      const peak = Math.max(0, Math.min(1, vol * opts.gain));

      // tiny, snappy envelope
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(Math.max(0.0002, peak), now + 0.003);
      g.gain.exponentialRampToValueAtTime(0.0001, now + opts.durationMs / 1000);

      osc.connect(g);
      g.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + opts.durationMs / 1000 + 0.01);
    },
    [settings.muted, settings.volume]
  );

  const playClick = useCallback(() => {
    if (settings.muted || settings.volume <= 0) return;
    ensureReady();
    if (!readyRef.current) return;
    // clear but not harsh "confirm" (two quick tones)
    beep({ freq: 880, durationMs: 32, gain: 0.75, type: "square" });
    beep({ freq: 1174, durationMs: 38, gain: 0.7, type: "square", startOffsetMs: 26 });
  }, [beep, ensureReady, settings.muted, settings.volume]);

  const playHover = useCallback(() => {
    if (settings.muted || settings.volume <= 0) return;
    if (!settings.hoverEnabled) return;
    if (prefersReducedMotion()) return;
    if (!readyRef.current) return; // don't auto-start audio on hover before a gesture
    beep({ freq: 680, durationMs: 22, gain: 0.28, type: "square" });
  }, [beep, settings.hoverEnabled, settings.muted, settings.volume]);

  // Global delegation: pixel-chip + pixel-button
  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".pixel-chip, .pixel-button");
      if (!el) return;
      ensureReady();
      playClick();
    };

    const onPointerOver = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".pixel-chip, .pixel-button");
      if (!el) return;

      // debounce hover so it doesn't spam when moving inside the same control
      const now = performance.now();
      if (now - lastHoverAtRef.current < 90) return;

      if (lastHoverElRef.current === el) return;
      lastHoverElRef.current = el;
      lastHoverAtRef.current = now;
      playHover();
    };

    const onPointerOut = (e: PointerEvent) => {
      const el = (e.target as HTMLElement | null)?.closest?.(".pixel-chip, .pixel-button");
      if (!el) return;
      if (lastHoverElRef.current === el) lastHoverElRef.current = null;
    };

    window.addEventListener("pointerdown", onPointerDown, { capture: true });
    window.addEventListener("pointerover", onPointerOver, { capture: true });
    window.addEventListener("pointerout", onPointerOut, { capture: true });
    return () => {
      window.removeEventListener("pointerdown", onPointerDown, { capture: true } as any);
      window.removeEventListener("pointerover", onPointerOver, { capture: true } as any);
      window.removeEventListener("pointerout", onPointerOut, { capture: true } as any);
    };
  }, [ensureReady, playClick, playHover]);

  const value = useMemo<SfxContextValue>(
    () => ({
      settings,
      setMuted: (muted) => setSettings((s) => ({ ...s, muted })),
      setVolume: (volume) => setSettings((s) => ({ ...s, volume: clamp01(volume) })),
      setHoverEnabled: (hoverEnabled) => setSettings((s) => ({ ...s, hoverEnabled })),
      playClick,
      playHover,
    }),
    [playClick, playHover, settings]
  );

  return <SfxContext.Provider value={value}>{children}</SfxContext.Provider>;
}

export function useSfx() {
  const ctx = useContext(SfxContext);
  if (!ctx) throw new Error("useSfx must be used within <SfxProvider />");
  return ctx;
}
