require('dotenv').config();
console.log('Starting server initialization...');

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const path = require('path');

const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const fileLogger = require('./utils/logger'); // Import logger

// Import routes
const authRoutes = require('./routes/authRoutes');
const memoryRoutes = require('./routes/memoryRoutes');
const newsRoutes = require('./routes/newsRoutes');
const journeyRoutes = require('./routes/journeyRoutes');
const profileRoutes = require('./routes/profileRoutes');
const contactRoutes = require('./routes/contactRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const travelRoutes = require('./routes/travelRoutes');
const visitorRoutes = require('./routes/visitorRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Trust proxy (required for rate limiter behind Nginx)
app.set('trust proxy', 1);

// ============ MIDDLEWARE ============

// Security Headers
app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }, // Allow cross-origin for static assets
}));

// Access Logging
app.use(fileLogger);

// CORS configuration with credentials
app.use(cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:8080',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Rate Limiting
const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: { error: 'Too many login attempts, please try again after an hour' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/auth/login', loginLimiter);

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', apiLimiter);

// Contact form rate limiter (stricter to prevent email spam)
const contactLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 contact messages per hour
    message: { error: 'Terlalu banyak pesan! Coba lagi nanti ya 💌' },
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api/contact', contactLimiter);

// Parse cookies (for JWT httpOnly cookies)
app.use(cookieParser());

// Parse JSON body
app.use(express.json({ limit: '10mb' }));

// Parse URL-encoded body
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request Logger
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    next();
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ============ ROUTES ============

app.get('/api/test', (req, res) => res.send('API Root Working'));
app.get('/api/news/ping', (req, res) => res.send('News Route Ping'));

console.log("Mounting Auth Routes...");
// Auth routes
app.use('/api/auth', authRoutes);

console.log("Mounting Memory Routes...");
// Memory routes
app.use('/api/memories', memoryRoutes);

console.log("Mounting News Routes...");
// News routes
app.use('/api/news', newsRoutes);

console.log("Mounting Journey Routes...");

// Journey routes
app.use('/api/journey', journeyRoutes);

// Profile routes
app.use('/api/profiles', profileRoutes);

// Contact routes
app.use('/api/contact', contactRoutes);

// Gallery routes
app.use('/api/gallery', galleryRoutes);

// Travel routes
app.use('/api/travel', travelRoutes);

// Visitor routes
app.use('/api/visitors', visitorRoutes);

// Root endpoint
app.get('/', (req, res) => {
    res.json({
        message: 'Zekk & Lia Digital Garden API 💖',
        version: '2.0.0',
        endpoints: {
            auth: '/api/auth',
            memories: '/api/memories',
            news: '/api/news',
            journey: '/api/journey',
            profiles: '/api/profiles',
            contact: '/api/contact',
            gallery: '/api/gallery',
            travel: '/api/travel',
            visitors: '/api/visitors'
        }
    });
});

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ============ ERROR HANDLING ============

// 404 handler
app.use((req, res) => {
    console.log(`[404] Route not found: ${req.method} ${req.url}`);
    res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
    console.error('Server error:', err);

    // Multer errors
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' });
    }
    if (err.code === 'LIMIT_FILE_COUNT') {
        return res.status(400).json({ error: 'Too many files. Maximum is 10 files.' });
    }
    if (err.message?.includes('Invalid file type')) {
        return res.status(400).json({ error: err.message });
    }

    res.status(500).json({ error: 'Internal server error' });
});

// ============ START SERVER ============


const server = app.listen(PORT, () => {
    console.log(`\n🚀 Server running on http://localhost:${PORT}`);
    console.log(`📦 API: http://localhost:${PORT}/api`);
    console.log(`📁 Uploads: http://localhost:${PORT}/uploads`);
    console.log(`\nEndpoints:`);
    console.log(`  • /api/auth      - Authentication`);
    console.log(`  • /api/memories  - Memories CRUD`);
    console.log(`  • /api/news      - News CRUD`);
    console.log(`  • /api/journey   - Journey timeline`);
    console.log(`  • /api/profiles  - Zekk & Lia profiles`);
    console.log(`  • /api/contact   - Contact messages`);
    console.log(`  • /api/gallery   - Image gallery`);
    console.log(`\nEnvironment: ${process.env.NODE_ENV || 'development'}\n`);
});

// Handle server startup errors (e.g. EADDRINUSE)
server.on('error', (error) => {
    console.error('SERVER STARTUP ERROR:', error);
    if (error.code === 'EADDRINUSE') {
        console.error(`Port ${PORT} is already in use. Please stop other processes or change the PORT in .env`);
    }
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
});
