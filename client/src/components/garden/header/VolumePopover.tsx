import { Volume2 } from "lucide-react";

import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

type VolumePopoverProps = {
  value: number; // 0..1
  onChange: (value: number) => void;
};

export function VolumePopover({ value, onChange }: VolumePopoverProps) {
  const pct = Math.round(value * 100);

  return (
    <Popover>
      <PopoverTrigger asChild>
          <button type="button" className="pixel-chip header-chip" aria-label="Open volume controls">
          <Volume2 className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">Vol</span>
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" sideOffset={8} className="w-56">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs">Volume</span>
            <span className="text-xs text-muted-foreground tabular-nums">{pct}%</span>
          </div>
          <input
            aria-label="SFX volume"
            type="range"
            min={0}
            max={100}
            value={pct}
            onChange={(e) => onChange(Number(e.target.value) / 100)}
            className="h-6 w-full accent-[hsl(var(--primary))]"
          />
          <p className="text-[11px] text-muted-foreground">
            Tips: hover SFX bisa dimatikan kalau terasa rame.
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}
