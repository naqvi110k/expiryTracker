const express = require('express');
const router = express.Router();
const { sendDailyExpiryAlerts } = require('../services/notificationScheduler');
const { handleWhatsAppWebhook } = require('../controllers/productController');
const { whatsappImageLimiter, whatsappTextLimiter } = require('../middleware/rateLimiter');
const { authenticateToken, validateTwilioWebhook } = require('../middleware/authMiddleware');
const User = require('../models/userModel');

// Admin-protected route to trigger notification manually
router.post('/trigger-daily-alerts', authenticateToken, async (req, res) => {
  try {
    // Verify that the user is authorized to trigger notifications
    const user = await User.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    // For now, allow all authenticated users to trigger notifications
    // In a production environment, you might want to check for admin role
    console.log(`Notification trigger requested by user: ${user.username}`);
    
    console.log('Manual notification trigger received');
    await sendDailyExpiryAlerts();
    res.status(200).json({ message: 'Daily alerts triggered successfully' });
  } catch (error) {
    console.error('Error triggering daily alerts:', error);
    res.status(500).json({ error: 'Failed to trigger daily alerts' });
  }
});

// Route for handling WhatsApp webhooks from Twilio - With rate limiting
// Rate limits: 10 images/hour, 30 text messages/hour to prevent API abuse
router.post('/whatsapp-webhook', validateTwilioWebhook, whatsappImageLimiter, whatsappTextLimiter, handleWhatsAppWebhook);

module.exports = router;