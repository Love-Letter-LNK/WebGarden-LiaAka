export interface Profile {
    id: string;
    slug: string;
    name: string;
    displayName?: string; // Corrected from nickname to match usage in Profile.tsx if any
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
    displayName?: string;
    bio?: string;
    birthDate?: string;
    hobbies?: string;
    likes?: string;
    loveLanguage?: string;
    funFacts?: string[];
    avatar?: string;
    color?: string;
}
