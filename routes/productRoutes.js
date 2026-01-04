
const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Define routes
router.post('/', productController.createProduct); // Create a new product
router.get('/', productController.getProducts); // Get all products
router.put('/:id', productController.updateProduct); // Update a product by ID
router.post('/alert', productController.sendExpiryAlert); // Send expiry alert
router.delete('/:id', productController.deleteProduct); // Delete a product by ID

module.exports = router;
    