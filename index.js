
// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const cors = require('cors');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

app.use(cors());

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✓ MongoDB connected'))
    .catch((err) => {
        console.warn('⚠ MongoDB connection failed:', err.message);
        console.warn('  Your IP may need whitelisting: https://www.mongodb.com/docs/atlas/security-whitelist/');
        console.warn('  The server will continue running, but database operations will fail');
    });

// Use product routes
app.use('/api/products', productRoutes);

// Start the server
app.listen(5000,"0.0.0.0", () => {
    console.log('Server is running on port 5000');
});
    