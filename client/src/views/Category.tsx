import { Folder, Heart, Calendar, ArrowLeft, Loader2 } from "lucide-react";
import { SparkleEffect } from "../components/garden/SparkleEffect";
import { Link, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";
import { galleryApi, GalleryImage } from "@/lib/api";
import { format } from "date-fns";

const Category = () => {
    const { categoryId } = useParams<{ categoryId: string }>();
    // Default to "Random" if no category is provided or if it doesn't match known ones (though we filter by string now)
    const categoryName = categoryId ? categoryId.charAt(0).toUpperCase() + categoryId.slice(1).replace(/-/g, ' ') : "Random";

    const [photos, setPhotos] = useState<GalleryImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const [previewCaption, setPreviewCaption] = useState<string>("");
    const playSound = useSound();

    useEffect(() => {
        const fetchPhotos = async () => {
            setLoading(true);
            try {
                // Map URL param to expected Category names (e.g. "first-date" -> "First Date")
                // If "random" -> "Random", etc.
                const mappedCategory = categoryName;
                // We might need a better mapping if URL slugs don't perfectly match stored "Category" field
                // For now, let's rely on the simple transformation or fetch all and filter if needed.
                // But the API supports filtering by exact string. 
                // Let's try to match the Capitalized casing we use in AdminGallery.

                let searchCategory = mappedCategory;
                if (categoryId === "first-date") searchCategory = "First Date";
                else if (categoryId === "anniversary") searchCategory = "Anniversary";
                else if (categoryId === "travel") searchCategory = "Travel";
                else if (categoryId === "random") searchCategory = "Random";
                else if (categoryId === "letters") searchCategory = "Letters";

                const data = await galleryApi.list(searchCategory);
                setPhotos(data);
            } catch (err) {
                console.error("Failed to load photos", err);
            } finally {
                setLoading(false);
            }
        };

        fetchPhotos();
    }, [categoryId, categoryName]);

    const colorClasses: Record<string, string> = {
        "First Date": "bg-pink-100 border-pink-300 text-pink-600",
        "Anniversary": "bg-purple-100 border-purple-300 text-purple-600",
        "Travel": "bg-blue-100 border-blue-300 text-blue-600",
        "Random": "bg-green-100 border-green-300 text-green-600",
        "Letters": "bg-red-100 border-red-300 text-red-600",
    };

    // Fallback color if category not in map
    const themeClass = colorClasses[categoryName] || "bg-pink-100 border-pink-300 text-pink-600";
    const emojiMap: Record<string, string> = {
        "First Date": "🌸",
        "Anniversary": "💍",
        "Travel": "✈️",
        "Random": "🎲",
        "Letters": "💌"
    };
    const emoji = emojiMap[categoryName] || "✨";

    return (
        <MainLayout>
            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg">
                <div className="max-w-4xl mx-auto">
                    {/* Back Button */}
                    <Link to="/" className="inline-flex items-center gap-1 text-gray-500 hover:text-pink-500 mb-4 text-[10px] font-bold transition-colors">
                        <ArrowLeft size={12} /> Back to Home
                    </Link>

                    {/* Category Header */}
                    <div className={`${themeClass.split(' ')[0]} border-2 border-white rounded-xl p-4 mb-6 text-center shadow-lg`}>
                        <Folder className="w-10 h-10 mx-auto text-gray-600 mb-2" />
                        <h2 className="text-sm font-bold text-gray-700">{emoji} {categoryName} Collection {emoji}</h2>
                        <p className="text-[10px] text-gray-600">
                            {loading ? "Loading memories..." : `${photos.length} memories`}
                        </p>
                    </div>

                    {/* Photos Grid */}
                    {loading ? (
                        <div className="flex justify-center py-20">
                            <Loader2 className="w-8 h-8 animate-spin text-pink-400" />
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {photos.map((photo) => (
                                <div
                                    key={photo.id}
                                    className="bg-white p-2 rounded-lg border-2 border-pink-100 hover:border-pink-400 hover:scale-105 transition-all cursor-pointer shadow-sm hover:shadow-md"
                                    onClick={() => { playSound('click'); setPreviewImage(photo.url); setPreviewCaption(photo.alt || ""); }}
                                    onMouseEnter={() => playSound('hover')}
                                >
                                    <div className="aspect-square bg-gray-50 rounded overflow-hidden mb-2 relative">
                                        <img src={photo.url} className="w-full h-full object-cover" alt={photo.alt} />
                                        <div className="absolute inset-0 bg-black/0 hover:bg-black/10 transition-colors" />
                                    </div>
                                    <div className="text-center">
                                        <p className="text-[10px] font-bold text-gray-700 truncate">{photo.alt || "Untitled"}</p>
                                        <p className="text-[8px] text-gray-400 flex items-center justify-center gap-1">
                                            <Calendar size={8} /> {format(new Date(photo.createdAt), "yyyy")}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {!loading && photos.length === 0 && (
                        <div className="text-center py-10 bg-white/50 rounded-lg border-2 border-dashed border-gray-200">
                            <p className="text-gray-400 text-xs">No memories in this category yet...</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Lightbox Modal */}
            {previewImage && (
                <div
                    className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4 cursor-pointer"
                    onClick={() => setPreviewImage(null)}
                >
                    <div className="bg-white p-2 rounded-lg max-w-2xl w-full border-4 border-pink-200 shadow-2xl animate-in zoom-in-95 duration-200" onClick={e => e.stopPropagation()}>
                        <img src={previewImage} className="w-full h-auto max-h-[70vh] object-contain rounded" alt={previewCaption} />
                        <div className="text-center mt-2">
                            <p className="text-pink-500 font-bold text-sm">{previewCaption}</p>
                        </div>
                        <button
                            className="absolute top-4 right-4 text-white hover:text-pink-300"
                            onClick={() => setPreviewImage(null)}
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </MainLayout>
    );
};

export default Category;
