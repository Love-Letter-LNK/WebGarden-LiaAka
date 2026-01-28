
import React from 'react';
import { MainLayout } from "../components/garden/MainLayout";
import { useMusic } from "@/context/MusicContext";
import { musicPlaylist } from "@/data/music";
import { Play, Pause, Music, Disc } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { useNavigate } from "react-router-dom";

const Playlist = () => {
    const { currentSong, isPlaying, playSong, togglePlay } = useMusic();
    const playSound = useSound();
    const navigate = useNavigate();

    return (
        <MainLayout>
            <div className="max-w-2xl mx-auto space-y-6">
                {/* Header */}
                <div className="text-center py-4 border-b-4 border-pink-300 border-dashed">
                    <h1 className="text-2xl font-black text-pink-500 mb-2 flex items-center justify-center gap-2">
                        <Music className="w-8 h-8 animate-bounce" />
                        OUR PLAYLIST
                        <Music className="w-8 h-8 animate-bounce" />
                    </h1>
                    <p className="text-xs text-gray-500 font-bold tracking-widest">SONGS THAT REMIND ME OF YOU</p>
                </div>

                {/* Now Playing Banner */}
                <div className="bg-gradient-to-r from-pink-100 to-blue-100 p-4 rounded-xl border-4 border-white shadow-xl flex items-center gap-4 relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 opacity-20">
                        <Disc size={100} className={isPlaying ? "animate-spin-slow" : ""} />
                    </div>

                    <div className="bg-white p-2 rounded-full border-2 border-pink-200 z-10">
                        <div className={`w-16 h-16 rounded-full bg-gray-800 flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
                            <div className="w-6 h-6 bg-pink-500 rounded-full border-2 border-white"></div>
                        </div>
                    </div>

                    <div className="flex-1 z-10">
                        <div className="text-[10px] font-bold text-pink-400 mb-1">NOW PLAYING</div>
                        <h2 className="text-lg font-bold text-gray-800 leading-tight">{currentSong.title}</h2>
                        <p className="text-sm text-gray-600">{currentSong.artist}</p>
                    </div>

                    <button
                        onClick={togglePlay}
                        className="w-12 h-12 bg-pink-500 hover:bg-pink-600 text-white rounded-full flex items-center justify-center border-4 border-pink-200 z-10 transition-transform hover:scale-110 active:scale-95"
                    >
                        {isPlaying ? <Pause fill="white" /> : <Play fill="white" className="ml-1" />}
                    </button>
                </div>

                {/* Song List */}
                <div className="space-y-2 bg-white/50 p-4 rounded-xl border-2 border-pink-100">
                    {musicPlaylist.map((song, index) => {
                        const isCurrent = currentSong.id === song.id;
                        return (
                            <div
                                key={song.id}
                                onClick={() => {
                                    if (isCurrent) {
                                        togglePlay();
                                    } else {
                                        playSong(index);
                                    }
                                    playSound('click');
                                }}
                                className={`
                                    group flex items-center gap-3 p-3 rounded-lg cursor-pointer border-2 transition-all duration-300
                                    ${isCurrent
                                        ? 'bg-pink-50 border-pink-400 shadow-md transform scale-[1.02]'
                                        : 'bg-white border-transparent hover:border-pink-200 hover:bg-pink-50/50'
                                    }
                                `}
                            >
                                <div className="text-gray-400 font-bold text-xs w-6 group-hover:text-pink-400">
                                    {isCurrent && isPlaying ? (
                                        <div className="flex gap-0.5 items-end h-3">
                                            <div className="w-1 bg-pink-400 animate-[bounce_1s_infinite] h-2"></div>
                                            <div className="w-1 bg-pink-400 animate-[bounce_1.2s_infinite] h-3"></div>
                                            <div className="w-1 bg-pink-400 animate-[bounce_0.8s_infinite] h-1"></div>
                                        </div>
                                    ) : (
                                        <span>#{index + 1}</span>
                                    )}
                                </div>

                                <div className="flex-1">
                                    <h3 className={`font-bold text-sm ${isCurrent ? 'text-pink-600' : 'text-gray-700'}`}>
                                        {song.title}
                                    </h3>
                                    <p className="text-[10px] text-gray-500">{song.artist}</p>
                                </div>

                                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                                    <div className="w-8 h-8 rounded-full bg-pink-100 flex items-center justify-center text-pink-500">
                                        {isCurrent && isPlaying ? <Pause size={14} /> : <Play size={14} className="ml-0.5" />}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="text-center pt-8">
                    <button
                        onClick={() => navigate('/')}
                        className="text-xs text-gray-400 hover:text-pink-500 underline"
                    >
                        ← Back to Home
                    </button>
                </div>
            </div>
        </MainLayout>
    );
};

export default Playlist;
