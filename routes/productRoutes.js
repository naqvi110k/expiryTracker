const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { authenticateToken } = require('../middleware/authMiddleware');

// All product routes require authentication
router.use(authenticateToken);

// Define routes
router.get('/', productController.getProducts); // Get all products
router.post('/', productController.createProduct); // Create a new product
router.post('/alert', productController.sendExpiryAlert); // Send expiry alert (must be before /:id routes)
router.put('/:id', productController.updateProduct); // Update a product by ID
router.delete('/:id', productController.deleteProduct); // Delete a product by ID

module.exports = router;
    