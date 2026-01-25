import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { journeyApi, JourneyMilestone, CreateJourneyDTO, UpdateJourneyDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Loader2, GripVertical, Save, Heart } from "lucide-react";
import { format } from "date-fns";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const ICONS = ["💕", "👋", "💑", "🎂", "🌸", "✨", "🎉", "💝", "🏠", "🎯", "💍", "🌈"];

const AdminJourney: React.FC = () => {
    const playSound = useSound();
    const [journey, setJourney] = useState<JourneyMilestone[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingJourney, setEditingJourney] = useState<JourneyMilestone | null>(null);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingJourney, setDeletingJourney] = useState<JourneyMilestone | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState<CreateJourneyDTO>({
        title: "", date: new Date().toISOString().split("T")[0], description: "", icon: "💕"
    });

    const fetchJourney = async () => {
        setLoading(true);
        try {
            const data = await journeyApi.list();
            setJourney(data);
        } catch (err) {
            console.error('Failed to load journey:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchJourney(); }, []);

    const openCreateForm = () => {
        playSound('click');
        setEditingJourney(null);
        setFormData({ title: "", date: new Date().toISOString().split("T")[0], description: "", icon: "💕" });
        setFormError(null);
        setIsFormOpen(true);
    };

    const openEditForm = (item: JourneyMilestone) => {
        playSound('click');
        setEditingJourney(item);
        setFormData({
            title: item.title, date: item.date.split("T")[0],
            description: item.description || "", icon: item.icon
        });
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setFormLoading(true);
        setFormError(null);
        try {
            if (editingJourney) {
                await journeyApi.update(editingJourney.id, formData as UpdateJourneyDTO);
            } else {
                await journeyApi.create(formData);
            }
            playSound('success');
            setIsFormOpen(false);
            fetchJourney();
        } catch (err: any) {
            setFormError(err.message || "Failed to save milestone");
        } finally {
            setFormLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingJourney) return;
        setFormLoading(true);
        try {
            await journeyApi.delete(deletingJourney.id);
            playSound('success');
            setIsDeleteOpen(false);
            setDeletingJourney(null);
            fetchJourney();
        } catch (err: any) {
            setFormError(err.message || "Failed to delete milestone");
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <AdminLayout title="Manage Journey">
            {/* Header Actions */}
            <div className="bg-white border-2 border-purple-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

                {/* Stats */}
                <div className="flex items-center gap-2">
                    <div className="bg-purple-50 text-purple-600 px-3 py-1 rounded-lg text-xs font-bold border border-purple-100">
                        {journey.length} MILESTONES
                    </div>
                </div>

                {/* Create Button */}
                <Button onClick={openCreateForm} className="w-full md:w-auto bg-gradient-to-r from-purple-400 to-violet-400 hover:from-purple-500 hover:to-violet-500 text-white font-bold shadow-md transition-transform active:scale-95">
                    <Plus className="w-4 h-4 mr-2" /> Add Milestone
                </Button>
            </div>

            {/* Timeline */}
            {loading ? (
                <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-purple-400" /></div>
            ) : journey.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-purple-200 rounded-xl">
                    <div className="w-16 h-16 bg-purple-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Heart className="w-8 h-8 text-purple-300 fill-current" />
                    </div>
                    <p className="text-gray-500 text-sm mb-4">No milestones yet</p>
                    <Button onClick={openCreateForm} variant="outline" className="border-purple-300 text-purple-500 hover:bg-purple-50">Create First Memory</Button>
                </div>
            ) : (
                <div className="relative pl-8 md:pl-0">
                    {/* Vertical Line */}
                    <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-1 bg-purple-200 md:-ml-0.5 rounded-full" />

                    <div className="space-y-8">
                        {journey.map((item, index) => (
                            <div key={item.id} className={cn(
                                "relative flex items-center md:justify-between group",
                                index % 2 === 0 ? "md:flex-row-reverse" : ""
                            )}>
                                {/* Spacer for alternating Layout */}
                                <div className="hidden md:block w-[45%]" />

                                {/* Icon Node */}
                                <div className="absolute left-0 md:left-1/2 md:-ml-6 w-12 h-12 rounded-full border-4 border-purple-100 bg-white z-10 flex items-center justify-center shadow-md text-xl">
                                    {item.icon}
                                </div>

                                {/* Content Card */}
                                <div className={cn(
                                    "ml-16 md:ml-0 bg-white p-5 rounded-2xl border-2 border-purple-100 shadow-sm w-full md:w-[45%] hover:border-purple-300 hover:shadow-md transition-all relative group-hover:scale-[1.02]",
                                    "after:content-[''] after:absolute after:top-1/2 after:-translate-y-1/2 after:w-4 after:h-4 after:bg-white after:border-t-2 after:border-l-2 after:border-purple-100 after:rotate-45",
                                    index % 2 === 0
                                        ? "md:mr-auto md:text-right after:-right-2 after:border-t-purple-100 after:border-r-purple-100 after:border-l-transparent after:border-b-transparent"
                                        : "md:ml-auto md:text-left after:-left-2 after:border-b-2 after:border-l-2 after:border-t-transparent after:border-r-transparent md:after:border-purple-100" // Fix caret direction
                                )}>
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <span className="text-[10px] bg-purple-50 text-purple-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
                                            {format(new Date(item.date), "MMMM d, yyyy")}
                                        </span>
                                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => openEditForm(item)}>
                                                <Pencil className="w-3 h-3 text-gray-400 hover:text-purple-500" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => { setDeletingJourney(item); setIsDeleteOpen(true); playSound('click'); }}>
                                                <Trash2 className="w-3 h-3 text-gray-400 hover:text-red-500" />
                                            </Button>
                                        </div>
                                    </div>
                                    <h3 className="text-gray-800 font-bold text-lg mb-1">{item.title}</h3>
                                    {item.description && <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Form Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-md bg-white border-4 border-purple-200">
                    <DialogHeader>
                        <DialogTitle className="text-purple-500 flex items-center gap-2">
                            {editingJourney ? <Pencil className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                            {editingJourney ? "Edit Milestone" : "Create Milestone"}
                        </DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pt-2">
                        {formError && <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">{formError}</div>}

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Title</label>
                            <Input
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                placeholder="e.g. First Date"
                                className="border-2 border-purple-100 focus-visible:ring-purple-200"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Date</label>
                            <Input
                                type="date"
                                value={formData.date}
                                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                required
                                className="border-2 border-purple-100 focus-visible:ring-purple-200 font-sans"
                            />
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Icon</label>
                            <div className="flex gap-2 flex-wrap bg-purple-50 p-3 rounded-xl border-2 border-purple-100">
                                {ICONS.map((i) => (
                                    <button
                                        key={i}
                                        type="button"
                                        onClick={() => setFormData({ ...formData, icon: i })}
                                        className={cn(
                                            "w-9 h-9 text-lg rounded-lg transition-all active:scale-90 flex items-center justify-center border-2",
                                            formData.icon === i ? "bg-white border-purple-300 shadow-sm scale-110" : "border-transparent hover:bg-white/50"
                                        )}
                                    >
                                        {i}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="block text-xs font-bold text-gray-500 uppercase">Description</label>
                            <Textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={3}
                                placeholder="What happened?"
                                className="border-2 border-purple-100 font-sans text-sm focus-visible:ring-purple-200"
                            />
                        </div>

                        <DialogFooter className="pt-2">
                            <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)} disabled={formLoading} className="border-2">Cancel</Button>
                            <Button type="submit" disabled={formLoading} className="bg-purple-500 hover:bg-purple-600 text-white font-bold">
                                {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Save Milestone"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Dialog */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="border-4 border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Delete Milestone?</DialogTitle>
                    </DialogHeader>
                    <p className="text-sm text-gray-600">
                        Delete <span className="font-bold">"{deletingJourney?.title}"</span>? This cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 pt-4">
                        <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button onClick={handleDelete} disabled={formLoading} className="bg-red-500 hover:bg-red-600 text-white">
                            {formLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminJourney;
