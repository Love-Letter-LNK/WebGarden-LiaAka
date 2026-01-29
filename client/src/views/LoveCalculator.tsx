import { useState } from "react";
import { Heart, Sparkles, Calculator, ArrowLeft } from "lucide-react";
import { MainLayout } from "../components/garden/MainLayout";
import { useSound } from "../hooks/useSound";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";

const LoveCalculator = () => {
    const playSound = useSound();
    const [name1, setName1] = useState("");
    const [name2, setName2] = useState("");
    const [result, setResult] = useState<number | null>(null);
    const [message, setMessage] = useState("");
    const [calculating, setCalculating] = useState(false);

    const calculateCompatibility = () => {
        if (!name1 || !name2) return;

        playSound('click');
        setCalculating(true);
        setResult(null);
        setMessage("");

        // Simple stable hash algorithm for consistent results
        const combined = (name1.toLowerCase() + name2.toLowerCase()).replace(/\s/g, '');
        let hash = 0;
        for (let i = 0; i < combined.length; i++) {
            hash = combined.charCodeAt(i) + ((hash << 5) - hash);
        }

        // Normalize to 0-100
        let percentage = Math.abs(hash % 101);

        // Easter eggs for Aka & Lia
        if (
            (name1.toLowerCase().includes("aka") && name2.toLowerCase().includes("lia")) ||
            (name1.toLowerCase().includes("lia") && name2.toLowerCase().includes("aka")) ||
            (name1.toLowerCase().includes("zakaria") && name2.toLowerCase().includes("lia"))
        ) {
            percentage = 100;
        }

        setTimeout(() => {
            setResult(percentage);
            setCalculating(false);
            playSound('success');

            if (percentage === 100) setMessage("PERFECT MATCH! Soulmates forever! 💍💕");
            else if (percentage >= 85) setMessage("Crazy in love! You two are meant to be! 🔥");
            else if (percentage >= 70) setMessage("A lovely couple! Great potential! 💖");
            else if (percentage >= 50) setMessage("There is a spark! Keep it burning! ✨");
            else setMessage("Hmm... maybe work on communication? 😅");

        }, 2000);
    };

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-purple-50 h-full flex items-center justify-center">
                <div className="max-w-md w-full">
                    {/* Back Button */}
                    <div className="mb-4 text-center">
                        <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-pink-500 text-[10px] font-bold transition-colors">
                            <ArrowLeft size={12} /> Back to Home
                        </Link>
                    </div>

                    <div className="bg-white border-4 border-pink-200 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        {/* Decorative background elements */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-pink-300" />

                        <div className="text-center mb-6">
                            <div className="inline-block p-3 bg-pink-100 rounded-full mb-3 animate-bounce">
                                <Calculator className="w-8 h-8 text-pink-500" />
                            </div>
                            <h1 className="text-2xl font-black text-pink-600 mb-1">LOVE CALC</h1>
                            <p className="text-xs text-gray-500">Calculate your destiny! ✧</p>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Person 1</label>
                                <Input
                                    placeholder="Enter name..."
                                    className="text-center border-pink-200 focus:border-pink-400 focus:ring-pink-100"
                                    value={name1}
                                    onChange={(e) => setName1(e.target.value)}
                                />
                            </div>

                            <div className="flex justify-center text-pink-300 py-1">
                                <Heart size={20} className="fill-pink-200 animate-pulse" />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Person 2</label>
                                <Input
                                    placeholder="Enter name..."
                                    className="text-center border-pink-200 focus:border-pink-400 focus:ring-pink-100"
                                    value={name2}
                                    onChange={(e) => setName2(e.target.value)}
                                />
                            </div>

                            <Button
                                className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-6 rounded-xl shadow-lg transform active:scale-95 transition-all mt-4"
                                onClick={calculateCompatibility}
                                disabled={calculating || !name1 || !name2}
                            >
                                {calculating ? (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="animate-spin" /> CALCULATING...
                                    </span>
                                ) : (
                                    "CALCULATE LOVE %"
                                )}
                            </Button>
                        </div>

                        {/* Result Section */}
                        {result !== null && !calculating && (
                            <div className="mt-6 text-center animate-in slide-in-from-bottom-4 duration-500">
                                <div className="p-4 bg-pink-50 rounded-xl border-2 border-pink-200 mb-3">
                                    <div className="text-xs text-gray-500 mb-1 uppercase tracking-wide font-bold">Compatibility Score</div>
                                    <div className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">
                                        {result}%
                                    </div>
                                </div>
                                <p className="text-sm font-bold text-pink-600 animate-pulse">{message}</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default LoveCalculator;
