import { useEffect, useState } from "react";

interface Decoration {
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
    type: 'sparkle' | 'love';
}

export const SparkleEffect = () => {
    const [decorations, setDecorations] = useState<Decoration[]>([]);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        // Check if mobile
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };

        checkMobile();
        window.addEventListener('resize', checkMobile);

        // Create random decorations (mix of sparkles and loves)
        const createDecorations = () => {
            const newDecorations: Decoration[] = [];
            const isMobileView = window.innerWidth < 768;

            // Fewer decorations on mobile
            const sparkleCount = isMobileView ? 4 : 12;
            const loveCount = isMobileView ? 3 : 8;

            // Create sparkles
            for (let i = 0; i < sparkleCount; i++) {
                newDecorations.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: isMobileView ? Math.random() * 12 + 8 : Math.random() * 20 + 15, // smaller on mobile
                    delay: Math.random() * 3,
                    type: 'sparkle',
                });
            }

            // Create love hearts
            for (let i = sparkleCount; i < sparkleCount + loveCount; i++) {
                newDecorations.push({
                    id: i,
                    x: Math.random() * 100,
                    y: Math.random() * 100,
                    size: isMobileView ? Math.random() * 10 + 6 : Math.random() * 18 + 12, // smaller on mobile
                    delay: Math.random() * 4,
                    type: 'love',
                });
            }

            setDecorations(newDecorations);
        };

        createDecorations();

        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Hide completely on mobile
    if (isMobile) {
        return null;
    }

    return (
        <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
            {/* Random Pixel Sparkle & Love GIFs - Desktop only */}
            {decorations.map((dec) => (
                <img
                    key={dec.id}
                    src={dec.type === 'sparkle' ? "/pixel sparkel.gif" : "/pixel love.gif"}
                    alt=""
                    className="absolute animate-float opacity-60"
                    style={{
                        left: `${dec.x}%`,
                        top: `${dec.y}%`,
                        width: `${dec.size}px`,
                        height: `${dec.size}px`,
                        animationDelay: `${dec.delay}s`,
                        animationDuration: `${3 + Math.random() * 3}s`,
                    }}
                />
            ))}
        </div>
    );
};




