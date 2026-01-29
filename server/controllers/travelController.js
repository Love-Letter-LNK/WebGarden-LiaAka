const prisma = require('../utils/prisma');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '..', 'uploads', 'travel');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Multer config for travel images
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadsDir),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, 'travel-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'), false);
        }
    }
}).array('images', 5); // Max 5 images

// GET /api/travel - List all travel logs with images
exports.list = async (req, res) => {
    try {
        const logs = await prisma.travelLog.findMany({
            include: { images: { orderBy: { sortOrder: 'asc' } } },
            orderBy: { createdAt: 'desc' }
        });
        res.json(logs);
    } catch (error) {
        console.error("Error fetching travel logs:", error);
        res.status(500).json({ error: "Failed to fetch travel logs" });
    }
};

// GET /api/travel/:id - Get single travel log
exports.get = async (req, res) => {
    try {
        const { id } = req.params;
        const log = await prisma.travelLog.findUnique({
            where: { id },
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });
        if (!log) return res.status(404).json({ error: "Travel log not found" });
        res.json(log);
    } catch (error) {
        console.error("Error fetching travel log:", error);
        res.status(500).json({ error: "Failed to fetch travel log" });
    }
};

// POST /api/travel - Create new travel log
exports.create = async (req, res) => {
    try {
        const { name, description, story, date, isVisited, lat, lng, images } = req.body;
        const newLog = await prisma.travelLog.create({
            data: {
                name,
                description,
                story,
                date,
                isVisited: Boolean(isVisited),
                lat: lat ? parseFloat(lat) : null,
                lng: lng ? parseFloat(lng) : null,
                // Allow creating with image URLs directly
                images: images?.length ? {
                    create: images.map((img, index) => ({
                        url: img.url,
                        caption: img.caption || null,
                        sortOrder: index
                    }))
                } : undefined
            },
            include: { images: true }
        });
        res.json(newLog);
    } catch (error) {
        console.error("Error creating travel log:", error);
        res.status(500).json({ error: "Failed to create travel log" });
    }
};

// PUT /api/travel/:id - Update travel log
exports.update = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, story, date, isVisited, lat, lng } = req.body;

        const updatedLog = await prisma.travelLog.update({
            where: { id },
            data: {
                name,
                description,
                story,
                date,
                isVisited: isVisited !== undefined ? Boolean(isVisited) : undefined,
                lat: lat !== undefined ? (lat ? parseFloat(lat) : null) : undefined,
                lng: lng !== undefined ? (lng ? parseFloat(lng) : null) : undefined
            },
            include: { images: { orderBy: { sortOrder: 'asc' } } }
        });
        res.json(updatedLog);
    } catch (error) {
        console.error("Error updating travel log:", error);
        res.status(500).json({ error: "Failed to update travel log" });
    }
};

// DELETE /api/travel/:id - Delete travel log
exports.delete = async (req, res) => {
    try {
        const { id } = req.params;

        // Get images to delete files
        const log = await prisma.travelLog.findUnique({
            where: { id },
            include: { images: true }
        });

        if (log) {
            // Delete image files
            for (const img of log.images) {
                if (img.url.startsWith('/uploads/')) {
                    const filePath = path.join(__dirname, '..', img.url);
                    if (fs.existsSync(filePath)) {
                        fs.unlinkSync(filePath);
                    }
                }
            }
        }

        await prisma.travelLog.delete({ where: { id } });
        res.json({ message: "Travel log deleted successfully" });
    } catch (error) {
        console.error("Error deleting travel log:", error);
        res.status(500).json({ error: "Failed to delete travel log" });
    }
};

// POST /api/travel/:id/images - Upload images to travel log
exports.uploadImages = async (req, res) => {
    upload(req, res, async (err) => {
        if (err) {
            console.error("Upload error:", err);
            return res.status(400).json({ error: err.message || "Upload failed" });
        }

        try {
            const { id } = req.params;

            // Check current image count
            const existing = await prisma.travelImage.count({ where: { travelLogId: id } });
            if (existing + req.files.length > 5) {
                // Delete uploaded files
                req.files.forEach(f => fs.unlinkSync(f.path));
                return res.status(400).json({ error: "Maximum 5 images allowed" });
            }

            // Create image records
            const images = await Promise.all(req.files.map(async (file, index) => {
                return prisma.travelImage.create({
                    data: {
                        url: '/uploads/travel/' + file.filename,
                        sortOrder: existing + index,
                        travelLogId: id
                    }
                });
            }));

            res.json(images);
        } catch (error) {
            console.error("Error saving images:", error);
            res.status(500).json({ error: "Failed to save images" });
        }
    });
};

// DELETE /api/travel/:id/images/:imageId - Delete single image
exports.deleteImage = async (req, res) => {
    try {
        const { id, imageId } = req.params;

        const image = await prisma.travelImage.findFirst({
            where: { id: imageId, travelLogId: id }
        });

        if (!image) {
            return res.status(404).json({ error: "Image not found" });
        }

        // Delete file if local
        if (image.url.startsWith('/uploads/')) {
            const filePath = path.join(__dirname, '..', image.url);
            if (fs.existsSync(filePath)) {
                fs.unlinkSync(filePath);
            }
        }

        await prisma.travelImage.delete({ where: { id: imageId } });
        res.json({ message: "Image deleted" });
    } catch (error) {
        console.error("Error deleting image:", error);
        res.status(500).json({ error: "Failed to delete image" });
    }
};
