import React, { useState, useEffect } from "react";
import { Memory } from "@/types/memory";
import { X, ChevronLeft, ChevronRight, Edit, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/useSound";
import { format } from "date-fns";
import { useTheme } from "next-themes";
import { ConfirmDialog } from "@/components/ui/ConfirmDialog";
import { useAuth } from "@/hooks/useAuth";
import { resolveUploadUrl } from "@/lib/uploadUtils";

interface MemoryBookModalProps {
    memory: Memory;
    isOpen: boolean;
    onClose: () => void;
    onEdit: (memory: Memory) => void;
    onDelete: (id: string) => void;
}

export const MemoryBookModal: React.FC<MemoryBookModalProps> = ({
    memory,
    isOpen,
    onClose,
    onEdit,
    onDelete
}) => {
    const playSound = useSound();
    const { theme } = useTheme();
    const { isAdmin } = useAuth();
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

    useEffect(() => {
        if (isOpen) {
            setCurrentImageIndex(0);
            document.body.style.overflow = "hidden";
            playSound("success"); // Use 'success' as fallback for open sound
        } else {
            document.body.style.overflow = "auto";
        }
        return () => { document.body.style.overflow = "auto"; };
    }, [isOpen, playSound]);

    // Keyboard navigation
    useEffect(() => {
        if (!isOpen) return;
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose();
            if (e.key === "ArrowLeft") prevImage();
            if (e.key === "ArrowRight") nextImage();
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => window.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, currentImageIndex]);

    const nextImage = () => {
        if (memory.images.length > 1) {
            playSound("click"); // Use 'click' for page flip
            setCurrentImageIndex((prev) => (prev + 1) % memory.images.length);
        }
    };

    const prevImage = () => {
        if (memory.images.length > 1) {
            playSound("click"); // Use 'click' for page flip
            setCurrentImageIndex((prev) => (prev - 1 + memory.images.length) % memory.images.length);
        }
    };

    if (!isOpen) return null;

    const currentImage = memory.images[currentImageIndex] || { url: "/placeholder.svg", alt: "No image" };
    const dateFormatted = format(new Date(memory.date), "EEEE, MMMM do, yyyy");

    // Theme variations
    const bookColor = theme === 'blue' ? 'bg-blue-50' : 'bg-pink-50';
    const borderColor = theme === 'blue' ? 'border-blue-200' : 'border-pink-200';
    const accentColor = theme === 'blue' ? 'text-blue-500' : 'text-pink-500';

    return (
        <AnimatePresence>
            {isOpen && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-8">
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Book Container */}
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0, rotateY: 90 }}
                        animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                        exit={{ scale: 0.8, opacity: 0, rotateY: -90 }}
                        transition={{ type: "spring", damping: 20, stiffness: 100 }}
                        className={`relative w-full max-w-6xl max-h-[90vh] md:max-h-none md:aspect-[2/1] bg-[#fffbf0] rounded-xl md:rounded-r-3xl md:rounded-l-md shadow-2xl flex flex-col md:flex-row overflow-y-auto md:overflow-hidden border-4 md:border-8 md:border-r-24 ${theme === 'blue' ? 'border-blue-900' : 'border-pink-900'}`}
                        style={{
                            perspective: "1000px",
                            transformStyle: "preserve-3d"
                        }}
                    >
                        {/* Spine Visual (Left Edge) - Desktop Only */}
                        <div className={`hidden md:block absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r ${theme === 'blue' ? 'from-blue-800 to-blue-600' : 'from-pink-800 to-pink-600'} z-20 shadow-inner`} />

                        {/* Page 1: Image Gallery (Top on Mobile, Left on Desktop) */}
                        <div className="relative w-full md:flex-1 p-4 md:p-6 md:pl-16 flex flex-col items-center justify-center border-b-2 md:border-b-0 md:border-r-2 border-gray-200 bg-white shrink-0">
                            {/* Photo Frame Effect */}
                            <div className="relative w-full max-w-[280px] md:max-w-sm aspect-[4/3] bg-white p-2 md:p-3 shadow-lg rotate-[-1deg] md:rotate-[-2deg] border border-gray-200 mt-8 md:mt-0">
                                <div className="w-full h-full relative overflow-hidden bg-gray-100">
                                    <motion.img
                                        key={currentImageIndex}
                                        src={resolveUploadUrl(currentImage.url)}
                                        alt={currentImage.alt}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Navigation Overlay */}
                                    {memory.images.length > 1 && (
                                        <>
                                            <button onClick={(e) => { e.stopPropagation(); prevImage(); }} className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 p-1.5 rounded-full hover:bg-white text-gray-800 backdrop-blur-sm">
                                                <ChevronLeft size={20} />
                                            </button>
                                            <button onClick={(e) => { e.stopPropagation(); nextImage(); }} className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 p-1.5 rounded-full hover:bg-white text-gray-800 backdrop-blur-sm">
                                                <ChevronRight size={20} />
                                            </button>
                                        </>
                                    )}
                                </div>
                                {/* Tape effect */}
                                <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-20 md:w-24 h-5 md:h-6 bg-yellow-100/80 rotate-1 shadow-sm" />
                            </div>

                            {/* Caption */}
                            {currentImage.caption && (
                                <p className="mt-4 font-handwriting text-gray-600 text-sm italic text-center px-4">
                                    "{currentImage.caption}"
                                </p>
                            )}

                            {/* Image Counter */}
                            {memory.images.length > 1 && (
                                <div className="mt-2 text-xs text-gray-400 font-bold">
                                    {currentImageIndex + 1} / {memory.images.length}
                                </div>
                            )}
                        </div>

                        {/* Page 2: Details (Bottom on Mobile, Right on Desktop) */}
                        <div className={`w-full md:flex-1 p-5 md:p-10 flex flex-col ${bookColor} overflow-hidden`}>
                            {/* Header: Date & Category */}
                            <div className="flex justify-between items-start mb-4 border-b border-gray-300 pb-2 border-dashed">
                                <div className="flex flex-col">
                                    <span className="text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-widest font-aesthetic">
                                        {dateFormatted}
                                    </span>
                                    <h2 className={`text-xl md:text-3xl font-bold ${accentColor} font-aesthetic mt-1 italic leading-tight`}>
                                        {memory.title}
                                    </h2>
                                </div>
                                <div className="flex flex-col items-end gap-1">
                                    {memory.mood && (
                                        <span className="text-xl md:text-2xl" title={`Mood: ${memory.mood}`}>
                                            {memory.mood === 'sweet' && '🍬'}
                                            {memory.mood === 'silly' && '🤪'}
                                            {memory.mood === 'serious' && '🧐'}
                                            {memory.mood === 'romantic' && '💖'}
                                            {memory.mood === 'adventure' && '🗺️'}
                                            {memory.mood === 'chill' && '🍃'}
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Quote */}
                            {memory.quote && (
                                <blockquote className={`border-l-4 ${theme === 'blue' ? 'border-blue-300' : 'border-pink-300'} pl-4 mb-4 md:mb-6 text-lg md:text-2xl font-handwriting text-gray-600 leading-relaxed opacity-80`}>
                                    "{memory.quote}"
                                </blockquote>
                            )}

                            {/* Story */}
                            <div className="flex-1 prose prose-sm max-w-none text-gray-700 font-aesthetic leading-relaxed text-sm md:text-base overflow-y-auto pr-2 custom-scrollbar min-h-0">
                                {memory.story || "No story written for this memory yet."}
                            </div>

                            {/* Footer: Tags & Location */}
                            <div className="mt-6 md:mt-8 pt-4 border-t border-gray-300 border-dashed">
                                {memory.location && (
                                    <p className="text-xs text-gray-500 mb-2 font-bold flex items-center gap-1">
                                        📍 {memory.location}
                                    </p>
                                )}
                                <div className="flex flex-wrap gap-2">
                                    {memory.tags.map(tag => (
                                        <span key={tag} className="text-[10px] md:text-xs bg-white border border-gray-200 px-2 py-1 rounded-full text-gray-500">
                                            #{tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {/* Actions - Admin Only */}
                            {isAdmin && (
                                <div className="mt-6 flex justify-end gap-2">
                                    <button
                                        onClick={() => onEdit(memory)}
                                        className="p-2 text-gray-400 hover:text-blue-500 transition-colors"
                                        title="Edit Memory"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => setShowDeleteConfirm(true)}
                                        className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                                        title="Delete Memory"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Close Button - Revised Position for Mobile */}
                        <button
                            onClick={onClose}
                            className="absolute top-2 right-2 md:-right-12 md:top-0 bg-white/80 md:bg-transparent text-gray-500 hover:text-red-500 md:hover:text-white p-2 rounded-full transition-colors z-50 shadow-sm md:shadow-none"
                        >
                            <X size={24} />
                        </button>

                    </motion.div>

                    <ConfirmDialog
                        open={showDeleteConfirm}
                        onOpenChange={setShowDeleteConfirm}
                        title="Delete Memory?"
                        description="This page will be torn out of your book forever. Are you sure?"
                        onConfirm={() => {
                            onDelete(memory.id);
                            setShowDeleteConfirm(false);
                            onClose();
                        }}
                        variant="destructive"
                        confirmText="Tear it out!"
                    />
                </div>
            )}
        </AnimatePresence>
    );
};
