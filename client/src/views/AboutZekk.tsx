import { Heart, Star, Sparkles, ArrowLeft, MessageCircle, Music, Code, Gamepad2, Camera } from "lucide-react";
import { SparkleEffect } from "../components/garden/SparkleEffect";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

const AboutZekk = () => {
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-blue-50 to-pink-50 h-full rounded-lg">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link to="/profile" className="inline-flex items-center gap-1 text-gray-500 hover:text-blue-500 mb-4 text-[10px] font-bold transition-colors">
                        <ArrowLeft size={12} /> Back to Profile
                    </Link>

                    {/* Profile Card */}
                    <div className="bg-white border-4 border-blue-200 rounded-xl p-6 mb-6 text-center shadow-lg">
                        <div className="w-32 h-36 mx-auto bg-blue-100 border-3 border-blue-400 rounded-lg overflow-hidden shadow-lg mb-4">
                            <img src="/zekk_pixel.webp" className="w-full h-[180%] object-cover object-top" alt="Zekk" />
                        </div>
                        <h2 className="text-xl font-bold text-blue-600 mb-1">ZEKK</h2>
                        <p className="text-[10px] text-gray-500 mb-3">a.k.a Zakaria</p>
                        <div className="flex justify-center gap-2 flex-wrap">
                            <span className="bg-blue-100 text-blue-600 text-[8px] px-2 py-1 rounded-full">💻 Developer</span>
                            <span className="bg-purple-100 text-purple-600 text-[8px] px-2 py-1 rounded-full">🎨 Designer</span>
                            <span className="bg-pink-100 text-pink-600 text-[8px] px-2 py-1 rounded-full">💕 Lia's Lover</span>
                        </div>
                    </div>

                    {/* Personality Section */}
                    <div className="bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-200 rounded-xl p-4 mb-4">
                        <h3 className="text-sm font-bold text-blue-600 mb-3 flex items-center gap-2">
                            <Heart size={14} className="text-pink-500" /> Love Language
                        </h3>
                        <div className="bg-white rounded-lg p-3 border border-blue-100">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="text-2xl">🤗</span>
                                <span className="text-xs font-bold text-blue-600">Physical Touch</span>
                            </div>
                            <p className="text-[10px] text-gray-600 leading-relaxed">
                                Zekk adalah tipe orang yang mengekspresikan cinta melalui sentuhan fisik.
                                Pelukan hangat, genggaman tangan, dan kehadiran fisik adalah cara dia menunjukkan
                                betapa sayangnya dia pada Lia. Setiap sentuhan adalah kata "Aku sayang kamu"
                                yang tak terucap. 💕
                            </p>
                        </div>
                    </div>

                    {/* Traits */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                        <div className="bg-white border-2 border-blue-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Code size={14} className="text-blue-500" />
                                <span className="text-[10px] font-bold text-blue-600">Tech Enthusiast</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Suka coding dan membuat sesuatu yang keren untuk Lia!</p>
                        </div>
                        <div className="bg-white border-2 border-purple-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles size={14} className="text-purple-500" />
                                <span className="text-[10px] font-bold text-purple-600">Creative Soul</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Selalu punya ide kreatif untuk surprise romantis!</p>
                        </div>
                        <div className="bg-white border-2 border-pink-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <MessageCircle size={14} className="text-pink-500" />
                                <span className="text-[10px] font-bold text-pink-600">Good Listener</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Selalu ada untuk mendengarkan cerita Lia!</p>
                        </div>
                        <div className="bg-white border-2 border-green-200 rounded-lg p-3">
                            <div className="flex items-center gap-2 mb-2">
                                <Music size={14} className="text-green-500" />
                                <span className="text-[10px] font-bold text-green-600">Music Lover</span>
                            </div>
                            <p className="text-[8px] text-gray-500">Suka berbagi playlist romantis bersama Lia!</p>
                        </div>
                    </div>

                    {/* Fun Facts */}
                    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mb-4">
                        <h3 className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-2">
                            <Star size={12} className="text-yellow-400" /> Fun Facts
                        </h3>
                        <ul className="text-[10px] text-gray-600 space-y-2">
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">★</span>
                                <span>Pernah bergadang 2 hari buat coding website buat Lia</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">★</span>
                                <span>Suka banget makan Pizza</span>
                            </li>
                            <li className="flex items-start gap-2">
                                <span className="text-blue-400">★</span>
                                <span>Kalau tidur suka meluk guling erat-erat (bayangin Lia)</span>
                            </li>
                        </ul>
                    </div>

                    {/* Mini Gallery */}
                    <div className="bg-white border-2 border-blue-200 rounded-lg p-4 mb-4">
                        <h3 className="text-xs font-bold text-blue-600 mb-3 flex items-center gap-2">
                            <Camera size={12} className="text-blue-500" /> Cool Stuff
                        </h3>
                        <div className="grid grid-cols-3 gap-2">
                            <div className="aspect-square bg-blue-50 rounded-lg overflow-hidden border border-blue-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => playSound('click')}>
                                <img src="/zekk_pixel.webp" className="w-full h-full object-cover" alt="Zekk 1" />
                            </div>
                            <div className="aspect-square bg-blue-50 rounded-lg overflow-hidden border border-blue-100 cursor-pointer hover:scale-105 transition-transform" onClick={() => playSound('click')}>
                                <img src="/we.webp" className="w-full h-full object-cover" alt="Zekk 2" />
                            </div>
                            <div className="aspect-square bg-blue-50 rounded-lg overflow-hidden border border-blue-100 flex items-center justify-center cursor-pointer hover:bg-blue-100 transition-colors" onClick={() => playSound('click')}>
                                <span className="text-[10px] text-blue-400 font-bold">+ More</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default AboutZekk;
