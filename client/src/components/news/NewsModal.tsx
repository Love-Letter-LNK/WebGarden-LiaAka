
import { X, Calendar } from "lucide-react";
import { format } from "date-fns";
import { NewsItem } from "@/types/news";
import { useSound } from "@/hooks/useSound";
import { AnimatePresence, motion } from "framer-motion";

interface NewsModalProps {
    news: NewsItem | null;
    onClose: () => void;
}

export const NewsModal = ({ news, onClose }: NewsModalProps) => {
    const playSound = useSound();

    if (!news) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4 backdrop-blur-sm" onClick={onClose}>
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white w-full max-w-lg rounded-xl border-4 border-pink-300 shadow-2xl overflow-hidden relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-pink-100 p-3 flex items-center justify-between border-b-2 border-pink-200">
                        <div className="flex items-center gap-2">
                            <span className="text-2xl">{news.emoji || "📰"}</span>
                            <h3 className="font-bold text-pink-600 text-sm font-pixel uppercase truncate max-w-[200px]">
                                {news.title}
                            </h3>
                        </div>
                        <button
                            onClick={() => {
                                playSound("click");
                                onClose();
                            }}
                            className="text-pink-400 hover:text-pink-600 transition-colors"
                        >
                            <X size={24} />
                        </button>
                    </div>

                    {/* Metadata */}
                    <div className="bg-white p-3 border-b border-gray-100 flex items-center gap-3 text-[10px] text-gray-500">
                        <span className="bg-pink-50 text-pink-500 px-2 py-0.5 rounded border border-pink-200 uppercase font-bold">
                            {news.category}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar size={12} />
                            {format(new Date(news.date), "MMM d, yyyy")}
                        </span>
                    </div>

                    {/* Content */}
                    <div className="p-4 max-h-[60vh] overflow-y-auto">
                        <p className="text-sm text-gray-700 whitespace-pre-line leading-relaxed font-pixel-text">
                            {news.content}
                        </p>
                    </div>

                    {/* Footer */}
                    <div className="bg-gray-50 p-2 text-center border-t border-gray-100 text-[9px] text-gray-400">
                        OFFICIAL ANNOUNCEMENT • AKA & LIA
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
