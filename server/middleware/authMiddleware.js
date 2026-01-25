const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

/**
 * Middleware: Verify JWT token from httpOnly cookie
 * Attaches user to req.user if valid
 */
const requireAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (!token) {
            return res.status(401).json({ error: 'Authentication required' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await prisma.user.findUnique({
            where: { id: decoded.userId },
            select: { id: true, email: true, role: true }
        });

        if (!user) {
            return res.status(401).json({ error: 'User not found' });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth middleware error:', error.message);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};

/**
 * Middleware: Require admin role
 * Must be used AFTER requireAuth
 */
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Admin access required' });
    }

    next();
};

/**
 * Middleware: Optional auth - attach user if token exists, but don't fail
 */
const optionalAuth = async (req, res, next) => {
    try {
        const token = req.cookies?.token;

        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
                select: { id: true, email: true, role: true }
            });
            req.user = user || null;
        } else {
            req.user = null;
        }
    } catch (error) {
        req.user = null;
    }
    next();
};

module.exports = {
    requireAuth,
    requireAdmin,
    optionalAuth
};
