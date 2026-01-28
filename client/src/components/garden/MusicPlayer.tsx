import { useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { useMusic } from "@/context/MusicContext";

export const MusicPlayer = () => {
    const {
        currentSong,
        isPlaying,
        isMuted,
        togglePlay,
        toggleMute,
        nextSong,
        prevSong,
        audioRef
    } = useMusic();

    // UI state only
    const [isExpanded, setIsExpanded] = useState(true);

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-end font-pixel">
            {/* Hidden Audio Element - controlled by Context via Ref */}
            <audio
                ref={audioRef}
                src={currentSong.src}
                onEnded={nextSong}
            />

            {/* Main Player Container */}
            <div className={`bg-white border-4 border-pink-300 shadow-[4px_4px_0px_0px_rgba(255,182,193,1)] transition-all duration-300 overflow-hidden ${isExpanded ? 'w-64 p-2' : 'w-12 h-12 p-0 flex items-center justify-center'}`}>

                {/* Collapsed View (Icon Only) */}
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full h-full flex items-center justify-center text-pink-500 hover:bg-pink-50 active:bg-pink-100"
                        title="Show Music Player"
                    >
                        <Music size={20} className={isPlaying ? "animate-bounce" : ""} />
                    </button>
                )}

                {/* Expanded View */}
                {isExpanded && (
                    <div className="space-y-2">
                        {/* Header with Minimize */}
                        <div className="flex items-center justify-between border-b-2 border-pink-100 pb-1 bg-pink-50 p-1 -mx-1 -mt-1 mb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-3 h-3 border-2 border-black ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                <span className="text-[8px] font-bold text-pink-500 uppercase">Now Playing</span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-pink-400 hover:text-pink-600 transition-colors border-2 border-transparent hover:border-pink-200 px-1"
                            >
                                <span className="text-[10px]">_</span>
                            </button>
                        </div>

                        {/* Song Info */}
                        <div className="text-center border-2 border-dashed border-pink-200 bg-pink-50/50 p-1 mb-2">
                            <div className="overflow-hidden mb-1">
                                <div className="text-[10px] font-bold text-gray-700 whitespace-nowrap animate-marquee">
                                    {currentSong.title}
                                </div>
                            </div>
                            <div className="text-[8px] text-pink-400 truncate font-bold">
                                {currentSong.artist}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-2 bg-pink-100 p-1 border-2 border-pink-200">
                            <button
                                onClick={prevSong}
                                className="text-pink-500 hover:text-pink-700 active:scale-95 transition-transform"
                                title="Previous"
                            >
                                <SkipBack size={14} />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-8 h-8 bg-pink-500 border-b-4 border-pink-700 active:border-b-0 active:translate-y-1 text-white flex items-center justify-center hover:brightness-110 transition-all"
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <Pause size={12} fill="white" />
                                ) : (
                                    <Play size={12} fill="white" className="ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={nextSong}
                                className="text-pink-500 hover:text-pink-700 active:scale-95 transition-transform"
                                title="Next"
                            >
                                <SkipForward size={14} />
                            </button>
                        </div>

                        {/* Volume/Mute */}
                        <button
                            onClick={toggleMute}
                            className="absolute top-2 right-8 text-pink-300 hover:text-pink-500"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

