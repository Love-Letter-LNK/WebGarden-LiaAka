import { useQuery } from "@tanstack/react-query";
import { newsApi, NewsItem } from "@/lib/api/news";

// MODELS (Interfaces)
export interface Memory {
    id: string;
    image: string;
    caption: string;
}

// FETCH FUNCTIONS (Service Layer)
const fetchNews = async (): Promise<NewsItem[]> => {
    return await newsApi.list();
};

const fetchMemories = async (): Promise<Memory[]> => {
    // Use relative path to go through proxy
    const res = await fetch("/api/memories");
    if (!res.ok) throw new Error("Failed to fetch memories");
    return res.json();
};

// CONTROLLER (Hook)
export const useDigitalGardenController = () => {
    const { data: news = [], isLoading: isLoadingNews } = useQuery({
        queryKey: ['news'],
        queryFn: fetchNews
    });

    const { data: memories = [], isLoading: isLoadingMemories } = useQuery({
        queryKey: ['memories'],
        queryFn: fetchMemories
    });

    return {
        news,
        memories,
        isLoading: isLoadingNews || isLoadingMemories
    };
};
