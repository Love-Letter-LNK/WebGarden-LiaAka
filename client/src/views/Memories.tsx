import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { useMemories } from "@/hooks/useMemories";
import { MemoryGrid } from "@/components/memory/MemoryGrid";
import { MemoryBookModal } from "@/components/memory/MemoryBookModal";
import { MemoryForm } from "@/components/memory/MemoryForm";
import { Memory, MemoryDTO } from "@/types/memory";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, Plus, Sparkles, Filter, Edit } from "lucide-react";
import { FloatingDecorations } from "@/components/garden/FloatingDecorations";
import { MainLayout } from "@/components/garden/MainLayout";
import { useAuth } from "@/hooks/useAuth";

const Memories = () => {
    const { memories, loading, error, actions } = useMemories();
    const { isAdmin } = useAuth();
    const [searchParams] = useSearchParams();
    const initialCategory = searchParams.get("category") || "all";
    const [search, setSearch] = useState("");
    const [categoryFilter, setCategoryFilter] = useState<string>(initialCategory);
    const [moodFilter, setMoodFilter] = useState<string>("all");

    // UI States
    const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [editingMemory, setEditingMemory] = useState<Memory | null>(null);

    // Initial load
    useEffect(() => {
        console.log("Memories component mounted, fetching data...");
        actions.refresh();
    }, []);

    // Handle filtering locally for instant UI or can call refresh({ ... }) for server-side
    // For specific filter requirements we can use the repository filter
    useEffect(() => {
        const timeout = setTimeout(() => {
            actions.refresh({
                search: search || undefined,
                category: categoryFilter !== "all" ? categoryFilter : undefined,
                mood: moodFilter !== "all" ? moodFilter : undefined
            });
        }, 300); // Debounce
        return () => clearTimeout(timeout);
    }, [search, categoryFilter, moodFilter]);

    const handleCreate = async (data: MemoryDTO) => {
        await actions.addMemory(data);
        setIsAddOpen(false);
    };

    const handleUpdate = async (data: MemoryDTO) => {
        if (editingMemory) {
            await actions.updateMemory(editingMemory.id, data);

            // Re-open the book modal with updated content
            const updated = await actions.getMemory(editingMemory.id);
            if (updated) setSelectedMemory(updated);

            setEditingMemory(null);
        }
    };

    const handleDelete = async (id: string) => {
        await actions.deleteMemory(id);
        if (selectedMemory?.id === id) {
            setSelectedMemory(null);
        }
    };

    return (
        <MainLayout>
            <div className="pb-20 relative">
                {/* Page Title Section */}
                <div className="relative bg-gradient-to-b from-pink-50 to-white pt-6 pb-4 px-4 text-center overflow-hidden rounded-xl mb-4 border-2 border-pink-100 border-dashed">
                    <div className="relative z-10 max-w-4xl mx-auto">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                            <h1 className="text-2xl md:text-4xl font-black text-pink-500 drop-shadow-sm">
                                OUR MEMORIES
                            </h1>
                            <Sparkles className="text-yellow-400 animate-pulse" size={24} />
                        </div>
                        <p className="text-gray-500 text-xs md:text-sm max-w-lg mx-auto font-medium font-pixel">
                            Collecting moments, one pixel at a time.
                        </p>
                    </div>
                </div>

                {/* Toolbar */}
                <div className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-y border-pink-100 py-3 px-4 shadow-sm mb-6 rounded-lg">
                    <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-4 items-center justify-between">
                        {/* Search & Filters */}
                        <div className="flex flex-col sm:flex-row w-full md:w-auto gap-3 flex-1">
                            <div className="relative flex-1">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search memories..."
                                    className="pl-9 bg-white border-pink-200 focus:border-pink-400 focus:ring-pink-200 w-full"
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                />
                            </div>

                            <div className="flex gap-2 w-full sm:w-auto">
                                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                                    <SelectTrigger className="flex-1 sm:w-[140px] bg-white border-pink-200">
                                        <div className="flex items-center gap-2 text-gray-600">
                                            <Filter size={14} />
                                            <span>{categoryFilter === 'all' ? 'All Types' : categoryFilter}</span>
                                        </div>
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                                        <SelectItem value="all">All Types</SelectItem>
                                        <SelectItem value="First Date">First Date</SelectItem>
                                        <SelectItem value="Anniversary">Anniversary</SelectItem>
                                        <SelectItem value="Travel">Travel</SelectItem>
                                        <SelectItem value="Random">Random</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select value={moodFilter} onValueChange={setMoodFilter}>
                                    <SelectTrigger className="flex-1 sm:w-[130px] bg-white border-pink-200">
                                        <SelectValue placeholder="Mood" />
                                    </SelectTrigger>
                                    <SelectContent className="bg-white border-gray-200 shadow-xl z-50">
                                        <SelectItem value="all">All Moods</SelectItem>
                                        <SelectItem value="sweet">🍬 Sweet</SelectItem>
                                        <SelectItem value="romantic">💖 Romantic</SelectItem>
                                        <SelectItem value="silly">🤪 Silly</SelectItem>
                                        <SelectItem value="adventure">🗺️ Adventure</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Add Button */}
                        {/* Add Button - Admin Only */}
                        {isAdmin && (
                            <Button
                                onClick={() => setIsAddOpen(true)}
                                className="w-full md:w-auto bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white font-bold shadow-md hover:shadow-lg transition-all rounded-full px-6"
                            >
                                <Plus size={18} className="mr-2" />
                                Add Memory
                            </Button>
                        )}
                    </div>
                </div>

                {/* Content Grid */}
                <main className="max-w-7xl mx-auto px-1 md:px-4 min-h-[200px]">
                    <MemoryGrid
                        memories={memories.filter(m => m.category?.toLowerCase() !== 'letters')}
                        loading={loading}
                        error={error}
                        onMemoryClick={setSelectedMemory}
                    />
                </main>

                {/* --- Modals --- */}

                {/* View Modal (Book) */}
                {selectedMemory && (
                    <MemoryBookModal
                        memory={selectedMemory}
                        isOpen={!!selectedMemory}
                        onClose={() => setSelectedMemory(null)}
                        onEdit={(mem) => {
                            setEditingMemory(mem);
                            setSelectedMemory(null); // Close book modal to avoid z-index block
                        }}
                        onDelete={handleDelete}
                    />
                )}

                {/* Create Modal */}
                <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-4 border-pink-200">
                        <DialogHeader>
                            <DialogTitle className="text-pink-600 font-bold text-xl flex items-center gap-2">
                                <Sparkles size={20} /> Create New Memory
                            </DialogTitle>
                            <DialogDescription>
                                Save a precious moment to your digital garden.
                            </DialogDescription>
                        </DialogHeader>
                        <MemoryForm
                            onSubmit={handleCreate}
                            onCancel={() => setIsAddOpen(false)}
                        />
                    </DialogContent>
                </Dialog>

                {/* Edit Modal */}
                <Dialog open={!!editingMemory} onOpenChange={(open) => !open && setEditingMemory(null)}>
                    <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-white border-4 border-blue-200">
                        <DialogHeader>
                            <DialogTitle className="text-blue-600 font-bold text-xl flex items-center gap-2">
                                <Edit size={20} /> Edit Memory
                            </DialogTitle>
                        </DialogHeader>
                        {editingMemory && (
                            <MemoryForm
                                initialData={editingMemory}
                                onSubmit={handleUpdate}
                                onCancel={() => setEditingMemory(null)}
                            />
                        )}
                    </DialogContent>
                </Dialog>

                <FloatingDecorations />
            </div>
        </MainLayout>
    );
};

export default Memories;
