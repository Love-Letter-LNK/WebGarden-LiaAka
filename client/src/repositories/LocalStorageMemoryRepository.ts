import { IMemoryRepository } from "./IMemoryRepository";
import { Memory, MemoryDTO, MemoryFilter } from "../types/memory";
import { seedMemories } from "../data/memories.seed";

const STORAGE_KEY = "garden_memories_v1";

export class LocalStorageMemoryRepository implements IMemoryRepository {
    constructor() {
        this.initialize();
    }

    private initialize() {
        if (!localStorage.getItem(STORAGE_KEY)) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(seedMemories));
        }
    }

    private getMemories(): Memory[] {
        const data = localStorage.getItem(STORAGE_KEY);
        return data ? JSON.parse(data) : [];
    }

    private saveMemories(memories: Memory[]) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }

    async list(filter?: MemoryFilter): Promise<Memory[]> {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500));

        let memories = this.getMemories();

        // Sort by date descending (newest first) by default
        memories.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

        if (filter) {
            if (filter.category) {
                memories = memories.filter(m => m.category === filter.category);
            }
            if (filter.search) {
                const searchLower = filter.search.toLowerCase();
                memories = memories.filter(m =>
                    m.title.toLowerCase().includes(searchLower) ||
                    m.tags.some(t => t.toLowerCase().includes(searchLower))
                );
            }
            if (filter.mood) {
                memories = memories.filter(m => m.mood === filter.mood);
            }
        }

        return memories;
    }

    async getById(id: string): Promise<Memory | null> {
        await new Promise(resolve => setTimeout(resolve, 300));
        const memories = this.getMemories();
        return memories.find(m => m.id === id) || null;
    }

    async create(payload: MemoryDTO): Promise<Memory> {
        await new Promise(resolve => setTimeout(resolve, 600));
        const memories = this.getMemories();

        // Safe manual ID generation
        const newId = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

        const newMemory: Memory = {
            ...payload,
            id: newId,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        memories.unshift(newMemory); // Add to beginning
        this.saveMemories(memories);
        return newMemory;
    }

    async update(id: string, payload: Partial<MemoryDTO>): Promise<Memory> {
        await new Promise(resolve => setTimeout(resolve, 500));
        const memories = this.getMemories();
        const index = memories.findIndex(m => m.id === id);

        if (index === -1) {
            throw new Error("Memory not found");
        }

        const updatedMemory = {
            ...memories[index],
            ...payload,
            updatedAt: new Date().toISOString()
        };

        memories[index] = updatedMemory;
        this.saveMemories(memories);
        return updatedMemory;
    }

    async remove(id: string): Promise<void> {
        await new Promise(resolve => setTimeout(resolve, 400));
        const memories = this.getMemories();
        const filtered = memories.filter(m => m.id !== id);
        this.saveMemories(filtered);
    }
}
