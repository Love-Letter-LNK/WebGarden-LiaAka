import React, { createContext, useContext, useEffect, useMemo, useState, useCallback } from "react";
import { authApi, User, ApiError } from "@/lib/api";

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch current user on mount
  const refreshUser = useCallback(async () => {
    try {
      const { user: userData } = await authApi.me();
      setUser(userData);
    } catch (error) {
      // Not authenticated or error - that's okay
      setUser(null);
    }
  }, []);

  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      await refreshUser();
      setIsLoading(false);
    };
    initAuth();
  }, [refreshUser]);

  const login = useCallback(async (email: string, password: string) => {
    const { user: userData } = await authApi.login(email, password);
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } catch (error) {
      // Ignore logout errors
    }
    setUser(null);
  }, []);

  const isAdmin = user?.role === 'admin';

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAdmin,
      login,
      logout,
      refreshUser,
    }),
    [user, isLoading, isAdmin, login, logout, refreshUser]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    // Safety fallback to prevent crash while debugging
    console.error("CRITICAL: useAuth called outside of AuthProvider! Returning safe fallback.");
    return {
      user: null,
      isLoading: true, // Keep loading to prevent premature redirects
      isAdmin: false,
      login: async () => console.warn("Login called without provider"),
      logout: async () => console.warn("Logout called without provider"),
      refreshUser: async () => console.warn("refreshUser called without provider"),
    };
  }
  return ctx;
};
