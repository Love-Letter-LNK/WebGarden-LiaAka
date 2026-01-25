import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { newsApi, NewsItem, CreateNewsDTO, UpdateNewsDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2, Calendar, Eye, EyeOff, Save } from "lucide-react";
import { format } from "date-fns";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const CATEGORIES = ["celebration", "date", "announcement", "update"];
const EMOJIS = ["🎄", "🌟", "🚀", "💕", "📸", "🎂", "🎉", "💝", "📰", "✨"];

const AdminNews: React.FC = () => {
    const playSound = useSound();
    const [news, setNews] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingNews, setEditingNews] = useState<NewsItem | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingNews, setDeletingNews] = useState<NewsItem | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateNewsDTO>({
        title: "", date: new Date().toISOString().split("T")[0],
        category: "announcement", emoji: "📰", content: "", published: true
    });

    const fetchNews = async () => {
        setLoading(true);
        try {
            const data = await newsApi.listAll();
            setNews(data);
        } catch (err) {
            console.error('Failed to load news:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchNews(); }, []);

    const openCreateForm = () => {
        playSound('click');
        setEditingNews(null);
        setFormData({ title: "", date: new Date().toISOString().split("T")[0], category: "announcement", emoji: "📰", content: "", published: true });
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (item: NewsItem) => {
        playSound('click');
        setEditingNews(item);
        setFormData({
            title: item.title, date: item.date.split("T")[0], category: item.category,
            emoji: item.emoji, content: item.content || "", published: item.published
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            if (editingNews) {
                await newsApi.update(editingNews.id, formData as UpdateNewsDTO);
            } else {
                await newsApi.create(formData);
            }
            playSound('success');
            setIsFormOpen(false);
            fetchNews();
        } catch (err: any) {
            setFormError(err.message || "Failed to save news");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingNews) return;
        setFormLoading(true);
        try {
            await newsApi.delete(deletingNews.id);
            playSound('success');
            setIsDeleteOpen(false);
            setDeletingNews(null);
            fetchNews();
        } catch (err: any) {
            setFormError(err.message || "Failed to delete news");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <AdminLayout title="Manage News">
            {/* Header Actions */}
            <div className="bg-white border-2 border-blue-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

                {/* Stats */}
                <div className="flex items-center gap-2">
                    <div className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-bold border border-blue-100">
                        {news.length} UPDATES
                    </div>
                    <div className="bg-cyan-50 text-cyan-600 px-3 py-1 rounded-lg text-xs font-bold border border-cyan-100">
                        {news.filter(n => n.published).length} PUBLISHED
                    </div>
                </div>

                {/* Create Button */}
                <Button onClick={openCreateForm} className="w-full md:w-auto bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white font-bold shadow-md transition-transform active:scale-95">
                    <Plus className="w-4 h-4 mr-2" /> Post News
                </Button>
            </div>

            {/* List */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-blue-400" /></div>
            ) : news.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-blue-200 rounded-xl">
                    <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-3xl">📰</span>
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No news updates yet</p>
                    <Button onClick={openCreateForm} variant="outline" className="border-blue-300 text-blue-500 hover:bg-blue-50">Add Update</Button>
                </div>
            ) : (
                <div className="grid gap-3">
                    {news.map((item) => (
                        <div key={item.id} className={cn(
                            "bg-white border-2 rounded-xl p-4 flex items-start gap-4 transition-all group hover:shadow-md",
                            item.published ? "border-blue-100 hover:border-blue-300" : "border-gray-200 bg-gray-50/50 opacity-80"
                        )}>
                            <div className="w-12 h-12 bg-blue-50 rounded-lg flex items-center justify-center text-2xl border border-blue-100 shadow-sm shrink-0">
                                {item.emoji}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 mb-1 flex-wrap">
                                    <h3 className="font-bold text-gray-800 truncate">{item.title}</h3>
                                    {!item.published && (
                                        <span className="text-[10px] bg-gray-200 text-gray-500 px-2 py-0.5 rounded-full flex items-center gap-1 font-bold border border-gray-300">
                                            <EyeOff size={10} /> DRAFT
                                        </span>
                                    )}
                                </div>

                                <p className="text-xs text-gray-600 line-clamp-2 mb-2">{item.content}</p>

                                <div className="flex items-center gap-3 text-[10px] text-gray-400">
                                    <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded font-bold uppercase tracking-wider">{item.category}</span>
                                    <span className="flex items-center gap-1"><Calendar size={10} /> {format(new Date(item.date), "MMM d, yyyy")}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 self-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Button variant="outline" size="sm" onClick={() => openEditForm(item)} className="h-8 w-8 p-0 rounded-lg border-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-500"><Pencil className="w-3.5 h-3.5" /></Button>
                                <Button variant="outline" size="sm" onClick={() => { setDeletingNews(item); setIsDeleteOpen(true); playSound('click'); }} className="h-8 w-8 p-0 rounded-lg border-2 hover:bg-red-50 hover:border-red-200 hover:text-red-500"><Trash2 className="w-3.5 h-3.5" /></Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto bg-white border-4 border-blue-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-blue-500 flex items-center gap-2">
                            {editingNews ? <Pencil className="w-5 h-5 animate-bounce" /> : <Plus className="w-5 h-5 animate-bounce" />}
                            {editingNews ? "Edit News" : "Create News"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                        {formError && <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r text-red-600 text-xs font-sans">{formError}</div>}

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="border-2 border-blue-100 focus-visible:ring-blue-200"
                                placeholder="Big news headline..."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Date</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="border-2 border-blue-100 focus-visible:ring-blue-200 font-sans"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Category</label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger className="border-2 border-blue-100 rounded-lg h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Emoji</label>
                            <div className="flex gap-2 flex-wrap bg-blue-50 p-3 rounded-xl border-2 border-blue-100">
                                {EMOJIS.map((e) => (
                                    <button
                                        key={e}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, emoji: e })}
                                        className={cn(
                                            "w-9 h-9 text-lg rounded-lg transition-all active:scale-90 flex items-center justify-center border-2",
                                            formData.emoji === e ? "bg-white border-blue-300 shadow-sm scale-110" : "border-transparent hover:bg-white/50"
                                        )}
                                    >
                                        {e}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Content</label>
                            <Textarea
                                value={formData.content}
                                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                rows={4}
                                className="border-2 border-blue-100 rounded-xl resize-none p-3 font-sans text-sm focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-100"
                                placeholder="Write your update here..."
                            />
                        </div>

                        <div className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-100 rounded-xl">
                            <div className="flex flex-col">
                                <span className="text-sm font-bold text-gray-700 flex items-center gap-2">
                                    {formData.published ? <Eye size={16} className="text-blue-500" /> : <EyeOff size={16} className="text-gray-400" />}
                                    Published Status
                                </span>
                                <span className="text-[10px] text-gray-500">Visible on the public site?</span>
                            </div>
                            <Switch checked={formData.published} onCheckedChange={(checked) => setFormData({ ...formData, published: checked })} />
                        </div>

                        <DialogFooter className="gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={formLoading} className="border-2 rounded-lg">Cancel</Button>
                            <Button type="submit" disabled={formLoading} className="bg-gradient-to-r from-blue-400 to-cyan-400 hover:from-blue-500 hover:to-cyan-500 text-white rounded-lg shadow-md font-bold">
                                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <><Save className="w-4 h-4 mr-2" /> Save Update</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="border-4 border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Delete Update?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Delete <span className="font-bold">"{deletingNews?.title}"</span>? This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} disabled={formLoading} className="bg-red-500 hover:bg-red-600 text-white">
                            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminNews;
