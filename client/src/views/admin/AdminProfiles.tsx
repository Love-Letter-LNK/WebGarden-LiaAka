import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { profilesApi, Profile, UpdateProfileDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Loader2, Pencil, User, Save, Plus, X, Heart, Star, Sparkles, Palette } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const AdminProfiles: React.FC = () => {
    const playSound = useSound();
    const [profiles, setProfiles] = useState<Profile[]>([]);
    const [loading, setLoading] = useState(true);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
    const [formLoading, setFormLoading] = useState(false);
    const [formError, setFormError] = useState<string | null>(null);

    const [formData, setFormData] = useState<UpdateProfileDTO>({
        name: "", nickname: "", bio: "", birthDate: "", hobbies: "", likes: "", loveLanguage: "", funFacts: [], avatar: "", color: "#ff69b4"
    });
    const [newFunFact, setNewFunFact] = useState("");

    const fetchProfiles = async () => {
        setLoading(true);
        try {
            const data = await profilesApi.list();
            setProfiles(data);
        } catch (err) {
            console.error('Failed to load profiles:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchProfiles(); }, []);

    const openEditForm = (profile: Profile) => {
        playSound('click');
        setEditingProfile(profile);
        setFormData({
            name: profile.name, nickname: profile.nickname || "", bio: profile.bio || "",
            birthDate: profile.birthDate || "", hobbies: profile.hobbies || "", likes: profile.likes || "",
            loveLanguage: profile.loveLanguage || "", funFacts: profile.funFacts || [], avatar: profile.avatar || "", color: profile.color
        });
        setNewFunFact("");
        setFormError(null);
        setIsFormOpen(true);
    };

    const handleAddFunFact = () => {
        if (!newFunFact.trim()) return;
        playSound('click');
        setFormData({ ...formData, funFacts: [...(formData.funFacts || []), newFunFact.trim()] });
        setNewFunFact("");
    };

    const handleRemoveFunFact = (index: number) => {
        playSound('click');
        setFormData({ ...formData, funFacts: formData.funFacts?.filter((_, i) => i !== index) });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!editingProfile) return;
        setFormLoading(true);
        setFormError(null);
        try {
            await profilesApi.update(editingProfile.slug, formData);
            playSound('success');
            setIsFormOpen(false);
            fetchProfiles();
        } catch (err: any) {
            setFormError(err.message || "Failed to save profile");
            playSound('error');
        } finally {
            setFormLoading(false);
        }
    };

    return (
        <AdminLayout title="Manage Profiles">
            {/* Header Stats / Info */}
            <div className="mb-6 bg-gradient-to-r from-pink-100 to-purple-100 border-2 border-dashed border-pink-300 rounded-xl p-4 flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-3">
                    <div className="bg-white p-2 rounded-full border-2 border-pink-200">
                        <User className="w-5 h-5 text-pink-400" />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-700 text-sm">Profile Customization</h3>
                        <p className="text-xs text-gray-500">Update avatars, bios, and fun facts!</p>
                    </div>
                </div>
                <div className="bg-white px-3 py-1 rounded-full border border-pink-200 text-xs font-bold text-pink-400">
                    {profiles.length} Profiles
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center py-12">
                    <div className="flex flex-col items-center gap-2">
                        <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                        <p className="text-xs text-pink-300 font-bold animate-pulse">Loading Cute Profiles...</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {profiles.map((profile) => (
                        <div key={profile.id} className="group bg-white border-2 border-gray-100 hover:border-pink-300 transition-all duration-300 rounded-2xl overflow-hidden shadow-sm hover:shadow-md">
                            {/* Colorful Header */}
                            <div className="p-6 text-center relative overflow-hidden" style={{ background: `linear-gradient(to bottom, ${profile.color}15, white)` }}>
                                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
                                </div>

                                <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 shadow-sm mb-3 transition-transform group-hover:scale-105" style={{ borderColor: profile.color }}>
                                    <img src={profile.avatar || '/placeholder.png'} alt={profile.name} className="w-full h-full object-cover" />
                                </div>
                                <h3 className="font-bold text-lg flex items-center justify-center gap-2" style={{ color: profile.color }}>
                                    {profile.nickname || profile.name}
                                    {profile.name === 'Aka' ? '💙' : '💗'}
                                </h3>
                                <p className="text-xs font-bold uppercase tracking-wider text-gray-400">{profile.name}</p>
                            </div>

                            {/* Info Grid */}
                            <div className="px-6 pb-6 space-y-4">
                                {profile.bio && (
                                    <div className="text-xs text-gray-600 text-center italic bg-gray-50 p-2 rounded-xl border border-gray-100">
                                        "{profile.bio}"
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <div className="flex items-start gap-2 text-xs">
                                        <Heart className="w-3.5 h-3.5 text-pink-400 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-gray-700">Love Language:</span>
                                            <p className="text-gray-600">{profile.loveLanguage || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs">
                                        <Star className="w-3.5 h-3.5 text-yellow-400 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-gray-700">Hobbies:</span>
                                            <p className="text-gray-600">{profile.hobbies || 'Not set'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2 text-xs">
                                        <Palette className="w-3.5 h-3.5 text-purple-400 mt-0.5" />
                                        <div>
                                            <span className="font-bold text-gray-700">Likes:</span>
                                            <p className="text-gray-600">{profile.likes || 'Not set'}</p>
                                        </div>
                                    </div>
                                </div>

                                {profile.funFacts.length > 0 && (
                                    <div className="mt-4 pt-4 border-t border-dashed border-gray-200">
                                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wider">Fun Facts</p>
                                        <div className="flex flex-wrap gap-1.5">
                                            {profile.funFacts.slice(0, 3).map((fact, i) => (
                                                <span key={i} className="text-[10px] bg-purple-50 text-purple-600 px-2 py-1 rounded-full border border-purple-100">
                                                    {fact.length > 30 ? fact.substring(0, 30) + '...' : fact}
                                                </span>
                                            ))}
                                            {profile.funFacts.length > 3 && (
                                                <span className="text-[10px] bg-gray-50 text-gray-400 px-2 py-1 rounded-full border border-gray-100">
                                                    +{profile.funFacts.length - 3} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                <Button
                                    onClick={() => openEditForm(profile)}
                                    className="w-full mt-4 rounded-xl shadow-sm hover:shadow transition-all active:scale-95 group-hover:bg-opacity-90"
                                    style={{ backgroundColor: profile.color }}
                                >
                                    <Pencil className="w-4 h-4 mr-2" /> Edit Details
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Dialog */}
            <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto bg-[#fffdf5] border-4 border-dashed border-purple-200 shadow-[8px_8px_0_0_rgba(216,191,216,0.5)] rounded-3xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold text-gray-800 flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ backgroundColor: editingProfile?.color + '20' }}>
                                <User className="w-5 h-5" style={{ color: editingProfile?.color }} />
                            </div>
                            Edit {editingProfile?.nickname}'s Profile
                        </DialogTitle>
                    </DialogHeader>

                    <form onSubmit={handleSubmit} className="space-y-6 mt-4">
                        {formError && (
                            <div className="p-3 bg-red-50 border-l-4 border-red-400 rounded-r text-red-600 text-xs font-bold animate-pulse">
                                ⚠️ {formError}
                            </div>
                        )}

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Left Column: Basic Info */}
                            <div className="space-y-4">
                                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm space-y-3">
                                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider border-b pb-2">Basic Info</h4>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Name</label>
                                        <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="bg-gray-50 border-gray-200 focus:border-purple-300" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Nickname</label>
                                        <Input value={formData.nickname} onChange={(e) => setFormData({ ...formData, nickname: e.target.value })} className="bg-gray-50 border-gray-200 focus:border-purple-300" />
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Theme Color</label>
                                        <div className="flex gap-2">
                                            <Input type="color" value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="w-10 h-10 p-1 cursor-pointer rounded-lg" />
                                            <Input value={formData.color} onChange={(e) => setFormData({ ...formData, color: e.target.value })} className="flex-1 bg-gray-50 font-mono text-xs" />
                                        </div>
                                    </div>

                                    <div className="space-y-1">
                                        <label className="text-xs font-bold text-gray-600">Birth Date</label>
                                        <Input value={formData.birthDate} onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })} placeholder="e.g. 1999-01-01" className="bg-gray-50 border-gray-200 focus:border-purple-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">Avatar URL</label>
                                    <div className="flex gap-2 items-center">
                                        {formData.avatar ? (
                                            <img src={formData.avatar} alt="Preview" className="w-10 h-10 rounded-full border-2 border-gray-200 object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border-2 border-gray-200"><User className="w-5 h-5 text-gray-300" /></div>
                                        )}
                                        <Input value={formData.avatar} onChange={(e) => setFormData({ ...formData, avatar: e.target.value })} placeholder="https://..." className="flex-1 bg-white border-gray-200 focus:border-purple-300 font-mono text-xs" />
                                    </div>
                                </div>
                            </div>

                            {/* Right Column: Details */}
                            <div className="space-y-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">Bio</label>
                                    <Textarea value={formData.bio} onChange={(e) => setFormData({ ...formData, bio: e.target.value })} rows={3} className="bg-white border-dashed border-2 border-purple-200 rounded-xl focus:border-purple-400 resize-none text-sm" placeholder="Tell us about yourself..." />
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">Love Language</label>
                                    <div className="relative">
                                        <Heart className="absolute left-3 top-2.5 w-4 h-4 text-pink-300" />
                                        <Input value={formData.loveLanguage} onChange={(e) => setFormData({ ...formData, loveLanguage: e.target.value })} className="pl-9 bg-white border-gray-200 focus:border-purple-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">Hobbies</label>
                                    <div className="relative">
                                        <Star className="absolute left-3 top-2.5 w-4 h-4 text-yellow-400" />
                                        <Input value={formData.hobbies} onChange={(e) => setFormData({ ...formData, hobbies: e.target.value })} className="pl-9 bg-white border-gray-200 focus:border-purple-300" />
                                    </div>
                                </div>

                                <div className="space-y-1">
                                    <label className="text-xs font-bold text-gray-600">Likes</label>
                                    <div className="relative">
                                        <Palette className="absolute left-3 top-2.5 w-4 h-4 text-purple-300" />
                                        <Input value={formData.likes} onChange={(e) => setFormData({ ...formData, likes: e.target.value })} className="pl-9 bg-white border-gray-200 focus:border-purple-300" />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Fun Facts Section */}
                        <div className="space-y-2 pt-2 border-t border-dashed border-purple-200">
                            <label className="text-xs font-bold text-purple-500 uppercase tracking-wider">✨ Fun Facts</label>
                            <div className="bg-purple-50 p-4 rounded-xl border border-purple-100 min-h-[100px] space-y-3">
                                <div className="flex flex-wrap gap-2">
                                    {formData.funFacts?.map((fact, i) => (
                                        <div key={i} className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-purple-100 shadow-sm animate-in fade-in zoom-in duration-200">
                                            <span className="text-xs font-medium text-purple-700">{fact}</span>
                                            <button type="button" onClick={() => handleRemoveFunFact(i)} className="text-purple-300 hover:text-red-400 transition-colors"><X size={12} /></button>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <Input
                                        value={newFunFact}
                                        onChange={(e) => setNewFunFact(e.target.value)}
                                        onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddFunFact())}
                                        placeholder="Type a fun fact and press Enter..."
                                        className="flex-1 h-9 text-xs bg-white border-purple-200 focus:border-purple-400"
                                    />
                                    <Button type="button" size="sm" onClick={handleAddFunFact} className="bg-purple-400 hover:bg-purple-500 text-white rounded-lg h-9 w-9 p-0"><Plus size={16} /></Button>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                            <Button type="button" variant="ghost" onClick={() => setIsFormOpen(false)} disabled={formLoading} className="rounded-xl hover:bg-gray-100 text-gray-500">Cancel</Button>
                            <Button type="submit" disabled={formLoading} className="bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white rounded-xl shadow-lg border-b-4 border-purple-600 active:border-b-0 active:translate-y-1 transition-all">
                                {formLoading ? <><Loader2 className="w-4 h-4 animate-spin mr-2" />Saving...</> : <><Save className="w-4 h-4 mr-2" />Save Changes</>}
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminProfiles;
