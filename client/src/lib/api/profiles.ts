import { apiRequest } from './core';
export * from '@/types/profile';
import { Profile, UpdateProfileDTO } from '@/types/profile';

export const profilesApi = {
    // Public
    list: () => apiRequest<Profile[]>('/api/profiles'),
    get: (slug: string) => apiRequest<Profile>(`/api/profiles/${slug}`),

    // Admin
    update: (slug: string, data: UpdateProfileDTO) =>
        apiRequest<Profile>(`/api/profiles/${slug}`, { method: 'PATCH', body: data }),
};
