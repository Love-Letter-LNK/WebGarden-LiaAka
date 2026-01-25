import { Heart, Sparkles } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import pixelCouple from "@/assets/pixel-couple.png";
import pixelStickers from "@/assets/pixel-stickers.png";
import { useCallback, useState } from "react";
import { PixelConfetti } from "@/components/garden/PixelConfetti";

export const HeroSection = () => {
  const reduce = useReducedMotion();
  const [confettiRun, setConfettiRun] = useState(false);

  const onStart = useCallback(() => {
    // Once per session
    try {
      const key = "rg_start_confetti_v1";
      if (sessionStorage.getItem(key) === "1") return;
      sessionStorage.setItem(key, "1");
      setConfettiRun(true);
    } catch {
      // Ignore if storage blocked
      setConfettiRun(true);
    }
  }, []);

  return (
    <section id="top" className="grid gap-6 md:grid-cols-[1.35fr_0.9fr] items-start">
      <PixelConfetti run={confettiRun} onDone={() => setConfettiRun(false)} />
      {/* Big “art panel” (left) */}
      <motion.div
        initial={reduce ? undefined : { opacity: 0, scale: 0.98 }}
        animate={reduce ? undefined : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      >
        <div className="pixel-panel p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-4">
            <span className="kawaii-ribbon">welcome ✿</span>
            <span className="pixel-chip">
              <Sparkles className="h-3.5 w-3.5" />
              <span>SNES pastel</span>
            </span>
          </div>

          <div className="relative">
            <div className="pixel-frame p-4 md:p-5">
              <img
                src={pixelCouple}
                alt="Cute pixel couple avatars standing together"
                className="mx-auto w-[260px] md:w-[340px] h-auto"
                style={{ imageRendering: "pixelated" }}
                loading="lazy"
              />
            </div>

            <motion.img
              src={pixelStickers}
              alt="Pixel stickers"
              className="absolute -left-4 -bottom-5 w-28 md:w-32 h-auto opacity-90"
              style={{ imageRendering: "pixelated" }}
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
              loading="lazy"
            />

            <motion.div
              className="absolute -top-3 -right-2"
              animate={reduce ? undefined : { y: [0, -6, 0] }}
              transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="pixel-heart h-8 w-8" />
            </motion.div>
          </div>

          <p className="mt-4 text-center text-xs text-muted-foreground">
            two tiny adventurers, one shared save file
          </p>
        </div>
      </motion.div>

      {/* Info panel (right) */}
       <div className="space-y-4">
        <div className="pixel-panel p-5 md:p-6">
           <h1 className="text-xl md:text-2xl leading-snug">
            Zakaria & Lia’s Adventure
          </h1>
           <p className="mt-3 text-sm md:text-base text-muted-foreground max-w-prose">
             Milestones we’ve unlocked, memories we’ve collected, and letters we’re saving
             for the future.
           </p>

           <div className="mt-5 flex flex-wrap items-center gap-3">
             <a className="pixel-button" href="#journey" onClick={onStart}>
               <Heart className="h-4 w-4" /> Start ✦
            </a>
            <a
              className="pixel-button bg-secondary text-secondary-foreground"
              href="#memories"
            >
               <Sparkles className="h-4 w-4" /> View Memories
            </a>
          </div>

           {/* tiny sparkle hint near CTAs */}
           <motion.div
             aria-hidden
             className="mt-3 flex items-center gap-2 text-xs text-muted-foreground"
             initial={reduce ? undefined : { opacity: 0, y: 6 }}
             animate={reduce ? undefined : { opacity: 1, y: 0 }}
             transition={{ duration: 0.3, delay: 0.12 }}
           >
             <span className="inline-flex h-2 w-2 rounded-[2px] border border-border bg-primary" />
             <span>tap start for a tiny surprise</span>
           </motion.div>
        </div>

        <div className="pixel-panel p-5 md:p-6">
          <div className="flex items-center justify-between gap-3 mb-3">
            <h2 className="text-sm md:text-base">Quick Links</h2>
            <span className="text-xs text-muted-foreground">tap to jump</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <a className="pixel-chip story-link" href="#journey">
              Journey
            </a>
            <a className="pixel-chip story-link" href="#memories">
              Memories
            </a>
            <a className="pixel-chip story-link" href="#capsule">
              Time Capsule
            </a>
            <a className="pixel-chip story-link" href="/auth">
              Admin Login
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};


