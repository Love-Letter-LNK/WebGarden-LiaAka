const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /api/profiles
 * List all profiles
 */
const listProfiles = async (req, res) => {
    try {
        const profiles = await prisma.profile.findMany({
            orderBy: { slug: 'asc' }
        });

        // Parse funFacts JSON for each profile
        const formatted = profiles.map(p => ({
            ...p,
            funFacts: p.funFacts ? JSON.parse(p.funFacts) : []
        }));

        res.json(formatted);
    } catch (error) {
        console.error('List profiles error:', error);
        res.status(500).json({ error: 'Failed to fetch profiles' });
    }
};

/**
 * GET /api/profiles/:slug
 * Get single profile by slug (zekk or lia)
 */
const getProfile = async (req, res) => {
    try {
        const { slug } = req.params;
        const profile = await prisma.profile.findUnique({ where: { slug } });

        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        res.json({
            ...profile,
            funFacts: profile.funFacts ? JSON.parse(profile.funFacts) : []
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * PATCH /api/profiles/:slug
 * Update profile - Admin only
 */
const updateProfile = async (req, res) => {
    try {
        const { slug } = req.params;
        const { name, nickname, bio, birthDate, hobbies, likes, loveLanguage, funFacts, avatar, color } = req.body;

        const existing = await prisma.profile.findUnique({ where: { slug } });
        if (!existing) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        // Handle funFacts - convert array to JSON string
        let funFactsJson = undefined;
        if (funFacts !== undefined) {
            funFactsJson = Array.isArray(funFacts) ? JSON.stringify(funFacts) : funFacts;
        }

        const profile = await prisma.profile.update({
            where: { slug },
            data: {
                ...(name !== undefined && { name }),
                ...(nickname !== undefined && { nickname }),
                ...(bio !== undefined && { bio }),
                ...(birthDate !== undefined && { birthDate }),
                ...(hobbies !== undefined && { hobbies }),
                ...(likes !== undefined && { likes }),
                ...(loveLanguage !== undefined && { loveLanguage }),
                ...(funFactsJson !== undefined && { funFacts: funFactsJson }),
                ...(avatar !== undefined && { avatar }),
                ...(color !== undefined && { color })
            }
        });

        res.json({
            ...profile,
            funFacts: profile.funFacts ? JSON.parse(profile.funFacts) : []
        });
    } catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

module.exports = {
    listProfiles,
    getProfile,
    updateProfile
};
