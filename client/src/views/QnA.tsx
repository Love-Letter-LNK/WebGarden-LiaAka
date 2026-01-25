import { HelpCircle, MessageCircle, Heart } from "lucide-react";
import { SparkleEffect } from "../components/garden/SparkleEffect";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSound } from "../hooks/useSound";

const faqItems = [
    {
        id: 1,
        question: "Siapa Zekk dan Lia?",
        answer: "Kami adalah pasangan yang telah jatuh cinta dan memutuskan untuk membuat website ini sebagai dokumentasi perjalanan cinta kami! 💕",
    },
    {
        id: 2,
        question: "Kapan website ini dibuat?",
        answer: "Website 'Kenangan Perjalanan Cinta' ini dibuat pada tahun 2024 sebagai hadiah spesial untuk menyimpan semua kenangan indah kami bersama.",
    },
    {
        id: 3,
        question: "Bagaimana cara menambahkan foto?",
        answer: "Untuk saat ini, foto-foto ditambahkan oleh admin. Jika kamu adalah kami, login ke halaman admin untuk mengelola konten!",
    },
    {
        id: 4,
        question: "Apakah bisa mengganti tema?",
        answer: "Ya! Kamu bisa mengganti antara tema Pink dan Blue. Cari tombol toggle tema di halaman utama!",
    },
    {
        id: 5,
        question: "Apa itu Memory Catalog?",
        answer: "Memory Catalog adalah galeri foto-foto kenangan kami. Klik foto manapun untuk melihat preview lebih besar!",
    },
    {
        id: 6,
        question: "Bagaimana cara mengirim pesan?",
        answer: "Gunakan tombol 'TO ZEKK' atau 'TO LIA' di sidebar MESSAGE untuk mengirim love letter! 💌",
    },
];

const QnA = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const playSound = useSound();

    return (
        <div className="shop-container flex flex-col border-x-8 border-pink-200 min-h-screen">
            <SparkleEffect />

            {/* Header */}
            <header className="bg-pink-100 p-4 text-center border-b-4 border-pink-300">
                <Link to="/" className="inline-block">
                    <h1 className="text-lg font-bold text-pink-500">❓ ZEKK & LIA - Q&A ❓</h1>
                </Link>
                <p className="text-[10px] text-gray-500 mt-1">Frequently Asked Questions</p>
            </header>

            {/* Main Content */}
            <main className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50">

                {/* Q&A Header */}
                <div className="bg-gradient-to-r from-purple-200 to-pink-200 border-2 border-white rounded-xl p-4 mb-6 text-center shadow-lg">
                    <HelpCircle className="w-10 h-10 mx-auto text-purple-500 mb-2" />
                    <h2 className="text-sm font-bold text-purple-600">✨ Got Questions? ✨</h2>
                    <p className="text-[10px] text-gray-600">We've got answers!</p>
                </div>

                {/* FAQ Items - Accordion Style */}
                <div className="space-y-3">
                    {faqItems.map((item) => (
                        <div
                            key={item.id}
                            className="bg-white border-2 border-pink-200 rounded-lg overflow-hidden hover:border-pink-400 transition-all"
                        >
                            <button
                                className="w-full p-4 text-left flex items-center gap-3"
                                onClick={() => { playSound('click'); setOpenId(openId === item.id ? null : item.id); }}
                                onMouseEnter={() => playSound('hover')}
                            >
                                <MessageCircle className="w-5 h-5 text-pink-400 flex-shrink-0" />
                                <span className="text-xs font-bold text-gray-700 flex-1">{item.question}</span>
                                <span className="text-pink-400 text-lg">{openId === item.id ? '−' : '+'}</span>
                            </button>
                            {openId === item.id && (
                                <div className="px-4 pb-4 pt-0">
                                    <div className="bg-pink-50 border border-pink-200 rounded-lg p-3">
                                        <p className="text-[10px] text-gray-600 leading-relaxed">{item.answer}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Contact Box */}
                <div className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 mt-6 text-center">
                    <h4 className="text-xs font-bold text-blue-600 mb-2 flex items-center justify-center gap-2">
                        <Heart size={14} /> Still have questions?
                    </h4>
                    <p className="text-[10px] text-gray-600 mb-3">Feel free to contact us anytime!</p>
                    <Link
                        to="/contact"
                        className="bg-blue-400 text-white px-4 py-1 rounded-full text-[10px] font-bold hover:bg-blue-500 transition-colors"
                        onClick={() => playSound('click')}
                        onMouseEnter={() => playSound('hover')}
                    >
                        Contact Us
                    </Link>
                </div>

                {/* Back Button */}
                <div className="text-center mt-6">
                    <Link
                        to="/"
                        className="bg-pink-400 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-pink-500 transition-colors"
                        onClick={() => playSound('click')}
                        onMouseEnter={() => playSound('hover')}
                    >
                        ← Back to Home
                    </Link>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-pink-100 border-t-4 border-pink-300 p-4 text-center">
                <p className="text-[10px] text-pink-400 font-bold">© 2024 ZEKK & LIA. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default QnA;
