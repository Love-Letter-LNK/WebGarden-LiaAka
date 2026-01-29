import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SparkleEffect } from "@/components/garden/SparkleEffect";
import { CursorSparkles } from "@/components/garden/CursorSparkles";

interface MainLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean; // Optional: if we want to enforce sidebars later
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const playSound = useSound();
    const location = useLocation();

    // Helper to check active link
    const isActive = (path: string) => location.pathname === path;

    // Global Click Listener for SFX
    React.useEffect(() => {
        const handleGlobalClick = (e: MouseEvent) => {
            const target = e.target as HTMLElement;
            // Check if the clicked element or its parent is interactive
            const interactiveElement = target.closest('button, a, [role="button"], input[type="submit"], input[type="button"], .interactive');

            if (interactiveElement) {
                // We can play the sound here. 
                playSound('click');
            }
        };

        window.addEventListener('click', handleGlobalClick);
        return () => window.removeEventListener('click', handleGlobalClick);
    }, [playSound]);

    return (
        // OUTER WRAPPER: Handles the centering and width constraints directly
        <div className="w-full md:w-[90%] lg:w-[65%] xl:w-[50%] mx-auto bg-white dark:bg-slate-900 min-h-screen border-x-4 border-pink-300 dark:border-blue-500 border-dashed shadow-2xl flex flex-col relative font-pixel transition-colors duration-500">
            {/* Sparkle Effect Background (Inside the box) */}
            <SparkleEffect />
            <CursorSparkles />

            {/* HEADER BANNER AREA */}
            <header className="bg-pink-100 dark:bg-slate-800 p-2 pb-0 relative z-20 transition-colors duration-500">
                {/* Header Corner Decorations - Desktop only */}
                <div className="hidden md:block">
                    <img src="/pita.webp" alt="" className="absolute -top-2 -left-2 w-28 z-20 pointer-events-none animate-pulse dark:hue-rotate-180" style={{ animationDuration: '3s' }} />
                    <img src="/love3.webp" alt="" className="absolute top-2 right-20 w-10 z-20 pointer-events-none opacity-80" />
                </div>

                <div className="bg-white dark:bg-slate-950 border-2 border-pink-300 dark:border-blue-500 rounded-t-xl p-4 flex items-center justify-between relative overflow-hidden h-32 md:h-40 transition-colors duration-500">
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hearts.png')] dark:bg-[url('https://www.transparenttextures.com/patterns/stardust.png')]"></div>

                    {/* Logo / Title */}
                    <div className="z-10 flex flex-col cursor-default">
                        <div className="flex items-center gap-1 md:gap-2 mb-1">
                            <Heart className="text-pink-500 dark:text-blue-500 fill-pink-500 dark:fill-blue-500 animate-bounce w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-pink-400 dark:text-blue-400 font-pixel text-[6px] md:text-xs">Official Digital Garden</span>
                        </div>
                        <Link to="/" className="hover:opacity-80 transition-opacity">
                            <h1 className="text-lg md:text-4xl font-black drop-shadow-sm flex items-center gap-2">
                                <span className="text-blue-500 dark:text-cyan-400">AKA</span>
                                <span className="text-purple-400 text-2xl md:text-3xl">&</span>
                                <span className="text-pink-500 dark:text-indigo-400">LIA</span>
                            </h1>
                        </Link>
                        <span className="text-gray-400 text-[6px] md:text-[10px] tracking-widest font-bold">KENANGAN PERJALANAN CINTA</span>
                    </div>

                    {/* Theme Toggle */}
                    <div className="absolute top-2 right-2 z-30">
                        <ThemeToggle />
                    </div>

                    {/* Pixel Avatars in Header */}
                    <div className="flex gap-3 z-10 items-end">
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-20 bg-blue-100 dark:bg-slate-700 border-2 border-blue-400 dark:border-cyan-500 rounded-lg cursor-pointer group-hover:scale-110 transition-transform overflow-hidden shadow-md">
                                <img src="/zekk_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Aka" />
                            </div>
                            <span className="text-[9px] font-bold text-blue-500 dark:text-cyan-400 bg-white dark:bg-slate-800 px-2 rounded-full -mt-2 border border-blue-200 dark:border-cyan-800 shadow-sm">AKA</span>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-20 bg-pink-100 dark:bg-slate-700 border-2 border-pink-400 dark:border-indigo-500 rounded-lg cursor-pointer group-hover:scale-110 transition-transform overflow-hidden shadow-md">
                                <img src="/lia_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Lia" />
                            </div>
                            <span className="text-[9px] font-bold text-pink-500 dark:text-indigo-400 bg-white dark:bg-slate-800 px-2 rounded-full -mt-2 border border-pink-200 dark:border-indigo-800 shadow-sm">LIA</span>
                        </div>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className="grid grid-cols-6 gap-1 mt-2 px-2">
                    {['/', '/news', '/profile', '/memories', '/guide', '/contact'].map((path) => {
                        const labels: Record<string, string> = {
                            '/': 'HOME',
                            '/news': 'NEWS',
                            '/profile': 'PROFILE',
                            '/memories': 'GALLERY',
                            '/guide': 'GUIDE',
                            '/contact': 'CONTACT'
                        };

                        // COLOR MAPPING (Light/Dark)
                        const getTabColor = (p: string) => {
                            if (p === '/') return 'bg-rose-400 dark:bg-indigo-600';
                            if (p === '/memories' || p === '/guide') return 'bg-blue-200 text-blue-900 dark:bg-cyan-800 dark:text-cyan-100';
                            return 'bg-pink-300 dark:bg-slate-600';
                        };

                        const label = labels[path];
                        const colorClass = getTabColor(path);
                        const activeClass = isActive(path) ? 'ring-2 ring-white scale-95 brightness-90' : '';

                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`rainbow-tab ${colorClass} ${activeClass} text-[8px] md:text-[10px] hover:brightness-110 transition-colors duration-300`}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white dark:bg-slate-900 p-2 text-slate-800 dark:text-slate-200 transition-colors duration-500">
                {children}
            </div>

            {/* FOOTER */}
            <footer className="bg-pink-100 dark:bg-slate-800 border-t-4 border-pink-300 dark:border-blue-500 p-4 text-center mt-auto relative z-10 transition-colors duration-500">
                <img src="/love2.webp" alt="" className="w-8 mx-auto mb-2 opacity-80" />
                <p className="text-[10px] text-pink-400 dark:text-blue-300 font-bold">© {new Date().getFullYear()} AKA & LIA. All Rights Reserved.</p>

                <div className="flex justify-center items-end gap-3 mt-2">
                    <div className="w-10 h-12 overflow-hidden">
                        <img src="/zekk_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Aka" />
                    </div>

                    <div className="flex items-center gap-2">
                        <img src="/love3.webp" alt="" className="w-5 h-5 object-contain" />
                        <span className="px-4 py-1 bg-white dark:bg-slate-900 border border-pink-300 dark:border-blue-500 rounded-full text-[8px] text-pink-400 dark:text-blue-300 font-bold">♥ TOGETHER FOREVER ♥</span>
                        <img src="/love3.webp" alt="" className="w-5 h-5 object-contain" />
                    </div>

                    <div className="w-10 h-12 overflow-hidden">
                        <img src="/lia_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Lia" />
                    </div>
                </div>
            </footer>
        </div>
    );
};
