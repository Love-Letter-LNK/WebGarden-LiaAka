const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /api/journey
 * List all journey milestones
 */
const listJourney = async (req, res) => {
    try {
        const journey = await prisma.journey.findMany({
            orderBy: { sortOrder: 'asc' }
        });
        res.json(journey);
    } catch (error) {
        console.error('List journey error:', error);
        res.status(500).json({ error: 'Failed to fetch journey' });
    }
};

/**
 * GET /api/journey/:id
 * Get single milestone
 */
const getJourney = async (req, res) => {
    try {
        const { id } = req.params;
        const journey = await prisma.journey.findUnique({ where: { id } });
        if (!journey) {
            return res.status(404).json({ error: 'Journey milestone not found' });
        }
        res.json(journey);
    } catch (error) {
        console.error('Get journey error:', error);
        res.status(500).json({ error: 'Failed to fetch journey' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * POST /api/journey
 * Create journey milestone - Admin only
 */
const createJourney = async (req, res) => {
    try {
        const { title, date, description, icon, sortOrder } = req.body;

        if (!title || !date) {
            return res.status(400).json({ error: 'Title and date are required' });
        }

        // Get next sortOrder if not provided
        let order = sortOrder;
        if (order === undefined) {
            const last = await prisma.journey.findFirst({ orderBy: { sortOrder: 'desc' } });
            order = last ? last.sortOrder + 1 : 1;
        }

        const journey = await prisma.journey.create({
            data: {
                title,
                date: new Date(date),
                description: description || null,
                icon: icon || '💕',
                sortOrder: order
            }
        });

        res.status(201).json(journey);
    } catch (error) {
        console.error('Create journey error:', error);
        res.status(500).json({ error: 'Failed to create journey' });
    }
};

/**
 * PATCH /api/journey/:id
 * Update journey milestone - Admin only
 */
const updateJourney = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, description, icon, sortOrder } = req.body;

        const existing = await prisma.journey.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Journey milestone not found' });
        }

        const journey = await prisma.journey.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(date !== undefined && { date: new Date(date) }),
                ...(description !== undefined && { description }),
                ...(icon !== undefined && { icon }),
                ...(sortOrder !== undefined && { sortOrder })
            }
        });

        res.json(journey);
    } catch (error) {
        console.error('Update journey error:', error);
        res.status(500).json({ error: 'Failed to update journey' });
    }
};

/**
 * DELETE /api/journey/:id
 * Delete journey milestone - Admin only
 */
const deleteJourney = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.journey.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Journey milestone not found' });
        }

        await prisma.journey.delete({ where: { id } });
        res.json({ message: 'Journey milestone deleted successfully' });
    } catch (error) {
        console.error('Delete journey error:', error);
        res.status(500).json({ error: 'Failed to delete journey' });
    }
};

module.exports = {
    listJourney,
    getJourney,
    createJourney,
    updateJourney,
    deleteJourney
};
