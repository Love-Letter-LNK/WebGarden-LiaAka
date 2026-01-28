export interface Profile {
    id: string;
    slug: string;
    name: string;
    nickname?: string;
    bio?: string;
    birthDate?: string;
    hobbies?: string; // Stored as comma-separated string
    likes?: string;
    loveLanguage?: string;
    funFacts: string[];
    avatar?: string; // Changed from avatarUrl to match backend
    color: string;
    createdAt: string;
    updatedAt: string;
}

export interface UpdateProfileDTO {
    name?: string;
    nickname?: string;
    bio?: string;
    birthDate?: string;
    hobbies?: string;
    likes?: string;
    loveLanguage?: string;
    funFacts?: string[];
    avatar?: string;
    color?: string;
}
