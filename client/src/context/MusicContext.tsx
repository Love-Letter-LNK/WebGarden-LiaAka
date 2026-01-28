
import React, { createContext, useState, useContext, useRef, useEffect, ReactNode } from 'react';
import { musicPlaylist, Song } from '@/data/music';

interface MusicContextType {
    currentSong: Song;
    isPlaying: boolean;
    isMuted: boolean;
    togglePlay: () => void;
    toggleMute: () => void;
    playSong: (index: number) => void;
    nextSong: () => void;
    prevSong: () => void;
    audioRef: React.RefObject<HTMLAudioElement>;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export const MusicProvider = ({ children }: { children: ReactNode }) => {
    const [currentSongIndex, setCurrentSongIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isMuted, setIsMuted] = useState(false);
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

    const togglePlay = () => setIsPlaying(!isPlaying);
    const toggleMute = () => setIsMuted(!isMuted);

    const playSong = (index: number) => {
        if (index >= 0 && index < musicPlaylist.length) {
            setCurrentSongIndex(index);
            setIsPlaying(true);
        }
    };

    const nextSong = () => {
        setCurrentSongIndex((prev) => (prev + 1) % musicPlaylist.length);
        setIsPlaying(true);
    };

    const prevSong = () => {
        setCurrentSongIndex((prev) => (prev - 1 + musicPlaylist.length) % musicPlaylist.length);
        setIsPlaying(true);
    };

    return (
        <MusicContext.Provider value={{
            currentSong,
            isPlaying,
            isMuted,
            togglePlay,
            toggleMute,
            playSong,
            nextSong,
            prevSong,
            audioRef
        }}>
            {children}
        </MusicContext.Provider>
    );
};

export const useMusic = () => {
    const context = useContext(MusicContext);
    if (context === undefined) {
        throw new Error('useMusic must be used within a MusicProvider');
    }
    return context;
};
