import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Heart, LogOut, Home, Image, Newspaper, Map, Users, Mail, Camera, Settings, Star, Globe, Eye } from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { SparkleEffect } from "@/components/garden/SparkleEffect";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useSound } from "@/hooks/useSound";

interface AdminLayoutProps {
    children: React.ReactNode;
    title?: string;
}

const menuItems = [
    { path: '/__admin', label: 'DASHBOARD', icon: Home },
    { path: '/__admin/memories', label: 'MEMORIES', icon: Image },
    { path: '/__admin/news', label: 'NEWS LOG', icon: Newspaper },
    { path: '/__admin/journey', label: 'MILESTONES', icon: Map },
    { path: '/__admin/travel', label: 'TRAVEL LOG', icon: Globe },
    { path: '/__admin/profiles', label: 'PROFILES', icon: Users },
    { path: '/__admin/contact', label: 'MESSAGES', icon: Mail },
    { path: '/__admin/gallery', label: 'GALLERY', icon: Camera },
    { path: '/__admin/visitors', label: 'VISITORS', icon: Eye },
];

export const AdminLayout: React.FC<AdminLayoutProps> = ({ children, title }) => {
    const { user, logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();
    const playSound = useSound();

    const handleLogout = async () => {
        playSound('click');
        await logout();
        navigate('/');
    };

    const isActive = (path: string) => location.pathname === path;

    return (
        // MAIN CONTAINER - 75% WIFTH
        <div className="shop-container flex flex-col border-x-8 border-pink-200 min-h-screen relative font-pixel max-w-[75%] mx-auto bg-white shadow-2xl">
            {/* Sparkle Effect Background */}
            <SparkleEffect />

            {/* HEADER BANNER AREA */}
            <header className="bg-gradient-to-r from-purple-100 to-pink-100 p-2 pb-0 relative z-20 border-b-4 border-pink-300">
                <div className="bg-white border-2 border-pink-300 rounded-t-xl p-4 flex items-center justify-between relative overflow-hidden h-24">
                    {/* Background Decor */}
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 bg-[url('https://www.transparenttextures.com/patterns/hearts.png')]"></div>

                    {/* Logo / Title */}
                    <div className="z-10 flex flex-col cursor-default">
                        <div className="flex items-center gap-2 mb-1">
                            <Settings className="text-purple-500 animate-spin-slow w-4 h-4" />
                            <span className="text-purple-500 font-pixel text-[10px] tracking-widest">SYSTEM CONTROL</span>
                        </div>
                        <h1 className="text-2xl font-black drop-shadow-sm flex items-center gap-2 text-gray-700">
                            ADMIN <span className="text-pink-500">PANEL</span>
                        </h1>
                    </div>

                    {/* Right Actions */}
                    <div className="flex items-center gap-3 z-30">
                        <div className="flex items-center gap-2 px-3 py-1 bg-purple-50 border border-purple-200 rounded-full">
                            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                            <span className="text-[10px] font-bold text-purple-600">{user?.email}</span>
                        </div>

                        <ThemeToggle />

                        <button
                            onClick={handleLogout}
                            className="bg-red-400 text-white px-3 py-1 text-[10px] font-bold rounded hover:bg-red-500 transition-colors flex items-center gap-1 border-b-2 border-red-600 active:border-b-0 active:translate-y-[2px]"
                        >
                            <LogOut size={10} /> LOGOUT
                        </button>
                    </div>
                </div>

                {/* BREADCRUMB / SUB-NAV */}
                <div className="bg-pink-400 text-white text-[10px] font-bold py-1 px-4 mt-2 rounded-t-lg flex justify-between items-center">
                    <span>LOCATION: {location.pathname}</span>
                    <Link to="/" className="hover:underline flex items-center gap-1">
                        VIEW SITE <ArrowRightIcon />
                    </Link>
                </div>
            </header>

            {/* MAIN CONTENT AREA */}
            <div className="flex-1 bg-white p-4 flex gap-4 overflow-hidden">

                {/* SIDEBAR NAVIGATION */}
                <aside className="w-48 flex-shrink-0 space-y-4">

                    {/* MENU BOX */}
                    <div className="bg-pink-50 border-2 border-pink-200 rounded p-2">
                        <div className="bg-gradient-to-r from-pink-400 to-pink-300 text-white text-center text-[10px] font-bold py-1 mb-2 rounded shadow-sm">
                            ★ COMMAND CENTER
                        </div>
                        <nav className="flex flex-col gap-1">
                            {menuItems.map((item) => (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    onClick={() => playSound('click')}
                                    onMouseEnter={() => playSound('hover')}
                                    className={`
                                        flex items-center gap-2 px-2 py-1.5 text-[10px] font-bold transition-all border
                                        ${isActive(item.path)
                                            ? 'bg-white border-pink-400 text-pink-500 shadow-sm translate-x-1'
                                            : 'bg-white/50 border-transparent text-gray-600 hover:bg-white hover:border-pink-200 hover:text-pink-400'}
                                    `}
                                >
                                    <item.icon size={12} />
                                    {item.label}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* STATS WIDGET */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded p-2 text-center">
                        <div className="text-[9px] font-bold text-blue-500 mb-1">SYSTEM STATUS</div>
                        <div className="text-[8px] text-gray-500">
                            All systems operational.<br />
                            Have a nice day! 💖
                        </div>
                    </div>

                </aside>

                {/* CONTENT */}
                <main className="flex-1 bg-gray-50 border-2 border-dashed border-gray-300 rounded p-4 overflow-y-auto h-full">
                    {title && (
                        <div className="border-b-2 border-gray-200 pb-2 mb-4">
                            <h2 className="text-lg font-bold text-gray-700 flex items-center gap-2">
                                <Star className="text-yellow-400 fill-yellow-400" size={16} />
                                {title}
                            </h2>
                        </div>
                    )}
                    {children}
                </main>
            </div>

            {/* FOOTER */}
            <footer className="bg-pink-100 border-t-4 border-pink-300 p-2 text-center relative z-10">
                <p className="text-[10px] text-pink-400 font-bold">ADMIN CONSOLE v1.0 • © {new Date().getFullYear()} AKA & LIA</p>
            </footer>
        </div>
    );
};

const ArrowRightIcon = () => (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14" />
        <path d="m12 5 7 7-7 7" />
    </svg>
);
