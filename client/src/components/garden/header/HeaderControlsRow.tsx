import { Sparkles, Volume2, VolumeX } from "lucide-react";

import { ThemeButtons } from "@/components/garden/ThemeButtons";
import { VolumePopover } from "@/components/garden/header/VolumePopover";

type HeaderControlsRowProps = {
  hoverEnabled: boolean;
  muted: boolean;
  volume: number;
  onToggleHover: () => void;
  onToggleMuted: () => void;
  onChangeVolume: (value: number) => void;
};

export function HeaderControlsRow({
  hoverEnabled,
  muted,
  volume,
  onToggleHover,
  onToggleMuted,
  onChangeVolume,
}: HeaderControlsRowProps) {
  return (
    <div className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-between gap-2">
      {/* Priority controls */}
      <div className="flex flex-wrap items-center justify-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          className="pixel-chip header-chip"
          onClick={onToggleHover}
          aria-label={hoverEnabled ? "Disable hover SFX" : "Enable hover SFX"}
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span className="hidden lg:inline">{hoverEnabled ? "Hover" : "Hover off"}</span>
        </button>

        <ThemeButtons />
      </div>

      {/* Compact audio controls */}
      <div className="flex items-center justify-center gap-2 w-full sm:w-auto">
        <button
          type="button"
          className="pixel-chip header-chip"
          onClick={onToggleMuted}
          aria-label={muted ? "Unmute SFX" : "Mute SFX"}
        >
          {muted ? (
            <VolumeX className="h-3.5 w-3.5" />
          ) : (
            <Volume2 className="h-3.5 w-3.5" />
          )}
          <span className="hidden lg:inline">{muted ? "Muted" : "Mute"}</span>
        </button>

        <VolumePopover value={volume} onChange={onChangeVolume} />
      </div>
    </div>
  );
}
