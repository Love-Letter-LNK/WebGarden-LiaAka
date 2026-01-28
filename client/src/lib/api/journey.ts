import { apiRequest } from './core';
export * from '@/types/journey';
import { JourneyMilestone, CreateJourneyDTO, UpdateJourneyDTO } from '@/types/journey';

export const journeyApi = {
    // Public
    list: () => apiRequest<JourneyMilestone[]>('/api/journey'),
    get: (id: string) => apiRequest<JourneyMilestone>(`/api/journey/${id}`),

    // Admin
    create: (data: CreateJourneyDTO) =>
        apiRequest<JourneyMilestone>('/api/journey', { method: 'POST', body: data }),
    update: (id: string, data: UpdateJourneyDTO) =>
        apiRequest<JourneyMilestone>(`/api/journey/${id}`, { method: 'PATCH', body: data }),
    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/journey/${id}`, { method: 'DELETE' }),
};
