import React from "react";
import { Memory } from "@/types/memory";
import { format } from "date-fns";
import { Heart, Calendar, MapPin } from "lucide-react";
import { useSound } from "@/hooks/useSound";

interface MemoryCardProps {
    memory: Memory;
    onClick: (memory: Memory) => void;
}

export const MemoryCard: React.FC<MemoryCardProps> = ({ memory, onClick }) => {
    const playSound = useSound();
    const coverImage = memory.images && memory.images.length > 0 ? memory.images[0].url : "/placeholder.svg";

    return (
        <div
            className="group relative bg-white border-2 border-[var(--theme-border)] rounded-xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-lg transition-all duration-300"
            onClick={() => {
                playSound("click");
                onClick(memory);
            }}
            onMouseEnter={() => playSound("hover")}
        >
            {/* Image Container with Aspect Ratio */}
            <div className="aspect-[4/3] w-full overflow-hidden bg-gray-100 relative">
                <img
                    src={coverImage}
                    alt={memory.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    loading="lazy"
                />
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center p-4">
                    <span className="text-white font-bold text-xs tracking-wider bg-black/40 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                        OPEN MEMORY
                    </span>
                </div>

                {/* Category Badge */}
                <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded border border-pink-200 shadow-sm">
                    <span className="text-[10px] font-bold text-[var(--theme-primary-dark)]">
                        {memory.category}
                    </span>
                </div>

                {/* Mood Emoji/Icon if available */}
                {memory.mood && (
                    <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm w-6 h-6 rounded-full flex items-center justify-center border border-pink-200 shadow-sm" title={`Mood: ${memory.mood}`}>
                        {memory.mood === 'sweet' && '🍬'}
                        {memory.mood === 'silly' && '🤪'}
                        {memory.mood === 'serious' && '🧐'}
                        {memory.mood === 'romantic' && '💖'}
                        {memory.mood === 'adventure' && '🗺️'}
                        {memory.mood === 'chill' && '🍃'}
                        {!['sweet', 'silly', 'serious', 'romantic', 'adventure', 'chill'].includes(memory.mood) && '✨'}
                    </div>
                )}
            </div>

            {/* Content Details */}
            <div className="p-3 bg-gradient-to-b from-white to-[var(--theme-primary)]/10">
                <h3 className="font-bold text-sm text-gray-800 line-clamp-1 mb-1 group-hover:text-[var(--theme-primary-dark)] transition-colors">
                    {memory.title}
                </h3>

                <div className="flex items-center gap-3 text-[10px] text-gray-500 mb-2">
                    <div className="flex items-center gap-1">
                        <Calendar size={10} className="text-pink-400" />
                        <span>{format(new Date(memory.date), "MMM d, yyyy")}</span>
                    </div>
                    {memory.location && (
                        <div className="flex items-center gap-1">
                            <MapPin size={10} className="text-blue-400" />
                            <span className="truncate max-w-[80px]">{memory.location}</span>
                        </div>
                    )}
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                    {memory.tags.slice(0, 3).map(tag => (
                        <span key={tag} className="text-[9px] bg-[var(--theme-primary)]/20 text-[var(--theme-primary-dark)] px-1.5 py-0.5 rounded">
                            #{tag}
                        </span>
                    ))}
                    {memory.tags.length > 3 && (
                        <span className="text-[9px] text-gray-400 px-1">+ {memory.tags.length - 3}</span>
                    )}
                </div>
            </div>

            {/* Hover Decor - Tiny Heart */}
            <Heart className="absolute -bottom-2 -right-2 w-8 h-8 text-[var(--theme-primary)] opacity-10 group-hover:scale-125 group-hover:rotate-12 transition-transform duration-300" />
        </div>
    );
};
