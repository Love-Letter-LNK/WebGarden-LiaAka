/**
 * Upload URL Utilities
 * 
 * Resolves relative upload paths to absolute URLs based on environment
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

/**
 * Converts a relative upload path to an absolute URL
 * @param path - The upload path (e.g., "/uploads/memory-123.jpg")
 * @returns Full URL to the uploaded file
 */
export function resolveUploadUrl(path: string | undefined | null): string {
    if (!path) return '';

    // If it's already a full URL (http:// or https://), return as-is
    if (path.startsWith('http://') || path.startsWith('https://')) {
        return path;
    }

    // If it's a relative path starting with /uploads/, prepend API base URL
    if (path.startsWith('/uploads/')) {
        // In development, Vite proxy handles it, so we can use relative paths
        // In production, we need the full API URL
        return API_BASE_URL ? `${API_BASE_URL}${path}` : path;
    }

    // For any other path, return as-is
    return path;
}

/**
 * Resolves multiple upload URLs
 * @param paths - Array of upload paths
 * @returns Array of full URLs
 */
export function resolveUploadUrls(paths: (string | undefined | null)[]): string[] {
    return paths.map(resolveUploadUrl);
}
