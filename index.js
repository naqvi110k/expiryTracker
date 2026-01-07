
// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const cors = require('cors');
const { startNotificationScheduler } = require('./services/notificationScheduler');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

app.use(cors());

// Middleware to parse JSON with increased limit for image uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✓ MongoDB connected'))
    .catch((err) => {
        console.warn('⚠ MongoDB connection failed:', err.message);
        console.warn('  Your IP may need whitelisting: https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.warn('  The server will continue running, but database operations will fail');
    });

// Auth routes
app.use('/api/auth', authRoutes);

// User profile routes
app.use('/api/users', userRoutes);

// Product routes (protected)
app.use('/api/products', productRoutes);

// Notification routes (for manual testing)
app.use('/api/notifications', notificationRoutes);

// Start automated notification scheduler
startNotificationScheduler();

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${PORT}`);
});

// Export for Vercel serverless
module.exports = app;
    