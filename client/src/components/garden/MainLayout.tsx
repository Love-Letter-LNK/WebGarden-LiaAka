import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Heart } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SparkleEffect } from "@/components/garden/SparkleEffect";

interface MainLayoutProps {
    children: React.ReactNode;
    showSidebar?: boolean; // Optional: if we want to enforce sidebars later
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
    const playSound = useSound();
    const location = useLocation();

    // Helper to check active link
    const isActive = (path: string) => location.pathname === path;

    return (
        <div className="shop-container flex flex-col border-x-8 border-pink-200 min-h-screen relative font-pixel">
            {/* Sparkle Effect Background */}
            <SparkleEffect />

            {/* HEADER BANNER AREA */}
            <header className="bg-pink-100 p-2 pb-0 relative z-20">
                {/* Header Corner Decorations - Desktop only */}
                <div className="hidden md:block">
                    <img src="/pita.png" alt="" className="absolute -top-2 -left-2 w-28 z-20 pointer-events-none animate-pulse" style={{ animationDuration: '3s' }} />
                    <img src="/love3.png" alt="" className="absolute top-2 right-20 w-10 z-20 pointer-events-none opacity-80" />
                </div>

                <div className="bg-white border-2 border-pink-300 rounded-t-xl p-4 flex items-center justify-between relative overflow-hidden h-32 md:h-40">
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hearts.png')]"></div>

                    {/* Logo / Title */}
                    <div className="z-10 flex flex-col cursor-default">
                        <div className="flex items-center gap-1 md:gap-2 mb-1">
                            <Heart className="text-pink-500 fill-pink-500 animate-bounce w-4 h-4 md:w-5 md:h-5" />
                            <span className="text-pink-400 font-pixel text-[6px] md:text-xs">Official Digital Garden</span>
                        </div>
                        <Link to="/" className="hover:opacity-80 transition-opacity">
                            <h1 className="text-lg md:text-4xl font-black drop-shadow-sm flex items-center gap-2">
                                <span className="text-blue-500">ZEKK</span>
                                <span className="text-purple-400 text-2xl md:text-3xl">&</span>
                                <span className="text-pink-500">LIA</span>
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
                            <div className="w-16 h-20 bg-blue-100 border-2 border-blue-400 rounded-lg cursor-pointer group-hover:scale-110 transition-transform overflow-hidden shadow-md">
                                <img src="/zekk_pixel.png" className="w-full h-[180%] object-cover object-top" alt="Zekk" />
                            </div>
                            <span className="text-[9px] font-bold text-blue-500 bg-white px-2 rounded-full -mt-2 border border-blue-200 shadow-sm">ZEKK</span>
                        </div>
                        <div className="flex flex-col items-center group">
                            <div className="w-16 h-20 bg-pink-100 border-2 border-pink-400 rounded-lg cursor-pointer group-hover:scale-110 transition-transform overflow-hidden shadow-md">
                                <img src="/lia_pixel.png" className="w-full h-[180%] object-cover object-top" alt="Lia" />
                            </div>
                            <span className="text-[9px] font-bold text-pink-500 bg-white px-2 rounded-full -mt-2 border border-pink-200 shadow-sm">LIA</span>
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
                        const label = labels[path];
                        const isSecondary = path === '/guide' || path === '/memories'; // Example style choice
                        const bgClass = isSecondary ? 'bg-[var(--theme-secondary)]' : 'bg-[var(--theme-primary)]';

                        return (
                            <Link
                                key={path}
                                to={path}
                                className={`rainbow-tab ${bgClass} hover:brightness-110 ${isActive(path) ? 'brightness-90 translate-y-1' : ''}`}
                                onClick={() => playSound('click')}
                                onMouseEnter={() => playSound('hover')}
                            >
                                {label}
                            </Link>
                        );
                    })}
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white p-2">
                {children}
            </div>

            {/* FOOTER */}
            <footer className="bg-pink-100 border-t-4 border-pink-300 p-4 text-center mt-auto relative z-10">
                <img src="/love2.png" alt="" className="w-8 mx-auto mb-2 opacity-80" />
                <p className="text-[10px] text-pink-400 font-bold">© {new Date().getFullYear()} ZEKK & LIA. All Rights Reserved.</p>

                <div className="flex justify-center items-end gap-3 mt-2">
                    <div className="w-10 h-12 overflow-hidden">
                        <img src="/zekk_pixel.png" className="w-full h-[180%] object-cover object-top" alt="Zekk" />
                    </div>

                    <div className="flex items-center gap-2">
                        <img src="/love3.png" alt="" className="w-5 h-5 object-contain" />
                        <span className="px-4 py-1 bg-white border border-pink-300 rounded-full text-[8px] text-pink-400 font-bold">♥ TOGETHER FOREVER ♥</span>
                        <img src="/love3.png" alt="" className="w-5 h-5 object-contain" />
                    </div>

                    <div className="w-10 h-12 overflow-hidden">
                        <img src="/lia_pixel.png" className="w-full h-[180%] object-cover object-top" alt="Lia" />
                    </div>
                </div>
            </footer>
        </div>
    );
};
