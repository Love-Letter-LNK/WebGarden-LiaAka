const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        // Generate unique filename: timestamp-randomstring.ext
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const ext = path.extname(file.originalname);
        cb(null, `memory-${uniqueSuffix}${ext}`);
    }
});

// File filter - only images
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];

    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed.'), false);
    }
};

// Create multer instance
const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB max
        files: 10 // Max 10 files per request
    }
});

/**
 * Delete a file from uploads directory
 * @param {string} filename - The filename to delete
 */
const deleteFile = (filename) => {
    const filepath = path.join(uploadsDir, filename);
    if (fs.existsSync(filepath)) {
        fs.unlinkSync(filepath);
        return true;
    }
    return false;
};

/**
 * Get the URL path for an uploaded file
 * @param {string} filename 
 */
const getFileUrl = (filename) => {
    return `/uploads/${filename}`;
};

/**
 * Extract filename from URL
 * @param {string} url 
 */
const getFilenameFromUrl = (url) => {
    return url.replace('/uploads/', '');
};

module.exports = {
    upload,
    deleteFile,
    getFileUrl,
    getFilenameFromUrl,
    uploadsDir
};
