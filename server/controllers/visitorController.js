const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// Parse user agent for device/browser/os info
const parseUserAgent = (ua) => {
    if (!ua) return { deviceType: 'unknown', browser: 'unknown', os: 'unknown' };

    // Device type
    let deviceType = 'desktop';
    if (/mobile/i.test(ua)) deviceType = 'mobile';
    else if (/tablet|ipad/i.test(ua)) deviceType = 'tablet';

    // Browser
    let browser = 'unknown';
    if (/chrome/i.test(ua) && !/edge|opr/i.test(ua)) browser = 'Chrome';
    else if (/firefox/i.test(ua)) browser = 'Firefox';
    else if (/safari/i.test(ua) && !/chrome/i.test(ua)) browser = 'Safari';
    else if (/edge/i.test(ua)) browser = 'Edge';
    else if (/opr|opera/i.test(ua)) browser = 'Opera';

    // OS
    let os = 'unknown';
    if (/windows/i.test(ua)) os = 'Windows';
    else if (/macintosh|mac os/i.test(ua)) os = 'MacOS';
    else if (/linux/i.test(ua)) os = 'Linux';
    else if (/android/i.test(ua)) os = 'Android';
    else if (/iphone|ipad/i.test(ua)) os = 'iOS';

    return { deviceType, browser, os };
};

// GET /api/visitors/stats - Get public visitor count
exports.getStats = async (req, res) => {
    try {
        let stats = await prisma.siteStats.findUnique({ where: { id: 'main' } });

        if (!stats) {
            stats = await prisma.siteStats.create({
                data: { id: 'main', totalVisitors: 0, uniqueToday: 0 }
            });
        }

        // Check if we need to reset daily count
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (new Date(stats.lastResetDate) < today) {
            stats = await prisma.siteStats.update({
                where: { id: 'main' },
                data: { uniqueToday: 0, lastResetDate: today }
            });
        }

        res.json({
            total: stats.totalVisitors,
            today: stats.uniqueToday
        });
    } catch (error) {
        console.error("Error fetching visitor stats:", error);
        res.status(500).json({ error: "Failed to fetch stats" });
    }
};

// POST /api/visitors/track - Track a visitor
exports.track = async (req, res) => {
    try {
        const ip = req.headers['x-forwarded-for']?.split(',')[0] || req.socket.remoteAddress || 'unknown';
        const userAgent = req.headers['user-agent'] || '';
        const referer = req.headers['referer'] || req.body.referer || null;
        const page = req.body.page || '/';

        const { deviceType, browser, os } = parseUserAgent(userAgent);

        // Check if this IP visited today (for unique count)
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const existingToday = await prisma.visitor.findFirst({
            where: {
                ip,
                createdAt: { gte: today }
            }
        });

        const isUnique = !existingToday;

        // Create visitor record
        await prisma.visitor.create({
            data: {
                ip,
                userAgent: userAgent.substring(0, 500), // Limit length
                page,
                referer,
                deviceType,
                browser,
                os,
                isUnique
            }
        });

        // Update stats
        let stats = await prisma.siteStats.findUnique({ where: { id: 'main' } });

        if (!stats) {
            stats = await prisma.siteStats.create({
                data: { id: 'main', totalVisitors: 1, uniqueToday: isUnique ? 1 : 0 }
            });
        } else {
            // Reset daily count if new day
            const lastReset = new Date(stats.lastResetDate);
            lastReset.setHours(0, 0, 0, 0);

            if (lastReset < today) {
                await prisma.siteStats.update({
                    where: { id: 'main' },
                    data: {
                        totalVisitors: { increment: 1 },
                        uniqueToday: isUnique ? 1 : 0,
                        lastResetDate: today
                    }
                });
            } else {
                await prisma.siteStats.update({
                    where: { id: 'main' },
                    data: {
                        totalVisitors: { increment: 1 },
                        uniqueToday: isUnique ? { increment: 1 } : undefined
                    }
                });
            }
        }

        res.json({ success: true, isUnique });
    } catch (error) {
        console.error("Error tracking visitor:", error);
        res.status(500).json({ error: "Failed to track" });
    }
};

// GET /api/visitors - Admin: Get all visitors (paginated)
exports.list = async (req, res) => {
    try {
        const { page = 1, limit = 50, today = false } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        let where = {};
        if (today === 'true') {
            const todayStart = new Date();
            todayStart.setHours(0, 0, 0, 0);
            where.createdAt = { gte: todayStart };
        }

        const [visitors, total] = await Promise.all([
            prisma.visitor.findMany({
                where,
                orderBy: { createdAt: 'desc' },
                take: parseInt(limit),
                skip
            }),
            prisma.visitor.count({ where })
        ]);

        res.json({
            visitors,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / parseInt(limit))
        });
    } catch (error) {
        console.error("Error fetching visitors:", error);
        res.status(500).json({ error: "Failed to fetch visitors" });
    }
};

// GET /api/visitors/analytics - Admin: Get visitor analytics
exports.analytics = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        weekAgo.setHours(0, 0, 0, 0);

        // Get stats
        const stats = await prisma.siteStats.findUnique({ where: { id: 'main' } });

        // Get counts
        const todayCount = await prisma.visitor.count({
            where: { createdAt: { gte: today } }
        });

        const uniqueTodayCount = await prisma.visitor.count({
            where: { createdAt: { gte: today }, isUnique: true }
        });

        const weekCount = await prisma.visitor.count({
            where: { createdAt: { gte: weekAgo } }
        });

        // Device breakdown
        const byDevice = await prisma.visitor.groupBy({
            by: ['deviceType'],
            _count: true,
            where: { createdAt: { gte: weekAgo } }
        });

        // Browser breakdown
        const byBrowser = await prisma.visitor.groupBy({
            by: ['browser'],
            _count: true,
            where: { createdAt: { gte: weekAgo } }
        });

        // Top pages
        const byPage = await prisma.visitor.groupBy({
            by: ['page'],
            _count: true,
            where: { createdAt: { gte: weekAgo } },
            orderBy: { _count: { page: 'desc' } },
            take: 10
        });

        // Recent unique visitors
        const recentUnique = await prisma.visitor.findMany({
            where: { isUnique: true },
            orderBy: { createdAt: 'desc' },
            take: 20,
            select: {
                id: true,
                ip: true,
                deviceType: true,
                browser: true,
                os: true,
                page: true,
                createdAt: true
            }
        });

        res.json({
            total: stats?.totalVisitors || 0,
            today: todayCount,
            uniqueToday: uniqueTodayCount,
            thisWeek: weekCount,
            byDevice: byDevice.map(d => ({ type: d.deviceType, count: d._count })),
            byBrowser: byBrowser.map(b => ({ browser: b.browser, count: b._count })),
            topPages: byPage.map(p => ({ page: p.page, count: p._count })),
            recentUnique
        });
    } catch (error) {
        console.error("Error fetching analytics:", error);
        res.status(500).json({ error: "Failed to fetch analytics" });
    }
};

// DELETE /api/visitors/clear - Admin: Clear old visitor logs
exports.clearOld = async (req, res) => {
    try {
        const { days = 30 } = req.body;
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - parseInt(days));

        const deleted = await prisma.visitor.deleteMany({
            where: { createdAt: { lt: cutoff } }
        });

        res.json({ message: `Deleted ${deleted.count} old visitor logs` });
    } catch (error) {
        console.error("Error clearing visitors:", error);
        res.status(500).json({ error: "Failed to clear" });
    }
};
