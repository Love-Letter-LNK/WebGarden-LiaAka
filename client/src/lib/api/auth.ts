import { apiRequest } from './core';

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

    me: () => apiRequest<AuthResponse>('/api/auth/me'),
};
