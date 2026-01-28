import React, { useEffect, useState } from 'react';
import { MainLayout } from '@/components/garden/MainLayout';
import { usePageTitle } from '@/hooks/usePageTitle';
import { travelApi, TravelLog } from '@/lib/api';
import { MapPin, Plane, Calendar, Heart, ExternalLink, ChevronLeft, ChevronRight, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/useSound';

const Travel = () => {
    usePageTitle("Romantic Journey");
    const playSound = useSound();

    const [visited, setVisited] = useState<TravelLog[]>([]);
    const [bucket, setBucket] = useState<TravelLog[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedPlace, setSelectedPlace] = useState<TravelLog | null>(null);
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await travelApi.list();
                data.sort((a, b) => {
                    if (a.date && b.date) return new Date(b.date).getTime() - new Date(a.date).getTime();
                    return 0;
                });
                setVisited(data.filter(t => t.isVisited));
                setBucket(data.filter(t => !t.isVisited));
            } catch (error) {
                console.error("Failed to fetch travel data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const openPlace = (place: TravelLog) => {
        playSound('click');
        setSelectedPlace(place);
        setCurrentImageIndex(0);
    };

    const closePlace = () => {
        setSelectedPlace(null);
        setCurrentImageIndex(0);
    };

    const nextImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPlace?.images?.length) {
            setCurrentImageIndex((prev) => (prev + 1) % selectedPlace.images.length);
        }
    };

    const prevImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (selectedPlace?.images?.length) {
            setCurrentImageIndex((prev) => (prev - 1 + selectedPlace.images.length) % selectedPlace.images.length);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1 }
    };

    return (
        <MainLayout>
            {/* Book Modal */}
            <AnimatePresence>
                {selectedPlace && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={closePlace}
                    >
                        <motion.div
                            initial={{ scale: 0.8, opacity: 0, rotateY: -20 }}
                            animate={{ scale: 1, opacity: 1, rotateY: 0 }}
                            exit={{ scale: 0.8, opacity: 0, rotateY: 20 }}
                            transition={{ type: "spring", bounce: 0.3 }}
                            className="relative max-w-4xl w-full"
                            onClick={e => e.stopPropagation()}
                        >
                            {/* Decorations */}
                            <div className="absolute -top-6 -left-6 w-20 h-20 z-10">
                                <img src="/pixel love.gif" alt="" className="w-full h-full" onError={(e) => e.currentTarget.style.display = 'none'} />
                            </div>
                            <div className="absolute -top-4 -right-4 text-4xl animate-bounce z-10">✨</div>
                            <div className="absolute -bottom-4 -left-4 text-3xl z-10">💖</div>
                            <div className="absolute -bottom-4 -right-4 text-2xl z-10">📖</div>

                            {/* Main Book Container */}
                            <div className="bg-gradient-to-br from-rose-50 via-white to-pink-50 rounded-3xl shadow-2xl border-4 border-pink-200 overflow-hidden">
                                {/* Book Spine */}
                                <div className="absolute left-0 top-0 bottom-0 w-4 bg-gradient-to-r from-pink-400 to-pink-300 rounded-l-3xl"></div>

                                <div className="flex flex-col lg:flex-row min-h-[500px]">
                                    {/* Left Page: Photos */}
                                    <div className="lg:w-1/2 relative bg-gradient-to-br from-pink-100/50 to-white p-4 lg:pl-8">
                                        {selectedPlace.images?.length > 0 ? (
                                            <div className="relative h-full min-h-[300px] lg:min-h-0">
                                                {/* Main Image */}
                                                <div className="relative h-64 lg:h-80 rounded-xl overflow-hidden shadow-xl border-4 border-white">
                                                    <AnimatePresence mode="wait">
                                                        <motion.img
                                                            key={currentImageIndex}
                                                            src={selectedPlace.images[currentImageIndex]?.url}
                                                            alt={selectedPlace.name}
                                                            className="w-full h-full object-cover"
                                                            initial={{ opacity: 0, x: 50 }}
                                                            animate={{ opacity: 1, x: 0 }}
                                                            exit={{ opacity: 0, x: -50 }}
                                                            transition={{ duration: 0.3 }}
                                                        />
                                                    </AnimatePresence>

                                                    {/* Navigation Arrows */}
                                                    {selectedPlace.images.length > 1 && (
                                                        <>
                                                            <button
                                                                onClick={prevImage}
                                                                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                                            >
                                                                <ChevronLeft size={20} className="text-pink-500" />
                                                            </button>
                                                            <button
                                                                onClick={nextImage}
                                                                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg transition-all"
                                                            >
                                                                <ChevronRight size={20} className="text-pink-500" />
                                                            </button>
                                                        </>
                                                    )}

                                                    {/* Image Counter */}
                                                    {selectedPlace.images.length > 1 && (
                                                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-3 py-1 rounded-full">
                                                            {currentImageIndex + 1} / {selectedPlace.images.length}
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Thumbnail Strip */}
                                                {selectedPlace.images.length > 1 && (
                                                    <div className="flex gap-2 mt-3 justify-center">
                                                        {selectedPlace.images.map((img, i) => (
                                                            <button
                                                                key={img.id}
                                                                onClick={(e) => { e.stopPropagation(); setCurrentImageIndex(i); }}
                                                                className={`w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${i === currentImageIndex ? 'border-pink-500 scale-110 shadow-lg' : 'border-white/50 opacity-70 hover:opacity-100'}`}
                                                            >
                                                                <img src={img.url} className="w-full h-full object-cover" alt="" />
                                                            </button>
                                                        ))}
                                                    </div>
                                                )}

                                                {/* Polaroid Date */}
                                                {selectedPlace.date && (
                                                    <div className="mt-4 bg-white p-2 rounded shadow-md transform rotate-[-1deg] inline-block">
                                                        <p className="text-center text-sm font-handwriting text-gray-600">
                                                            📅 {new Date(selectedPlace.date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <div className="h-full flex items-center justify-center bg-gradient-to-br from-pink-100 to-pink-50 rounded-xl">
                                                <div className="text-center p-8">
                                                    <span className="text-7xl">{selectedPlace.isVisited ? '🗺️' : '✈️'}</span>
                                                    <p className="text-pink-400 font-bold mt-4">No Photos Yet</p>
                                                    <p className="text-pink-300 text-sm">But the memories are beautiful!</p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Right Page: Story */}
                                    <div className="lg:w-1/2 p-6 lg:p-8 flex flex-col bg-gradient-to-br from-white to-rose-50/30">
                                        {/* Status Badge */}
                                        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold shadow-sm w-fit ${selectedPlace.isVisited
                                            ? 'bg-green-100 text-green-600 border-2 border-green-200'
                                            : 'bg-blue-100 text-blue-500 border-2 border-blue-200'
                                            }`}>
                                            {selectedPlace.isVisited ? <><MapPin size={14} /> Visited</> : <><Plane size={14} /> Bucket List</>}
                                        </div>

                                        {/* Title */}
                                        <h2 className="text-3xl lg:text-4xl font-black text-gray-800 font-aesthetic tracking-tight leading-tight mt-4">
                                            {selectedPlace.name}
                                        </h2>

                                        {/* Description */}
                                        {selectedPlace.description && (
                                            <p className="text-pink-500 font-bold mt-2">{selectedPlace.description}</p>
                                        )}

                                        {/* Story Section */}
                                        <div className="flex-1 mt-6">
                                            <div className="flex items-center gap-2 text-sm text-pink-400 font-bold mb-3">
                                                <BookOpen size={16} /> Our Story
                                            </div>
                                            <div className="bg-pink-50/50 rounded-xl p-5 border border-pink-100 relative">
                                                <div className="absolute top-2 left-2 text-3xl text-pink-200">"</div>
                                                <p className="text-gray-600 leading-relaxed font-handwriting text-lg pt-4 px-4">
                                                    {selectedPlace.story || "Every journey with you is a story waiting to be written. This place holds a special meaning in our hearts, a chapter in our love story that we'll cherish forever."}
                                                </p>
                                                <div className="absolute bottom-2 right-4 text-3xl text-pink-200">"</div>
                                            </div>
                                        </div>

                                        {/* Footer */}
                                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-pink-100">
                                            {/* Google Maps Link */}
                                            {selectedPlace.lat && selectedPlace.lng && (
                                                <a
                                                    href={`https://www.google.com/maps?q=${selectedPlace.lat},${selectedPlace.lng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="inline-flex items-center gap-2 text-sm text-pink-500 hover:text-pink-600 bg-pink-50 px-4 py-2 rounded-full hover:bg-pink-100 transition-colors font-bold"
                                                >
                                                    <MapPin size={14} /> Maps <ExternalLink size={12} />
                                                </a>
                                            )}

                                            {/* Close Button */}
                                            <button
                                                onClick={closePlace}
                                                className="py-3 px-8 bg-gradient-to-r from-pink-400 to-rose-400 text-white rounded-full font-bold hover:from-pink-500 hover:to-rose-500 transition-all shadow-lg shadow-pink-200 text-sm uppercase tracking-wider"
                                            >
                                                ✕ Close Book
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="min-h-screen bg-gradient-to-br from-pink-50 to-white pb-20">
                <div className="max-w-6xl mx-auto p-4 md:p-8 space-y-12">
                    {/* Header */}
                    <div className="text-center space-y-4 pt-8">
                        <div className="inline-block relative">
                            <h1 className="text-4xl md:text-5xl font-black text-pink-500 font-aesthetic tracking-tight drop-shadow-sm flex items-center justify-center gap-3">
                                <Plane className="text-pink-400 animate-bounce" /> TRAVEL LOG
                            </h1>
                            <div className="absolute -bottom-2 left-0 w-full h-1 bg-pink-200 rounded-full" />
                        </div>
                        <p className="text-gray-500 font-handwriting text-lg md:text-xl max-w-xl mx-auto italic">
                            "Exploring the world, hand in hand. Every destination is a love letter to our journey." 🌍💖
                        </p>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-pink-300 animate-pulse text-xl font-bold font-aesthetic">
                            Loading our adventures... ✨
                        </div>
                    ) : (
                        <>
                            {/* Visited Section */}
                            <section>
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-pink-100 p-3 rounded-2xl shadow-inner">
                                        <MapPin className="text-pink-600 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 font-aesthetic">OUR PLACES</h2>
                                        <div className="h-1 w-20 bg-pink-300 rounded-full mt-1" />
                                    </div>
                                    <span className="ml-auto text-sm text-pink-400 bg-pink-50 px-3 py-1 rounded-full font-bold">{visited.length} places</span>
                                </div>

                                {visited.length === 0 ? (
                                    <div className="text-gray-400 italic text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-pink-100">
                                        No visited locations yet. Time to pack our bags! 🎒
                                    </div>
                                ) : (
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {visited.map((place) => (
                                            <motion.div
                                                key={place.id}
                                                variants={itemVariants}
                                                onClick={() => openPlace(place)}
                                                className="bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-2 border-transparent hover:border-pink-200"
                                            >
                                                <div className="h-48 relative overflow-hidden bg-gray-100">
                                                    {place.images?.[0]?.url ? (
                                                        <img src={place.images[0].url} alt={place.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-pink-200 bg-pink-50">
                                                            <Heart size={48} />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 right-3 bg-white/90 backdrop-blur text-pink-500 text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                        <MapPin size={10} /> VISITED
                                                    </div>
                                                    {place.images?.length > 1 && (
                                                        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                                                            📷 {place.images.length}
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="p-5 space-y-3">
                                                    <h3 className="text-xl font-bold text-gray-800 line-clamp-1 group-hover:text-pink-500 transition-colors">{place.name}</h3>
                                                    {place.date && (
                                                        <div className="flex items-center gap-1 text-xs text-gray-400 font-medium bg-gray-50 px-2 py-1 rounded w-fit">
                                                            <Calendar size={12} /> {new Date(place.date).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                    <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed">
                                                        {place.description || "A beautiful memory..."}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </section>

                            {/* Bucket List Section */}
                            <section className="mt-16">
                                <div className="flex items-center gap-3 mb-8">
                                    <div className="bg-blue-100 p-3 rounded-2xl shadow-inner">
                                        <Plane className="text-blue-500 w-6 h-6" />
                                    </div>
                                    <div>
                                        <h2 className="text-2xl font-bold text-gray-800 font-aesthetic">DREAM DESTINATIONS</h2>
                                        <div className="h-1 w-20 bg-blue-300 rounded-full mt-1" />
                                    </div>
                                    <span className="ml-auto text-sm text-blue-400 bg-blue-50 px-3 py-1 rounded-full font-bold">{bucket.length} dreams</span>
                                </div>

                                {bucket.length === 0 ? (
                                    <div className="text-gray-400 italic text-center py-12 bg-white/50 rounded-3xl border-2 border-dashed border-blue-100">
                                        Dream list is empty? Impossible! 🌏
                                    </div>
                                ) : (
                                    <motion.div
                                        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                                        variants={containerVariants}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        {bucket.map((place) => (
                                            <motion.div
                                                key={place.id}
                                                variants={itemVariants}
                                                onClick={() => openPlace(place)}
                                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer group border-4 border-dashed border-blue-100 hover:border-blue-300"
                                            >
                                                <div className="h-40 relative overflow-hidden bg-blue-50/50">
                                                    {place.images?.[0]?.url ? (
                                                        <img src={place.images[0].url} alt={place.name} className="w-full h-full object-cover opacity-90 group-hover:scale-110 transition-transform duration-700 grayscale-[20%] group-hover:grayscale-0" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-blue-200">
                                                            <Plane size={48} />
                                                        </div>
                                                    )}
                                                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-sm flex items-center gap-1">
                                                        <Plane size={10} /> DREAM
                                                    </div>
                                                </div>

                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-gray-700 mb-2">{place.name}</h3>
                                                    <p className="text-xs text-gray-400 line-clamp-3 leading-relaxed">
                                                        {place.description || "A dream waiting to happen..."}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                )}
                            </section>
                        </>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Travel;
