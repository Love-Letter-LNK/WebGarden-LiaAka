export interface NewsItem {
    id: string;
    title: string;
    date: string;
    category: string;
    emoji: string;
    content?: string;
    published: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateNewsDTO {
    title: string;
    date: string;
    category: string;
    emoji?: string;
    content?: string;
    published?: boolean;
}

export interface UpdateNewsDTO {
    title?: string;
    date?: string;
    category?: string;
    emoji?: string;
    content?: string;
    published?: boolean;
}
