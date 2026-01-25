import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { contactApi, ContactMessage, ContactStats } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Mail, MailOpen, Trash2, User, Clock, Filter, RefreshCw, Send, Sparkles, MessageSquare } from "lucide-react";
import { format } from "date-fns";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const AdminContact: React.FC = () => {
    const playSound = useSound();
    const [messages, setMessages] = useState<ContactMessage[]>([]);
    const [stats, setStats] = useState<ContactStats | null>(null);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'zekk' | 'lia' | 'unread'>('all');
    const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [actionLoading, setActionLoading] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        try {
            const params: any = {};
            if (filter === 'zekk' || filter === 'lia') params.recipient = filter;
            if (filter === 'unread') params.unreadOnly = true;
            const [messagesData, statsData] = await Promise.all([
                contactApi.list(params),
                contactApi.stats()
            ]);
            setMessages(messagesData);
            setStats(statsData);
        } catch (err) {
            console.error('Failed to load messages:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchData(); }, [filter]);

    const handleMarkRead = async (msg: ContactMessage) => {
        if (msg.isRead) return;
        try {
            await contactApi.markAsRead(msg.id);
            setMessages(messages.map(m => m.id === msg.id ? { ...m, isRead: true } : m));
            if (stats) setStats({ ...stats, unread: stats.unread - 1 });
        } catch (err) {
            console.error('Failed to mark as read:', err);
        }
    };

    const handleView = async (msg: ContactMessage) => {
        playSound('click');
        setSelectedMessage(msg);
        await handleMarkRead(msg);
    };

    const handleDelete = async () => {
        if (!deletingId) return;
        setActionLoading(true);
        try {
            await contactApi.delete(deletingId);
            playSound('success');
            setIsDeleteOpen(false);
            setDeletingId(null);
            setSelectedMessage(null);
            fetchData();
        } catch (err) {
            console.error('Failed to delete:', err);
            playSound('error');
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <AdminLayout title="Contact Messages">
            {/* Header / Stats */}
            {stats && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="bg-white border-2 border-gray-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden group hover:border-gray-300 transition-colors">
                        <div className="absolute top-0 right-0 p-2 opacity-10 group-hover:opacity-20 transition-opacity"><MessageSquare size={40} /></div>
                        <span className="text-3xl font-black text-gray-700 block mb-1">{stats.total}</span>
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Total Messages</p>
                    </div>
                    <div className="bg-white border-2 border-red-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden group hover:border-red-300 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-red-500 opacity-10 group-hover:opacity-20 transition-opacity"><Mail size={40} /></div>
                        <span className="text-3xl font-black text-red-500 block mb-1">{stats.unread}</span>
                        <p className="text-[10px] font-bold text-red-300 uppercase tracking-wider">Unread</p>
                    </div>
                    <div className="bg-white border-2 border-blue-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-blue-500 opacity-10 group-hover:opacity-20 transition-opacity"><User size={40} /></div>
                        <span className="text-3xl font-black text-blue-500 block mb-1">{stats.toZekk}</span>
                        <p className="text-[10px] font-bold text-blue-300 uppercase tracking-wider">To Zekk 💙</p>
                    </div>
                    <div className="bg-white border-2 border-pink-200 rounded-xl p-4 text-center shadow-sm relative overflow-hidden group hover:border-pink-300 transition-colors">
                        <div className="absolute top-0 right-0 p-2 text-pink-500 opacity-10 group-hover:opacity-20 transition-opacity"><User size={40} /></div>
                        <span className="text-3xl font-black text-pink-500 block mb-1">{stats.toLia}</span>
                        <p className="text-[10px] font-bold text-pink-300 uppercase tracking-wider">To Lia 💗</p>
                    </div>
                </div>
            )}

            {/* Filter & Actions */}
            <div className="bg-[#fff Bea] border-2 border-dashed border-yellow-200 rounded-xl p-4 mb-6 flex flex-wrap items-center justify-between gap-4 shadow-sm bg-yellow-50/30">
                <div className="flex gap-2 bg-white p-1.5 rounded-lg border border-yellow-100 shadow-sm">
                    <div className="flex items-center px-2 text-yellow-400"><Filter size={14} /></div>
                    {(['all', 'zekk', 'lia', 'unread'] as const).map((f) => (
                        <button
                            key={f}
                            onClick={() => { playSound('click'); setFilter(f); }}
                            className={`px-3 py-1.5 rounded-md text-[10px] font-bold transition-all uppercase tracking-wide ${filter === f
                                    ? 'bg-yellow-400 text-white shadow-sm scale-105'
                                    : 'text-gray-500 hover:bg-yellow-50 hover:text-yellow-600'
                                }`}
                        >
                            {f === 'all' ? 'All' : f === 'unread' ? 'Unread' : f}
                        </button>
                    ))}
                </div>
                <Button variant="outline" size="sm" onClick={() => { playSound('refresh'); fetchData(); }} className="bg-white border-yellow-200 text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300">
                    <RefreshCw size={14} className="mr-2" /> Refresh
                </Button>
            </div>

            {/* Messages List */}
            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-yellow-400" />
                        <p className="text-xs text-yellow-300 font-bold animate-pulse">Checking Mailbox...</p>
                    </div>
                </div>
            ) : messages.length === 0 ? (
                <div className="text-center py-16 bg-white border-2 border-dashed border-gray-200 rounded-2xl">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Mail className="w-8 h-8 text-gray-300" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium">No messages found!</p>
                    <p className="text-xs text-gray-400 mt-1">Check back later or change your filters.</p>
                </div>
            ) : (
                <div className="space-y-3">
                    {messages.map((msg) => (
                        <div
                            key={msg.id}
                            onClick={() => handleView(msg)}
                            className={`
                                group relative bg-white border-2 rounded-xl p-4 cursor-pointer transition-all duration-200
                                ${msg.isRead
                                    ? 'border-gray-100 hover:border-gray-300 opacity-90 hover:opacity-100'
                                    : 'border-yellow-300 bg-yellow-50 shadow-md hover:shadow-lg hover:-translate-y-0.5'
                                }
                            `}
                        >
                            <div className="flex items-start gap-4">
                                <div className={`
                                    w-12 h-12 rounded-full flex items-center justify-center border-2 shadow-sm shrink-0
                                    ${msg.recipient === 'zekk'
                                        ? 'bg-blue-50 border-blue-100 text-blue-500'
                                        : 'bg-pink-50 border-pink-100 text-pink-500'
                                    }
                                `}>
                                    {msg.isRead ? <MailOpen size={20} /> : <Mail size={20} className="animate-pulse" />}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center justify-between mb-1">
                                        <div className="flex items-center gap-2">
                                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider border ${msg.recipient === 'zekk'
                                                    ? 'bg-blue-100 text-blue-600 border-blue-200'
                                                    : 'bg-pink-100 text-pink-600 border-pink-200'
                                                }`}>
                                                For {msg.recipient}
                                            </span>
                                            {!msg.isRead && (
                                                <span className="flex items-center gap-1 text-[10px] text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full border border-red-100">
                                                    <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" /> NEW
                                                </span>
                                            )}
                                        </div>
                                        <span className="text-[10px] text-gray-400 font-mono flex items-center gap-1 bg-gray-50 px-2 py-0.5 rounded-full">
                                            <Clock size={10} />
                                            {format(new Date(msg.createdAt), "MMM d, HH:mm")}
                                        </span>
                                    </div>

                                    <div className="flex items-center gap-2 mb-2">
                                        <h4 className="text-sm font-bold text-gray-800">{msg.senderName || 'Anonymous'}</h4>
                                        {msg.senderEmail && <span className="text-[10px] text-gray-400">&lt;{msg.senderEmail}&gt;</span>}
                                    </div>

                                    <p className={`text-sm line-clamp-2 ${msg.isRead ? 'text-gray-500' : 'text-gray-800 font-medium'}`}>
                                        {msg.message}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* View Message Dialog */}
            <Dialog open={!!selectedMessage} onOpenChange={() => setSelectedMessage(null)}>
                <DialogContent className="max-w-xl bg-[#fffdf5] border-4 border-dashed border-yellow-200 shadow-[8px_8px_0_0_rgba(253,224,71,0.5)] rounded-3xl">
                    <DialogHeader className="border-b border-dashed border-yellow-200 pb-4">
                        <DialogTitle className="flex items-center gap-3 text-xl font-bold text-gray-800">
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${selectedMessage?.recipient === 'zekk' ? 'bg-blue-400' : 'bg-pink-400'}`}>
                                <User size={20} />
                            </div>
                            <div>
                                <span className="block text-sm font-normal text-gray-500">Message for</span>
                                {selectedMessage?.recipient === 'zekk' ? 'Zekk 💙' : 'Lia 💗'}
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-6 pt-2">
                        {/* Meta Info */}
                        <div className="flex items-center justify-between bg-white p-3 rounded-xl border border-yellow-100 shadow-sm">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                                    <User size={16} />
                                </div>
                                <div>
                                    <p className="text-sm font-bold text-gray-800">{selectedMessage?.senderName || 'Anonymous'}</p>
                                    <p className="text-xs text-gray-500">{selectedMessage?.senderEmail || 'No email provided'}</p>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Received</p>
                                <p className="text-xs font-mono text-gray-600">
                                    {selectedMessage && format(new Date(selectedMessage.createdAt), "MMM d, yyyy")}
                                </p>
                                <p className="text-xs font-mono text-gray-400">
                                    {selectedMessage && format(new Date(selectedMessage.createdAt), "HH:mm a")}
                                </p>
                            </div>
                        </div>

                        {/* Message Body */}
                        <div className="relative">
                            <div className="absolute -top-3 -left-2 text-yellow-200 transform -rotate-12"><MessageSquare size={24} fill="currentColor" /></div>
                            <div className="bg-white p-6 rounded-2xl border-2 border-yellow-100 shadow-sm min-h-[120px] relative z-10">
                                <p className="text-sm leading-relaxed text-gray-700 whitespace-pre-wrap font-medium">
                                    {selectedMessage?.message}
                                </p>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-4 border-t border-yellow-100 gap-3">
                            {selectedMessage?.senderEmail && (
                                <Button className="bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200 rounded-xl" onClick={() => window.location.href = `mailto:${selectedMessage.senderEmail}`}>
                                    <Send size={14} className="mr-2" /> Reply
                                </Button>
                            )}
                            <Button variant="destructive" onClick={() => { setDeletingId(selectedMessage?.id || null); setIsDeleteOpen(true); playSound('click'); }} className="rounded-xl">
                                <Trash2 size={14} className="mr-2" /> Delete Message
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="max-w-sm rounded-2xl border-4 border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500 flex items-center gap-2">
                            <Trash2 size={20} /> Delete Message?
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600 my-2">Are you sure you want to delete this message? This cannot be undone.</p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)} className="rounded-xl">Cancel</Button>
                        <Button onClick={handleDelete} disabled={actionLoading} className="bg-red-500 hover:bg-red-600 text-white rounded-xl shadow-lg shadow-red-200">
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Yes, Delete'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminContact;
