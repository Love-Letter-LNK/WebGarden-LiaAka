import { useState, useEffect } from 'react';
import { authApi } from '@/lib/api/auth';

export const useAuth = () => {
    const [user, setUser] = useState<{ id: string; email: string; role: string } | null>(null);
    const [loading, setLoading] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const currentUser = await authApi.getCurrentUser();
                setUser(currentUser);
                setIsAdmin(currentUser?.role === 'ADMIN');
            } catch (error) {
                // Not authenticated
                setUser(null);
                setIsAdmin(false);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    return { user, loading, isAdmin };
};
