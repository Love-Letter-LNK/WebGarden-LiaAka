const { PrismaClient } = require('@prisma/client');
const { deleteFile, getFileUrl, getFilenameFromUrl } = require('../middleware/uploadMiddleware');

const prisma = new PrismaClient();

// ============ PUBLIC ENDPOINTS ============

/**
 * GET /api/gallery
 * List all gallery images
 */
const listGallery = async (req, res) => {
    try {
        const { category, limit = 100 } = req.query;

        const where = {};
        if (category) where.category = category;

        const images = await prisma.gallery.findMany({
            where,
            orderBy: { sortOrder: 'asc' },
            take: parseInt(limit)
        });

        res.json(images);
    } catch (error) {
        console.error('List gallery error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery' });
    }
};

/**
 * GET /api/gallery/:id
 * Get single gallery image
 */
const getGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const image = await prisma.gallery.findUnique({ where: { id } });

        if (!image) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        res.json(image);
    } catch (error) {
        console.error('Get gallery item error:', error);
        res.status(500).json({ error: 'Failed to fetch gallery item' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * POST /api/gallery
 * Upload gallery images - Admin only
 * Accepts multipart/form-data with 'images' field
 */
const uploadGallery = async (req, res) => {
    try {
        const { category, alt } = req.body;

        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ error: 'No images uploaded' });
        }

        // Get current max sortOrder
        const lastImage = await prisma.gallery.findFirst({
            orderBy: { sortOrder: 'desc' }
        });
        let sortOrder = lastImage ? lastImage.sortOrder + 1 : 0;

        // Create gallery records
        const images = await Promise.all(
            req.files.map(async (file, index) => {
                return prisma.gallery.create({
                    data: {
                        url: getFileUrl(file.filename),
                        alt: alt || 'Gallery image',
                        category: category || null,
                        year: req.body.year || new Date().getFullYear().toString(),
                        sortOrder: sortOrder + index
                    }
                });
            })
        );

        res.status(201).json(images);
    } catch (error) {
        console.error('Upload gallery error:', error);
        res.status(500).json({ error: 'Failed to upload images' });
    }
};

/**
 * PATCH /api/gallery/:id
 * Update gallery item metadata - Admin only
 */
const updateGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;
        const { alt, category, sortOrder, year } = req.body;

        const existing = await prisma.gallery.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        const image = await prisma.gallery.update({
            where: { id },
            data: {
                ...(alt !== undefined && { alt }),
                ...(category !== undefined && { category }),
                ...(year !== undefined && { year }),
                ...(sortOrder !== undefined && { sortOrder })
            }
        });

        res.json(image);
    } catch (error) {
        console.error('Update gallery item error:', error);
        res.status(500).json({ error: 'Failed to update gallery item' });
    }
};

/**
 * DELETE /api/gallery/:id
 * Delete gallery image - Admin only
 */
const deleteGalleryItem = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.gallery.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Gallery item not found' });
        }

        // Delete file from disk if it's a local upload
        if (existing.url.startsWith('/uploads/')) {
            deleteFile(getFilenameFromUrl(existing.url));
        }

        await prisma.gallery.delete({ where: { id } });
        res.json({ message: 'Gallery item deleted successfully' });
    } catch (error) {
        console.error('Delete gallery item error:', error);
        res.status(500).json({ error: 'Failed to delete gallery item' });
    }
};

module.exports = {
    listGallery,
    getGalleryItem,
    uploadGallery,
    updateGalleryItem,
    deleteGalleryItem
};
