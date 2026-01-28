import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { travelApi, TravelLog, TravelImage } from "@/lib/api";
import { Loader2, Plus, Save, Trash2, MapPin, Calendar, Image as ImageIcon, Globe, Plane, X, Check, CircleDashed, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminTravel = () => {
    const { toast } = useToast();
    const [travels, setTravels] = useState<TravelLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedTravel, setSelectedTravel] = useState<TravelLog | null>(null);
    const [saving, setSaving] = useState(false);

    // Form State
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [story, setStory] = useState("");
    const [date, setDate] = useState("");
    const [isVisited, setIsVisited] = useState(true);
    const [lat, setLat] = useState("");
    const [lng, setLng] = useState("");

    // Image State
    const [newPhotos, setNewPhotos] = useState<File[]>([]);
    const [existingImages, setExistingImages] = useState<TravelImage[]>([]);

    const fetchTravels = async () => {
        try {
            const data = await travelApi.list();
            setTravels(data);
        } catch (error) {
            console.error("Failed to fetch travel logs", error);
            toast({ title: "Failed to load travels", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTravels();
    }, []);

    const resetForm = () => {
        setName("");
        setDescription("");
        setStory("");
        setDate("");
        setIsVisited(true);
        setLat("");
        setLng("");
        setNewPhotos([]);
        setExistingImages([]);
        setSelectedTravel(null);
    };

    const handleEdit = (travel: TravelLog) => {
        setSelectedTravel(travel);
        setName(travel.name);
        setDescription(travel.description || "");
        setStory(travel.story || "");
        setDate(travel.date || "");
        setIsVisited(travel.isVisited);
        setLat(travel.lat?.toString() || "");
        setLng(travel.lng?.toString() || "");
        setExistingImages(travel.images || []);
        setNewPhotos([]);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this travel location?")) return;
        try {
            await travelApi.delete(id);
            toast({ title: "Deleted successfully" });
            fetchTravels();
            if (selectedTravel?.id === id) resetForm();
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const files = Array.from(e.target.files);
            const total = existingImages.length + newPhotos.length + files.length;
            if (total > 5) {
                toast({ title: "Maximum 5 photos allowed", variant: "destructive" });
                return;
            }
            setNewPhotos([...newPhotos, ...files]);
        }
    };

    const removeNewPhoto = (index: number) => {
        setNewPhotos(newPhotos.filter((_, i) => i !== index));
    };

    const removeExistingImage = async (imageId: string) => {
        if (!selectedTravel) return;
        if (!confirm("Remove this photo?")) return;
        try {
            await travelApi.deleteImage(selectedTravel.id, imageId);
            setExistingImages(existingImages.filter(img => img.id !== imageId));
            toast({ title: "Photo removed" });
            fetchTravels();
        } catch (error) {
            toast({ title: "Failed to remove photo", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) {
            toast({ title: "Name is required", variant: "destructive" });
            return;
        }
        setSaving(true);
        try {
            const payload = {
                name: name.trim(),
                description: description.trim() || undefined,
                story: story.trim() || undefined,
                date: date || undefined,
                isVisited,
                lat: lat ? parseFloat(lat) : undefined,
                lng: lng ? parseFloat(lng) : undefined
            };

            let travelId = selectedTravel?.id;

            if (selectedTravel) {
                await travelApi.update(selectedTravel.id, payload);
                toast({ title: "Travel updated! ✈️" });
            } else {
                const newTravel = await travelApi.create(payload as any);
                travelId = newTravel.id;
                toast({ title: "Travel created! 🌍" });
            }

            // Upload new photos
            if (newPhotos.length > 0 && travelId) {
                await travelApi.uploadImages(travelId, newPhotos);
                toast({ title: "Photos uploaded!" });
            }

            fetchTravels();
            resetForm();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save", variant: "destructive" });
        } finally {
            setSaving(false);
        }
    };

    const visited = travels.filter(t => t.isVisited);
    const bucketList = travels.filter(t => !t.isVisited);

    return (
        <AdminLayout>
            <div className="flex flex-col lg:flex-row gap-4 h-[calc(100vh-80px)]">
                {/* LEFT: LIST */}
                <div className="w-full lg:w-72 bg-white/90 backdrop-blur border border-gray-200 rounded-lg p-3 overflow-y-auto shadow-sm flex flex-col">
                    <div className="flex items-center justify-between mb-3 pb-2 border-b border-gray-100">
                        <h2 className="text-xs font-bold text-gray-600 flex items-center gap-1.5 uppercase tracking-wide">
                            <Globe className="text-green-500" size={14} /> Travel Log
                        </h2>
                        <span className="text-[9px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                            {travels.length}
                        </span>
                    </div>

                    <Button size="sm" onClick={resetForm} className="h-7 text-[10px] bg-green-500 hover:bg-green-600 text-white w-full mb-3">
                        <Plus size={12} className="mr-1" /> New Place
                    </Button>

                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-green-400" size={20} /></div>
                    ) : (
                        <div className="space-y-3 flex-1 overflow-y-auto">
                            {/* VISITED Section */}
                            <div>
                                <h3 className="text-[9px] font-bold text-green-600 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <Check size={10} /> Visited ({visited.length})
                                </h3>
                                {visited.length === 0 && <p className="text-[9px] text-gray-400 italic pl-2">No places yet...</p>}
                                <div className="space-y-1">
                                    {visited.map((travel) => (
                                        <TravelCard key={travel.id} travel={travel} selected={selectedTravel?.id === travel.id} onEdit={handleEdit} />
                                    ))}
                                </div>
                            </div>

                            {/* BUCKET LIST Section */}
                            <div>
                                <h3 className="text-[9px] font-bold text-blue-500 uppercase tracking-wider mb-1.5 flex items-center gap-1">
                                    <CircleDashed size={10} /> Bucket List ({bucketList.length})
                                </h3>
                                {bucketList.length === 0 && <p className="text-[9px] text-gray-400 italic pl-2">No dreams yet...</p>}
                                <div className="space-y-1">
                                    {bucketList.map((travel) => (
                                        <TravelCard key={travel.id} travel={travel} selected={selectedTravel?.id === travel.id} onEdit={handleEdit} />
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* RIGHT: EDITOR */}
                <div className="flex-1 bg-white/95 backdrop-blur border border-gray-200 rounded-lg p-4 shadow-sm overflow-y-auto">
                    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-4">

                        {/* Header */}
                        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                            <h3 className="text-sm font-bold text-gray-700">
                                {selectedTravel ? "Edit Place" : "Add New Place"}
                            </h3>

                            {/* Status Toggle */}
                            <div className="flex items-center bg-gray-100 p-0.5 rounded-full cursor-pointer text-[10px]" onClick={() => setIsVisited(!isVisited)}>
                                <div className={`px-3 py-1 rounded-full font-semibold transition-all ${isVisited ? 'bg-green-500 text-white shadow-sm' : 'text-gray-400'}`}>
                                    ✓ Visited
                                </div>
                                <div className={`px-3 py-1 rounded-full font-semibold transition-all ${!isVisited ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-400'}`}>
                                    ✈️ Bucket
                                </div>
                            </div>
                        </div>

                        {/* Name & Description */}
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Place Name *</label>
                                <Input
                                    value={name} onChange={e => setName(e.target.value)}
                                    placeholder="e.g. Bali, Japan"
                                    className="h-8 text-xs bg-gray-50 border-gray-200"
                                    required
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Short Description</label>
                                <Input
                                    value={description} onChange={e => setDescription(e.target.value)}
                                    placeholder="e.g. Honeymoon goals!"
                                    className="h-8 text-xs bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>

                        {/* Date & Coordinates */}
                        <div className="grid grid-cols-3 gap-3">
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Date</label>
                                <div className="relative">
                                    <Calendar className="absolute left-2 top-2 text-gray-400" size={12} />
                                    <Input
                                        type="date"
                                        value={date} onChange={e => setDate(e.target.value)}
                                        className="pl-7 h-8 text-xs bg-gray-50 border-gray-200"
                                    />
                                </div>
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Latitude</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={lat} onChange={e => setLat(e.target.value)}
                                    placeholder="-6.2088"
                                    className="h-8 text-xs bg-gray-50 border-gray-200"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase">Longitude</label>
                                <Input
                                    type="number"
                                    step="any"
                                    value={lng} onChange={e => setLng(e.target.value)}
                                    placeholder="106.8456"
                                    className="h-8 text-xs bg-gray-50 border-gray-200"
                                />
                            </div>
                        </div>

                        {/* Story */}
                        <div className="space-y-1">
                            <label className="text-[10px] font-semibold text-gray-500 uppercase">Story / Memory</label>
                            <Textarea
                                value={story} onChange={e => setStory(e.target.value)}
                                placeholder="Write about your experience..."
                                className="min-h-[100px] text-xs bg-gray-50 border-gray-200 resize-none"
                            />
                        </div>

                        {/* Photos */}
                        <div className="space-y-1.5">
                            <div className="flex items-center justify-between">
                                <label className="text-[10px] font-semibold text-gray-500 uppercase flex items-center gap-1">
                                    <ImageIcon size={10} /> Photos
                                </label>
                                <span className={`text-[10px] font-bold ${existingImages.length + newPhotos.length >= 5 ? 'text-red-400' : 'text-gray-400'}`}>
                                    {existingImages.length + newPhotos.length}/5
                                </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                                {/* Existing Images */}
                                {existingImages.map((img) => (
                                    <div key={img.id} className="relative w-14 h-14 rounded-md overflow-hidden group border border-gray-200">
                                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => removeExistingImage(img.id)}
                                            className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white"
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </div>
                                ))}

                                {/* New Photos Preview */}
                                {newPhotos.map((file, i) => (
                                    <div key={i} className="relative w-14 h-14 rounded-md overflow-hidden group border-2 border-blue-200">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover opacity-80" alt="" />
                                        <button
                                            type="button"
                                            onClick={() => removeNewPhoto(i)}
                                            className="absolute top-0.5 right-0.5 bg-red-500 text-white rounded-full p-0.5"
                                        >
                                            <X size={10} />
                                        </button>
                                    </div>
                                ))}

                                {/* Upload Button */}
                                {(existingImages.length + newPhotos.length < 5) && (
                                    <label className="w-14 h-14 border border-dashed border-gray-300 hover:border-green-400 hover:bg-green-50 rounded-md flex flex-col items-center justify-center cursor-pointer transition-colors text-gray-300 hover:text-green-400">
                                        <Upload size={16} />
                                        <span className="text-[8px] font-semibold mt-0.5">Add</span>
                                        <input type="file" multiple accept="image/*" className="hidden" onChange={handlePhotoChange} />
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                            {selectedTravel ? (
                                <Button type="button" variant="ghost" size="sm" className="text-red-400 hover:text-red-500 hover:bg-red-50 h-8 text-xs" onClick={() => handleDelete(selectedTravel.id)}>
                                    <Trash2 size={12} className="mr-1" /> Delete
                                </Button>
                            ) : <div />}
                            <Button type="submit" disabled={saving} size="sm" className="bg-green-500 hover:bg-green-600 text-white h-8 text-xs px-4">
                                {saving ? <Loader2 className="animate-spin mr-1" size={12} /> : <Save size={12} className="mr-1" />}
                                {selectedTravel ? "Update" : "Save"}
                            </Button>
                        </div>

                    </form>
                </div>
            </div>
        </AdminLayout>
    );
};

// Travel Card Component
interface TravelCardProps {
    travel: TravelLog;
    selected: boolean;
    onEdit: (travel: TravelLog) => void;
}

const TravelCard = ({ travel, selected, onEdit }: TravelCardProps) => (
    <div
        onClick={() => onEdit(travel)}
        className={`p-2 rounded-md border cursor-pointer transition-all group ${selected
            ? "border-green-400 bg-green-50"
            : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
            }`}
    >
        <div className="flex gap-2 items-center">
            <div className="w-8 h-8 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                {travel.images?.[0]?.url ? (
                    <img src={travel.images[0].url} alt="" className="w-full h-full object-cover" />
                ) : (
                    <Plane className="w-full h-full p-1.5 text-gray-300" />
                )}
            </div>
            <div className="min-w-0 flex-1">
                <h4 className="font-semibold text-gray-700 text-[11px] truncate">{travel.name}</h4>
                {travel.description && <p className="text-[9px] text-gray-400 truncate">{travel.description}</p>}
                <div className="flex items-center gap-2 mt-0.5">
                    {travel.date && <span className="text-[8px] text-gray-300">{new Date(travel.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: '2-digit' })}</span>}
                    {travel.images?.length > 0 && <span className="text-[8px] text-green-400">📷 {travel.images.length}</span>}
                </div>
            </div>
        </div>
    </div>
);

export default AdminTravel;
