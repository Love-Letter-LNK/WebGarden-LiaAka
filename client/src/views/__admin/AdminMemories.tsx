import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { memoriesApi, Memory, CreateMemoryDTO, UpdateMemoryDTO } from "@/api/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import {
    ArrowLeft,
    Plus,
    Pencil,
    Trash2,
    Image as ImageIcon,
    Loader2,
    Search,
    X,
    Upload,
    Heart
} from "lucide-react";
import { format } from "date-fns";

const CATEGORIES = ["First Date", "Anniversary", "Travel", "Random", "Letters"];
const MOODS = ["sweet", "silly", "romantic", "adventure", "chill", "serious"];

const AdminMemories: React.FC = () => {
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [search, setSearch] = useState("");

    // Modal states
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingMemory, setDeletingMemory] = useState<Memory | null>(null);

    // Form states
    const [formData, setFormData] = useState<CreateMemoryDTO>({
        title: "",
        date: new Date().toISOString().split("T")[0],
        category: "Random",
        tags: [],
        mood: "sweet",
        quote: "",
        story: "",
        location: "",
    });
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    // Image upload states
    const [uploadingImages, setUploadingImages] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const fetchMemories = async () => {
        setLoading(true);
        try {
            const data = await memoriesApi.list({ search: search || undefined });
            setMemories(data);
            setError(null);
        } catch (err: any) {
            setError(err.message || "Failed to load memories");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMemories();
    }, []);

    useEffect(() => {
        const timeout = setTimeout(() => {
            fetchMemories();
        }, 300);
        return () => clearTimeout(timeout);
    }, [search]);

    const openCreateForm = () => {
        setEditingMemory(null);
        setFormData({
            title: "",
            date: new Date().toISOString().split("T")[0],
            category: "Random",
            tags: [],
            mood: "sweet",
            quote: "",
            story: "",
            location: "",
        });
        setSelectedFiles([]);
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (memory: Memory) => {
        setEditingMemory(memory);
        setFormData({
            title: memory.title,
            date: memory.date.split("T")[0],
            category: memory.category,
            tags: memory.tags,
            mood: memory.mood,
            quote: memory.quote || "",
            story: memory.story || "",
            location: memory.location || "",
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
                // Update
                memory = await memoriesApi.update(editingMemory.id, formData as UpdateMemoryDTO);
            } else {
                // Create
                memory = await memoriesApi.create(formData);
            }

            // Upload images if any
            if (selectedFiles.length > 0) {
                await memoriesApi.uploadImages(memory.id, selectedFiles);
            }

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
            setIsDeleteOpen(false);
            setDeletingMemory(null);
            fetchMemories();
        } catch (err: any) {
            setFormError(err.message || "Failed to delete memory");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDeleteImage = async (memoryId: string, imageId: string) => {
        try {
            await memoriesApi.deleteImage(memoryId, imageId);
            // Refresh the editing memory
            if (editingMemory) {
                const updated = await memoriesApi.get(editingMemory.id);
                setEditingMemory(updated);
            }
        } catch (err: any) {
            alert(err.message || "Failed to delete image");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-40">
                <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/__admin"
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5 text-gray-600" />
                        </Link>
                        <div>
                            <h1 className="font-bold text-gray-800">Manage Memories</h1>
                            <p className="text-xs text-gray-500">{memories.length} memories</p>
                        </div>
                    </div>

                    <Button
                        onClick={openCreateForm}
                        className="bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
                    >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Memory
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-6xl mx-auto px-4 py-6">
                {/* Search */}
                <div className="mb-6">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search memories..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Error */}
                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
                        {error}
                    </div>
                )}

                {/* Loading */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-500" />
                    </div>
                ) : memories.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Heart className="w-8 h-8 text-gray-300" />
                        </div>
                        <p className="text-gray-500 mb-4">No memories yet</p>
                        <Button onClick={openCreateForm}>Create your first memory</Button>
                    </div>
                ) : (
                    /* Memories Grid */
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {memories.map((memory) => (
                            <div
                                key={memory.id}
                                className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                            >
                                {/* Cover Image */}
                                <div className="aspect-video bg-gray-100 relative">
                                    {memory.images[0] ? (
                                        <img
                                            src={memory.images[0].url}
                                            alt={memory.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center">
                                            <ImageIcon className="w-8 h-8 text-gray-300" />
                                        </div>
                                    )}
                                    <span className="absolute top-2 left-2 text-xs bg-white/90 px-2 py-1 rounded font-medium">
                                        {memory.category}
                                    </span>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="font-bold text-gray-800 truncate">
                                        {memory.title}
                                    </h3>
                                    <p className="text-xs text-gray-500 mt-1">
                                        {format(new Date(memory.date), "MMM d, yyyy")}
                                    </p>

                                    {/* Actions */}
                                    <div className="flex gap-2 mt-4">
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => openEditForm(memory)}
                                            className="flex-1"
                                        >
                                            <Pencil className="w-3 h-3 mr-1" />
                                            Edit
                                        </Button>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={() => {
                                                setDeletingMemory(memory);
                                                setIsDeleteOpen(true);
                                            }}
                                            className="text-red-500 border-red-200 hover:bg-red-50"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Create/Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>
                            {editingMemory ? "Edit Memory" : "Create Memory"}
                        </DialogTitle>
                        <DialogDescription>
                            {editingMemory ? "Update the memory details." : "Add a new memory to your collection."}
                        </DialogDescription>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {formError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
                                {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Title *</label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Date *</label>
                                <Input
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    required
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium mb-1">Category *</label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(val) => setFormData({ ...formData, category: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1">Mood</label>
                                <Select
                                    value={formData.mood || ""}
                                    onValueChange={(val) => setFormData({ ...formData, mood: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select mood" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {MOODS.map((m) => (
                                            <SelectItem key={m} value={m}>{m}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Location</label>
                            <Input
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="e.g. Jakarta, My Room"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Tags (comma separated)</label>
                            <Input
                                value={formData.tags?.join(", ") || ""}
                                onChange={(e) => setFormData({
                                    ...formData,
                                    tags: e.target.value.split(",").map(t => t.trim()).filter(Boolean)
                                })}
                                placeholder="love, memories, travel"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Quote</label>
                            <Input
                                value={formData.quote}
                                onChange={(e) => setFormData({ ...formData, quote: e.target.value })}
                                placeholder="A special quote..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-1">Story</label>
                            <Textarea
                                value={formData.story}
                                onChange={(e) => setFormData({ ...formData, story: e.target.value })}
                                placeholder="Tell the story..."
                                rows={4}
                            />
                        </div>

                        {/* Existing Images (edit mode) */}
                        {editingMemory && editingMemory.images.length > 0 && (
                            <div>
                                <label className="block text-sm font-medium mb-2">Current Images</label>
                                <div className="grid grid-cols-4 gap-2">
                                    {editingMemory.images.map((img) => (
                                        <div key={img.id} className="relative aspect-square rounded overflow-hidden group">
                                            <img src={img.url} alt="" className="w-full h-full object-cover" />
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteImage(editingMemory.id, img.id)}
                                                className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            >
                                                <X className="w-3 h-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Upload New Images */}
                        <div>
                            <label className="block text-sm font-medium mb-2">
                                {editingMemory ? "Add More Images" : "Upload Images"}
                            </label>
                            <div className="border-2 border-dashed border-gray-200 rounded-lg p-4 text-center">
                                <input
                                    type="file"
                                    multiple
                                    accept="image/*"
                                    onChange={(e) => {
                                        if (e.target.files) {
                                            setSelectedFiles(Array.from(e.target.files));
                                        }
                                    }}
                                    className="hidden"
                                    id="image-upload"
                                />
                                <label htmlFor="image-upload" className="cursor-pointer">
                                    <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                                    <p className="text-sm text-gray-500">Click to upload images</p>
                                    <p className="text-xs text-gray-400">PNG, JPG, GIF up to 5MB</p>
                                </label>
                            </div>
                            {selectedFiles.length > 0 && (
                                <p className="text-sm text-green-600 mt-2">
                                    {selectedFiles.length} file(s) selected
                                </p>
                            )}
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsFormOpen(false)}
                                disabled={formLoading}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={formLoading}
                                className="bg-pink-500 hover:bg-pink-600"
                            >
                                {formLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin mr-2" />
                                        Saving...
                                    </>
                                ) : (
                                    "Save Memory"
                                )}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Memory?</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete "{deletingMemory?.title}"?
                            This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleDelete}
                            disabled={formLoading}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {formLoading ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                "Delete"
                            )}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminMemories;
