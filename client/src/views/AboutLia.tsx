import { Heart, Star, Sparkles, ArrowLeft, MessageCircle, BookOpen, Coffee, Camera } from "lucide-react";
import { SparkleEffect } from "../components/garden/SparkleEffect";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const AboutLia = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link to="/profile" className="inline-flex items-center gap-1 text-gray-500 hover:text-pink-500 mb-4 text-[10px] font-bold transition-colors">
                        <ArrowLeft size={12} /> Back to Profile
                    </Link>

                    {/* Profile Card */}
                    <div className="bg-white border-4 border-pink-200 rounded-xl p-6 mb-6 text-center shadow-lg">
                        <div className="w-32 h-36 mx-auto bg-pink-100 border-3 border-pink-400 rounded-lg overflow-hidden shadow-lg mb-4">
                            <img src="/lia_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Lia" />
                        </div>
                        <h2 className="text-xl font-bold text-pink-600 mb-1">LIA</h2>
                        <p className="text-[10px] text-gray-500 mb-3">Si Cerewet yang Manis</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <span className="bg-pink-100 text-pink-600 text-[8px] px-2 py-1 rounded-full">💕 Romantic</span>
                            <span className="bg-purple-100 text-purple-600 text-[8px] px-2 py-1 rounded-full">📚 Bookworm</span>
                            <span className="bg-blue-100 text-blue-600 text-[8px] px-2 py-1 rounded-full">💙 Zekk's Lover</span>
                        </div>
                    </div>

                    {/* Personality Section */}
                    <div className="bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-pink-200 rounded-xl p-4 mb-4">
                        <h3 className="text-sm font-bold text-pink-600 mb-3 flex items-center gap-2">
                            <Heart size={14} className="text-pink-500" /> Love Language
                        </h3>
                        <div className="bg-white rounded-lg p-3 border border-pink-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">💬</span>
                                <span className="text-xs font-bold text-pink-600">Words of Affirmation & Quality Time</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                Lia adalah tipe yang cerewet tapi penuh perhatian! Dia selalu mengekspresikan
                                cintanya dengan kata-kata manis (meski kadang sambil ngomel). Dia suka menghabiskan
                                waktu berkualitas bersama Zekk, entah itu ngobrol sampai larut malam atau sekadar
                                diam bersama. Setiap omelan adalah bentuk perhatiannya yang tulus! 💕
                            </p>
                        </div>
                    </div>

                    {/* Traits */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white border-2 border-pink-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageCircle size={14} className="text-pink-500" />
                                <span className="text-[10px] font-bold text-pink-600">Si Cerewet</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Bawel? Iya! Tapi itu tandanya sayang sama Zekk!</p>
                        </div>
                        <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Heart size={14} className="text-purple-500" />
                                <span className="text-[10px] font-bold text-purple-600">Super Perhatian</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Selalu ingat hal-hal kecil tentang Zekk!</p>
                        </div>
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <BookOpen size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600">Bookworm</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Suka baca buku, apalagi novel romantis!</p>
                        </div>
                        <div className="bg-white border-2 border-yellow-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Camera size={14} className="text-yellow-500" />
                                <span className="text-[10px] font-bold text-yellow-600">Memory Keeper</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Suka foto-foto momen bareng Zekk!</p>
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-white border-2 border-pink-200 rounded-lg p-4 mb-4">
                        <h3 className="text-xs font-bold text-pink-600 mb-3 flex items-center gap-2">
                            <Star size={12} className="text-yellow-400" /> Fun Facts
                        </h3>
                        <ul className="text-[10px] text-gray-600 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400">♥</span>
                                <span>Kopi favoritnya adalah Caramel Macchiato</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400">♥</span>
                                <span>Suka banget ngoleksi stiker lucu</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-pink-400">♥</span>
                                <span>Pernah nangis gara-gara nonton film kartun</span>
                            </li>
                        </ul>
                    </div>

                    {/* Mini Gallery */}
                    <div className="bg-white border-2 border-pink-200 rounded-lg p-4 mb-4">
                        <h3 className="text-xs font-bold text-pink-600 mb-3 flex items-center gap-2">
                            <Camera size={12} className="text-pink-500" /> Sweet Chat
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="aspect-square bg-pink-50 rounded-lg overflow-hidden border border-pink-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => playSound('click')}>
                                <img src="/lia_pixel.webp" className="w-full h-full object-cover" alt="Lia 1" />
                            </div>
                            <div className="aspect-square bg-pink-50 rounded-lg overflow-hidden border border-pink-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => playSound('click')}>
                                <img src="/we.webp" className="w-full h-full object-cover" alt="Lia 2" />
                            </div>
                            <div className="aspect-square bg-pink-50 rounded-lg overflow-hidden border border-pink-100 flex items-center justify-center cursor-pointer hover:bg-pink-100 transition-colors" onClick={() => playSound('click')}>
                                <span className="text-[10px] text-pink-400 font-bold">+ More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AboutLia;
