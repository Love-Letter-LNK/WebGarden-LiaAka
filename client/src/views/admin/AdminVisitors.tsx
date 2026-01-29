import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { visitorApi, Visitor, VisitorAnalytics } from "@/lib/api";
import { Loader2, Users, Monitor, Smartphone, Tablet, Globe, Clock, TrendingUp, Eye, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const AdminVisitors = () => {
    const { toast } = useToast();
    const [loading, setLoading] = useState(true);
    const [analytics, setAnalytics] = useState<VisitorAnalytics | null>(null);
    const [visitors, setVisitors] = useState<Visitor[]>([]);
    const [viewMode, setViewMode] = useState<'analytics' | 'logs'>('analytics');

    const fetchData = async () => {
        setLoading(true);
        try {
            const [analyticsData, logsData] = await Promise.all([
                visitorApi.analytics(),
                visitorApi.list(1, 100, false)
            ]);
            setAnalytics(analyticsData);
            setVisitors(logsData.visitors);
        } catch (error) {
            console.error("Failed to fetch visitor data", error);
            toast({ title: "Failed to load data", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleClearAll = async () => {
        if (!confirm("⚠️ Are you sure you want to delete ALL visitor logs?\nThis cannot be undone!")) return;
        try {
            // Send days=0 to delete everything
            const result = await visitorApi.clearOld(0);
            toast({ title: "Success", description: result.message });
            fetchData();
        } catch (error) {
            toast({ title: "Failed to clear logs", variant: "destructive" });
        }
    };

    const getDeviceIcon = (type?: string) => { // Keep this part just to locate the replacement area correctly
        // ...
    }; // Actually I should just replace the handleClearOld function and the button rendering


    const getDeviceIcon = (type?: string) => {
        switch (type?.toLowerCase()) {
            case 'mobile': return <Smartphone size={14} className="text-blue-500" />;
            case 'tablet': return <Tablet size={14} className="text-purple-500" />;
            default: return <Monitor size={14} className="text-gray-500" />;
        }
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleString('id-ID', {
            day: '2-digit',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <AdminLayout>
                <div className="flex justify-center items-center h-96">
                    <Loader2 className="animate-spin text-pink-400" size={48} />
                </div>
            </AdminLayout>
        );
    }

    return (
        <AdminLayout>
            <div className="space-y-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-black text-gray-800 flex items-center gap-3">
                            <Users className="text-pink-500" /> Visitor Analytics
                        </h1>
                        <p className="text-sm text-gray-500">See who's visiting your garden 🌸</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={fetchData}>
                            <RefreshCw size={14} className="mr-1" /> Refresh
                        </Button>
                        <Button variant="outline" size="sm" className="text-red-500 hover:bg-red-50" onClick={handleClearAll}>
                            <Trash2 size={14} className="mr-1" /> Clear All Logs
                        </Button>
                    </div>
                </div>

                {/* Stats Cards */}
                {analytics && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <StatCard
                            title="Total Visitors"
                            value={analytics.total}
                            icon={<Eye className="text-pink-500" />}
                            color="pink"
                        />
                        <StatCard
                            title="Today"
                            value={analytics.today}
                            subtitle={`${analytics.uniqueToday} unique`}
                            icon={<Clock className="text-blue-500" />}
                            color="blue"
                        />
                        <StatCard
                            title="This Week"
                            value={analytics.thisWeek}
                            icon={<TrendingUp className="text-green-500" />}
                            color="green"
                        />
                        <StatCard
                            title="Unique Today"
                            value={analytics.uniqueToday}
                            icon={<Users className="text-purple-500" />}
                            color="purple"
                        />
                    </div>
                )}

                {/* Toggle View */}
                <div className="flex gap-2">
                    <Button
                        variant={viewMode === 'analytics' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('analytics')}
                    >
                        📊 Analytics
                    </Button>
                    <Button
                        variant={viewMode === 'logs' ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setViewMode('logs')}
                    >
                        📋 Visitor Logs
                    </Button>
                </div>

                {viewMode === 'analytics' && analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Device Breakdown */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Monitor size={16} /> By Device
                            </h3>
                            <div className="space-y-3">
                                {analytics.byDevice.map((d, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <div className="flex items-center gap-2">
                                            {getDeviceIcon(d.type)}
                                            <span className="text-sm capitalize">{d.type || 'Unknown'}</span>
                                        </div>
                                        <span className="text-sm font-bold text-gray-600">{d.count}</span>
                                    </div>
                                ))}
                                {analytics.byDevice.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Browser Breakdown */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                <Globe size={16} /> By Browser
                            </h3>
                            <div className="space-y-3">
                                {analytics.byBrowser.map((b, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm">{b.browser || 'Unknown'}</span>
                                        <span className="text-sm font-bold text-gray-600">{b.count}</span>
                                    </div>
                                ))}
                                {analytics.byBrowser.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No data yet</p>
                                )}
                            </div>
                        </div>

                        {/* Top Pages */}
                        <div className="bg-white rounded-xl p-4 shadow-sm border">
                            <h3 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                                📍 Top Pages
                            </h3>
                            <div className="space-y-3">
                                {analytics.topPages.map((p, i) => (
                                    <div key={i} className="flex items-center justify-between">
                                        <span className="text-sm truncate max-w-[150px]" title={p.page}>{p.page}</span>
                                        <span className="text-sm font-bold text-gray-600">{p.count}</span>
                                    </div>
                                ))}
                                {analytics.topPages.length === 0 && (
                                    <p className="text-sm text-gray-400 italic">No data yet</p>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* Recent Visitors */}
                {viewMode === 'analytics' && analytics && analytics.recentUnique.length > 0 && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <h3 className="font-bold text-gray-700 mb-4">🆕 Recent Unique Visitors</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="pb-2">Time</th>
                                        <th className="pb-2">IP</th>
                                        <th className="pb-2">Device</th>
                                        <th className="pb-2">Browser</th>
                                        <th className="pb-2">OS</th>
                                        <th className="pb-2">Page</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {analytics.recentUnique.map((v) => (
                                        <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-2 text-gray-400">{formatDate(v.createdAt)}</td>
                                            <td className="py-2 font-mono text-xs">{maskIP(v.ip)}</td>
                                            <td className="py-2">{getDeviceIcon(v.deviceType)}</td>
                                            <td className="py-2">{v.browser || '-'}</td>
                                            <td className="py-2">{v.os || '-'}</td>
                                            <td className="py-2 text-blue-500 truncate max-w-[100px]">{v.page}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Visitor Logs */}
                {viewMode === 'logs' && (
                    <div className="bg-white rounded-xl p-4 shadow-sm border">
                        <h3 className="font-bold text-gray-700 mb-4">📋 All Visitor Logs (Last 100)</h3>
                        <div className="overflow-x-auto max-h-[500px] overflow-y-auto">
                            <table className="w-full text-sm">
                                <thead className="sticky top-0 bg-white">
                                    <tr className="text-left text-gray-500 border-b">
                                        <th className="pb-2">Time</th>
                                        <th className="pb-2">IP</th>
                                        <th className="pb-2">Device</th>
                                        <th className="pb-2">Browser</th>
                                        <th className="pb-2">OS</th>
                                        <th className="pb-2">Page</th>
                                        <th className="pb-2">Unique</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {visitors.map((v) => (
                                        <tr key={v.id} className="border-b border-gray-50 hover:bg-gray-50">
                                            <td className="py-2 text-gray-400 text-xs">{formatDate(v.createdAt)}</td>
                                            <td className="py-2 font-mono text-xs">{maskIP(v.ip)}</td>
                                            <td className="py-2">{getDeviceIcon(v.deviceType)}</td>
                                            <td className="py-2 text-xs">{v.browser || '-'}</td>
                                            <td className="py-2 text-xs">{v.os || '-'}</td>
                                            <td className="py-2 text-blue-500 text-xs truncate max-w-[100px]">{v.page}</td>
                                            <td className="py-2">{v.isUnique ? '🆕' : ''}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {visitors.length === 0 && (
                                <p className="text-center text-gray-400 py-8">No visitor logs yet</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
};

// Helper: Mask IP for privacy
const maskIP = (ip?: string) => {
    if (!ip) return '-';
    const parts = ip.split('.');
    if (parts.length === 4) {
        return `${parts[0]}.${parts[1]}.*.*`;
    }
    return ip.substring(0, 10) + '...';
};

// Stat Card Component
interface StatCardProps {
    title: string;
    value: number;
    subtitle?: string;
    icon: React.ReactNode;
    color: 'pink' | 'blue' | 'green' | 'purple';
}

const StatCard = ({ title, value, subtitle, icon, color }: StatCardProps) => {
    const colors = {
        pink: 'bg-pink-50 border-pink-200',
        blue: 'bg-blue-50 border-blue-200',
        green: 'bg-green-50 border-green-200',
        purple: 'bg-purple-50 border-purple-200'
    };

    return (
        <div className={`${colors[color]} border rounded-xl p-4`}>
            <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-500 font-medium">{title}</span>
                {icon}
            </div>
            <div className="text-3xl font-black text-gray-800">{value.toLocaleString()}</div>
            {subtitle && <div className="text-xs text-gray-400 mt-1">{subtitle}</div>}
        </div>
    );
};

export default AdminVisitors;
