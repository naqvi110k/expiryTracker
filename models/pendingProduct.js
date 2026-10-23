const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * PendingProduct Schema - Temporary storage for products awaiting user confirmation
 * WORKFLOW: Image → Extract → Preview → Confirm/Cancel → Save/Delete
 * TTL INDEX: Auto-deletes after 24 hours via MongoDB TTL daemon
 * SECURITY: All queries must filter by userId for multi-tenancy
 */
const pendingProductSchema = new Schema({
    name: { type: String, default: 'Unknown Product', maxlength: 100, trim: true },
    batchNumber: { type: String, default: '', maxlength: 50, trim: true },
    manufacturingDate: { type: Date, default: null },
    expiryDate: { type: Date, default: null },
    quantity: { type: Number, default: 1, min: 1, max: 999999 },
    unit: { type: String, default: 'units', maxlength: 20, enum: ['units', 'kg', 'g', 'l', 'ml', 'pieces', 'packs', 'boxes'] },
    category: { type: String, default: 'Uncategorized', maxlength: 50, trim: true },
    description: { type: String, default: '', maxlength: 500, trim: true },
    storageLocation: { type: String, default: '', maxlength: 100, trim: true },
    image: { type: String, default: null },
    barcode: { type: String, default: null, maxlength: 100 },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    messageId: { type: String, unique: true, sparse: true, maxlength: 100 }, // Twilio MessageSid - prevents duplicate processing
    expiresAt: { type: Date, required: true, index: true }
}, { timestamps: true });

// Compound index for efficient queries: find pending products for user expiring soon
pendingProductSchema.index({ userId: 1, expiresAt: 1 });

// Index for idempotency: detect duplicate webhook submissions from Twilio
pendingProductSchema.index({ messageId: 1 }, { sparse: true });

// TTL Index: MongoDB automatically deletes documents after expiresAt time
pendingProductSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const PendingProduct = mongoose.model('PendingProduct', pendingProductSchema);

module.exports = PendingProduct;
