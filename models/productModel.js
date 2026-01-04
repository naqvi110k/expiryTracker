
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define product schema
const productSchema = new Schema({
    name: { type: String, required: true },
    batchNumber: { type: String, required: true },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    category: { type: String, default: 'Uncategorized' },
    description: { type: String, default: '' }
});

// Create Product model from schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
    