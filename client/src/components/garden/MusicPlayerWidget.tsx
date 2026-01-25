import { Pause, Play, Volume2 } from "lucide-react";
import { useState } from "react";

export const MusicPlayerWidget = () => {
  const [playing, setPlaying] = useState(false);

  return (
    <aside className="fixed bottom-4 right-4 z-50 w-[260px]">
      <div className="pixel-panel p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-muted-foreground">Now Playing</p>
            <p className="text-sm">Our Theme Song (UI)</p>
          </div>

          <button
            type="button"
            className="pixel-button px-3 py-2"
            onClick={() => setPlaying((v) => !v)}
            aria-label={playing ? "Pause" : "Play"}
          >
            {playing ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <Volume2 className="h-4 w-4 text-muted-foreground" />
          <div className="h-2 flex-1 rounded-full bg-muted border-2 overflow-hidden">
            <div className="h-full w-1/2 bg-secondary" />
          </div>
        </div>
      </div>
    </aside>
  );
};
