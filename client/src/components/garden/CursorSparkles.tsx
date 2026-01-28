import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    color: string;
    speedX: number;
    speedY: number;
    life: number;
}

export const CursorSparkles = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const particles = useRef<Particle[]>([]);
    const requestRef = useRef<number>();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Resize canvas to window size
        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener("resize", handleResize);
        handleResize();

        // Colors: Pink, Blue, Yellow, White (Pastel Retro)
        const colors = ["#FFB7B2", "#B5EAD7", "#E2F0CB", "#FF9AA2", "#ffffff"];

        const createParticle = (x: number, y: number) => {
            const size = Math.random() * 4 + 1; // 1px to 5px
            const color = colors[Math.floor(Math.random() * colors.length)];
            const speedX = Math.random() * 2 - 1;
            const speedY = Math.random() * 2 - 1;

            particles.current.push({
                x,
                y,
                size,
                color,
                speedX,
                speedY,
                life: 1.0, // 100% opacity
            });
        };

        const handleMouseMove = (e: MouseEvent) => {
            // Create a few particles per move for density
            for (let i = 0; i < 2; i++) {
                createParticle(e.clientX, e.clientY);
            }
        };
        window.addEventListener("mousemove", handleMouseMove);

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and draw particles
            particles.current.forEach((p, index) => {
                p.life -= 0.02; // Fade out speed
                p.x += p.speedX;
                p.y += p.speedY;

                if (p.life <= 0) {
                    particles.current.splice(index, 1);
                } else {
                    ctx.beginPath();
                    ctx.fillStyle = p.color;
                    ctx.globalAlpha = p.life;
                    // Draw squares for pixel feel
                    ctx.fillRect(p.x, p.y, p.size, p.size);
                    ctx.globalAlpha = 1.0;
                }
            });

            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);

        return () => {
            window.removeEventListener("resize", handleResize);
            window.removeEventListener("mousemove", handleMouseMove);
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="fixed top-0 left-0 w-full h-full pointer-events-none z-[9999]"
            style={{ mixBlendMode: 'screen' }}
        />
    );
};
