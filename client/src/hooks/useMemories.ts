import { useMemoryContext } from "../context/MemoryContext";

export const useMemories = () => {
    const {
        memories,
        loading,
        error,
        refresh,
        addMemory,
        updateMemory,
        deleteMemory,
        getMemory
    } = useMemoryContext();

    return {
        memories,
        loading,
        error,
        actions: {
            refresh,
            addMemory,
            updateMemory,
            deleteMemory,
            getMemory
        }
    };
};
