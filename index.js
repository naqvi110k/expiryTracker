
// Import required libraries
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');

// Load environment variables
dotenv.config();

// Initialize express app
const app = express();

// Middleware to parse JSON
app.use(bodyParser.json());

// MongoDB connection setup
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch((err) => console.log('MongoDB connection error:', err));

// Use product routes
app.use('/api/products', productRoutes);

// Start the server
app.listen(5000, () => {
    console.log('Server is running on port 5000');
});
    