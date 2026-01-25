import { apiRequest, apiUpload } from '../api';
export * from '@/types/memory';
import { Memory, MemoryDTO, MemoryImage, UpdateMemoryDTO } from '@/types/memory';

export const memoriesApi = {
    list: (params?: { category?: string; mood?: string; search?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set('category', params.category);
        if (params?.mood) searchParams.set('mood', params.mood);
        if (params?.search) searchParams.set('search', params.search);
        const query = searchParams.toString();
        return apiRequest<Memory[]>(`/api/memories${query ? `?${query}` : ''}`);
    },

    get: (idOrSlug: string) => apiRequest<Memory>(`/api/memories/${idOrSlug}`),

    create: (data: MemoryDTO) =>
        apiRequest<Memory>('/api/memories', { method: 'POST', body: data }),

    update: (id: string, data: Partial<MemoryDTO>) =>
        apiRequest<Memory>(`/api/memories/${id}`, { method: 'PATCH', body: data }),

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/memories/${id}`, { method: 'DELETE' }),

    uploadImages: (memoryId: string, files: File[]) =>
        apiUpload<MemoryImage[]>(`/api/memories/${memoryId}/images`, files),

    deleteImage: (memoryId: string, imageId: string) =>
        apiRequest<{ message: string }>(`/api/memories/${memoryId}/images/${imageId}`, { method: 'DELETE' }),
};
