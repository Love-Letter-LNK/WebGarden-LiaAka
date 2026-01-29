const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const { sendNotification } = require('../services/emailService');

// ============ PUBLIC ENDPOINTS ============

/**
 * POST /api/contact
 * Submit a contact message (public)
 */
const submitMessage = async (req, res) => {
    try {
        const { recipient, message, senderName, senderEmail } = req.body;

        if (!recipient || !message) {
            return res.status(400).json({ error: 'Recipient and message are required' });
        }

        if (!['aka', 'lia'].includes(recipient)) {
            return res.status(400).json({ error: 'Invalid recipient. Must be "aka" or "lia"' });
        }

        const contact = await prisma.contactMessage.create({
            data: {
                recipient,
                message,
                senderName: senderName || null,
                senderEmail: senderEmail || null
            }
        });

        // Send Email Notification
        const notificationSubject = `New Contact Message for ${recipient.toUpperCase()}`;
        const notificationText = `From: ${senderName || 'Anonymous'} (${senderEmail || 'No Email'})\n\nMessage:\n${message}`;
        sendNotification(notificationSubject, notificationText, null, recipient).catch(err => console.error("Email fail:", err));

        res.status(201).json({ message: 'Message sent successfully!', id: contact.id });
    } catch (error) {
        console.error('Submit message error:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
};

// ============ ADMIN ENDPOINTS ============

/**
 * GET /api/contact
 * List all messages - Admin only
 */
const listMessages = async (req, res) => {
    try {
        const { recipient, unreadOnly } = req.query;

        const where = {};
        if (recipient) where.recipient = recipient;
        if (unreadOnly === 'true') where.isRead = false;

        const messages = await prisma.contactMessage.findMany({
            where,
            orderBy: { createdAt: 'desc' }
        });

        res.json(messages);
    } catch (error) {
        console.error('List messages error:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
};

/**
 * GET /api/contact/:id
 * Get single message - Admin only
 */
const getMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const message = await prisma.contactMessage.findUnique({ where: { id } });

        if (!message) {
            return res.status(404).json({ error: 'Message not found' });
        }

        res.json(message);
    } catch (error) {
        console.error('Get message error:', error);
        res.status(500).json({ error: 'Failed to fetch message' });
    }
};

/**
 * PATCH /api/contact/:id/read
 * Mark message as read - Admin only
 */
const markAsRead = async (req, res) => {
    try {
        const { id } = req.params;

        const message = await prisma.contactMessage.update({
            where: { id },
            data: { isRead: true }
        });

        res.json(message);
    } catch (error) {
        console.error('Mark as read error:', error);
        res.status(500).json({ error: 'Failed to update message' });
    }
};

/**
 * DELETE /api/contact/:id
 * Delete message - Admin only
 */
const deleteMessage = async (req, res) => {
    try {
        const { id } = req.params;

        const existing = await prisma.contactMessage.findUnique({ where: { id } });
        if (!existing) {
            return res.status(404).json({ error: 'Message not found' });
        }

        await prisma.contactMessage.delete({ where: { id } });
        res.json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error('Delete message error:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
};

/**
 * GET /api/contact/stats
 * Get message stats - Admin only
 */
const getStats = async (req, res) => {
    try {
        const [total, unread, toAka, toLia] = await Promise.all([
            prisma.contactMessage.count(),
            prisma.contactMessage.count({ where: { isRead: false } }),
            prisma.contactMessage.count({ where: { recipient: 'aka' } }),
            prisma.contactMessage.count({ where: { recipient: 'lia' } })
        ]);

        res.json({ total, unread, toAka, toLia });
    } catch (error) {
        console.error('Get stats error:', error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
};

/**
 * POST /api/contact/guestbook-notify
 * Send email notification for new guestbook entry
 */
const notifyGuestbook = async (req, res) => {
    try {
        const { name, message } = req.body;
        if (!name || !message) return res.status(400).json({ error: "Missing fields" });

        const subject = `New Guestbook Entry from ${name}`;
        const text = `Name: ${name}\n\nMessage:\n${message}`;

        sendNotification(subject, text).catch(err => console.error("Guestbook email fail:", err));

        res.json({ success: true });
    } catch (error) {
        console.error("Notify guestbook error:", error);
        res.status(500).json({ error: "Notification failed" });
    }
};

module.exports = {
    submitMessage,
    listMessages,
    getMessage,
    markAsRead,
    deleteMessage,
    getStats,
    notifyGuestbook
};
