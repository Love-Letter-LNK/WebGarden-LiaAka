import React, { useEffect, useState } from 'react';
import { Plane, CheckCircle2, CircleDashed } from 'lucide-react';
import { travelApi, TravelLog } from '@/lib/api';

export const TravelWidget = () => {
    const [visited, setVisited] = useState<TravelLog[]>([]);
    const [bucket, setBucket] = useState<TravelLog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await travelApi.list();
                setVisited(data.filter(log => log.isVisited));
                setBucket(data.filter(log => !log.isVisited));
            } catch (error) {
                console.error("Failed to fetch travel data", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="bg-green-50 border border-green-200 p-2 rounded relative mt-4 h-32 flex items-center justify-center">
                <span className="text-[10px] text-green-500 animate-pulse">Loading Logs...</span>
            </div>
        );
    }

    return (
        <div className="bg-green-50 border border-green-200 p-2 rounded relative mt-4">
            {/* Header */}
            <div className="bg-gradient-to-r from-green-400 to-emerald-300 text-white p-1 font-bold text-xs flex items-center gap-2 mb-2 shadow-sm cursor-pointer hover:opacity-90 transition-opacity" onClick={() => window.location.href = '/travel'}>
                <span className="bg-white text-green-400 w-5 h-5 flex items-center justify-center font-pixel text-[10px] shadow-sm border border-green-200">4</span>
                <span>TRAVEL LOG</span>
            </div>

            <div className="space-y-3">
                {/* Visited Section */}
                <div>
                    <h5 className="text-[9px] font-bold text-green-700 flex items-center gap-1 mb-1">
                        <CheckCircle2 size={10} className="text-green-500" /> ALREADY VISITED
                    </h5>
                    <ul className="space-y-1 pl-1">
                        {visited.length === 0 ? (
                            <li className="text-[10px] text-gray-400 italic">No visited places yet.</li>
                        ) : (
                            visited.map((loc) => (
                                <li key={loc.id} className="text-[10px] text-gray-600 flex items-start gap-1 group cursor-default">
                                    <span className="text-[8px] mt-0.5">📍</span>
                                    <div>
                                        <span className="font-bold text-green-600 group-hover:underline">{loc.name}</span>
                                        <p className="text-[8px] text-gray-400 italic leading-tight">{loc.description}</p>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* Divider */}
                <div className="border-t border-green-200 border-dashed"></div>

                {/* Bucket List Section */}
                <div>
                    <h5 className="text-[9px] font-bold text-blue-500 flex items-center gap-1 mb-1">
                        <Plane size={10} className="text-blue-400" /> BUCKET LIST
                    </h5>
                    <ul className="space-y-1 pl-1">
                        {bucket.length === 0 ? (
                            <li className="text-[10px] text-gray-400 italic">No plans yet.</li>
                        ) : (
                            bucket.map((loc) => (
                                <li key={loc.id} className="text-[10px] text-gray-600 flex items-start gap-1 group cursor-default">
                                    <CircleDashed size={8} className="mt-0.5 text-blue-300" />
                                    <div>
                                        <span className="group-hover:text-blue-500 transition-colors">{loc.name}</span>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            </div>

            {/* Decorative Icon */}
            <div className="absolute -top-2 -right-1 text-base animate-pulse">🌍</div>
        </div>
    );
};
