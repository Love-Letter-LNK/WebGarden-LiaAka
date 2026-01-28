// Core API utilities
export * from './api/core';

// Re-export from individual API modules
export * from './api/auth';
export * from './api/memories';
export * from './api/news';
export * from './api/journey';
export * from './api/profiles';
export * from './api/contact';
export * from './api/gallery';

// ============ TRAVEL API ============
import { apiRequest } from './api/core';

export interface TravelImage {
    id: string;
    url: string;
    caption?: string;
    sortOrder: number;
    createdAt: string;
}

export interface TravelLog {
    id: string;
    name: string;
    description?: string;
    story?: string;
    date?: string;
    isVisited: boolean;
    lat?: number;
    lng?: number;
    images: TravelImage[];
    createdAt: string;
    updatedAt: string;
}

export const travelApi = {
    list: () => apiRequest<TravelLog[]>('/api/travel'),
    get: (id: string) => apiRequest<TravelLog>(`/api/travel/${id}`),
    create: (data: Partial<TravelLog>) => apiRequest<TravelLog>('/api/travel', { method: 'POST', body: data }),
    update: (id: string, data: Partial<TravelLog>) => apiRequest<TravelLog>(`/api/travel/${id}`, { method: 'PUT', body: data }),
    delete: (id: string) => apiRequest<{ message: string }>(`/api/travel/${id}`, { method: 'DELETE' }),

    // Image management
    uploadImages: async (id: string, files: File[]): Promise<TravelImage[]> => {
        const formData = new FormData();
        files.forEach(file => formData.append('images', file));
        const response = await fetch(`/api/travel/${id}/images`, {
            method: 'POST',
            body: formData,
            credentials: 'include'
        });
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Upload failed');
        }
        return response.json();
    },

    deleteImage: (id: string, imageId: string) => apiRequest<{ message: string }>(`/api/travel/${id}/images/${imageId}`, { method: 'DELETE' }),
};

// ============ VISITOR API ============

export interface Visitor {
    id: string;
    ip?: string;
    userAgent?: string;
    country?: string;
    city?: string;
    page: string;
    referer?: string;
    deviceType?: string;
    browser?: string;
    os?: string;
    isUnique: boolean;
    createdAt: string;
}

export interface VisitorStats {
    total: number;
    today: number;
}

export interface VisitorAnalytics {
    total: number;
    today: number;
    uniqueToday: number;
    thisWeek: number;
    byDevice: { type: string; count: number }[];
    byBrowser: { browser: string; count: number }[];
    topPages: { page: string; count: number }[];
    recentUnique: Visitor[];
}

export const visitorApi = {
    getStats: () => apiRequest<VisitorStats>('/api/visitors/stats'),
    track: (page: string = '/') => apiRequest<{ success: boolean; isUnique: boolean }>('/api/visitors/track', { method: 'POST', body: { page } }),
    list: (page = 1, limit = 50, today = false) => apiRequest<{ visitors: Visitor[]; total: number; page: number; totalPages: number }>(`/api/visitors?page=${page}&limit=${limit}&today=${today}`),
    analytics: () => apiRequest<VisitorAnalytics>('/api/visitors/analytics'),
    clearOld: (days = 30) => apiRequest<{ message: string }>('/api/visitors/clear', { method: 'DELETE', body: { days } }),
};
