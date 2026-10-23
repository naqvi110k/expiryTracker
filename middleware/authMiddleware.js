const jwt = require('jsonwebtoken');
const twilio = require('twilio');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token =
    authHeader && authHeader.startsWith('Bearer ')
      ? authHeader.split(' ')[1]
      : null;

  if (!token) {
    return res.status(401).json({ error: 'Authorization token missing' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = {
      userId: decoded.userId,
      username: decoded.username,
      phoneNumber: decoded.phoneNumber,
    };
    next();
  } catch (err) {
    console.error('JWT error:', err);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

// Trusting twilio signature using twilio's official validation middleware
const validateTwilioWebhook = twilio.webhook({ validate: true });

module.exports = { authenticateToken, validateTwilioWebhook };


