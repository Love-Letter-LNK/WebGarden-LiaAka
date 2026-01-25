import { Heart, Sparkles } from "lucide-react";
import { useSfx } from "@/context/SfxContext";
import { HeaderTopRow } from "@/components/garden/header/HeaderTopRow";
import { HeaderControlsRow } from "@/components/garden/header/HeaderControlsRow";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/sonner";
import { motion, useReducedMotion } from "framer-motion";

export const SiteHeader = () => {
  const { settings, setHoverEnabled, setMuted, setVolume } = useSfx();
  const reduce = useReducedMotion();
  const clickCountRef = useRef(0);
  const lastClickAtRef = useRef(0);
  const [burst, setBurst] = useState(false);
  const headerRef = useRef<HTMLElement | null>(null);

  // Expose header height as a CSS var so pages can offset content and avoid overlap.
  useLayoutEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    const setVar = () => {
      const h = Math.ceil(el.getBoundingClientRect().height);
      document.documentElement.style.setProperty("--site-header-h", `${h}px`);
    };

    setVar();
    const ro = new ResizeObserver(() => setVar());
    ro.observe(el);
    window.addEventListener("resize", setVar);

    return () => {
      ro.disconnect();
      window.removeEventListener("resize", setVar);
    };
  }, []);

  const onLogoClick = useCallback(() => {
    const now = Date.now();
    if (now - lastClickAtRef.current > 1200) clickCountRef.current = 0;
    lastClickAtRef.current = now;
    clickCountRef.current += 1;

    if (clickCountRef.current >= 5) {
      clickCountRef.current = 0;
      toast("Secret unlocked ✦", {
        description: "zakaria & lia forever in this save file",
      });
      if (!reduce) {
        setBurst(true);
        window.setTimeout(() => setBurst(false), 900);
      }
    }
  }, [reduce]);

  return (
    <header ref={headerRef} className="sticky top-0 z-40">
      {/* Top cute banner (retro JP vibes) */}
      <div className="kawaii-banner border-b-2">
        <div className="container mx-auto px-4 py-2">
          <div className="relative flex items-center justify-center">
            {/* Centered logo/title */}
            <a
              href="#top"
              className="group relative z-10 inline-flex flex-col items-center gap-0.5 px-3 py-1"
              aria-label="Back to top"
              onClick={onLogoClick}
            >
              <span className="relative inline-flex items-center gap-2">
                <Heart className="pixel-heart h-5 w-5" />
                <span className="text-sm md:text-base tracking-tight">
                  Zakaria & Lia
                </span>
                <Sparkles className="h-4 w-4 text-primary" />

                {/* 5-click easter egg burst */}
                {burst && !reduce && (
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0"
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                  >
                    {Array.from({ length: 6 }).map((_, i) => (
                      <motion.span
                        key={i}
                        className={
                          "absolute h-2 w-2 rounded-[2px] border border-border shadow-[2px_2px_0_0_hsl(var(--border))] " +
                          (i % 2 === 0 ? "bg-primary" : "bg-secondary")
                        }
                        style={{
                          left: i % 3 === 0 ? "-10px" : i % 3 === 1 ? "calc(50% - 4px)" : "calc(100% + 2px)",
                          top: i < 3 ? "-10px" : "calc(100% + 2px)",
                        }}
                        initial={{ opacity: 0, y: 4 }}
                        animate={{ opacity: [0, 1, 0], y: [4, 0, -4] }}
                        transition={{ duration: 0.75, delay: i * 0.04 }}
                      />
                    ))}
                  </motion.span>
                )}

                {/* Hover twinkles (subtle, retro). Reduced-motion safe via CSS. */}
                <span
                  aria-hidden
                  className="logo-twinkle pointer-events-none absolute -right-3 -top-1 h-1.5 w-1.5 rounded-[2px] border border-border bg-primary opacity-0 group-hover:opacity-100"
                />
                <span
                  aria-hidden
                  className="logo-twinkle pointer-events-none absolute -left-2 top-1 h-1 w-1 rounded-[2px] border border-border bg-secondary opacity-0 group-hover:opacity-100 [animation-delay:120ms]"
                />
                <span
                  aria-hidden
                  className="logo-twinkle pointer-events-none absolute right-7 -bottom-1 h-1 w-1 rounded-[2px] border border-border bg-primary opacity-0 group-hover:opacity-100 [animation-delay:240ms]"
                />
                <span
                  aria-hidden
                  className="logo-twinkle pointer-events-none absolute left-7 -bottom-2 h-1.5 w-1.5 rounded-[2px] border border-border bg-secondary opacity-0 group-hover:opacity-100 [animation-delay:360ms]"
                />
              </span>

              <span className="text-[10px] md:text-xs text-muted-foreground font-[var(--font-body)]">
                digital garden 2010
              </span>
            </a>

            {/* Right badge (CSS-only replacement for removed sticker) */}
            <span className="absolute right-0 top-1/2 hidden sm:inline-flex -translate-y-1/2">
              <span className="pixel-chip header-chip select-none whitespace-nowrap text-[10px]">
                online ✦
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Retro navbar */}
      <div className="border-b-2 bg-background/80 backdrop-blur">
        <div className="container mx-auto px-4 py-3">
          <div className="relative pixel-panel px-4 py-3 md:px-5 md:py-3 flex flex-col gap-3 overflow-visible">

            <div className="relative z-10">
              <HeaderTopRow />
            </div>

            <div className="relative z-10">
              <HeaderControlsRow
                hoverEnabled={settings.hoverEnabled}
                muted={settings.muted}
                volume={settings.volume}
                onToggleHover={() => setHoverEnabled(!settings.hoverEnabled)}
                onToggleMuted={() => setMuted(!settings.muted)}
                onChangeVolume={setVolume}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Cute divider (transparent PNG) */}
      <div className="bg-background/70">
        <div className="container mx-auto px-4">
          <div
            aria-hidden
            className="h-3 opacity-90 border-y-2 border-border [background:repeating-linear-gradient(90deg,hsl(var(--muted))_0_8px,hsl(var(--background))_8px_16px)]"
          />
        </div>
      </div>
    </header>
  );
};
