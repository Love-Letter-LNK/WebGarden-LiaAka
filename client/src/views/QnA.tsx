import { HelpCircle, MessageCircle, Heart } from "lucide-react";
import { SparkleEffect } from "../components/garden/SparkleEffect";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";

import { contactApi } from "@/lib/api";

const faqItems = [
    {
        id: 1,
        question: "Siapa Aka dan Lia?",
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
        answer: "Gunakan tombol 'TO AKA' atau 'TO LIA' di sidebar MESSAGE untuk mengirim love letter! 💌",
    },
];

const QnA = () => {
    const [openId, setOpenId] = useState<number | null>(null);
    const playSound = useSound();

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg overflow-y-auto">
                <div className="max-w-4xl mx-auto pb-20">

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

                    {/* Ask a Question Form */}
                    <div className="bg-white border-2 border-purple-200 rounded-xl p-6 mt-8 shadow-sm">
                        <div className="text-center mb-4">
                            <h3 className="text-lg font-bold text-purple-600 mb-1">💌 Send a Love Letter / Question</h3>
                            <p className="text-xs text-gray-500">Want to tell us something? Choose who to send it to!</p>
                        </div>

                        <div className="flex justify-center gap-4 mb-4">
                            <button
                                className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${openId === 101 ? 'bg-blue-100 border-blue-400 text-blue-600' : 'border-gray-200 text-gray-400 hover:border-blue-200'}`}
                                onClick={() => { playSound('click'); setOpenId(101); }} // Reuse openId state for simple toggle or use new state
                            >
                                👦 To Aka
                            </button>
                            <button
                                className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all ${openId === 102 ? 'bg-pink-100 border-pink-400 text-pink-600' : 'border-gray-200 text-gray-400 hover:border-pink-200'}`}
                                onClick={() => { playSound('click'); setOpenId(102); }}
                            >
                                👧 To Lia
                            </button>
                        </div>

                        {(openId === 101 || openId === 102) && (
                            <form className="space-y-3" onSubmit={(e) => {
                                e.preventDefault();
                                const recipient = openId === 101 ? 'aka' : 'lia';
                                const form = e.target as HTMLFormElement;
                                const message = (form.elements.namedItem('message') as HTMLTextAreaElement).value;
                                const senderName = (form.elements.namedItem('senderName') as HTMLInputElement).value;

                                // Call API
                                contactApi.submit({ recipient, message, senderName })
                                    .then(() => {
                                        alert(`Message sent to ${recipient.toUpperCase()}! 💕`);
                                        form.reset();
                                        setOpenId(null);
                                    })
                                    .catch(err => alert('Failed to send message: ' + err.message));
                            }}>
                                <input
                                    name="senderName"
                                    placeholder="Your Name (Optional)"
                                    className="w-full text-xs p-2 border border-gray-200 rounded focus:outline-none focus:border-purple-400"
                                />
                                <textarea
                                    name="message"
                                    placeholder={`Write something sweet to ${openId === 101 ? 'Aka' : 'Lia'}...`}
                                    className="w-full text-xs p-2 border border-gray-200 rounded h-24 focus:outline-none focus:border-purple-400"
                                    required
                                />
                                <button type="submit" className="w-full bg-purple-500 text-white py-2 rounded-lg text-xs font-bold hover:bg-purple-600 transition-colors">
                                    SEND MESSAGE 🚀
                                </button>
                            </form>
                        )}
                        {!openId && openId !== 101 && openId !== 102 && (
                            <p className="text-[10px] text-center text-gray-400 italic">Click a button above to start writing...</p>
                        )}
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="bg-pink-400 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-pink-500 transition-colors inline-block"
                            onClick={() => playSound('click')}
                            onMouseEnter={() => playSound('hover')}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default QnA;
