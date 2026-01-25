import React, { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { galleryApi, GalleryImage, UpdateGalleryDTO } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Loader2, Upload, Image as ImageIcon, X, Camera, Filter, Pencil, Save } from "lucide-react";
import { useSound } from "@/hooks/useSound";
import { cn } from "@/lib/utils";

const CATEGORIES = ["First Date", "Anniversary", "Travel", "Random", "Letters"];

const AdminGallery: React.FC = () => {
    const playSound = useSound();
    const [images, setImages] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterCategory, setFilterCategory] = useState<string>("all");

    // Upload State
    const [isUploadOpen, setIsUploadOpen] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [uploadCategory, setUploadCategory] = useState("Random"); // Default category
    const [uploadLoading, setUploadLoading] = useState(false);

    // Edit State
    const [isEditOpen, setIsEditOpen] = useState(false);
    const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
    const [editData, setEditData] = useState<UpdateGalleryDTO>({});
    const [editLoading, setEditLoading] = useState(false);

    // Delete State
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [deletingImage, setDeletingImage] = useState<GalleryImage | null>(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    const fetchGallery = async () => {
        setLoading(true);
        try {
            // Fetch all images then filter on client side for snappier feel, 
            // or fetch by category if we wanted server-side filtering. 
            // For now, fetching all is fine for small collections.
            const data = await galleryApi.list();
            setImages(data);
        } catch (err) {
            console.error('Failed to load gallery:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchGallery(); }, []);

    const filteredImages = filterCategory === "all"
        ? images
        : images.filter(img => img.category === filterCategory);

    // --- HANDLERS ---

    const handleUpload = async () => {
        if (selectedFiles.length === 0) return;
        setUploadLoading(true);
        try {
            await galleryApi.upload(selectedFiles, uploadCategory);
            playSound('success');
            setIsUploadOpen(false);
            setSelectedFiles([]);
            setUploadCategory("Random");
            fetchGallery();
        } catch (err) {
            console.error('Upload failed:', err);
        } finally {
            setUploadLoading(false);
        }
    };

    const handleEdit = async () => {
        if (!editingImage) return;
        setEditLoading(true);
        try {
            await galleryApi.update(editingImage.id, editData);
            playSound('success');
            setIsEditOpen(false);
            setEditingImage(null);
            fetchGallery();
        } catch (err) {
            console.error('Update failed:', err);
        } finally {
            setEditLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!deletingImage) return;
        setDeleteLoading(true);
        try {
            await galleryApi.delete(deletingImage.id);
            playSound('success');
            setIsDeleteOpen(false);
            setDeletingImage(null);
            fetchGallery();
        } catch (err) {
            console.error('Delete failed:', err);
        } finally {
            setDeleteLoading(false);
        }
    };

    const openUpload = () => {
        playSound('click');
        setSelectedFiles([]);
        setUploadCategory("Random");
        setIsUploadOpen(true);
    };

    const openEdit = (image: GalleryImage) => {
        playSound('click');
        setEditingImage(image);
        setEditData({ category: image.category, alt: image.alt });
        setIsEditOpen(true);
    };

    return (
        <AdminLayout title="Manage Gallery">
            {/* Header Actions */}
            <div className="bg-white border-2 border-pink-200 rounded-xl p-4 mb-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm">

                {/* Stats & Filter */}
                <div className="flex items-center gap-4 w-full md:w-auto">
                    <div className="bg-pink-50 text-pink-600 px-3 py-1 rounded-lg text-xs font-bold border border-pink-100">
                        {filteredImages.length} PHOTOS
                    </div>

                    <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-gray-400" />
                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                            <SelectTrigger className="w-[180px] h-9 text-xs border-pink-200 focus:ring-pink-200">
                                <SelectValue placeholder="Filter by Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {CATEGORIES.map(cat => (
                                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Upload Button */}
                <Button onClick={openUpload} className="w-full md:w-auto bg-gradient-to-r from-pink-400 to-purple-400 hover:from-pink-500 hover:to-purple-500 text-white font-bold shadow-md transition-transform active:scale-95">
                    <Plus className="w-4 h-4 mr-2" /> Upload New Photos
                </Button>
            </div>

            {/* Gallery Grid */}
            {loading ? (
                <div className="flex justify-center py-20">
                    <Loader2 className="w-10 h-10 animate-spin text-pink-400" />
                </div>
            ) : filteredImages.length === 0 ? (
                <div className="text-center py-20 bg-white border-2 border-dashed border-pink-200 rounded-xl">
                    <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ImageIcon className="w-8 h-8 text-pink-300" />
                    </div>
                    <h3 className="text-gray-600 font-bold mb-1">No photos found</h3>
                    <p className="text-gray-400 text-xs mb-6">Try uploading some memories!</p>
                    <Button onClick={openUpload} variant="outline" className="border-pink-300 text-pink-500 hover:bg-pink-50">
                        Upload Now
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {filteredImages.map((img) => (
                        <div key={img.id} className="group relative bg-white border-2 border-pink-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:border-pink-300 transition-all">
                            {/* Image */}
                            <div className="aspect-square bg-gray-50 relative overflow-hidden">
                                <img
                                    src={img.url}
                                    alt={img.alt || ''}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                />

                                {/* Overlay Actions */}
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button size="icon" variant="secondary" className="h-8 w-8 rounded-full bg-white/90 hover:bg-white text-gray-700" onClick={() => openEdit(img)}>
                                        <Pencil className="w-3.5 h-3.5" />
                                    </Button>
                                    <Button size="icon" variant="destructive" className="h-8 w-8 rounded-full shadow-sm" onClick={() => { setDeletingImage(img); setIsDeleteOpen(true); playSound('click'); }}>
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </Button>
                                </div>

                                {/* Category Badge */}
                                <span className={cn(
                                    "absolute top-2 left-2 text-[9px] px-2 py-0.5 rounded-full font-bold shadow-sm border",
                                    "bg-white/90 text-gray-600 border-gray-100"
                                )}>
                                    {img.category || "Uncategorized"}
                                </span>
                            </div>

                            {/* Caption / Alt */}
                            {img.alt && (
                                <div className="p-2 bg-white text-center border-t border-pink-50">
                                    <p className="text-[10px] text-gray-500 truncate" title={img.alt}>
                                        {img.alt}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* --- DIALOGS --- */}

            {/* Upload Dialog */}
            <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
                <DialogContent className="sm:max-w-md border-4 border-pink-200 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-pink-500 flex items-center gap-2 text-xl">
                            <Upload className="w-5 h-5" /> Upload Photos
                        </DialogTitle>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {/* Category Select */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Select Category</label>
                            <Select value={uploadCategory} onValueChange={setUploadCategory}>
                                <SelectTrigger className="border-2 border-pink-100 rounded-lg focus:ring-pink-200">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    {CATEGORIES.map(cat => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        {/* File Dropzone */}
                        <div
                            className={cn(
                                "border-2 border-dashed rounded-xl p-8 text-center transition-colors relative",
                                selectedFiles.length > 0 ? "border-green-300 bg-green-50" : "border-pink-200 hover:bg-pink-50"
                            )}
                        >
                            <input
                                type="file"
                                multiple
                                accept="image/*"
                                onChange={(e) => e.target.files && setSelectedFiles(Array.from(e.target.files))}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                                id="gallery-upload"
                            />

                            {selectedFiles.length > 0 ? (
                                <div>
                                    <div className="w-10 h-10 bg-green-200 text-green-700 rounded-full flex items-center justify-center mx-auto mb-2">
                                        <div className="font-bold">{selectedFiles.length}</div>
                                    </div>
                                    <p className="text-green-700 font-bold text-sm">Photos selected!</p>
                                    <p className="text-green-600 text-[10px]">Click to change selection</p>
                                </div>
                            ) : (
                                <div>
                                    <Upload className="w-10 h-10 text-pink-300 mx-auto mb-3" />
                                    <p className="text-gray-600 font-bold text-sm">Click to choose photos</p>
                                    <p className="text-gray-400 text-[10px]">Up to 5MB each (JPG, PNG, GIF)</p>
                                </div>
                            )}
                        </div>

                        {/* Preview Grid (Mini) */}
                        {selectedFiles.length > 0 && (
                            <div className="grid grid-cols-5 gap-2 mt-2">
                                {selectedFiles.slice(0, 5).map((file, i) => (
                                    <div key={i} className="aspect-square rounded overflow-hidden border border-gray-200">
                                        <img src={URL.createObjectURL(file)} className="w-full h-full object-cover" alt="preview" />
                                    </div>
                                ))}
                                {selectedFiles.length > 5 && (
                                    <div className="aspect-square rounded bg-gray-100 flex items-center justify-center text-xs text-gray-500 font-bold">
                                        +{selectedFiles.length - 5}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsUploadOpen(false)} className="border-2 rounded-lg">Cancel</Button>
                        <Button
                            onClick={handleUpload}
                            disabled={selectedFiles.length === 0 || uploadLoading}
                            className="bg-pink-500 hover:bg-pink-600 text-white rounded-lg font-bold"
                        >
                            {uploadLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                            Upload {selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Edit Dialog */}
            <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
                <DialogContent className="sm:max-w-md border-4 border-pink-200 bg-white">
                    <DialogHeader>
                        <DialogTitle className="text-pink-500 flex items-center gap-2">
                            <Pencil className="w-4 h-4" /> Edit Photo Details
                        </DialogTitle>
                    </DialogHeader>

                    {editingImage && (
                        <div className="space-y-4 py-2">
                            <div className="flex justify-center mb-4">
                                <div className="h-40 w-40 rounded-lg overflow-hidden border-2 border-gray-100 shadow-sm">
                                    <img src={editingImage.url} alt="preview" className="w-full h-full object-cover" />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Category</label>
                                <Select
                                    value={editData.category || "Random"}
                                    onValueChange={(val) => setEditData({ ...editData, category: val })}
                                >
                                    <SelectTrigger className="border-2 border-pink-100 rounded-lg">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map(cat => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Caption / Alt Text</label>
                                <Input
                                    value={editData.alt || ""}
                                    onChange={(e) => setEditData({ ...editData, alt: e.target.value })}
                                    placeholder="Describe this memory..."
                                    className="border-2 border-pink-100 rounded-lg focus-visible:ring-pink-200"
                                />
                            </div>
                        </div>
                    )}

                    <DialogFooter>
                        <Button variant="outline" onClick={() => setIsEditOpen(false)} className="rounded-lg">Cancel</Button>
                        <Button onClick={handleEdit} disabled={editLoading} className="bg-pink-500 text-white rounded-lg">
                            {editLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
                            Save Changes
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation */}
            <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <DialogContent className="border-4 border-red-100">
                    <DialogHeader>
                        <DialogTitle className="text-red-500">Delete Photo?</DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600 text-sm">
                        Are you sure you want to delete this photo permanently? This action cannot be undone.
                    </p>
                    <div className="flex justify-end gap-3 mt-4">
                        <Button variant="ghost" onClick={() => setIsDeleteOpen(false)}>Cancel</Button>
                        <Button
                            onClick={handleDelete}
                            disabled={deleteLoading}
                            className="bg-red-500 hover:bg-red-600 text-white"
                        >
                            {deleteLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Delete Forever"}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </AdminLayout>
    );
};

export default AdminGallery;
