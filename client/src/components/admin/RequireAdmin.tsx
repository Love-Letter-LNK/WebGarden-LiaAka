import React from "react";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";

interface RequireAdminProps {
    children: React.ReactNode;
    fallback?: React.ReactNode;
}

/**
 * Auth guard component for admin routes
 * Shows login form inline if not authenticated as admin
 */
export const RequireAdmin: React.FC<RequireAdminProps> = ({
    children,
    fallback
}) => {
    const { user, isLoading, isAdmin } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-pink-500 mx-auto mb-2" />
                    <p className="text-gray-500 text-sm">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user || !isAdmin) {
        // Show fallback or default message
        if (fallback) {
            return <>{fallback}</>;
        }

        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center max-w-md">
                    <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-2xl">🔒</span>
                    </div>
                    <h1 className="text-xl font-bold text-gray-800 mb-2">Admin Only</h1>
                    <p className="text-gray-500 text-sm mb-4">
                        This area is restricted to administrators.
                    </p>
                    <a
                        href="/__admin/login"
                        className="inline-block px-6 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors font-medium"
                    >
                        Admin Login
                    </a>
                </div>
            </div>
        );
    }

    return <>{children}</>;
};
