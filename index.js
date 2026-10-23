
// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cache = require('./services/productDetailsCache');

const cors = require('cors');
const connectDB = require('./config/db');
const { startNotificationScheduler } = require('./services/notificationScheduler');
const emailService = require('./services/emailService');
const ContactMessage = require('./models/contactModel');
const { contactLimiter } = require('./middleware/rateLimiter');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Trust reverse proxies (e.g. Vercel, Ngrok) so req.protocol and req.hostname are accurate for Twilio signature validation
app.set('trust proxy', 1);

// Redirect Vercel default domain and WWW to the primary custom domain in production
app.use((req, res, next) => {
  const host = req.headers.host || '';
  if (host.includes('expirytracker.vercel.app') || host.startsWith('www.')) {
    return res.redirect(301, `https://expiry-tracker.live${req.originalUrl}`);
  }
  next();
});

// Security headers middleware
app.use((req, res, next) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  res.setHeader('Permissions-Policy', 'camera=(self), microphone=(), geolocation=()');
  next();
});

// Restrict CORS to only the configured frontend origin
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173')
  .split(',')
  .map(o => o.trim().replace(/\/+$/, ''));

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (e.g. mobile apps, curl, Postman)
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      if (process.env.NODE_ENV !== 'test') {
        console.warn(`CORS: origin '${origin}' not allowed`);
      }
      callback(null, false); // Don't throw an error, just return false to block CORS headers
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'X-CSRF-Token', 'X-Api-Version']
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

// Global middleware to parse JSON and urlencoded with a tight limit (1mb) to prevent DoS
app.use(bodyParser.json({ limit: '1mb' }));
app.use(bodyParser.urlencoded({ limit: '1mb', extended: true }));

// Commit 1: gzip/Brotli compression for all HTML, JS, CSS, and API responses
// Reduces transfer size by up to 70% and improves Core Web Vitals (LCP, TBT)
const compression = require('compression');
app.use(compression());



// Middleware to ensure DB connection
app.use(async (req, res, next) => {
  if (process.env.NODE_ENV === 'test') {
    return next();
  }
  try {
    // Check if already connected
    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    next();
  } catch (err) {
    console.error('Database connection error:', err);
    return res.status(500).json({ error: 'Database connection failed' });
  }
});

// Commit 5: Prevent browsers, Vercel Edge CDN, and the SW from caching any API response
app.use('/api', (req, res, next) => {
  res.set('Cache-Control', 'no-store, no-cache, must-revalidate');
  res.set('Pragma', 'no-cache');
  next();
});

// Auth routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/users', userRoutes);

// Product routes (protected)
app.use('/api/products', productRoutes);

// Notification routes
app.use('/api/notifications', notificationRoutes);

// Vercel Cron endpoint: sends the daily expiry alerts (WhatsApp + Telegram).
// The node-cron scheduler in services/notificationScheduler.js only runs on
// an always-on server; on Vercel (serverless) this endpoint is the trigger
// instead. It is configured in vercel.json under "crons" and runs once a
// day. Vercel sends the CRON_SECRET project env var as
// "Authorization: Bearer <CRON_SECRET>" on cron invocations.
// The endpoint fails closed: until CRON_SECRET is set in the Vercel project
// settings it refuses every request, so it can never be triggered publicly.
app.get('/api/cron/daily-alerts', async (req, res) => {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(503).json({ error: 'CRON_SECRET is not configured' });
  }
  if (req.headers.authorization !== `Bearer ${secret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  try {
    const { sendDailyExpiryAlerts } = require('./services/notificationScheduler');
    await sendDailyExpiryAlerts();
    return res.status(200).json({ success: true, message: 'Daily expiry alerts processed' });
  } catch (error) {
    console.error('Cron daily-alerts error:', error.message);
    return res.status(500).json({ error: 'Failed to process daily alerts' });
  }
});

// Contact form API (public submissions)
app.post('/api/contact', contactLimiter, async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !subject || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ error: 'Please provide a valid email address' });
    }
    if (message.length < 10) {
      return res.status(400).json({ error: 'Message must be at least 10 characters long' });
    }

    // Persist to database so messages are never lost
    const newContact = new ContactMessage({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });
    await newContact.save();

    // Deliver notification email asynchronously
    emailService.sendContactNotification({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    }).catch(err => console.error('Contact email sending error:', err));

    console.log(`[Contact Form Submission] Received message from ${email.trim().toLowerCase()} at ${new Date().toISOString()}`);

    return res.status(200).json({
      success: true,
      message: 'Thank you for reaching out to us. We have received your message and will get back to you shortly.'
    });
  } catch (error) {
    console.error('Error handling contact form submission:', error.message);
    return res.status(500).json({
      error: 'Unable to send your message right now. Please try again later.'
    });
  }
});


// Start automated notification scheduler
// Note: In production environments like Vercel, cron jobs need to be handled differently
// Consider using a separate service or scheduled function
// To enable scheduler in production, set ENABLE_SCHEDULER_IN_PRODUCTION=true
if (process.env.NODE_ENV !== 'test' && (process.env.NODE_ENV !== 'production' || process.env.ENABLE_SCHEDULER_IN_PRODUCTION === 'true')) {
  startNotificationScheduler();
}

// Initialize Gemini AI caching
// Cache extracted product details for 5 minutes to avoid redundant API calls
if (process.env.NODE_ENV !== 'test') {
  cache.startCleanupTimer();
  console.log('Product details caching initialized (5 minute TTL)');
}

// Start the server if running directly (for local development)
if (require.main === module) {
  const PORT = process.env.PORT || 5000;

  // Connect to database and start server
  connectDB()
    .then(async () => {
      // Test email service
      try {
        console.log('Testing email service connection...');
        const emailReady = await emailService.testConnection();
        console.log(`Email service status: ${emailReady ? 'Ready' : 'Not ready'}`);
      } catch (emailErr) {
        console.error('Error testing email service:', emailErr.message);
      }

      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server is running on port ${PORT}`);
      });
    })
    .catch(err => {
      console.error('Failed to connect to database:', err);
      process.exit(1);
    });
}

// Serve static files from the frontend build directory
// In Vercel, the built frontend files will be available in different locations depending on the environment
let frontendDist;

// Check for the frontend dist in various possible locations
if (fs.existsSync(path.join(__dirname, 'frontend', 'dist'))) {
  // Local development or certain build setups
  frontendDist = path.join(__dirname, 'frontend', 'dist');
} else if (fs.existsSync(path.join(process.cwd(), 'frontend', 'dist'))) {
  // Vercel or other hosting platforms
  frontendDist = path.join(process.cwd(), 'frontend', 'dist');
} else if (fs.existsSync(path.join(__dirname, 'dist'))) {
  // If the frontend dist was copied to root during build
  frontendDist = path.join(__dirname, 'dist');
} else {
  console.log('Frontend build directory not found in expected locations');
  frontendDist = null;
}

// Commit 6: Correct cache headers for static files
// - index.html: no-cache (always revalidate so new deploys are picked up)
// - hashed assets (JS/CSS/images): immutable 1-year cache (safe — hash changes on update)
if (frontendDist) {
  app.use(express.static(frontendDist, {
    fallthrough: true,
    setHeaders(res, filePath) {
      if (filePath.endsWith('.html')) {
        res.set('Cache-Control', 'no-cache');
      } else {
        res.set('Cache-Control', 'public, max-age=31536000, immutable');
      }
    }
  }));
  console.log('Serving static files from:', frontendDist);
} else {
  console.log('Static file serving disabled - frontend build not found');
}

// Handle client-side routing by serving index.html for non-API routes that aren't static files
app.get(/^(?!\/api\/)/, (req, res) => {
  // For all non-API routes, serve the frontend
  let indexPath;

  // Look for index.html in the same locations we checked for static files
  if (frontendDist && fs.existsSync(path.join(frontendDist, 'index.html'))) {
    indexPath = path.join(frontendDist, 'index.html');
  } else if (fs.existsSync(path.join(__dirname, 'frontend', 'dist', 'index.html'))) {
    indexPath = path.join(__dirname, 'frontend', 'dist', 'index.html');
  } else if (fs.existsSync(path.join(process.cwd(), 'frontend', 'dist', 'index.html'))) {
    indexPath = path.join(process.cwd(), 'frontend', 'dist', 'index.html');
  } else if (fs.existsSync(path.join(__dirname, 'dist', 'index.html'))) {
    indexPath = path.join(__dirname, 'dist', 'index.html');
  } else {
    // If we can't find index.html, return a 404
    res.status(404).send('Page not found');
    return;
  }

  res.sendFile(indexPath);
});

// Export for Vercel serverless
module.exports = app;
