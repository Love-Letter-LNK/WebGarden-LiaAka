import { useRef, useState, useEffect, RefObject } from "react";
import { useScroll, useTransform, motion, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronDown } from "lucide-react";

interface SequenceScrollProps {
    onEnter: () => void;
    scrollRef: RefObject<HTMLElement>;
}

export function SequenceScroll({ onEnter, scrollRef }: SequenceScrollProps) {
    const [showButton, setShowButton] = useState(false);

    // Track parent scroll
    const { scrollYProgress } = useScroll({
        container: scrollRef,
    });

    const smoothProgress = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    useEffect(() => {
        const unsubscribe = smoothProgress.on("change", (v) => {
            if (v > 0.9) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        });
        return () => unsubscribe();
    }, [smoothProgress]);

    return (
        <div className="relative h-[700vh]">
            <div className="sticky top-0 h-screen overflow-hidden flex items-center justify-center">
                <ScrollScene progress={smoothProgress} showButton={showButton} onEnter={onEnter} />
            </div>
        </div>
    );
}

function ScrollScene({ progress, showButton, onEnter }: { progress: MotionValue<number>; showButton: boolean; onEnter: () => void }) {
    // --- ANIMATION TIMELINE ---

    // SCENE 1: INTRO (0.0 - 0.15)
    const introOp = useTransform(progress, [0, 0.05, 0.15], [1, 1, 0]);
    const introScale = useTransform(progress, [0, 0.15], [1, 0.8]);
    const introY = useTransform(progress, [0, 0.15], [0, -100]);

    // SCENE 2: CHARACTERS (0.2 - 0.4)
    const charOp = useTransform(progress, [0.15, 0.25, 0.35, 0.45], [0, 1, 1, 0]);
    const zekkX = useTransform(progress, [0.15, 0.3], [-100, 0]);
    const liaX = useTransform(progress, [0.15, 0.3], [100, 0]);

    // SCENE 3: DATE (0.5 - 0.7)
    const dateOp = useTransform(progress, [0.45, 0.5, 0.65, 0.7], [0, 1, 1, 0]);
    const dateScale = useTransform(progress, [0.5, 0.7], [0.8, 1.2]);

    // SCENE 4: FINALE (0.75 - 1.0)
    const finalOp = useTransform(progress, [0.75, 0.85, 1], [0, 1, 1]);

    // DECORATIONS PARALLAX
    const decorY1 = useTransform(progress, [0, 1], [0, -300]);
    const decorY2 = useTransform(progress, [0, 1], [0, -150]);
    const rotateDecor = useTransform(progress, [0, 1], [0, 360]);

    // Background Mood
    const bgColor = useTransform(progress,
        [0, 0.3, 0.6, 1],
        ["rgba(255, 240, 245, 0)", "rgba(224, 247, 250, 0.8)", "rgba(255, 245, 238, 0.9)", "rgba(255, 250, 250, 0.5)"]
    );

    return (
        <>
            <motion.div style={{ backgroundColor: bgColor }} className="absolute inset-0 -z-10 transition-colors duration-500" />

            {/* FLOATING DECORATIONS (Background Layer) */}
            <motion.div style={{ y: decorY1, rotate: rotateDecor }} className="absolute top-1/4 left-10 opacity-60">
                <img src="/love2.webp" className="w-8 md:w-16" alt="" />
            </motion.div>
            <motion.div style={{ y: decorY2 }} className="absolute bottom-1/3 right-10 opacity-50">
                <img src="/pixel sparkel.gif" className="w-12 md:w-24" alt="" />
            </motion.div>
            <motion.div style={{ y: decorY1 }} className="absolute top-10 right-20 opacity-40">
                <img src="/love3.webp" className="w-6 md:w-12" alt="" />
            </motion.div>

            {/* === SCENE 1: INTRO === */}
            <motion.div style={{ opacity: introOp, scale: introScale, y: introY }} className="absolute text-center px-4">
                <div className="mb-4 animate-pulse">
                    <img src="/pixel sparkel.gif" className="w-10 h-10 mx-auto" alt="" />
                </div>
                <h1 className="text-4xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 drop-shadow-sm leading-tight">
                    A TALE OF<br />TWO SOULS
                </h1>
                <div className="mt-8 opacity-60 text-slate-400 flex flex-col items-center gap-2">
                    <div className="text-[10px] uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full">Explore Our Story</div>
                    <ChevronDown className="animate-bounce" />
                </div>
            </motion.div>

            {/* === SCENE 2: AVATARS === */}
            <motion.div style={{ opacity: charOp }} className="absolute w-full px-4 flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 text-center">

                {/* ZEKK */}
                <motion.div style={{ x: zekkX }} className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-blue-200 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <img src="/zekk_pixel.webp" className="relative w-32 md:w-48 drop-shadow-2xl hover:scale-110 transition-transform" alt="Zekk" />
                        <div className="absolute -top-4 -right-4 animate-bounce delay-700">
                            <img src="/computer.webp" className="w-8 md:w-12" alt="" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-800">Zakaria Mujur Prasetyo</h2>
                        <span className="text-xs text-blue-500 font-bold tracking-widest bg-blue-50 px-2 py-1 rounded mt-2 inline-block">THE CREATOR</span>
                    </div>
                </motion.div>

                {/* HEART DIVIDER */}
                <div className="hidden md:block text-pink-300 animate-pulse">
                    <img src="/love2.webp" className="w-12" alt="&" />
                </div>

                {/* LIA */}
                <motion.div style={{ x: liaX }} className="flex flex-col items-center gap-4">
                    <div className="relative group">
                        <div className="absolute inset-0 bg-pink-200 rounded-full blur-xl opacity-50 group-hover:opacity-80 transition-opacity"></div>
                        <img src="/lia_pixel.webp" className="relative w-32 md:w-48 drop-shadow-2xl hover:scale-110 transition-transform" alt="Lia" />
                        <div className="absolute -top-4 -left-4 animate-bounce">
                            <img src="/kamera.webp" className="w-8 md:w-12" alt="" />
                        </div>
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-4xl font-bold text-slate-800">Lia Nur Khasanah</h2>
                        <span className="text-xs text-pink-500 font-bold tracking-widest bg-pink-50 px-2 py-1 rounded mt-2 inline-block">THE MUSE</span>
                    </div>
                </motion.div>
            </motion.div>

            {/* === SCENE 3: AUGUST 2025 === */}
            <motion.div style={{ opacity: dateOp, scale: dateScale }} className="absolute text-center">
                <div className="text-xl md:text-2xl text-slate-500 mb-6 font-serif italic flex items-center justify-center gap-2">
                    <img src="/book.webp" className="w-6 h-6 opacity-70" alt="" />
                    <span>It all officially began in...</span>
                </div>

                <div className="relative inline-block">
                    {/* Background elements */}
                    <div className="absolute -top-10 -left-10 animate-pulse opacity-60">
                        <img src="/love3.webp" className="w-12" alt="" />
                    </div>
                    <div className="absolute -bottom-5 -right-10 animate-bounce delay-100 opacity-60">
                        <img src="/kucing.webp" className="w-10" alt="" />
                    </div>

                    <div className="text-[60px] md:text-[100px] font-black leading-none text-slate-800/10 absolute top-2 left-2 select-none">
                        AUGUST
                    </div>
                    <div className="text-[60px] md:text-[100px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-pink-500 to-purple-600 drop-shadow-xl z-10 relative">
                        AUGUST
                    </div>
                    <div className="text-[80px] md:text-[140px] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-blue-500 to-cyan-500 drop-shadow-xl z-20 relative -mt-4 md:-mt-8 ml-10">
                        2025
                    </div>
                </div>
            </motion.div>

            {/* === SCENE 4: FINALE === */}
            <motion.div style={{ opacity: finalOp }} className="absolute text-center w-full max-w-4xl px-6 flex flex-col items-center">
                <div className="relative mb-8">
                    <div className="absolute -inset-4 bg-gradient-to-r from-pink-200 to-blue-200 rounded-2xl rotate-3 opacity-60 blur-md"></div>
                    <img src="/we.webp" className="relative w-48 md:w-64 rounded-xl border-4 border-white shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform duration-500" alt="Us" />
                    <div className="absolute -bottom-6 -right-6">
                        <img src="/pixel love.gif" className="w-16" alt="" />
                    </div>
                </div>

                <h3 className="text-3xl md:text-6xl font-black text-slate-800 mb-6 drop-shadow-sm">
                    Welcome to <span className="text-pink-500 inline-block border-b-4 border-pink-200 transform -rotate-1">Our Garden</span>
                </h3>

                <p className="text-lg md:text-2xl text-slate-600 leading-relaxed font-serif max-w-xl mx-auto italic">
                    "Every pixel here holds a memory, every line of code tells our story."
                </p>

                {/* ENTER BUTTON - Inside finale for proper flow */}
                <AnimatePresence>
                    {showButton && (
                        <motion.div
                            className="mt-8"
                            initial={{ opacity: 0, y: 30, scale: 0.8 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 20 }}
                            transition={{ type: "spring", bounce: 0.5, delay: 0.2 }}
                        >
                            <button
                                onClick={() => {
                                    const audio = new Audio("/mixkit-select-click-1109.wav");
                                    audio.volume = 0.5;
                                    audio.play().catch(() => { });
                                    onEnter();
                                }}
                                className="group relative flex items-center gap-3 bg-white text-pink-600 px-8 py-4 rounded-full font-bold hover:scale-110 active:scale-95 transition-all shadow-[0px_4px_20px_rgba(255,105,180,0.6)] animate-pulse"
                            >
                                <div className="absolute -top-6 -right-4">
                                    <img src="/pixel love.gif" className="w-8 h-8" alt="" />
                                </div>
                                <span className="uppercase tracking-widest text-sm md:text-base">ENTER GARDEN</span>
                                <div className="bg-pink-100 text-pink-600 rounded-full p-1 group-hover:bg-pink-600 group-hover:text-white transition-colors">
                                    <ArrowRight size={20} />
                                </div>
                            </button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* PROGRESS BAR */}
            <motion.div style={{ scaleX: progress }} className="fixed top-0 left-0 h-1.5 bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 w-full origin-left z-[60] shadow-md" />

        </>
    );
}
