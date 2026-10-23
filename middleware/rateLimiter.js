const rateLimit = require('express-rate-limit');

/**
 * Rate Limiting Middleware for WhatsApp Webhook
 * 
 * LIMITS:
 * - 10 image uploads per user per hour (prevent API cost explosion)
 * - 30 text messages per user per hour (allow corrections)
 * - Storage: Memory-based (suitable for Vercel serverless)
 * 
 * RESPONSE: 429 Too Many Requests with retry-after header
 * 
 * Future: Move to Redis for distributed rate limiting across multiple instances
 */

// Limit image uploads (high cost due to Gemini API calls + Twilio bandwidth)
const whatsappImageLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // 10 image uploads per user per hour
    keyGenerator: (req) => {
        // Extract phone number from Twilio webhook
        const fromNumber = req.body?.From || 'unknown';
        return fromNumber.replace(/\D/g, ''); // Extract digits only
    },
    message: '⚠️ Too many image uploads. Please wait before sending more.',
    standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
    legacyHeaders: false, // Disable `X-RateLimit-*` headers
    skip: (req) => {
        // Don't rate limit if no image attached
        return !req.body?.NumMedia || req.body.NumMedia === '0';
    },
    handler: async (req, res) => {
        const fromNumber = req.body?.From || 'unknown';
        console.warn(`Rate limit exceeded for WhatsApp image uploads from ${fromNumber}`);
        res.status(429).json({ message: '⚠️ Too many image uploads. Try again in 1 hour.' });
    }
});

// Gentler limit for text messages (corrections, confirmations)
const whatsappTextLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 30, // 30 text messages per user per hour
    keyGenerator: (req) => {
        const fromNumber = req.body?.From || 'unknown';
        return fromNumber.replace(/\D/g, '');
    },
    skip: (req) => {
        // Only rate limit if there's a text body (no image)
        return !req.body?.Body || req.body?.NumMedia > 0;
    }
});

// Rate limiter for contact form submissions
const contactLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 submissions per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: { error: 'Too many contact form submissions from this IP. Please try again after 15 minutes.' }
});

// Rate limiter for general auth endpoints (login, register)
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 20, // 20 attempts per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: {
        error: 'Too many authentication attempts from this IP. Please try again after 15 minutes.',
        message: 'Too many authentication attempts from this IP. Please try again after 15 minutes.'
    }
});

// Stricter rate limiter for sensitive email endpoints (forgot-password, resend-verification)
const emailActionLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // 5 email requests per 15 minutes
    standardHeaders: true,
    legacyHeaders: false,
    validate: { trustProxy: false },
    message: {
        error: 'Too many requests. Please wait 15 minutes before requesting another email.',
        message: 'Too many requests. Please wait 15 minutes before requesting another email.'
    }
});

module.exports = {
    whatsappImageLimiter,
    whatsappTextLimiter,
    contactLimiter,
    authLimiter,
    emailActionLimiter
};
