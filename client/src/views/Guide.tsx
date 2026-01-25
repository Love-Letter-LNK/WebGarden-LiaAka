import { Book, Star, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const guideItems = [
    {
        id: 1,
        title: "How to Navigate",
        content: "Use the navigation tabs at the top to explore different sections of our digital garden.",
        icon: "🧭"
    },
    {
        id: 2,
        title: "Memory Catalog",
        content: "Click on any photo to view it in full size. Hover to see the preview option.",
        icon: "📸"
    },
    {
        id: 3,
        title: "Music Player",
        content: "Use the music player on the left sidebar to play our favorite songs!",
        icon: "🎵"
    },
    {
        id: 4,
        title: "Send Message",
        content: "Want to send a love letter? Use the MESSAGE button on the right sidebar!",
        icon: "💌"
    },
    {
        id: 5,
        title: "Categories",
        content: "Browse memories by category: First Date, Anniversary, Travel, Random, Letters.",
        icon: "📁"
    },
    {
        id: 6,
        title: "Theme Toggle",
        content: "Switch between Pink and Blue themes using the theme toggle button!",
        icon: "🎨"
    },
];

const Guide = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg">
                <div className="max-w-2xl mx-auto">
                    {/* Guide Header */}
                    <div className="bg-gradient-to-r from-blue-200 to-pink-200 border-2 border-white rounded-xl p-4 mb-6 text-center shadow-lg">
                        <Book className="w-10 h-10 mx-auto text-purple-500 mb-2" />
                        <h2 className="text-sm font-bold text-purple-600">✨ User Guide ✨</h2>
                        <p className="text-[10px] text-gray-600">Everything you need to know!</p>
                    </div>

                    {/* Guide Items */}
                    <div className="space-y-3">
                        {guideItems.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white border-2 border-pink-200 rounded-lg p-4 hover:border-pink-400 hover:shadow-md transition-all cursor-pointer"
                                onMouseEnter={() => playSound('hover')}
                                onClick={() => playSound('click')}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="text-2xl flex-shrink-0">{item.icon}</div>
                                    <div className="flex-1">
                                        <h3 className="text-xs font-bold text-pink-600 mb-1 flex items-center gap-1">
                                            <Star size={12} className="text-yellow-400" />
                                            {item.title}
                                        </h3>
                                        <p className="text-[10px] text-gray-600 leading-relaxed">{item.content}</p>
                                    </div>
                                    <ChevronRight className="w-4 h-4 text-pink-300 flex-shrink-0" />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Tips Box */}
                    <div className="bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4 mt-6">
                        <h4 className="text-xs font-bold text-yellow-600 mb-2 flex items-center gap-2">
                            💡 Pro Tips
                        </h4>
                        <ul className="text-[10px] text-gray-600 space-y-1">
                            <li>• Move your mouse to hear cute sound effects!</li>
                            <li>• Try clicking on the character avatars in the header!</li>
                            <li>• Found a hidden easter egg? Let us know in the guestbook!</li>
                        </ul>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Guide;
