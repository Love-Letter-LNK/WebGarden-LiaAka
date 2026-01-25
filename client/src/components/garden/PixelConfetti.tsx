import { useEffect, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";

type PixelConfettiProps = {
  run: boolean;
  onDone?: () => void;
  pieces?: number;
};

type Piece = {
  left: number;
  size: number;
  delay: number;
  drift: number;
  rotate: number;
  hue: "primary" | "secondary";
};

export function PixelConfetti({ run, onDone, pieces = 18 }: PixelConfettiProps) {
  const reduce = useReducedMotion();

  const confetti = useMemo<Piece[]>(() => {
    // Deterministic-enough per render; good for a lightweight effect.
    return Array.from({ length: pieces }).map((_, i) => {
      const seed = (i * 9301 + 49297) % 233280;
      const rnd = (n: number) => ((seed + i * n) % 1000) / 1000;
      return {
        left: 10 + rnd(13) * 80,
        size: 6 + Math.round(rnd(17) * 8),
        delay: rnd(19) * 0.12,
        drift: (rnd(23) - 0.5) * 120,
        rotate: (rnd(29) - 0.5) * 140,
        hue: i % 2 === 0 ? "secondary" : "primary",
      };
    });
  }, [pieces]);

  useEffect(() => {
    if (!run) return;
    const t = window.setTimeout(() => onDone?.(), 1200);
    return () => window.clearTimeout(t);
  }, [run, onDone]);

  if (!run || reduce) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {confetti.map((p, idx) => (
        <motion.span
          key={idx}
          className={
            "absolute top-[-20px] rounded-[2px] border-2 border-border shadow-[2px_2px_0_0_hsl(var(--border))] " +
            (p.hue === "primary" ? "bg-primary" : "bg-secondary")
          }
          style={{ left: `${p.left}%`, width: p.size, height: p.size }}
          initial={{ opacity: 0, y: -20, x: 0, rotate: 0 }}
          animate={{ opacity: [0, 1, 1, 0], y: 520, x: p.drift, rotate: p.rotate }}
          transition={{
            delay: p.delay,
            duration: 1.15,
            ease: "easeOut",
          }}
        />
      ))}
    </div>
  );
}
