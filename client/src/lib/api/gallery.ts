import { apiRequest, apiUpload } from './core';

export interface GalleryImage {
    id: string;
    url: string;
    alt?: string;
    category?: string;
    year?: string;
    sortOrder: number;
    createdAt: string;
}

export interface UpdateGalleryDTO {
    alt?: string;
    category?: string;
    year?: string;
    sortOrder?: number;
}

export const galleryApi = {
    // Public
    list: (category?: string) => {
        const query = category ? `?category=${encodeURIComponent(category)}` : '';
        return apiRequest<GalleryImage[]>(`/api/gallery${query}`);
    },
    get: (id: string) => apiRequest<GalleryImage>(`/api/gallery/${id}`),

    // Admin
    upload: (files: File[], category?: string, alt?: string) =>
        apiUpload<GalleryImage[]>('/api/gallery', files, 'images', {
            ...(category && { category }),
            ...(alt && { alt }),
        }),
    update: (id: string, data: UpdateGalleryDTO) =>
        apiRequest<GalleryImage>(`/api/gallery/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/gallery/${id}`, { method: 'DELETE' }),
};
