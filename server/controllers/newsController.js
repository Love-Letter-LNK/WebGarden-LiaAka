const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /api/news
 * List all published news
 */
const listNews = async (req, res) => {
    try {
        const { limit = 50 } = req.query;
        const news = await prisma.news.findMany({
            where: { published: true },
            orderBy: { date: 'desc' },
            take: parseInt(limit)
        });
        res.json(news);
    } catch (error) {
        console.error('List news error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

/**
 * GET /api/news/:id
 * Get single news item
 */
const getNews = async (req, res) => {
    try {
        const { id } = req.params;
        const news = await prisma.news.findUnique({ where: { id } });
        if (!news) {
            return res.status(404).json({ error: 'News not found' });
        }
        res.json(news);
    } catch (error) {
        console.error('Get news error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * GET /api/news/admin/all
 * List all news (including unpublished) - Admin only
 */
const listAllNews = async (req, res) => {
    try {
        const news = await prisma.news.findMany({
            orderBy: { date: 'desc' }
        });
        res.json(news);
    } catch (error) {
        console.error('List all news error:', error);
        res.status(500).json({ error: 'Failed to fetch news' });
    }
};

/**
 * POST /api/news
 * Create news item - Admin only
 */
const createNews = async (req, res) => {
    console.log('createNews controller called with body:', req.body);
    try {
        const { title, date, category, emoji, content, published } = req.body;

        if (!title || !date || !category) {
            return res.status(400).json({ error: 'Title, date, and category are required' });
        }

        const news = await prisma.news.create({
            data: {
                title,
                date: new Date(date),
                category,
                emoji: emoji || '📰',
                content: content || null,
                published: published !== false
            }
        });

        res.status(201).json(news);
    } catch (error) {
        console.error('Create news error:', error);
        res.status(500).json({ error: 'Failed to create news' });
    }
};

/**
 * PATCH /api/news/:id
 * Update news item - Admin only
 */
const updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, category, emoji, content, published } = req.body;

        const existing = await prisma.news.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'News not found' });
        }

        const news = await prisma.news.update({
            where: { id },
            data: {
                ...(title !== undefined && { title }),
                ...(date !== undefined && { date: new Date(date) }),
                ...(category !== undefined && { category }),
                ...(emoji !== undefined && { emoji }),
                ...(content !== undefined && { content }),
                ...(published !== undefined && { published })
            }
        });

        res.json(news);
    } catch (error) {
        console.error('Update news error:', error);
        res.status(500).json({ error: 'Failed to update news' });
    }
};

/**
 * DELETE /api/news/:id
 * Delete news item - Admin only
 */
const deleteNews = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.news.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'News not found' });
        }

        await prisma.news.delete({ where: { id } });
        res.json({ message: 'News deleted successfully' });
    } catch (error) {
        console.error('Delete news error:', error);
        res.status(500).json({ error: 'Failed to delete news' });
    }
};

module.exports = {
    listNews,
    getNews,
    listAllNews,
    createNews,
    updateNews,
    deleteNews
};
