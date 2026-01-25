import { motion, useReducedMotion } from "framer-motion";
import pixelCloudSparkle from "@/assets/pixel-cloud-sparkle.png";
import pixelStickersExtra from "@/assets/pixel-stickers-extra.png";
import { AlphaKeyCanvas } from "@/components/garden/AlphaKeyCanvas";

type AmbientSparklesProps = {
  className?: string;
};

/**
 * Ambient decorative layer: subtle twinkle + float.
 * Prefers-reduced-motion friendly.
 */
export const AmbientSparkles = ({ className }: AmbientSparklesProps) => {
  const reduce = useReducedMotion();

  return (
    <div
      className={
        "pointer-events-none absolute inset-0 overflow-hidden " + (className ?? "")
      }
      aria-hidden
    >
      {/* Soft dreamy haze (CSS gradients using theme tokens) */}
      <div
        className="absolute -top-24 -left-24 h-[420px] w-[520px] blur-3xl"
        style={{
          opacity: 0.55,
          background:
            "radial-gradient(closest-side, hsl(var(--haze-a) / 0.45), transparent 70%)",
        }}
      />
      <div
        className="absolute -bottom-28 -right-28 h-[460px] w-[560px] blur-3xl"
        style={{
          opacity: 0.5,
          background:
            "radial-gradient(closest-side, hsl(var(--haze-b) / 0.42), transparent 70%)",
        }}
      />

      {/* Top-left cloud */}
      <motion.div
        className="absolute -top-14 -left-16 w-64 opacity-40"
        animate={
          reduce
            ? undefined
            : {
                y: [0, -8, 0],
                opacity: [0.34, 0.5, 0.34],
              }
        }
        transition={
          reduce ? undefined : { duration: 6.5, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AlphaKeyCanvas src={pixelCloudSparkle} className="w-full h-auto" />
      </motion.div>

      {/* Bottom-right stickers */}
      <motion.div
        className="absolute -bottom-16 -right-16 w-72 opacity-45"
        animate={
          reduce
            ? undefined
            : {
                y: [0, 10, 0],
                opacity: [0.38, 0.52, 0.38],
              }
        }
        transition={
          reduce ? undefined : { duration: 7.2, repeat: Infinity, ease: "easeInOut" }
        }
      >
        <AlphaKeyCanvas src={pixelStickersExtra} className="w-full h-auto" />
      </motion.div>

      {/* Tiny twinkles (CSS-only dots using tokens) */}
      {!reduce && (
        <>
          <motion.div
            className="absolute left-16 top-24 h-2 w-2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 0 2px hsl(var(--background))" }}
            animate={{ opacity: [0.15, 0.6, 0.15], scale: [0.9, 1.2, 0.9] }}
            transition={{ duration: 2.8, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute right-24 top-44 h-2 w-2 rounded-full bg-secondary"
            style={{ boxShadow: "0 0 0 2px hsl(var(--background))" }}
            animate={{ opacity: [0.1, 0.55, 0.1], scale: [0.85, 1.15, 0.85] }}
            transition={{ duration: 3.3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute left-1/2 top-16 h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary"
            style={{ boxShadow: "0 0 0 2px hsl(var(--background))" }}
            animate={{ opacity: [0.08, 0.45, 0.08], scale: [0.9, 1.25, 0.9] }}
            transition={{ duration: 3.9, repeat: Infinity, ease: "easeInOut" }}
          />
        </>
      )}
    </div>
  );
};
