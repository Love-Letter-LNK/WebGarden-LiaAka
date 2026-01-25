import { IMemoryRepository } from "./IMemoryRepository";
import { Memory, MemoryDTO, MemoryFilter } from "../types/memory";
import { memoriesApi } from "../lib/api/memories";

export class ApiMemoryRepository implements IMemoryRepository {

    async list(filter?: MemoryFilter): Promise<Memory[]> {
        return await memoriesApi.list(filter);
    }

    async getById(id: string): Promise<Memory | null> {
        return await memoriesApi.get(id);
    }

    async create(payload: MemoryDTO): Promise<Memory> {
        return await memoriesApi.create(payload);
    }

    async update(id: string, payload: Partial<MemoryDTO>): Promise<Memory> {
        return await memoriesApi.update(id, payload);
    }

    async remove(id: string): Promise<void> {
        await memoriesApi.delete(id);
    }
}
