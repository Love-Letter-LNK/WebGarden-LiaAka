import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { useToast } from "@/hooks/use-toast";
import { memoriesApi } from "@/lib/api";
import { Memory } from "@/types/memory";
import { Loader2, Plus, Save, Trash2, Link as LinkIcon, Image as ImageIcon, Mail, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const AdminLetters = () => {
    const { toast } = useToast();
    const [letters, setLetters] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);
    const [selectedLetter, setSelectedLetter] = useState<Memory | null>(null);

    // Form State
    const [title, setTitle] = useState("");
    const [content, setContent] = useState(""); // Stored in 'story'
    const [photo, setPhoto] = useState<File | null>(null);
    const [existingPhoto, setExistingPhoto] = useState("");
    const [link, setLink] = useState(""); // Stored in 'location'
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

    const fetchLetters = async () => {
        try {
            const allMemories = await memoriesApi.list();
            // Filter categories explicitly for 'letters'
            const letterMemories = allMemories.filter(m => m.category === "letters");
            setLetters(letterMemories);
        } catch (error) {
            console.error("Failed to fetch letters", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLetters();
    }, []);

    const resetForm = () => {
        setTitle("");
        setContent("");
        setPhoto(null);
        setExistingPhoto("");
        setLink("");
        setDate(new Date().toISOString().split('T')[0]);
        setIsEditing(false);
        setSelectedLetter(null);
    };

    const handleEdit = (letter: Memory) => {
        setSelectedLetter(letter);
        setTitle(letter.title);
        setContent(letter.story || "");
        setExistingPhoto(letter.images?.[0]?.url || "");
        setLink(letter.location || ""); // Using location for Link
        setDate(letter.date ? new Date(letter.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);
        setIsEditing(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this letter?")) return;
        try {
            await memoriesApi.delete(id);
            toast({ title: "Letter deleted!" });
            fetchLetters();
            if (selectedLetter?.id === id) resetForm();
        } catch (error) {
            toast({ title: "Failed to delete", variant: "destructive" });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // 1. Create JSON Payload
            const payload = {
                title,
                category: "letters",
                date: new Date(date).toISOString(),
                story: content,
                location: link, // Using location for Link
                tags: ["letter", "memory"],
                mood: "romantic" // Default mood
            };

            let letterId = selectedLetter?.id;

            // 2. Create or Update Data
            if (selectedLetter) {
                // UPDATE
                await memoriesApi.update(selectedLetter.id, payload as any);
                toast({ title: "Letter content updated!" });

                // 3. Handle Image Update
                if (photo) {
                    // Delete old images if replacing
                    if (selectedLetter.images && selectedLetter.images.length > 0) {
                        for (const img of selectedLetter.images) {
                            if (img.id) {
                                await memoriesApi.deleteImage(selectedLetter.id, img.id);
                            }
                        }
                    }
                    // Upload new
                    await memoriesApi.uploadImages(selectedLetter.id, [photo]);
                    toast({ title: "Letter photo updated!" });
                }
            } else {
                // CREATE
                const newLetter = await memoriesApi.create(payload as any);
                letterId = newLetter.id;
                toast({ title: "Letter created successfully!" });

                // 3. Handle Image Upload
                if (photo && letterId) {
                    await memoriesApi.uploadImages(letterId, [photo]);
                }
            }

            // 4. Cleanup
            fetchLetters();
            resetForm();
        } catch (error) {
            console.error(error);
            toast({ title: "Failed to save letter", variant: "destructive" });
        }
    };

    return (
        <AdminLayout>
            <div className="flex flex-col md:flex-row gap-6 h-[calc(100vh-100px)]">
                {/* LEFT: LIST */}
                <div className="w-full md:w-1/3 bg-white border-2 border-pink-100 rounded-xl p-4 overflow-y-auto shadow-sm">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="font-bold text-pink-500 flex items-center gap-2">
                            <Mail size={18} /> Letters
                        </h2>
                        <Button size="sm" onClick={resetForm} className="bg-pink-400 hover:bg-pink-500 text-white">
                            <Plus size={16} /> New
                        </Button>
                    </div>

                    {loading ? (
                        <div className="flex justify-center p-4"><Loader2 className="animate-spin text-pink-300" /></div>
                    ) : (
                        <div className="space-y-2">
                            {letters.map((letter) => (
                                <div
                                    key={letter.id}
                                    onClick={() => handleEdit(letter)}
                                    className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${selectedLetter?.id === letter.id
                                        ? "border-pink-400 bg-pink-50"
                                        : "border-transparent hover:bg-gray-50 hover:border-gray-200"
                                        }`}
                                >
                                    <div className="flex gap-3">
                                        <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden flex-shrink-0">
                                            {letter.images?.[0]?.url ? (
                                                <img src={letter.images[0].url} alt="" className="w-full h-full object-cover" />
                                            ) : (
                                                <Mail className="w-full h-full p-3 text-gray-300" />
                                            )}
                                        </div>
                                        <div className="overflow-hidden">
                                            <h4 className="font-bold text-sm truncate">{letter.title}</h4>
                                            <p className="text-[10px] text-gray-500 truncate">{letter.story}</p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {letters.length === 0 && (
                                <p className="text-center text-gray-400 text-xs py-8">No letters yet. Write one!</p>
                            )}
                        </div>
                    )}
                </div>

                {/* RIGHT: EDITOR & PREVIEW */}
                <div className="w-full md:w-2/3 flex flex-col gap-4">
                    {/* FORM */}
                    <div className="bg-white border-2 border-pink-100 rounded-xl p-4 shadow-sm">
                        <h3 className="font-bold text-gray-700 mb-4 border-b pb-2">
                            {selectedLetter ? "Edit Letter" : "Write New Letter"}
                        </h3>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Title</label>
                                    <Input
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        placeholder="Letter Title..."
                                        required
                                        className="bg-gray-50"
                                    />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Optional Link</label>
                                    <div className="flex gap-2">
                                        <Input
                                            value={link}
                                            onChange={(e) => setLink(e.target.value)}
                                            placeholder="https://..."
                                            className="bg-gray-50"
                                        />
                                        <div className="flex items-center justify-center w-10 bg-gray-100 rounded text-gray-400">
                                            <LinkIcon size={16} />
                                        </div>
                                    </div>
                                </div>
                                <div className="col-span-2">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Date</label>
                                    <div className="flex gap-2">
                                        <Input
                                            type="date"
                                            value={date}
                                            onChange={(e) => setDate(e.target.value)}
                                            className="bg-gray-50"
                                        />
                                        <div className="flex items-center justify-center w-10 bg-gray-100 rounded text-gray-400">
                                            <Calendar size={16} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex-1">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Message Content</label>
                                    <Textarea
                                        value={content}
                                        onChange={(e) => setContent(e.target.value)}
                                        placeholder="Write your heart out..."
                                        className="h-32 bg-gray-50 font-serif"
                                    />
                                </div>
                                <div className="w-32">
                                    <label className="text-xs font-bold text-gray-500 mb-1 block">Polaroid Photo</label>
                                    <div className="border-2 border-dashed border-gray-300 rounded-lg h-32 flex flex-col items-center justify-center relative hover:bg-gray-50 cursor-pointer overflow-hidden">
                                        <input
                                            type="file"
                                            className="absolute inset-0 opacity-0 cursor-pointer"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) setPhoto(e.target.files[0]);
                                            }}
                                            accept="image/*"
                                        />
                                        {(photo || existingPhoto) ? (
                                            <img
                                                src={photo ? URL.createObjectURL(photo) : existingPhoto}
                                                alt="Preview"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <>
                                                <ImageIcon className="text-gray-300 mb-1" />
                                                <span className="text-[10px] text-gray-400">Upload</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-2 pt-2 border-t">
                                {selectedLetter && (
                                    <Button type="button" variant="destructive" size="sm" onClick={() => handleDelete(selectedLetter.id)}>
                                        <Trash2 size={16} /> Delete
                                    </Button>
                                )}
                                <Button type="submit" size="sm" className="bg-pink-500 hover:bg-pink-600">
                                    <Save size={16} className="mr-2" /> Save Letter
                                </Button>
                            </div>
                        </form>
                    </div>

                    {/* LIVE PREVIEW (Paper Style) */}
                    <div className="flex-1 bg-gray-100 rounded-xl p-4 overflow-hidden flex items-center justify-center relative">
                        <div className="absolute top-2 left-4 text-xs font-bold text-gray-400 uppercase tracking-widest">Live Preview</div>

                        {/* THE LETTER CARD */}
                        <div
                            className="relative w-full max-w-md aspect-[3/4] shadow-2xl transition-all"
                            style={{
                                backgroundImage: `url('/letter-bg.png')`,
                                backgroundSize: '100% 100%',
                            }}
                        >
                            <div className="absolute inset-0 p-8 flex flex-col">
                                {/* Photo Area (Polaroid style) */}
                                {(photo || existingPhoto) && (
                                    <div className="bg-white p-2 shadow-sm rotate-[-2deg] w-32 h-40 mx-auto mb-4 flex-shrink-0 absolute top-12 right-8 transition-transform hover:scale-105 hover:rotate-0 z-10">
                                        <div className="w-full h-28 bg-gray-200 overflow-hidden">
                                            <img
                                                src={photo ? URL.createObjectURL(photo) : existingPhoto}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="text-center mt-2 font-handwriting text-[10px] text-gray-500">
                                            {date ? new Date(date).toLocaleDateString() : new Date().toLocaleDateString()}
                                        </div>
                                    </div>
                                )}

                                {/* Text Content */}
                                <div className="mt-8 relative z-0">
                                    <h2 className="font-serif text-2xl text-red-900 mb-4 border-b-2 border-red-900/10 pb-2 inline-block">
                                        {title || "Untitled Letter"}
                                    </h2>
                                    <p className="font-serif text-sm text-gray-800 leading-relaxed whitespace-pre-wrap">
                                        {content || "Your letter content will appear here..."}
                                    </p>

                                    {link && (
                                        <div className="mt-6">
                                            <span className="text-[10px] bg-red-100 text-red-600 px-2 py-1 rounded inline-flex items-center gap-1 border border-red-200">
                                                <LinkIcon size={10} /> Has Link attachment
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div >
        </AdminLayout >
    );
};

export default AdminLetters;
