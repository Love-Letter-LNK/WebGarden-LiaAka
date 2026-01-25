import { Memory, MemoryDTO, MemoryFilter } from "../types/memory";

export interface IMemoryRepository {
    list(filter?: MemoryFilter): Promise<Memory[]>;
    getById(id: string): Promise<Memory | null>;
    create(payload: MemoryDTO): Promise<Memory>;
    update(id: string, payload: Partial<MemoryDTO>): Promise<Memory>;
    remove(id: string): Promise<void>;
}
