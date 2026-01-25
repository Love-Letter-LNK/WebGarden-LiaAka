import React from "react";
import { Memory } from "@/types/memory";
import { MemoryCard } from "./MemoryCard";
import { Loader2, Sparkles } from "lucide-react";

interface MemoryGridProps {
    memories: Memory[];
    loading: boolean;
    error: string | null;
    onMemoryClick: (memory: Memory) => void;
}

export const MemoryGrid: React.FC<MemoryGridProps> = ({
    memories,
    loading,
    error,
    onMemoryClick
}) => {
    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--theme-primary)]">
                <Loader2 className="w-10 h-10 animate-spin mb-2" />
                <p className="text-xs font-bold animate-pulse">Loading memories...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-red-400">
                <div className="bg-red-50 p-4 rounded-lg border-2 border-red-200 text-center">
                    <p className="font-bold mb-1">Oops!</p>
                    <p className="text-xs">{error}</p>
                </div>
            </div>
        );
    }

    if (memories.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <Sparkles className="w-8 h-8 text-gray-300" />
                </div>
                <p className="font-bold text-sm">No memories found yet.</p>
                <p className="text-xs mt-1">Start creating your first memory!</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 p-3">
            {memories.map((memory) => (
                <MemoryCard
                    key={memory.id}
                    memory={memory}
                    onClick={onMemoryClick}
                />
            ))}
        </div>
    );
};
