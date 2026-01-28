import { useRef, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SequenceScroll } from "../components/garden/SequenceScroll";

interface LandingProps {
    onEnter: () => void;
}

interface LoveParticle {
    id: number;
    x: number;
    y: number;
}

const Landing = ({ onEnter }: LandingProps) => {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const [particles, setParticles] = useState<LoveParticle[]>([]);

    // CURSOR TRAIL LOGIC
    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            // Spawn a new heart every few pixels or frames?
            // Let's spawn continuously but remove them fast.
            if (Math.random() > 0.8) { // throttling
                const newParticle = {
                    id: Date.now() + Math.random(),
                    x: e.clientX,
                    y: e.clientY
                };
                setParticles((prev) => [...prev.slice(-20), newParticle]); // keep max 20
            }
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1, filter: "blur(20px)" }}
            transition={{ duration: 1.0, ease: "easeInOut" }}
            ref={scrollContainerRef}
            className="fixed inset-0 z-[100] bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 text-slate-800 font-pixel overflow-y-auto overflow-x-hidden no-scrollbar cursor-none" // hidden cursor for effect? or default? let's keep default but adding flair
        >
            {/* CURSOR LOVE TRAIL LAYER */}
            <div className="fixed inset-0 pointer-events-none z-[200] overflow-hidden">
                <AnimatePresence>
                    {particles.map((p) => (
                        <motion.img
                            key={p.id}
                            src="/love3.webp" // using the pixel heart asset
                            initial={{ opacity: 1, scale: 0.5, x: p.x, y: p.y }}
                            animate={{
                                opacity: 0,
                                scale: 1.5,
                                y: p.y - 50, // float up
                                x: p.x + (Math.random() * 20 - 10) // slight jitter
                            }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.8 }}
                            className="absolute w-4 h-4 md:w-6 md:h-6"
                            alt=""
                        />
                    ))}
                </AnimatePresence>
            </div>

            <SequenceScroll scrollRef={scrollContainerRef} onEnter={onEnter} />
        </motion.div>
    );
};

export default Landing;
