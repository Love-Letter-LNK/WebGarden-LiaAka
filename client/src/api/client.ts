/**
 * Centralized API client with credentials support
 * All requests include cookies for JWT authentication
 */

export class ApiError extends Error {
    status: number;

    constructor(message: string, status: number) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

interface RequestOptions extends Omit<RequestInit, 'body'> {
    body?: unknown;
}

/**
 * Make an API request with automatic JSON handling and credentials
 */
export async function apiRequest<T>(
    url: string,
    options: RequestOptions = {}
): Promise<T> {
    const { body, headers, ...rest } = options;

    const config: RequestInit = {
        ...rest,
        credentials: 'include', // Include cookies for httpOnly JWT
        headers: {
            'Content-Type': 'application/json',
            ...headers,
        },
    };

    if (body !== undefined) {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(url, config);

    // Handle empty responses
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new ApiError(
            data?.error || data?.message || 'Request failed',
            response.status
        );
    }

    return data as T;
}

/**
 * Upload files via FormData
 */
export async function apiUpload<T>(
    url: string,
    files: File[],
    fieldName: string = 'images'
): Promise<T> {
    const formData = new FormData();
    files.forEach(file => formData.append(fieldName, file));

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
        // Note: Don't set Content-Type header, browser will set it with boundary
    });

    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    if (!response.ok) {
        throw new ApiError(
            data?.error || data?.message || 'Upload failed',
            response.status
        );
    }

    return data as T;
}

// ============ AUTH API ============

export interface User {
    id: string;
    email: string;
    role: 'admin' | 'user';
}

export interface AuthResponse {
    user: User;
}

export const authApi = {
    login: (email: string, password: string) =>
        apiRequest<AuthResponse>('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        }),

    logout: () =>
        apiRequest<{ message: string }>('/api/auth/logout', {
            method: 'POST',
        }),

    me: () =>
        apiRequest<AuthResponse>('/api/auth/me'),
};

// ============ MEMORIES API ============

export interface MemoryImage {
    id: string;
    url: string;
    alt?: string;
    sortOrder: number;
}

export interface Memory {
    id: string;
    slug: string;
    title: string;
    date: string;
    category: string;
    tags: string[];
    mood?: string;
    quote?: string;
    story?: string;
    location?: string;
    images: MemoryImage[];
    createdAt: string;
    updatedAt: string;
}

export interface CreateMemoryDTO {
    title: string;
    date: string;
    category: string;
    tags?: string[];
    mood?: string;
    quote?: string;
    story?: string;
    location?: string;
    images?: { url: string; alt?: string }[];
}

export interface UpdateMemoryDTO {
    title?: string;
    date?: string;
    category?: string;
    tags?: string[];
    mood?: string;
    quote?: string;
    story?: string;
    location?: string;
}

export const memoriesApi = {
    list: (params?: { category?: string; mood?: string; search?: string }) => {
        const searchParams = new URLSearchParams();
        if (params?.category) searchParams.set('category', params.category);
        if (params?.mood) searchParams.set('mood', params.mood);
        if (params?.search) searchParams.set('search', params.search);
        const query = searchParams.toString();
        return apiRequest<Memory[]>(`/api/memories${query ? `?${query}` : ''}`);
    },

    get: (idOrSlug: string) =>
        apiRequest<Memory>(`/api/memories/${idOrSlug}`),

    create: (data: CreateMemoryDTO) =>
        apiRequest<Memory>('/api/memories', {
            method: 'POST',
            body: data,
        }),

    update: (id: string, data: UpdateMemoryDTO) =>
        apiRequest<Memory>(`/api/memories/${id}`, {
            method: 'PATCH',
            body: data,
        }),

    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/memories/${id}`, {
            method: 'DELETE',
        }),

    // Image operations
    uploadImages: (memoryId: string, files: File[]) =>
        apiUpload<MemoryImage[]>(`/api/memories/${memoryId}/images`, files),

    deleteImage: (memoryId: string, imageId: string) =>
        apiRequest<{ message: string }>(`/api/memories/${memoryId}/images/${imageId}`, {
            method: 'DELETE',
        }),

    reorderImages: (memoryId: string, imageIds: string[]) =>
        apiRequest<MemoryImage[]>(`/api/memories/${memoryId}/images/reorder`, {
            method: 'PATCH',
            body: { imageIds },
        }),
};
