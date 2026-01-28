import { Newspaper, Calendar, Heart, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useSound } from "../hooks/useSound";
import { MainLayout } from "../components/garden/MainLayout";
import { useEffect, useState } from "react";
import { NewsItem } from "@/types/news";
import { newsApi } from "@/lib/api/news";
import { format } from "date-fns";
import { NewsModal } from "@/components/news/NewsModal";
import { usePageTitle } from "@/hooks/usePageTitle";

const News = () => {
    usePageTitle("News");
    const playSound = useSound();
    const [newsItems, setNewsItems] = useState<NewsItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const data = await newsApi.list();
                setNewsItems(data);
            } catch (err) {
                console.error("Failed to fetch news:", err);
                setError("Could not load news.");
            } finally {
                setLoading(false);
            }
        };

        fetchNews();
    }, []);

    return (
        <MainLayout>
            {/* News Modal */}
            {selectedNews && (
                <NewsModal news={selectedNews} onClose={() => setSelectedNews(null)} />
            )}

            <div className="flex-1 p-4 bg-gradient-to-b from-pink-50 to-blue-50 h-full rounded-lg overflow-y-auto">
                <div className="max-w-4xl mx-auto pb-20">
                    {/* News Header Banner */}
                    <div className="bg-gradient-to-r from-pink-200 to-blue-200 border-2 border-white rounded-xl p-4 mb-6 text-center shadow-lg">
                        <Newspaper className="w-10 h-10 mx-auto text-purple-500 mb-2" />
                        <h2 className="text-sm font-bold text-purple-600">✨ Latest News ✨</h2>
                        <p className="text-[10px] text-gray-600">Stay updated with our journey!</p>
                    </div>

                    {/* News List */}
                    {loading ? (
                        <div className="flex justify-center py-10">
                            <Loader2 className="animate-spin text-pink-400" />
                        </div>
                    ) : error ? (
                        <div className="text-center text-red-400 text-xs font-bold py-10">
                            {error}
                        </div>
                    ) : newsItems.length === 0 ? (
                        <div className="text-center text-gray-400 text-xs font-bold py-10">
                            No news yet! Stay tuned.
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {newsItems.map((news) => (
                                <div
                                    key={news.id}
                                    className="bg-white border-2 border-pink-200 rounded-lg p-3 hover:border-pink-400 hover:shadow-md transition-all cursor-pointer group"
                                    onMouseEnter={() => playSound('hover')}
                                    onClick={() => {
                                        playSound('click');
                                        setSelectedNews(news);
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{news.emoji || "📰"}</div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-[8px] bg-pink-100 text-pink-500 px-2 py-0.5 rounded-full font-bold uppercase">
                                                    {news.category}
                                                </span>
                                                <span className="text-[8px] text-gray-400 flex items-center gap-1">
                                                    <Calendar size={10} /> {format(new Date(news.date), "MMM d, yyyy")}
                                                </span>
                                            </div>
                                            <h3 className="text-xs font-bold text-gray-700 group-hover:text-pink-500 transition-colors">
                                                {news.title}
                                            </h3>
                                        </div>
                                        <Heart className="w-4 h-4 text-pink-300 group-hover:text-pink-500 transition-colors" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Back Button */}
                    <div className="text-center mt-6">
                        <Link
                            to="/"
                            className="bg-pink-400 text-white px-6 py-2 rounded-full text-xs font-bold hover:bg-pink-500 transition-colors inline-block"
                            onClick={() => playSound('click')}
                            onMouseEnter={() => playSound('hover')}
                        >
                            ← Back to Home
                        </Link>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default News;
