const prisma = require('../utils/prisma');
const { deleteFile, getFileUrl, getFilenameFromUrl } = require('../middleware/uploadMiddleware');

/**
 * Generate URL-friendly slug from title
 */
const generateSlug = (title) => {
    return title
        .toLowerCase()
        .trim()
        .replace(/[^\w\s-]/g, '')
        .replace(/[\s_-]+/g, '-')
        .replace(/^-+|-+$/g, '')
        + '-' + Date.now().toString(36);
};

/**
 * Parse tags string to array
 */
const parseTags = (tags) => {
    if (Array.isArray(tags)) return tags;
    if (typeof tags === 'string') return tags.split(',').map(t => t.trim()).filter(Boolean);
    return [];
};

/**
 * Format memory for response (convert tags string to array)
 */
const formatMemory = (memory) => ({
    ...memory,
    tags: memory.tags ? memory.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    images: memory.images || []
});

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /api/memories
 * List all memories (public)
 */
const listMemories = async (req, res) => {
    try {
        const { category, mood, search, limit = 50, offset = 0 } = req.query;

        const where = {};
        if (category && category !== 'all') where.category = category;
        if (mood && mood !== 'all') where.mood = mood;
        if (search) {
            where.OR = [
                { title: { contains: search } },
                { story: { contains: search } },
                { tags: { contains: search } }
            ];
        }

        const memories = await prisma.memory.findMany({
            where,
            include: { images: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { date: 'desc' },
            take: parseInt(limit),
            skip: parseInt(offset)
        });

        res.json(memories.map(formatMemory));
    } catch (error) {
        console.error('List memories error:', error);
        res.status(500).json({ error: 'Failed to fetch memories' });
    }
};

/**
 * GET /api/memories/:idOrSlug
 * Get single memory by ID or slug (public)
 */
const getMemory = async (req, res) => {
    try {
        const { idOrSlug } = req.params;

        const memory = await prisma.memory.findFirst({
            where: {
                OR: [
                    { id: idOrSlug },
                    { slug: idOrSlug }
                ]
            },
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        res.json(formatMemory(memory));
    } catch (error) {
        console.error('Get memory error:', error);
        res.status(500).json({ error: 'Failed to fetch memory' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * POST /api/memories
 * Create new memory (admin only)
 */
const createMemory = async (req, res) => {
    try {
        const { title, date, category, tags, mood, quote, story, location, images } = req.body;

        if (!title || !date || !category) {
            return res.status(400).json({ error: 'Title, date, and category are required' });
        }

        const slug = generateSlug(title);
        const tagsString = Array.isArray(tags) ? tags.join(',') : (tags || '');

        const memory = await prisma.memory.create({
            data: {
                slug,
                title,
                date: new Date(date),
                category,
                tags: tagsString,
                mood: mood || null,
                quote: quote || null,
                story: story || null,
                location: location || null,
                images: images?.length ? {
                    create: images.map((img, index) => ({
                        url: img.url,
                        alt: img.alt || title,
                        sortOrder: index
                    }))
                } : undefined
            },
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });

        res.status(201).json(formatMemory(memory));
    } catch (error) {
        console.error('Create memory error:', error);
        res.status(500).json({ error: 'Failed to create memory' });
    }
};

/**
 * PATCH /api/memories/:id
 * Update memory (admin only)
 */
const updateMemory = async (req, res) => {
    try {
        const { id } = req.params;
        const { title, date, category, tags, mood, quote, story, location } = req.body;

        // Check if memory exists
        const existing = await prisma.memory.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        const updateData = {};
        if (title !== undefined) updateData.title = title;
        if (date !== undefined) updateData.date = new Date(date);
        if (category !== undefined) updateData.category = category;
        if (tags !== undefined) updateData.tags = Array.isArray(tags) ? tags.join(',') : tags;
        if (mood !== undefined) updateData.mood = mood || null;
        if (quote !== undefined) updateData.quote = quote || null;
        if (story !== undefined) updateData.story = story || null;
        if (location !== undefined) updateData.location = location || null;

        const memory = await prisma.memory.update({
            where: { id },
            data: updateData,
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });

        res.json(formatMemory(memory));
    } catch (error) {
        console.error('Update memory error:', error);
        res.status(500).json({ error: 'Failed to update memory' });
    }
};

/**
 * DELETE /api/memories/:id
 * Delete memory and all associated images (admin only)
 */
const deleteMemory = async (req, res) => {
    try {
        const { id } = req.params;

        // Get memory with images first
        const memory = await prisma.memory.findUnique({
            where: { id },
            include: { images: true }
        });

        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        // Delete image files from disk
        for (const image of memory.images) {
            if (image.url.startsWith('/uploads/')) {
                deleteFile(getFilenameFromUrl(image.url));
            }
        }

        // Delete memory (cascade deletes images in DB)
        await prisma.memory.delete({ where: { id } });

        res.json({ message: 'Memory deleted successfully' });
    } catch (error) {
        console.error('Delete memory error:', error);
        res.status(500).json({ error: 'Failed to delete memory' });
    }
};

// ============ IMAGE ENDPOINTS ============

/**
 * POST /api/memories/:id/images
 * Upload images to a memory (admin only)
 * Expects multipart/form-data with 'images' field
 */
const uploadImages = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if memory exists
        const memory = await prisma.memory.findUnique({ where: { id } });
        if (!memory) {
            return res.status(404).json({ error: 'Memory not found' });
        }

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        // Get current max sortOrder
        const lastImage = await prisma.memoryImage.findFirst({
            where: { memoryId: id },
            orderBy: { sortOrder: 'desc' }
        });
        let sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;

        // Create image records
        const imageRecords = await Promise.all(
            req.files.map(async (file, index) => {
                return prisma.memoryImage.create({
                    data: {
                        memoryId: id,
                        url: getFileUrl(file.filename),
                        alt: memory.title,
                        sortOrder: sortOrder + index
                    }
                });
            })
        );

        res.status(201).json(imageRecords);
    } catch (error) {
        console.error('Upload images error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

/**
 * DELETE /api/memories/:id/images/:imageId
 * Delete a single image (admin only)
 */
const deleteImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        const image = await prisma.memoryImage.findFirst({
            where: { id: imageId, memoryId: id }
        });

        if (!image) {
            return res.status(404).json({ error: 'Image not found' });
        }

        // Delete file from disk
        if (image.url.startsWith('/uploads/')) {
            deleteFile(getFilenameFromUrl(image.url));
        }

        // Delete from database
        await prisma.memoryImage.delete({ where: { id: imageId } });

        res.json({ message: 'Image deleted successfully' });
    } catch (error) {
        console.error('Delete image error:', error);
        res.status(500).json({ error: 'Failed to delete image' });
    }
};

/**
 * PATCH /api/memories/:id/images/reorder
 * Reorder images (admin only)
 * Body: { imageIds: ['id1', 'id2', ...] } in desired order
 */
const reorderImages = async (req, res) => {
    try {
        const { id } = req.params;
        const { imageIds } = req.body;

        if (!Array.isArray(imageIds)) {
            return res.status(400).json({ error: 'imageIds must be an array' });
        }

        // Update sortOrder for each image
        await Promise.all(
            imageIds.map((imageId, index) =>
                prisma.memoryImage.updateMany({
                    where: { id: imageId, memoryId: id },
                    data: { sortOrder: index }
                })
            )
        );

        // Fetch updated images
        const images = await prisma.memoryImage.findMany({
            where: { memoryId: id },
            orderBy: { sortOrder: 'asc' }
        });

        res.json(images);
    } catch (error) {
        console.error('Reorder images error:', error);
        res.status(500).json({ error: 'Failed to reorder images' });
    }
};

module.exports = {
    listMemories,
    getMemory,
    createMemory,
    updateMemory,
    deleteMemory,
    uploadImages,
    deleteImage,
    reorderImages
};
