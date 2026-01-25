export type MemoryCategory = 'First Date' | 'Anniversary' | 'Travel' | 'Random' | 'Letters' | string;
export type MemoryMood = 'sweet' | 'silly' | 'serious' | 'romantic' | 'adventure' | 'chill';

export interface MemoryImage {
    url: string;
    alt?: string;
    caption?: string;
}

export interface Memory {
    id: string;
    slug?: string;
    title: string;
    date: string; // ISO string
    category: MemoryCategory;
    tags: string[];
    mood?: MemoryMood;
    quote?: string;
    story?: string;
    location?: string;
    images: MemoryImage[];
    createdAt: string; // ISO string
    updatedAt: string; // ISO string
}

export interface MemoryDTO {
    title: string;
    date: string;
    category: MemoryCategory;
    tags: string[];
    mood?: MemoryMood;
    quote?: string;
    story?: string;
    location?: string;
    images: MemoryImage[];
}

export interface MemoryFilter {
    category?: string;
    search?: string;
    mood?: string;
    startDate?: string;
    endDate?: string;
}

export interface UpdateMemoryDTO {
    title?: string;
    date?: string;
    category?: MemoryCategory;
    tags?: string[];
    mood?: MemoryMood;
    quote?: string;
    story?: string;
    location?: string;
}
