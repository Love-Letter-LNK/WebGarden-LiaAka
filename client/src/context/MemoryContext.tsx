import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { Memory, MemoryDTO, MemoryFilter } from "../types/memory";
import { IMemoryRepository } from "../repositories/IMemoryRepository";
import { LocalStorageMemoryRepository } from "../repositories/LocalStorageMemoryRepository";
import { useToast } from "../hooks/use-toast";
import { ApiMemoryRepository } from "../repositories/ApiMemoryRepository";

interface MemoryContextType {
    memories: Memory[];
    loading: boolean;
    error: string | null;
    refresh: (filter?: MemoryFilter) => Promise<void>;
    addMemory: (data: MemoryDTO) => Promise<void>;
    updateMemory: (id: string, data: Partial<MemoryDTO>) => Promise<void>;
    deleteMemory: (id: string) => Promise<void>;
    getMemory: (id: string) => Promise<Memory | null>;
}

const MemoryContext = createContext<MemoryContextType | undefined>(undefined);

export const MemoryProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [repository] = useState<IMemoryRepository>(() => new ApiMemoryRepository());
    const [memories, setMemories] = useState<Memory[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { toast } = useToast();

    const refresh = useCallback(async (filter?: MemoryFilter) => {
        setLoading(true);
        setError(null);
        try {
            const data = await repository.list(filter);
            setMemories(data);
        } catch (err) {
            console.error("Failed to fetch memories", err);
            setError("Failed to load memories.");
        } finally {
            setLoading(false);
        }
    }, [repository]);

    // Initial load
    useEffect(() => {
        refresh();
    }, [refresh]);

    const addMemory = async (data: MemoryDTO) => {
        setLoading(true);
        try {
            await repository.create(data);
            await refresh(); // Re-fetch to update list
            toast({
                title: "Memory Created",
                description: "Your new memory has been saved correctly.",
            });
        } catch (err) {
            console.error(err);
            setError("Failed to create memory.");
            toast({
                title: "Error",
                description: "Failed to save memory.",
                variant: "destructive",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateMemory = async (id: string, data: Partial<MemoryDTO>) => {
        setLoading(true);
        try {
            await repository.update(id, data);
            await refresh();
            toast({
                title: "Memory Updated",
                description: "Changes have been saved.",
            });
        } catch (err) {
            console.error(err);
            setError("Failed to update memory.");
            toast({
                title: "Error",
                description: "Failed to update memory.",
                variant: "destructive",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteMemory = async (id: string) => {
        setLoading(true);
        try {
            await repository.remove(id);
            await refresh();
            toast({
                title: "Memory Deleted",
                description: "The memory has been removed.",
            });
        } catch (err) {
            console.error(err);
            setError("Failed to delete memory.");
            toast({
                title: "Error",
                description: "Failed to delete memory.",
                variant: "destructive",
            });
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const getMemory = async (id: string) => {
        try {
            return await repository.getById(id);
        } catch (err) {
            console.error(err);
            return null;
        }
    };

    return (
        <MemoryContext.Provider value={{
            memories,
            loading,
            error,
            refresh,
            addMemory,
            updateMemory,
            deleteMemory,
            getMemory
        }}>
            {children}
        </MemoryContext.Provider>
    );
};

export const useMemoryContext = () => {
    const context = useContext(MemoryContext);
    if (!context) {
        throw new Error("useMemoryContext must be used within a MemoryProvider");
    }
    return context;
};
