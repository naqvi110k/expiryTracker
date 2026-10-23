const express = require('express');
const router = express.Router();
const {
    register,
    login,
    verifyEmail,
    resendVerification,
    requestPasswordReset,
    resetPassword
} = require('../controllers/authController');
const { authLimiter, emailActionLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/verify-email/:token', verifyEmail);
router.post('/resend-verification', emailActionLimiter, resendVerification);
router.post('/forgot-password', emailActionLimiter, requestPasswordReset);
router.post('/reset-password/:token', authLimiter, resetPassword);

module.exports = router;


