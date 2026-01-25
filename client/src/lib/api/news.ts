import { apiRequest } from '../api';
export * from '@/types/news';
import { NewsItem, CreateNewsDTO, UpdateNewsDTO } from '@/types/news';

export const newsApi = {
    // Public
    list: () => apiRequest<NewsItem[]>('/api/news'),
    get: (id: string) => apiRequest<NewsItem>(`/api/news/${id}`),

    // Admin
    listAll: () => apiRequest<NewsItem[]>('/api/news/admin/all'),
    create: (data: CreateNewsDTO) =>
        apiRequest<NewsItem>('/api/news', { method: 'POST', body: data }),
    update: (id: string, data: UpdateNewsDTO) =>
        apiRequest<NewsItem>(`/api/news/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/news/${id}`, { method: 'DELETE' }),
};
