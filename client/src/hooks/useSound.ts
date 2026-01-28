import { useCallback, useRef, useEffect } from "react";

// SFX using actual WAV files + Web Audio API fallback
export const useSound = () => {
    // Pre-load audio elements for better performance
    const clickAudioRef = useRef<HTMLAudioElement | null>(null);
    const hoverAudioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        // Pre-load the audio files
        clickAudioRef.current = new Audio('/mixkit-cool-interface-click-tone-2568.wav');
        clickAudioRef.current.volume = 0.5;

        hoverAudioRef.current = new Audio('/mixkit-select-click-1109.wav');
        hoverAudioRef.current.volume = 0.3;

        return () => {
            clickAudioRef.current = null;
            hoverAudioRef.current = null;
        };
    }, []);

    const playSound = useCallback((type: 'click' | 'hover' | 'success' | 'error') => {
        if (type === 'click') {
            // Use click WAV file
            if (clickAudioRef.current) {
                clickAudioRef.current.currentTime = 0;
                clickAudioRef.current.play().catch(() => { });
            }
        }
        else if (type === 'hover') {
            // Use select/hover WAV file
            if (hoverAudioRef.current) {
                hoverAudioRef.current.currentTime = 0;
                hoverAudioRef.current.play().catch(() => { });
            }
        }
        else if (type === 'success') {
            // Keep Web Audio API for success sound (retro power up)
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            // Retro Power Up
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(400, now);
            osc.frequency.linearRampToValueAtTime(600, now + 0.1);
            osc.frequency.linearRampToValueAtTime(1000, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.4);

            osc.start(now);
            osc.stop(now + 0.4);
        }
        else if (type === 'error') {
            // Error/Failure sound (descending low tone)
            const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
            if (!AudioContext) return;

            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.connect(gain);
            gain.connect(ctx.destination);

            const now = ctx.currentTime;

            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(150, now);
            osc.frequency.linearRampToValueAtTime(100, now + 0.3);

            gain.gain.setValueAtTime(0.1, now);
            gain.gain.linearRampToValueAtTime(0, now + 0.3);

            osc.start(now);
            osc.stop(now + 0.3);
        }
    }, []);

    return playSound;
};

