const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define product schema
const productSchema = new Schema({
    name: { type: String, required: true },
    batchNumber: { type: String, required: true },
    manufacturingDate: { type: Date, default: null },
    expiryDate: { type: Date, required: true },
    quantity: { type: Number, required: true },
    unit: { type: String, default: 'units' },
    category: { type: String, default: 'Uncategorized' },
    description: { type: String, default: '' },
    storageLocation: { type: String, default: '' },
    image: { type: String, default: null }, // Store base64 image data
    userId: { type: Schema.Types.ObjectId, ref: 'User', default: null } // Owner of this product
});

// Create Product model from schema
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
    