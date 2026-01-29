import { Heart, Star, Calendar, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";
import { SEO } from "@/components/seo/SEO";
import { useEffect, useState } from "react";
import { profilesApi } from "@/lib/api/profiles";
import { journeyApi } from "@/lib/api/journey";
import { Profile as ProfileType } from "@/types/profile";
import { JourneyMilestone } from "@/types/journey";
import { format } from "date-fns";

const Profile = () => {
    const playSound = useSound();
    const [zekk, setZekk] = useState<ProfileType | null>(null);
    const [lia, setLia] = useState<ProfileType | null>(null);
    const [journey, setJourney] = useState<JourneyMilestone[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [zekkData, liaData, journeyData] = await Promise.all([
                    profilesApi.get('zekk'),
                    profilesApi.get('lia'),
                    journeyApi.list()
                ]);
                setZekk(zekkData);
                setLia(liaData);
                setJourney(journeyData);
            } catch (err) {
                console.error("Failed to fetch profile data:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <MainLayout>
                <div className="flex-1 flex items-center justify-center h-full">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-400" />
                </div>
            </MainLayout>
        );
    }

    // Fallback if API fails or returns null (should be seeded though)
    const zekkProfile = zekk || { name: 'Zekk', nickname: 'ZEKK', bio: 'Loading...', hobbies: '', funFacts: [], birthDate: '' };
    const liaProfile = lia || { name: 'Lia', nickname: 'LIA', bio: 'Loading...', hobbies: '', funFacts: [], birthDate: '' };

    return (
        <MainLayout>
            <SEO title="About Us" description="Profil lengkap Zakaria & Lia. Kenali kami lebih dekat!" />
            {/* Page Content */}
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg overflow-y-auto">
                <div className="max-w-4xl mx-auto pb-20">

                    {/* Couple Banner */}
                    <div className="bg-white border-4 border-pink-200 rounded-xl p-4 mb-6 text-center">
                        <div className="flex justify-center gap-8 mb-4">
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-28 bg-blue-100 border-3 border-blue-400 rounded-lg overflow-hidden shadow-lg relative">
                                    <img
                                        src={zekk?.avatar || "/zekk_pixel.webp"}
                                        className="w-full h-full object-cover"
                                        alt="Zekk"
                                        // Fallback to placeholder if image fails
                                        onError={(e) => { e.currentTarget.src = "https://placehold.co/100x120/blue/white?text=Zekk"; }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-blue-500 mt-2">{zekkProfile.nickname || zekkProfile.name.toUpperCase()}</span>
                                <p className="text-[8px] text-gray-400">{zekkProfile.name}</p>
                            </div>
                            <div className="flex items-center">
                                <Heart className="text-pink-500 w-8 h-8 animate-pulse" />
                            </div>
                            <div className="flex flex-col items-center">
                                <div className="w-24 h-28 bg-pink-100 border-3 border-pink-400 rounded-lg overflow-hidden shadow-lg relative">
                                    <img
                                        src={lia?.avatar || "/lia_pixel.webp"}
                                        className="w-full h-full object-cover"
                                        alt="Lia"
                                        onError={(e) => { e.currentTarget.src = "https://placehold.co/100x120/pink/white?text=Lia"; }}
                                    />
                                </div>
                                <span className="text-xs font-bold text-pink-500 mt-2">{liaProfile.nickname || liaProfile.name.toUpperCase()}</span>
                                <p className="text-[8px] text-gray-400">{liaProfile.name}</p>
                            </div>
                        </div>
                        <div className="bg-gradient-to-r from-pink-100 via-purple-100 to-blue-100 rounded-full p-2 inline-block">
                            <span className="text-[10px] font-bold text-purple-500">✨ Together Forever ✨</span>
                        </div>
                    </div>

                    {/* About Section */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                        {/* Zekk's Profile */}
                        <div className="bg-blue-100 border-2 border-blue-300 rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10">
                                <Star size={64} className="text-blue-500" />
                            </div>
                            <h3 className="font-bold text-blue-600 text-sm mb-2 flex items-center gap-2 relative z-10">
                                <Star size={14} /> About Zekk
                            </h3>
                            <div className="text-[10px] text-gray-600 mb-3 relative z-10">
                                <p className="mb-2 italic">"{zekkProfile.bio}"</p>
                                <ul className="space-y-1">
                                    <li>🎂 Born: {zekkProfile.birthDate ? format(new Date(zekkProfile.birthDate), "MMMM do") : '-'}</li>
                                    <li>💼 Hobbies: {zekkProfile.hobbies}</li>
                                </ul>
                            </div>
                            {/* Fun Facts Preview */}
                            {zekkProfile.funFacts && zekkProfile.funFacts.length > 0 && (
                                <div className="mt-2 bg-white/50 p-2 rounded text-[9px] text-blue-800">
                                    Let you know: {zekkProfile.funFacts[0]}
                                </div>
                            )}
                        </div>

                        {/* Lia's Profile */}
                        <div className="bg-pink-100 border-2 border-pink-300 rounded-lg p-4 relative overflow-hidden">
                            <div className="absolute top-2 right-2 opacity-10">
                                <Heart size={64} className="text-pink-500" />
                            </div>
                            <h3 className="font-bold text-pink-600 text-sm mb-2 flex items-center gap-2 relative z-10">
                                <Heart size={14} /> About Lia
                            </h3>
                            <div className="text-[10px] text-gray-600 mb-3 relative z-10">
                                <p className="mb-2 italic">"{liaProfile.bio}"</p>
                                <ul className="space-y-1">
                                    <li>🎂 Born: {liaProfile.birthDate ? format(new Date(liaProfile.birthDate), "MMMM do") : '-'}</li>
                                    <li>💼 Hobbies: {liaProfile.hobbies}</li>
                                </ul>
                            </div>
                            {/* Fun Facts Preview */}
                            {liaProfile.funFacts && liaProfile.funFacts.length > 0 && (
                                <div className="mt-2 bg-white/50 p-2 rounded text-[9px] text-pink-800">
                                    Let you know: {liaProfile.funFacts[0]}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Our Journey */}
                    <div className="bg-white border-2 border-purple-200 rounded-lg p-4">
                        <h3 className="font-bold text-purple-600 text-sm mb-3 flex items-center gap-2">
                            <Calendar size={14} /> Our Journey
                        </h3>
                        <div className="space-y-2 relative">
                            {/* Vertical Line */}
                            <div className="absolute left-[15px] top-2 bottom-2 w-0.5 bg-gray-100" />

                            {journey.map((item, index) => (
                                <div key={item.id} className="relative flex items-center gap-3 mb-4 last:mb-0">
                                    {/* Icon Circle */}
                                    <div className="relative z-10 w-8 h-8 rounded-full bg-white border-2 border-purple-100 flex items-center justify-center text-xl shrink-0 shadow-sm">
                                        {item.icon || "📅"}
                                    </div>
                                    {/* Content */}
                                    <div className="bg-purple-50/50 p-2 rounded-lg flex-1 border border-purple-100">
                                        <div className="flex justify-between items-start">
                                            <p className="text-[10px] font-bold text-gray-700">{item.title}</p>
                                            <p className="text-[8px] text-gray-400 font-bold ml-2 shrink-0">
                                                {format(new Date(item.date), "MMM yyyy")}
                                            </p>
                                        </div>
                                        {item.description && (
                                            <p className="text-[9px] text-gray-500 mt-1">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            ))}

                            {journey.length === 0 && (
                                <div className="text-center text-gray-400 text-xs py-4">
                                    Our story is just beginning...
                                </div>
                            )}
                        </div>
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

export default Profile;
