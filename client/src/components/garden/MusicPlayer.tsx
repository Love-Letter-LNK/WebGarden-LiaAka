import { useState, useRef, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Music } from "lucide-react";
import { musicPlaylist } from "@/data/music";

export const MusicPlayer = () => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
    const [isExpanded, setIsExpanded] = useState(true); // Toggle for compact/expanded view
    const audioRef = useRef<HTMLAudioElement>(null);

    const currentSong = musicPlaylist[currentSongIndex];

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play().catch(() => setIsPlaying(false));
            } else {
                audioRef.current.pause();
            }
        }
    }, [isPlaying, currentSongIndex]);

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.muted = isMuted;
        }
    }, [isMuted]);

    const handleSongEnd = () => {
        nextSong();
    };

    const togglePlay = () => {
        setIsPlaying(!isPlaying);
    };

    const toggleMute = () => {
        setIsMuted(!isMuted);
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % musicPlaylist.length);
        if (isPlaying) {
            setTimeout(() => audioRef.current?.play(), 100);
        }
    };

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length);
        if (isPlaying) {
            setTimeout(() => audioRef.current?.play(), 100);
        }
    };

    return (
        <div className="fixed bottom-4 left-4 z-50 flex items-end">
            {/* Hidden Audio Element */}
            <audio
                ref={audioRef}
                src={currentSong.src}
                onEnded={handleSongEnd}
            />

            {/* Main Player Container */}
            <div className={`bg-white/90 backdrop-blur-sm border-2 border-pink-300 rounded-xl shadow-xl transition-all duration-300 overflow-hidden ${isExpanded ? 'w-64 p-3' : 'w-12 h-12 p-0 flex items-center justify-center'}`}>

                {/* Collapsed View (Icon Only) */}
                {!isExpanded && (
                    <button
                        onClick={() => setIsExpanded(true)}
                        className="w-full h-full flex items-center justify-center text-pink-500 hover:bg-pink-50"
                        title="Show Music Player"
                    >
                        <Music size={20} className={isPlaying ? "animate-bounce" : ""} />
                    </button>
                )}

                {/* Expanded View */}
                {isExpanded && (
                    <div className="space-y-3">
                        {/* Header with Minimize */}
                        <div className="flex items-center justify-between border-b border-pink-100 pb-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${isPlaying ? 'bg-green-400 animate-pulse' : 'bg-gray-300'}`}></div>
                                <span className="text-[10px] font-bold text-pink-500">NOW PLAYING</span>
                            </div>
                            <button
                                onClick={() => setIsExpanded(false)}
                                className="text-gray-400 hover:text-pink-500 transition-colors"
                            >
                                <span className="text-[10px]">▼</span>
                            </button>
                        </div>

                        {/* Song Info */}
                        <div className="text-center">
                            <div className="overflow-hidden mb-1">
                                <div className="text-[10px] font-bold text-gray-700 whitespace-nowrap animate-marquee">
                                    {currentSong.title}
                                </div>
                            </div>
                            <div className="text-[9px] text-pink-400 truncate">
                                {currentSong.artist}
                            </div>
                        </div>

                        {/* Controls */}
                        <div className="flex items-center justify-center gap-3">
                            <button
                                onClick={prevSong}
                                className="text-pink-400 hover:text-pink-600 transition-colors"
                                title="Previous"
                            >
                                <SkipBack size={16} />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="w-8 h-8 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center text-white shadow-md hover:scale-105 transition-transform"
                                title={isPlaying ? "Pause" : "Play"}
                            >
                                {isPlaying ? (
                                    <Pause size={14} />
                                ) : (
                                    <Play size={14} className="ml-0.5" />
                                )}
                            </button>

                            <button
                                onClick={nextSong}
                                className="text-pink-400 hover:text-pink-600 transition-colors"
                                title="Next"
                            >
                                <SkipForward size={16} />
                            </button>
                        </div>

                        {/* Volume/Mute */}
                        <button
                            onClick={toggleMute}
                            className="absolute top-3 right-8 text-gray-400 hover:text-pink-400"
                            title={isMuted ? "Unmute" : "Mute"}
                        >
                            {isMuted ? <VolumeX size={12} /> : <Volume2 size={12} />}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};
