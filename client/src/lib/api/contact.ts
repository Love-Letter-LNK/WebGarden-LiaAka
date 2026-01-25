import { apiRequest } from '../api';

export interface ContactMessage {
    id: string;
    recipient: 'zekk' | 'lia';
    message: string;
    senderName?: string;
    senderEmail?: string;
    isRead: boolean;
    createdAt: string;
}

export interface SubmitMessageDTO {
    recipient: 'zekk' | 'lia';
    message: string;
    senderName?: string;
    senderEmail?: string;
}

export interface ContactStats {
    total: number;
    unread: number;
    toZekk: number;
    toLia: number;
}

export const contactApi = {
    // Public
    submit: (data: SubmitMessageDTO) =>
        apiRequest<{ message: string; id: string }>('/api/contact', { method: 'POST', body: data }),

    // Admin
    list: (params?: { recipient?: string; unreadOnly?: boolean }) => {
        const searchParams = new URLSearchParams();
        if (params?.recipient) searchParams.set('recipient', params.recipient);
        if (params?.unreadOnly) searchParams.set('unreadOnly', 'true');
        const query = searchParams.toString();
        return apiRequest<ContactMessage[]>(`/api/contact${query ? `?${query}` : ''}`);
    },
    get: (id: string) => apiRequest<ContactMessage>(`/api/contact/${id}`),
    markAsRead: (id: string) =>
        apiRequest<ContactMessage>(`/api/contact/${id}/read`, { method: 'PATCH' }),
    delete: (id: string) =>
        apiRequest<{ message: string }>(`/api/contact/${id}`, { method: 'DELETE' }),
    stats: () => apiRequest<ContactStats>('/api/contact/stats'),
};
