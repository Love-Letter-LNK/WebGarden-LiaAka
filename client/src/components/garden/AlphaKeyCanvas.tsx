import { useEffect, useMemo, useRef, useState } from "react";

type RGB = { r: number; g: number; b: number };

type AlphaKeyCanvasProps = {
  src: string;
  className?: string;
  style?: React.CSSProperties;
  /**
   * Colors to be removed (made transparent). Defaults to common PNG-checkerboard grays.
   */
  keyColors?: RGB[];
  /** Per-channel tolerance when matching key colors. */
  tolerance?: number;
};

const DEFAULT_KEYS: RGB[] = [
  { r: 230, g: 230, b: 230 }, // #e6e6e6
  { r: 242, g: 242, b: 242 }, // #f2f2f2
  { r: 238, g: 238, b: 238 },
  { r: 246, g: 246, b: 246 },
];

const near = (a: number, b: number, tol: number) => Math.abs(a - b) <= tol;

/**
 * Utility for assets that accidentally include a checkerboard background baked into the PNG.
 * Renders a canvas where those specific gray squares are keyed out to transparency.
 */
export const AlphaKeyCanvas = ({
  src,
  className,
  style,
  keyColors,
  tolerance = 8,
}: AlphaKeyCanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [failed, setFailed] = useState(false);

  const keys = useMemo(() => keyColors ?? DEFAULT_KEYS, [keyColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const img = new Image();
    img.decoding = "async";
    img.loading = "eager";
    img.src = src;

    const onError = () => setFailed(true);

    const onLoad = () => {
      const w = img.naturalWidth || img.width;
      const h = img.naturalHeight || img.height;
      if (!w || !h) return;

      canvas.width = w;
      canvas.height = h;

      const ctx = canvas.getContext("2d", { willReadFrequently: true });
      if (!ctx) return;

      ctx.clearRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0);

      const imageData = ctx.getImageData(0, 0, w, h);
      const d = imageData.data;

      for (let i = 0; i < d.length; i += 4) {
        const r = d[i];
        const g = d[i + 1];
        const b = d[i + 2];
        const a = d[i + 3];
        if (a === 0) continue;

        const isKey = keys.some((k) =>
          near(r, k.r, tolerance) && near(g, k.g, tolerance) && near(b, k.b, tolerance)
        );

        if (isKey) {
          d[i + 3] = 0;
        }
      }

      ctx.putImageData(imageData, 0, 0);
    };

    img.addEventListener("load", onLoad);
    img.addEventListener("error", onError);
    return () => {
      img.removeEventListener("load", onLoad);
      img.removeEventListener("error", onError);
    };
  }, [keys, src, tolerance]);

  if (failed) {
    return (
      <img
        src={src}
        alt=""
        aria-hidden
        className={className}
        style={{ imageRendering: "pixelated", ...style }}
        loading="lazy"
      />
    );
  }

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ imageRendering: "pixelated", ...style }}
      aria-hidden
    />
  );
};
