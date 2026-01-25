/**
 * Base API utilities and types
 * All API calls go through this module for consistent error handling
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
    fieldName: string = 'images',
    extraFields?: Record<string, string>
): Promise<T> {
    const formData = new FormData();
    files.forEach(file => formData.append(fieldName, file));

    // Add extra fields if provided
    if (extraFields) {
        Object.entries(extraFields).forEach(([key, value]) => {
            formData.append(key, value);
        });
    }

    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        body: formData,
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

// Re-export from individual API modules
export * from './api/auth';
export * from './api/memories';
export * from './api/news';
export * from './api/journey';
export * from './api/profiles';
export * from './api/contact';
export * from './api/gallery';
