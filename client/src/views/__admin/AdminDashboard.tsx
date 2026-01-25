import React from "react";
import { Link } from "react-router-dom";
import {
    Image,
    Map,
    Users,
    Newspaper,
    Sparkles,
    MessageSquare,
    Heart,
    ArrowRight
} from "lucide-react";

const AdminDashboard: React.FC = () => {

    const quickLinks = [
        {
            title: "Manage Memories",
            description: "Upload & edit photos",
            icon: Image,
            href: "/__admin/memories",
            color: "text-pink-500",
            bgColor: "bg-pink-50",
            borderColor: "hover:border-pink-300"
        },
        {
            title: "Journey Timeline",
            description: "Update our story",
            icon: Map,
            href: "/__admin/journey",
            color: "text-purple-500",
            bgColor: "bg-purple-50",
            borderColor: "hover:border-purple-300"
        },
        {
            title: "News & Updates",
            description: "Post announcements",
            icon: Newspaper,
            href: "/__admin/news",
            color: "text-blue-500",
            bgColor: "bg-blue-50",
            borderColor: "hover:border-blue-300"
        },
        {
            title: "Profile Data",
            description: "Edit bio & facts",
            icon: Users,
            href: "/__admin/profiles",
            color: "text-green-500",
            bgColor: "bg-green-50",
            borderColor: "hover:border-green-300"
        },
        {
            title: "Contact Messages",
            description: "Read messages",
            icon: MessageSquare,
            href: "/__admin/contact",
            color: "text-yellow-500",
            bgColor: "bg-yellow-50",
            borderColor: "hover:border-yellow-300"
        }
    ];

    return (
        <div className="space-y-8">

            {/* WELCOME SECTION */}
            <div className="bg-gradient-to-r from-pink-50 to-white border-2 border-dashed border-pink-300 p-6 rounded-2xl shadow-[4px_4px_0_0_rgba(249,168,212,0.4)] flex items-center justify-between">
                <div>
                    <h3 className="text-xl font-black text-gray-700 mb-1 flex items-center gap-2">
                        HELLO, ADMIN! <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                    </h3>
                    <p className="text-xs text-gray-500 font-medium">Welcome to your digital garden control center.</p>
                </div>
                <div className="hidden sm:block">
                    <Heart className="w-12 h-12 text-pink-200 fill-pink-100" />
                </div>
            </div>

            {/* QUICK ACTIONS GRID */}
            <div>
                <div className="flex items-center gap-3 mb-4">
                    <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                        Quick Shortcuts
                    </span>
                    <div className="h-0.5 bg-gray-100 flex-1 border-t border-dashed border-gray-300"></div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {quickLinks.map((item) => (
                        <Link
                            key={item.title}
                            to={item.href}
                            className={`
                                bg-white p-4 rounded-xl border-2 border-gray-100 ${item.borderColor} 
                                hover:shadow-md transition-all flex items-center group relative overflow-hidden
                            `}
                        >
                            <div className={`p-3 rounded-xl ${item.bgColor} mr-4 transition-transform group-hover:scale-110`}>
                                <item.icon size={20} className={item.color} />
                            </div>
                            <div className="flex-1 z-10">
                                <h4 className="text-sm font-bold text-gray-700 group-hover:text-gray-900 transition-colors">{item.title}</h4>
                                <p className="text-[10px] text-gray-400 font-medium">{item.description}</p>
                            </div>
                            <ArrowRight size={16} className="text-gray-300 group-hover:text-gray-400 transform translate-x-4 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all" />
                        </Link>
                    ))}
                </div>
            </div>

        </div>
    );
};

export default AdminDashboard;
