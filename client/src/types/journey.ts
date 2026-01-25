export interface JourneyMilestone {
    id: string;
    title: string;
    date: string; // ISO string
    description?: string;
    icon: string;
    sortOrder: number;
    createdAt: string;
    updatedAt: string;
}

export interface CreateJourneyDTO {
    title: string;
    date: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
}

export interface UpdateJourneyDTO {
    title?: string;
    date?: string;
    description?: string;
    icon?: string;
    sortOrder?: number;
}
