import { useQuery } from "@tanstack/react-query";

// MODELS (Interfaces)
export interface Milestone {
    id: string;
    date: string;
    title: string;
    description: string;
}

export interface Memory {
    id: string;
    image: string;
    caption: string;
}

// FETCH FUNCTIONS (Service Layer)
const fetchMilestones = async (): Promise<Milestone[]> => {
    const res = await fetch("http://localhost:3000/api/milestones");
    if (!res.ok) throw new Error("Failed to fetch milestones");
    return res.json();
};

const fetchMemories = async (): Promise<Memory[]> => {
    const res = await fetch("http://localhost:3000/api/memories");
    if (!res.ok) throw new Error("Failed to fetch memories");
    return res.json();
};

// CONTROLLER (Hook)
export const useDigitalGardenController = () => {
    const { data: milestones = [], isLoading: isLoadingMilestones } = useQuery({
        queryKey: ['milestones'],
        queryFn: fetchMilestones
    });

    const { data: memories = [], isLoading: isLoadingMemories } = useQuery({
        queryKey: ['memories'],
        queryFn: fetchMemories
    });

    return {
        milestones,
        memories,
        isLoading: isLoadingMilestones || isLoadingMemories
    };
};
