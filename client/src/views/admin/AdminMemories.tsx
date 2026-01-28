import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { memoriesApi, Memory, MemoryDTO, UpdateMemoryDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Image as ImageIcon, Loader2, Search, X, Upload, Save } from "lucide-react";
import { format } from "date-fns";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const CATEGORIES = ["First Date", "Anniversary", "Travel", "Random", "Letters"];
const MOODS = ["sweet", "silly", "romantic", "adventure", "chill", "serious"];

const AdminMemories: React.FC = () => {
    const playSound = useSound();
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingMemory, setDeletingMemory] = useState<Memory | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [formData, setFormData] = useState<MemoryDTO>({
        title: "", date: new Date().toISOString().split("T")[0],
        category: "Random", tags: [], mood: "sweet", quote: "", story: "", location: "", images: []
    });

    const fetchMemories = async () => {
        setLoading(true);
        try {
            const data = await memoriesApi.list({ search: search || undefined });
            setMemories(data);
        } catch (err) {
            console.error('Failed to load memories:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchMemories(); }, []);
    useEffect(() => {
        const timeout = setTimeout(fetchMemories, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const openCreateForm = () => {
        playSound('click');
        setEditingMemory(null);
        setFormData({ title: "", date: new Date().toISOString().split("T")[0], category: "Random", tags: [], mood: "sweet", quote: "", story: "", location: "", images: [] });
        setSelectedFiles([]);
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (memory: Memory) => {
        playSound('click');
        setEditingMemory(memory);
        setFormData({
            title: memory.title, date: memory.date.split("T")[0], category: memory.category,
            tags: memory.tags, mood: memory.mood, quote: memory.quote || "", story: memory.story || "", location: memory.location || "", images: memory.images || []
        });
        setSelectedFiles([]);
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            let memory: Memory;
            if (editingMemory) {
                memory = await memoriesApi.update(editingMemory.id, formData as UpdateMemoryDTO);
            } else {
                memory = await memoriesApi.create(formData);
            }
            if (selectedFiles.length > 0) {
                await memoriesApi.uploadImages(memory.id, selectedFiles);
            }
            playSound('success');
            setIsFormOpen(false);
            fetchMemories();
        } catch (err: any) {
            setFormError(err.message || "Failed to save memory");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingMemory) return;
        setFormLoading(true);
        try {
            await memoriesApi.delete(deletingMemory.id);
            playSound('success');
            setIsDeleteOpen(false);
            setDeletingMemory(null);
            fetchMemories();
        } catch (err: any) {
            setFormError(err.message || "Failed to delete memory");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <AdminLayout title="Manage Memories">
            {/* Header Actions */}
            <div className="bg-white border-2 border-pink-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

                {/* Search */}
                <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-pink-300" />
                    <Input
                        placeholder="Search memories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-10 border-pink-200 focus-visible:ring-pink-200"
                    />
                </div>

                {/* Create Button */}
                <Button onClick={openCreateForm} className="w-full md:w-auto bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-md transition-transform active:scale-95">
                    <Plus className="w-4 h-4 mr-2" /> Add Memory
                </Button>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-pink-400" /></div>
            ) : memories.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-pink-200 rounded-xl">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-pink-300" />
                    </div>
                    <h3 className="text-gray-600 font-bold mb-1">No memories found</h3>
                    <p className="text-gray-400 text-xs mb-6">Start documenting your journey!</p>
                    <Button onClick={openCreateForm} variant="outline" className="border-pink-300 text-pink-500 hover:bg-pink-50">
                        Create Memory
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {memories.map((memory) => (
                        <div key={memory.id} className="group bg-white border-2 border-pink-100 rounded-xl overflow-hidden hover:border-pink-400 hover:shadow-md transition-all">
                            {/* Image / Cover */}
                            <div className="aspect-video bg-pink-50 relative overflow-hidden">
                                {memory.images[0] ? (
                                    <img src={memory.images[0].url} alt={memory.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-pink-200 bg-pink-50/50">
                                        <ImageIcon className="w-10 h-10" />
                                    </div>
                                )}
                                <div className="absolute top-2 left-2 flex gap-1">
                                    <span className="text-[10px] bg-white/90 px-2 py-0.5 rounded-full font-bold text-pink-500 shadow-sm border border-pink-100">
                                        {memory.category}
                                    </span>
                                </div>
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="h-9 w-9 rounded-full" onClick={() => openEditForm(memory)}>
                                        <Pencil className="w-4 h-4" />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-9 w-9 rounded-full" onClick={() => { setDeletingMemory(memory); setIsDeleteOpen(true); playSound('click'); }}>
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>
                            </div>

                            {/* Content */}
                            <div className="p-3">
                                <h3 className="font-bold text-sm text-gray-800 truncate mb-1" title={memory.title}>{memory.title}</h3>
                                <div className="flex items-center justify-between text-[10px] text-gray-400">
                                    <span>{format(new Date(memory.date), "MMM d, yyyy")}</span>
                                    <span>{memory.images.length} photos</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-4 border-pink-200 shadow-xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl text-pink-500 flex items-center gap-2">
                            {editingMemory ? <Pencil className="w-5 h-5 animate-bounce" /> : <Plus className="w-5 h-5 animate-bounce" />}
                            {editingMemory ? "Edit Memory" : "Create Memory"}
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-5 mt-2">
                        {formError && <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r text-red-600 text-xs font-sans">{formError}</div>}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Title</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                    placeholder="e.g. Our First Date"
                                    className="border-2 border-pink-100 focus-visible:ring-pink-200"
                                />
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Date</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                    className="border-2 border-pink-100 focus-visible:ring-pink-200 font-sans"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Category</label>
                                <Select value={formData.category} onValueChange={(val) => setFormData({ ...formData, category: val })}>
                                    <SelectTrigger className="border-2 border-pink-100 rounded-lg h-10"><SelectValue /></SelectTrigger>
                                    <SelectContent>{CATEGORIES.map((cat) => <SelectItem key={cat} value={cat}>{cat}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-1.5">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Mood</label>
                                <Select value={formData.mood || ""} onValueChange={(val) => setFormData({ ...formData, mood: val })}>
                                    <SelectTrigger className="border-2 border-pink-100 rounded-lg h-10"><SelectValue placeholder="Select mood" /></SelectTrigger>
                                    <SelectContent>{MOODS.map((m) => <SelectItem key={m} value={m}>{m}</SelectItem>)}</SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Story</label>
                            <Textarea
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                rows={5}
                                placeholder="Tell the whole story..."
                                className="border-2 border-pink-100 rounded-xl resize-none p-3 font-sans text-sm focus-visible:border-pink-300 focus-visible:ring-2 focus-visible:ring-pink-100"
                            />
                        </div>

                        {/* Images */}
                        <div className="space-y-1.5">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider pl-1">Images</label>
                            <div className="bg-pink-50 p-4 rounded-xl border-2 border-pink-100">
                                {editingMemory && editingMemory.images.length > 0 && (
                                    <div className="grid grid-cols-4 gap-3 mb-4">
                                        {editingMemory.images.map((img) => (
                                            <div key={img.id} className="relative aspect-square rounded-lg overflow-hidden group shadow-sm bg-white border border-pink-100">
                                                <img src={img.url} alt="" className="w-full h-full object-cover" />
                                                <button type="button" onClick={async () => { await memoriesApi.deleteImage(editingMemory.id, img.id); const updated = await memoriesApi.get(editingMemory.id); setEditingMemory(updated); }} className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <X className="w-3 h-3" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="border-2 border-dashed border-pink-300 rounded-xl p-6 text-center hover:bg-white transition-colors cursor-pointer relative bg-white/50">
                                    <input type="file" multiple accept="image/*" onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))} className="absolute inset-0 opacity-0 cursor-pointer" id="image-upload" />
                                    <div className="pointer-events-none">
                                        <Upload className="w-8 h-8 text-pink-400 mx-auto mb-2" />
                                        <p className="text-xs font-bold text-gray-600">
                                            {selectedFiles.length > 0 ? `${selectedFiles.length} files selected` : "Drop or click to upload photos"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <DialogFooter className="gap-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={formLoading} className="border-2 rounded-lg">Cancel</Button>
                            <Button type="submit" disabled={formLoading} className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-lg shadow-md font-bold">
                                {formLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <><Save className="w-4 h-4 mr-2" /> Save Memory</>}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="border-4 border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Delete Memory?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Are you sure you want to delete <span className="font-bold">"{deletingMemory?.title}"</span>? This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} disabled={formLoading} className="bg-red-500 hover:bg-red-600 text-white">
                            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminMemories;
