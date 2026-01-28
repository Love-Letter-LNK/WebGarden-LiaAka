import { Memory } from "../types/memory";

export const seedMemories: Memory[] = [
    {
        id: "seed-1",
        title: "Our First Meeting",
        date: "2023-01-15T00:00:00.000Z",
        category: "First Date",
        tags: ["intro", "coffee", "nervous"],
        mood: "sweet",
        quote: "\"It all started with a simple hello...\"",
        story: "I remember waiting at the cafe, checking my watch every minute. When you walked in wearing that blue dress, time stopped. We talked for hours until the shop closed.",
        location: "Starbucks Central Park",
        images: [
            { url: "/we.webp", alt: "Us together" },
            { url: "/love2.webp", alt: "Heart decoration" }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "seed-2",
        title: "Beach Adventure",
        date: "2023-06-20T00:00:00.000Z",
        category: "Travel",
        tags: ["beach", "sunset", "fun"],
        mood: "adventure",
        quote: "\"The ocean echoes our laughter.\"",
        story: "We drove for 3 hours just to see the sea. You built a sandcastle that looked like a potato, but we loved it anyway. The sunset was magical.",
        location: "Kuta Beach",
        images: [
            { url: "/LiaaZekk.webp", alt: "Beach sunset" },
            { url: "/kucing.webp", alt: "Cat we found" }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    },
    {
        id: "seed-3",
        title: "Random Night Out",
        date: "2023-09-10T00:00:00.000Z",
        category: "Random",
        tags: ["night", "city", "lights"],
        mood: "silly",
        quote: "\"City lights and your bright smile.\"",
        story: "Just walking around the city with no destination. We found that weird statue and took a thousand silly photos.",
        location: "Downtown",
        images: [
            { url: "/zekk_pixel.webp", alt: "Zekk silly face" },
            { url: "/lia_pixel.webp", alt: "Lia laughing" }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
];
