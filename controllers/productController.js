// Controller function to delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    try {
        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(400).json({ error: err.message || 'Error deleting product' });
    }
};

const Product = require('../models/productModel');
const { sendTelegramMessage , sendWhatsApp} = require('../config/twilio');

// Controller function to create a new product
const createProduct = async (req, res) => {
    const { name, batchNumber, expiryDate, quantity } = req.body;
    console.log('Request body:', req.body);

    // Basic validation
    if (!name || !batchNumber || !expiryDate || quantity === undefined) {
        return res.status(400).json({ error: 'All fields are required: name, batchNumber, expiryDate, quantity' });
    }

    try {
        // Check for duplicate product
        const existingProduct = await Product.findOne({ name, batchNumber });
        if (existingProduct) {
            return res.status(409).json({ error: 'Product with the same name and batch number already exists.' });
        }

        const newProduct = new Product({
            name,
            batchNumber,
            expiryDate,
            quantity
        });
        const savedProduct = await newProduct.save();
        res.status(201).json(savedProduct);
    } catch (err) {
        console.error('Error adding product:', err);
        res.status(400).json({ error: err.message || 'Error adding product' });
    }
};

// Controller function to get all products
const getProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (err) {
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Controller function to send Telegram expiry alert
const sendExpiryAlert = async (req, res) => {
    const { productId } = req.body;

    try {
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const message = `🚨 *Expiry Alert*\n\nProduct: ${product.name}\nBatch: ${product.batchNumber}\nExpiry Date: ${product.expiryDate}\nQuantity: ${product.quantity}\n\n⚠️ Please check your stock immediately!`;

        // Send the Telegram message
        // await sendTelegramMessage(message);
        await sendWhatsApp(message);

        res.status(200).json({ message: 'Expiry alert sent to WhatsApp' });
    } catch (err) {
        console.error('Error sending expiry alert:', err);
        res.status(500).json({ error: 'Error sending alert: ' + err.message });
    }
};

module.exports = {
    createProduct,
    getProducts,
    sendExpiryAlert,
    deleteProduct
};
    