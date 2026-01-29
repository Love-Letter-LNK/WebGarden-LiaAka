const { body, validationResult } = require('express-validator');

/**
 * Centralized validation error handler
 */
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            error: 'Validation failed',
            details: errors.array().map(e => e.msg)
        });
    }
    next();
};

// ============ CONTACT MESSAGE VALIDATION ============
const submitMessageValidation = [
    body('recipient')
        .trim()
        .notEmpty().withMessage('Recipient is required')
        .isIn(['aka', 'lia']).withMessage('Recipient must be "aka" or "lia"'),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 5, max: 2000 }).withMessage('Message must be 5-2000 characters')
        .escape(), // sanitize HTML characters
    body('senderName')
        .optional()
        .trim()
        .isLength({ max: 100 }).withMessage('Name must be under 100 characters')
        .escape(),
    body('senderEmail')
        .optional()
        .trim()
        .isEmail().withMessage('Invalid email format')
        .normalizeEmail(),
    handleValidation
];

// ============ GUESTBOOK VALIDATION ============
const guestbookValidation = [
    body('name')
        .trim()
        .notEmpty().withMessage('Name is required')
        .isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters')
        .escape(),
    body('message')
        .trim()
        .notEmpty().withMessage('Message is required')
        .isLength({ min: 5, max: 1000 }).withMessage('Message must be 5-1000 characters')
        .escape(),
    handleValidation
];

module.exports = {
    submitMessageValidation,
    guestbookValidation
};
