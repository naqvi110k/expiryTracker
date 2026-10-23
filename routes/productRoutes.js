const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { upload } = productController;
const reportController = require('../controllers/reportController');
const analyticsController = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { whatsappImageLimiter, whatsappTextLimiter } = require('../middleware/rateLimiter');

// All product routes require authentication
router.use(authenticateToken);

// Define routes
router.get('/', productController.getProducts); // Get all products
router.get('/pending', productController.getPendingProduct); // Get current pending product (WhatsApp workflow)
router.post('/', productController.createProduct); // Create a new product
router.post('/extract', express.json({ limit: '10mb' }), productController.extractProductFromImage); // Extract product details from image using Gemini AI
router.get('/lookup', productController.lookupProductByBarcode); // Lookup product by barcode
router.get('/report', reportController.generateExpiryReport); // Generate expiry report PDF
router.post('/alert', productController.sendExpiryAlert); // Send expiry alert (must be before /:id routes)
router.post('/telegram-alert', productController.sendTelegramAlert); // Send Telegram expiry alert
// Analytics routes
router.get('/analytics/expiry-trends', analyticsController.getExpiryTrends);
router.get('/analytics/category-distribution', analyticsController.getCategoryDistribution);
router.get('/analytics/waste-metrics', analyticsController.getWasteMetrics);
router.get('/analytics/inventory-stats', analyticsController.getInventoryStats);
router.get('/analytics/monthly-forecast', analyticsController.getMonthlyExpiryForecast);

// Bulk import route - accepts file uploads
router.post('/bulk-import', upload.single('file'), productController.bulkImportProducts);

// Parameterized product routes
router.put('/:id', productController.updateProduct); // Update a product by ID
router.delete('/:id', productController.deleteProduct); // Delete a product by ID

module.exports = router;
