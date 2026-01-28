import React, { useState, useEffect } from "react";
import { MainLayout } from "../components/garden/MainLayout";
import { useMemories } from "@/hooks/useMemories";
import { Loader2, Mail, ArrowLeft, X, ExternalLink } from "lucide-react";
import { Link } from "react-router-dom";
import { useSound } from "@/hooks/useSound";
import { format } from "date-fns";

const Letters = () => {
    const { memories, loading, actions } = useMemories();
    const [letters, setLetters] = useState<any[]>([]);
    const [selectedLetter, setSelectedLetter] = useState<any | null>(null);
    const playSound = useSound();

    useEffect(() => {
        actions.refresh();
    }, []);

    useEffect(() => {
        if (memories) {
            const letterMemories = memories.filter(m => m.category?.toLowerCase() === "letters");
            setLetters(letterMemories);
        }
    }, [memories]);

    return (
        <MainLayout>
            <div className="min-h-screen bg-pink-50/50 p-4 md:p-8">
                <div className="max-w-6xl mx-auto">
                    {/* Header */}
                    <div className="mb-8 flex flex-col items-center justify-center text-center">
                        <Link to="/" className="text-gray-400 hover:text-pink-500 text-xs mb-4 flex items-center gap-1 transition-colors self-start">
                            <ArrowLeft size={14} /> Back to Home
                        </Link>

                        <div className="relative">
                            <h1 className="text-4xl md:text-5xl font-serif text-red-400 mb-2 drop-shadow-sm flex items-center gap-3">
                                <Mail className="w-8 h-8 md:w-12 md:h-12 text-red-300" />
                                Letters Collection
                                <Mail className="w-8 h-8 md:w-12 md:h-12 text-red-300" />
                            </h1>
                            <p className="text-red-300 font-handwriting text-xl">Words directly from the heart...</p>
                        </div>
                    </div>

                    {/* Content */}
                    {loading ? (
                        <div className="flex justify-center p-12">
                            <Loader2 className="w-8 h-8 animate-spin text-pink-300" />
                        </div>
                    ) : letters.length === 0 ? (
                        <div className="text-center py-20 bg-white/50 rounded-3xl border-4 border-dashed border-pink-100">
                            <Mail className="w-16 h-16 text-pink-200 mx-auto mb-4" />
                            <p className="text-gray-400 font-serif text-lg">No letters have been written yet...</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {letters.map((letter) => (
                                <div
                                    key={letter.id}
                                    onClick={() => { playSound('click'); setSelectedLetter(letter); }}
                                    className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-2 border-pink-100 group relative"
                                >
                                    {/* Envelope Look Top Bar */}
                                    <div className="h-3 bg-red-300 pattern-wavy opacity-50"></div>

                                    <div className="p-6 relative">
                                        {/* Stamp/Date */}
                                        <div className="absolute top-4 right-4 rotate-12 opacity-80 border-2 border-red-200 p-1 rounded-sm">
                                            <div className="text-[8px] font-mono text-red-400 uppercase text-center leading-tight">
                                                {format(new Date(letter.date || letter.createdAt), "MMM")}<br />
                                                <span className="text-lg font-bold">{format(new Date(letter.date || letter.createdAt), "dd")}</span><br />
                                                {format(new Date(letter.date || letter.createdAt), "yyyy")}
                                            </div>
                                        </div>

                                        <h3 className="font-serif text-xl text-gray-800 mb-2 pr-12 line-clamp-1 group-hover:text-red-500 transition-colors">
                                            {letter.title}
                                        </h3>

                                        <p className="text-sm text-gray-500 font-serif line-clamp-4 leading-relaxed mb-4">
                                            {letter.story}
                                        </p>

                                        <div className="flex items-center justify-between mt-4">
                                            <span className="text-xs text-red-300 font-bold bg-red-50 px-2 py-1 rounded-full group-hover:bg-red-100 transition-colors">
                                                Open Letter 💌
                                            </span>
                                            {letter.images && letter.images.length > 0 && (
                                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                                    📷 Photo attached
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* LETTER READING MODAL (Paper Style) */}
            {selectedLetter && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={() => setSelectedLetter(null)}
                >
                    <div

                        className="relative w-full max-w-2xl bg-[#fffcf5] shadow-2xl animate-in zoom-in-95 duration-300 my-auto max-h-[90vh] flex flex-col rounded-sm"
                        onClick={e => e.stopPropagation()}
                        style={{
                            backgroundImage: `
                                linear-gradient(#e6e6e6 1px, transparent 1px),
                                linear-gradient(90deg, #e6e6e6 1px, transparent 1px),
                                linear-gradient(rgba(244, 114, 182, 0.1) 20px, transparent 20px)
                            `,
                            backgroundSize: '20px 20px, 20px 20px, 100% 100%',
                            backgroundColor: '#fffcf5'
                        }}
                    >
                        {/* Close Button */}
                        <button
                            onClick={() => setSelectedLetter(null)}
                            className="absolute top-4 right-4 md:-right-12 md:top-0 md:text-white text-gray-400 hover:text-red-400 md:hover:text-pink-200 transition-colors bg-white/80 md:bg-transparent rounded-full p-2 md:p-0"
                        >
                            <X size={24} />
                        </button>

                        <div className="p-8 md:p-12 overflow-y-auto flex-1 custom-scrollbar">
                            {/* Polaroid Photo */}
                            {selectedLetter.images && selectedLetter.images.length > 0 && (
                                <div className="bg-white p-3 shadow-md rotate-2 w-48 mx-auto mb-8 transition-transform hover:rotate-0 hover:scale-105 duration-500">
                                    <div className="aspect-[4/5] bg-gray-100 overflow-hidden mb-2">
                                        <img
                                            src={selectedLetter.images[0].url}
                                            alt={selectedLetter.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="text-center font-handwriting text-gray-400 text-xs">
                                        Attached Memory
                                    </div>
                                </div>
                            )}

                            {/* Letter Content */}
                            <div className="font-serif relative z-10">
                                <h2 className="text-3xl text-red-900/80 mb-6 border-b-2 border-red-900/10 pb-4 text-center">
                                    {selectedLetter.title}
                                </h2>

                                <div className="text-gray-800 leading-loose whitespace-pre-wrap text-lg opacity-90 pb-8">
                                    {selectedLetter.story}
                                </div>

                                {/* Link Attachment if exists */}
                                {selectedLetter.location && (
                                    <div className="mt-8 pt-6 border-t border-dashed border-red-200 text-center">
                                        <a
                                            href={selectedLetter.location}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center gap-2 text-red-400 hover:text-red-600 hover:underline transition-colors text-sm font-bold bg-white/50 px-4 py-2 rounded-full border border-red-100"
                                        >
                                            <ExternalLink size={14} />
                                            Visit Attached Link
                                        </a>
                                    </div>
                                )}

                                <div className="mt-12 text-center">
                                    <p className="font-handwriting text-2xl text-gray-400">
                                        With love,<br />
                                        Zakaria & Lia
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Letters;
