import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Search, X, Home, Newspaper, User, BookOpen, HelpCircle, Mail, Heart } from "lucide-react";
import { useSound } from "../../hooks/useSound";

interface NavItem {
    label: string;
    path: string;
    icon: React.ReactNode;
    color: string;
}

const navItems: NavItem[] = [
    { label: "HOME", path: "/", icon: <Home size={10} />, color: "bg-pink-400 hover:bg-pink-500" },
    { label: "NEWS", path: "/news", icon: <Newspaper size={10} />, color: "bg-pink-400 hover:bg-pink-500" },
    { label: "PROFILE", path: "/profile", icon: <User size={10} />, color: "bg-pink-500 hover:bg-pink-600" },
    { label: "LETTERS", path: "/letters", icon: <Heart size={10} />, color: "bg-red-400 hover:bg-red-500" },
    { label: "GUIDE", path: "/guide", icon: <BookOpen size={10} />, color: "bg-purple-400 hover:bg-purple-500" },
    { label: "Q&A", path: "/qna", icon: <HelpCircle size={10} />, color: "bg-purple-400 hover:bg-purple-500" },
    { label: "CONTACT", path: "/contact", icon: <Mail size={10} />, color: "bg-purple-500 hover:bg-purple-600" },
];

const allPages = [
    { label: "Home", path: "/", keywords: ["home", "beranda", "utama"] },
    { label: "News", path: "/news", keywords: ["news", "berita", "update"] },
    { label: "Profile", path: "/profile", keywords: ["profile", "profil", "aka", "lia", "about"] },
    { label: "About Aka", path: "/about-aka", keywords: ["aka", "zakaria", "about", "profil"] },
    { label: "About Lia", path: "/about-lia", keywords: ["lia", "about", "profil"] },
    { label: "Guide", path: "/guide", keywords: ["guide", "panduan", "tutorial"] },
    { label: "Q&A", path: "/qna", keywords: ["qna", "tanya", "jawab", "faq", "pertanyaan"] },
    { label: "Contact", path: "/contact", keywords: ["contact", "kontak", "hubungi"] },
    { label: "Guestbook", path: "/guestbook", keywords: ["guestbook", "buku tamu", "pesan"] },
    { label: "Memories", path: "/memories", keywords: ["memory", "kenangan", "foto", "album", "letters"] },
    { label: "Admin", path: "/admin", keywords: ["admin", "dashboard", "login"] },
];

export const QuickNav = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<typeof allPages>([]);
    const location = useLocation();
    const navigate = useNavigate();
    const playSound = useSound();
    const inputRef = useRef<HTMLInputElement>(null);

    // Handle Ctrl+K to open quick nav
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen(prev => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
    }, [isOpen]);

    // Search functionality
    useEffect(() => {
        if (searchQuery.trim() === "") {
            setSearchResults([]);
            return;
        }

        const query = searchQuery.toLowerCase();
        const results = allPages.filter(page =>
            page.label.toLowerCase().includes(query) ||
            page.keywords.some(keyword => keyword.includes(query))
        );
        setSearchResults(results);
    }, [searchQuery]);

    const handleSearch = () => {
        playSound("click");
        if (searchResults.length > 0) {
            navigate(searchResults[0].path);
            setIsOpen(false);
            setSearchQuery("");
        }
    };

    const handleNavClick = (path: string) => {
        playSound("click");
        if (location.pathname !== path) {
            navigate(path);
        }
        setIsOpen(false);
    };

    return (
        <>
            {/* Floating Quick Nav Button */}
            <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2">
                <div className="bg-black/50 backdrop-blur-sm text-white text-[9px] px-2 py-1 rounded-full animate-pulse hidden md:block border border-white/20">
                    Press <span className="font-bold text-pink-300">Ctrl + K</span>
                </div>
                <button
                    onClick={() => {
                        playSound("click");
                        setIsOpen(true);
                    }}
                    onMouseEnter={() => playSound("hover")}
                    className="bg-gradient-to-r from-pink-400 to-purple-400 text-white p-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110 border-2 border-white"
                    title="Quick Nav (Ctrl+K)"
                >
                    <Search size={20} />
                </button>
            </div>

            {/* Quick Nav Modal */}
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-start justify-center pt-20 px-4">
                    {/* Backdrop */}
                    <div
                        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
                        onClick={() => setIsOpen(false)}
                    />

                    {/* Modal Content */}
                    <div className="relative bg-white border-4 border-pink-300 rounded-xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in slide-in-from-top-4 duration-200">
                        {/* Header with Close */}
                        <div className="bg-gradient-to-r from-pink-400 to-purple-400 p-3 flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Heart size={14} className="text-white" />
                                <span className="text-white text-[10px] font-bold">QUICK NAVIGATION</span>
                            </div>
                            <button
                                onClick={() => {
                                    playSound("click");
                                    setIsOpen(false);
                                }}
                                onMouseEnter={() => playSound("hover")}
                                className="text-white hover:bg-white/20 p-1 rounded"
                            >
                                <X size={14} />
                            </button>
                        </div>

                        {/* Navigation Buttons */}
                        <div className="p-3 bg-gradient-to-b from-pink-50 to-white border-b-2 border-pink-100">
                            <div className="flex flex-wrap gap-1 justify-center">
                                {navItems.map((item) => (
                                    <button
                                        key={item.path}
                                        onClick={() => handleNavClick(item.path)}
                                        onMouseEnter={() => playSound("hover")}
                                        className={`${item.color} text-white px-3 py-1.5 text-[8px] font-bold rounded transition-all duration-200 flex items-center gap-1 ${location.pathname === item.path
                                            ? "ring-2 ring-white ring-offset-1"
                                            : ""
                                            }`}
                                    >
                                        {item.icon}
                                        {item.label}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Search Section */}
                        <div className="p-3">
                            <div className="bg-pink-500 text-white px-3 py-1.5 text-[10px] font-bold flex items-center gap-2 rounded-t">
                                <Search size={12} />
                                SEARCH
                            </div>
                            <div className="bg-pink-100 p-3 rounded-b border-2 border-t-0 border-pink-200">
                                <input
                                    ref={inputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={(e) => {
                                        if (e.key === "Enter") {
                                            handleSearch();
                                        }
                                    }}
                                    placeholder="Find memory..."
                                    className="w-full bg-white border-2 border-pink-200 rounded px-3 py-2 text-[10px] text-gray-600 placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-200"
                                    style={{ userSelect: "text" }}
                                />

                                {/* Search Results */}
                                {searchResults.length > 0 && (
                                    <div className="mt-2 bg-white border-2 border-pink-200 rounded max-h-32 overflow-y-auto">
                                        {searchResults.map((result) => (
                                            <button
                                                key={result.path}
                                                onClick={() => {
                                                    playSound("click");
                                                    navigate(result.path);
                                                    setIsOpen(false);
                                                    setSearchQuery("");
                                                }}
                                                onMouseEnter={() => playSound("hover")}
                                                className="w-full text-left px-3 py-2 text-[10px] text-gray-600 hover:bg-pink-50 border-b border-pink-100 last:border-b-0 flex items-center gap-2"
                                            >
                                                <span className="text-pink-400">→</span>
                                                {result.label}
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* GO Button */}
                                <button
                                    onClick={handleSearch}
                                    onMouseEnter={() => playSound("hover")}
                                    className="w-full mt-3 bg-gradient-to-r from-pink-400 to-pink-500 text-white py-2 text-[11px] font-bold rounded border-b-4 border-pink-600 hover:from-pink-500 hover:to-pink-600 active:border-b-0 active:mt-[15px] transition-all"
                                >
                                    GO!
                                </button>
                            </div>
                        </div>

                        {/* Keyboard Hint */}
                        <div className="bg-gray-50 border-t border-pink-100 px-3 py-2 text-center">
                            <span className="text-[8px] text-gray-400">
                                Press <kbd className="bg-gray-200 px-1 rounded text-[8px]">Ctrl</kbd> + <kbd className="bg-gray-200 px-1 rounded text-[8px]">K</kbd> to toggle • <kbd className="bg-gray-200 px-1 rounded text-[8px]">Esc</kbd> to close
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default QuickNav;
