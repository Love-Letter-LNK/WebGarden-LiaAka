import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { Link } from "react-router-dom";
import {
    Image, Newspaper, Map, Users, Mail, Camera,
    TrendingUp, Clock, Heart, Loader2
} from "lucide-react";
import { memoriesApi, newsApi, journeyApi, contactApi } from "@/lib/api";

interface Stats {
    memories: number;
    news: number;
    journey: number;
    letters: number;
    messages: { total: number; unread: number };
}

const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState<Stats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const [memories, news, journey, messageStats] = await Promise.all([
                    memoriesApi.list(),
                    newsApi.listAll(),
                    journeyApi.list(),
                    contactApi.stats()
                ]);
                const letterCount = memories.filter((m: any) => m.category === 'letters').length;
                setStats({
                    memories: memories.length,
                    news: news.length,
                    journey: journey.length,
                    letters: letterCount,
                    messages: { total: messageStats.total, unread: messageStats.unread }
                });
            } catch (error) {
                console.error('Failed to fetch stats:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const cards = [
        {
            title: 'Memories',
            icon: Image,
            color: 'from-pink-400 to-rose-400',
            link: '/__admin/memories',
            count: stats?.memories ?? '-',
            desc: 'Photo memories'
        },
        {
            title: 'News',
            icon: Newspaper,
            color: 'from-blue-400 to-cyan-400',
            link: '/__admin/news',
            count: stats?.news ?? '-',
            desc: 'News & updates'
        },
        {
            title: 'Journey',
            icon: Map,
            color: 'from-purple-400 to-violet-400',
            link: '/__admin/journey',
            count: stats?.journey ?? '-',
            desc: 'Timeline milestones'
        },
        {
            title: 'Profiles',
            icon: Users,
            color: 'from-green-400 to-emerald-400',
            link: '/__admin/profiles',
            count: 2,
            desc: 'Aka & Lia'
        },
        {
            title: 'Messages',
            icon: Mail,
            color: 'from-yellow-400 to-orange-400',
            link: '/__admin/contact',
            count: stats?.messages.total ?? '-',
            desc: stats?.messages.unread ? `${stats.messages.unread} unread` : 'Contact messages',
            badge: stats?.messages.unread
        },
        {
            title: 'Letters',
            icon: Mail,
            color: 'from-amber-400 to-yellow-500',
            link: '/__admin/letters',
            count: stats?.letters ?? '-',
            desc: 'Private letters'
        },
        {
            title: 'Gallery',
            icon: Camera,
            color: 'from-red-400 to-pink-400',
            link: '/__admin/gallery',
            count: '-',
            desc: 'Image gallery'
        },
    ];

    return (
        <AdminLayout>
            {/* Welcome Banner */}
            <div className="bg-gradient-to-r from-pink-400 to-purple-400 rounded-xl p-6 mb-6 text-white shadow-lg relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
                <div className="absolute bottom-0 left-0 w-20 h-20 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />

                <div className="relative z-10">
                    <h1 className="text-2xl font-bold mb-2 flex items-center gap-2">
                        <Heart className="animate-pulse" /> Welcome Back!
                    </h1>
                    <p className="text-sm opacity-90">Manage your Digital Garden from here ✨</p>
                </div>
            </div>

            {/* Stats Grid */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {cards.map((card) => (
                        <Link
                            key={card.title}
                            to={card.link}
                            className="bg-white border-2 border-pink-100 rounded-xl p-4 hover:border-pink-300 hover:shadow-md transition-all group relative"
                        >
                            {/* Badge */}
                            {(card.badge || 0) > 0 && (
                                <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] px-2 py-0.5 rounded-full animate-pulse">
                                    {card.badge} new
                                </span>
                            )}

                            <div className="flex items-start gap-3">
                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center shadow-md group-hover:scale-110 transition-transform`}>
                                    <card.icon className="w-6 h-6 text-white" />
                                </div>
                                <div className="flex-1">
                                    <h3 className="font-bold text-gray-800 text-sm">{card.title}</h3>
                                    <p className="text-[10px] text-gray-500">{card.desc}</p>
                                </div>
                                <div className="text-right">
                                    <span className="text-2xl font-bold text-gray-800">{card.count}</span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            )}

            {/* Quick Actions */}
            <div className="mt-6 bg-white border-2 border-pink-100 rounded-xl p-4">
                <h3 className="font-bold text-sm text-gray-800 mb-3 flex items-center gap-2">
                    <TrendingUp size={14} /> Quick Actions
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <Link
                        to="/__admin/memories"
                        className="px-4 py-2 bg-pink-100 text-pink-600 rounded-lg text-xs font-bold text-center hover:bg-pink-200 transition-colors"
                    >
                        + Add Memory
                    </Link>
                    <Link
                        to="/__admin/news"
                        className="px-4 py-2 bg-blue-100 text-blue-600 rounded-lg text-xs font-bold text-center hover:bg-blue-200 transition-colors"
                    >
                        + Add News
                    </Link>
                    <Link
                        to="/__admin/journey"
                        className="px-4 py-2 bg-purple-100 text-purple-600 rounded-lg text-xs font-bold text-center hover:bg-purple-200 transition-colors"
                    >
                        + Add Milestone
                    </Link>
                    <Link
                        to="/__admin/letters"
                        className="px-4 py-2 bg-amber-100 text-amber-600 rounded-lg text-xs font-bold text-center hover:bg-amber-200 transition-colors"
                    >
                        + Write Letter
                    </Link>
                    <Link
                        to="/__admin/gallery"
                        className="px-4 py-2 bg-rose-100 text-rose-600 rounded-lg text-xs font-bold text-center hover:bg-rose-200 transition-colors"
                    >
                        + Upload Photo
                    </Link>
                </div>
            </div>

            {/* Footer Info */}
            <div className="mt-6 text-center">
                <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
                    <Clock size={10} /> Last updated: {new Date().toLocaleDateString()}
                </span>
            </div>
        </AdminLayout>
    );
};

export default AdminDashboard;
