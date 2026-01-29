import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Heart, AlertCircle } from "lucide-react";
import { SparkleEffect } from "@/components/garden/SparkleEffect";
import { useSound } from "@/hooks/useSound";

const AdminLogin: React.FC = () => {
    const navigate = useNavigate();
    const playSound = useSound();
    const { login, isLoading: authLoading, isAdmin } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Redirect if already logged in as admin
    React.useEffect(() => {
        if (isAdmin && !authLoading) {
            navigate("/__admin");
        }
    }, [isAdmin, authLoading, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);
        playSound('click');

        try {
            await login(email, password);
            playSound('success');
            navigate("/__admin");
        } catch (err: any) {
            setError(err.message || "Login failed. Please check your credentials.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50">
                <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-50 to-purple-50 p-4 font-pixel relative">
            <SparkleEffect />

            <div className="w-full max-w-md relative z-10">
                {/* Card */}
                <div className="bg-white rounded-2xl shadow-xl p-8 border-4 border-pink-200">
                    {/* Header */}
                    <div className="text-center mb-8">
                        <div className="w-20 h-20 bg-gradient-to-br from-pink-400 to-purple-400 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg border-4 border-white">
                            <Heart className="w-10 h-10 text-white fill-white" />
                        </div>
                        <h1 className="text-xl font-bold text-gray-800">Admin Login</h1>
                        <p className="text-[10px] text-gray-500 mt-1">Aka & Lia Digital Garden</p>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 text-xs">{error}</p>
                        </div>
                    )}

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Email</label>
                            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="admin@aka-lia.love" required disabled={isSubmitting} className="border-2 border-pink-200 focus:border-pink-400" />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-gray-700 mb-1">Password</label>
                            <Input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required disabled={isSubmitting} className="border-2 border-pink-200 focus:border-pink-400" />
                        </div>

                        <Button type="submit" disabled={isSubmitting} className="w-full bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold py-3 rounded-xl text-sm">
                            {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Logging in...</> : "Login ✨"}
                        </Button>
                    </form>

                    {/* Footer */}
                    <p className="text-center text-[10px] text-gray-400 mt-6">🔒 This is a private admin area</p>
                </div>

                {/* Back to site */}
                <p className="text-center mt-4">
                    <a href="/" className="text-pink-500 hover:text-pink-600 text-xs font-bold">← Back to site</a>
                </p>
            </div>
        </div>
    );
};

export default AdminLogin;
