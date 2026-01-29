import { Mail, MessageSquare, Send, Heart, Loader2 } from "lucide-react";
import { Link, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { contactApi } from "@/lib/api/contact";
import { Input } from "@/components/ui/input";

const Contact = () => {
    const playSound = useSound();
    const [searchParams] = useSearchParams();
    const { toast } = useToast();

    // Default to 'lia' if not specified, or grab from URL
    const initialTo = searchParams.get('to') === 'aka' ? 'aka' : 'lia';
    const [recipient, setRecipient] = useState<'aka' | 'lia'>(initialTo);

    // Form States
    const [senderName, setSenderName] = useState('');
    const [message, setMessage] = useState('');
    const [isSending, setIsSending] = useState(false);

    // Update state if URL changes
    useEffect(() => {
        const to = searchParams.get('to');
        if (to === 'aka' || to === 'lia') {
            setRecipient(to);
        }
    }, [searchParams]);

    const handleSend = async () => {
        if (!message.trim() || !senderName.trim()) return;

        playSound('click');
        setIsSending(true);

        try {
            await contactApi.submit({
                recipient: recipient,
                senderName: senderName,
                message: message
            });

            playSound('success');
            setMessage('');
            setSenderName('');
            toast({
                title: "Message Sent! 💌",
                description: `Your love letter to ${recipient === 'aka' ? 'Aka' : 'Lia'} has been sent!`,
            });
        } catch (error) {
            console.error("Failed to send message:", error);
            toast({
                title: "Uh oh! 😓",
                description: "Something went wrong sending your message. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsSending(false);
        }
    };

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg overflow-y-auto">
                <div className="max-w-2xl mx-auto pb-20">
                    {/* Header */}
                    <div className="bg-white border-4 border-pink-200 rounded-xl p-4 mb-6 text-center shadow-lg">
                        <Mail className="w-10 h-10 mx-auto text-pink-500 mb-2" />
                        <h2 className="text-xl font-bold text-pink-600">Contact Us</h2>
                        <p className="text-xs text-gray-600">Send us a love note or just say hi!</p>
                    </div>

                    {/* Interactive Message Form */}
                    <div className="bg-white border-2 border-pink-200 rounded-lg p-6 mb-6 shadow-sm">
                        <div className="flex justify-center mb-6">
                            <div className="bg-gray-100 p-1 rounded-full flex gap-1">
                                <button
                                    onClick={() => { setRecipient('aka'); playSound('click'); }}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${recipient === 'aka'
                                        ? 'bg-blue-400 text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className={recipient === 'aka' ? 'animate-bounce' : ''}>💙</span> To Aka
                                </button>
                                <button
                                    onClick={() => { setRecipient('lia'); playSound('click'); }}
                                    className={`px-4 py-2 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${recipient === 'lia'
                                        ? 'bg-pink-400 text-white shadow-md'
                                        : 'text-gray-500 hover:bg-gray-200'
                                        }`}
                                >
                                    <span className={recipient === 'lia' ? 'animate-bounce' : ''}>💕</span> To Lia
                                </button>
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className={`p-4 rounded-lg border-2 transition-colors ${recipient === 'aka' ? 'bg-blue-50 border-blue-100' : 'bg-pink-50 border-pink-100'
                                }`}>

                                <div className="mb-4">
                                    <label className="block text-xs font-bold mb-1 text-gray-600">Your Name / Alias:</label>
                                    <Input
                                        value={senderName}
                                        onChange={(e) => setSenderName(e.target.value)}
                                        placeholder="Who are you? (e.g. Secret Admirer)"
                                        className="bg-white border-0 shadow-sm"
                                    />
                                </div>

                                <label className="block text-xs font-bold mb-1 text-gray-600">
                                    Your Message for {recipient === 'aka' ? 'Aka' : 'Lia'}:
                                </label>
                                <Textarea
                                    value={message}
                                    onChange={(e) => setMessage(e.target.value)}
                                    placeholder={`Write something sweet to ${recipient === 'aka' ? 'Aka' : 'Lia'}...`}
                                    className="bg-white border-0 shadow-none focus-visible:ring-1 min-h-[120px]"
                                />
                            </div>

                            <Button
                                onClick={handleSend}
                                disabled={!message.trim() || !senderName.trim() || isSending}
                                className={`w-full font-bold text-white transition-all ${recipient === 'aka'
                                    ? 'bg-blue-400 hover:bg-blue-500'
                                    : 'bg-pink-400 hover:bg-pink-500'
                                    }`}
                            >
                                {isSending ? (
                                    <span className="flex items-center gap-2">Sending... <Loader2 size={14} className="animate-spin" /></span>
                                ) : (
                                    <span className="flex items-center gap-2">Send Message <Send size={14} /></span>
                                )}
                            </Button>
                        </div>
                    </div>

                    {/* Social Links */}
                    <div className="bg-white border-2 border-purple-200 rounded-lg p-4 mt-6 text-center max-w-md mx-auto">
                        <h4 className="text-xs font-bold text-purple-600 mb-3 flex items-center justify-center gap-2">
                            <MessageSquare size={14} /> Other Ways to Connect
                        </h4>
                        <div className="flex justify-center gap-4">
                            <span className="text-[10px] text-gray-500 hover:text-purple-500 transition-colors cursor-pointer">📧 aka@example.com</span>
                            <span className="text-[10px] text-gray-500 hover:text-pink-500 transition-colors cursor-pointer">📧 lia@example.com</span>
                        </div>
                    </div>

                    {/* Back Button */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="inline-block bg-pink-400 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-pink-500 transition-colors"
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

export default Contact;
