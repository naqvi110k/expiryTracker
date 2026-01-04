
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define product schema
const productSchema = new Schema({
    name: { type: String, required: true },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'units' },
    category: { type: String, default: 'Uncategorized' },
    description: { type: String, default: '' },
    image: { type: String, default: null } // Store base64 image data
});

// Create Product model from schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
    