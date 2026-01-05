const Product = require('../models/productModel');
const { sendTelegramMessage, sendWhatsApp } = require('../config/twilio');
const User = require('../models/userModel');

// Controller function to delete a product by ID
const deleteProduct = async (req, res) => {
    const { id } = req.params;
    const userId = req.user?.userId;

    try {
        const deletedProduct = await Product.findOneAndDelete({ _id: id, userId });
        if (!deletedProduct) {
            return res.status(404).json({ error: 'Product not found or not owned by user' });
        }
        res.status(200).json({ message: 'Product deleted successfully' });
    } catch (err) {
        console.error('Error deleting product:', err);
        res.status(400).json({ error: err.message || 'Error deleting product' });
    }
};

// Controller function to create a new product
const createProduct = async (req, res) => {
    const { name, batchNumber, expiryDate, quantity, unit, category, description, image } = req.body;
    const userId = req.user?.userId;
    console.log('Request body:', req.body);

    // Basic validation
    if (!name || !batchNumber || !expiryDate || quantity === undefined) {
        return res.status(400).json({ error: 'All fields are required: name, batchNumber, expiryDate, quantity' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated for product creation' });
    }

    try {
        // Check for duplicate product for this user
        const existingProduct = await Product.findOne({ name, batchNumber, userId });
        if (existingProduct) {
            return res.status(409).json({ error: 'Product with the same name and batch number already exists for this user.' });
        }

        const newProduct = new Product({
            name,
            batchNumber,
            expiryDate,
            quantity,
            unit: unit || 'units',
            category: category || 'Uncategorized',
            description: description || '',
            image: image || null,
            userId
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
    const userId = req.user?.userId;
    try {
        const products = await Product.find({ userId });
        res.status(200).json(products);
    } catch (err) {
        console.error('Error fetching products:', err);
        res.status(500).json({ error: 'Error fetching products' });
    }
};

// Controller function to send Telegram/WhatsApp expiry alert
const sendExpiryAlert = async (req, res) => {
    const { productId } = req.body;
    const userId = req.user?.userId;

    try {
        const product = await Product.findOne({ _id: productId, userId });
        if (!product) {
            return res.status(404).json({ error: 'Product not found or not owned by user' });
        }

        const today = new Date();
        const expiryDate = new Date(product.expiryDate);
        
        // Reset time to midnight for accurate date comparison
        today.setHours(0, 0, 0, 0);
        expiryDate.setHours(0, 0, 0, 0);

        // Calculate difference in milliseconds
        const timeDiff = expiryDate - today;
        const daysDiff = Math.ceil(timeDiff / (1000 * 60 * 60 * 24));

        let statusMessage = '';
        let alertIcon = '';

        if (daysDiff < 0) {
            const daysExpired = Math.abs(daysDiff);
            alertIcon = '❌';
            statusMessage = `*EXPIRED* - ${daysExpired} day${daysExpired !== 1 ? 's' : ''} ago`;
        } else if (daysDiff === 0) {
            alertIcon = '🚨';
            statusMessage = '*EXPIRES TODAY*';
        } else if (daysDiff <= 30) {
            alertIcon = '⚠️';
            statusMessage = `*Expires in ${daysDiff} day${daysDiff !== 1 ? 's' : ''}*`;
        } else if (daysDiff < 365) {
            alertIcon = '⚠️';
            
            const start = new Date(today);
            const end = new Date(expiryDate);
            
            let months = 0;
            let remainingDays = 0;
            
            let tempDate = new Date(start);
            
            while (true) {
                tempDate.setMonth(tempDate.getMonth() + 1);
                if (tempDate <= end) {
                    months++;
                } else {
                    tempDate.setMonth(tempDate.getMonth() - 1);
                    break;
                }
            }
            
            const remainingTime = end - tempDate;
            remainingDays = Math.ceil(remainingTime / (1000 * 60 * 60 * 24));
            
            if (remainingDays < 0) {
                remainingDays = 0;
            }
            
            if (months > 0 && remainingDays > 0) {
                statusMessage = `*Expires in ${months} month${months !== 1 ? 's' : ''} and ${remainingDays} day${remainingDays !== 1 ? 's' : ''}*`;
            } else if (months > 0) {
                statusMessage = `*Expires in ${months} month${months !== 1 ? 's' : ''}*`;
            } else {
                statusMessage = `*Expires in ${remainingDays} day${remainingDays !== 1 ? 's' : ''}*`;
            }
        } else {
            const yearsLeft = Math.floor(daysDiff / 365);
            const remainingDays = daysDiff % 365;
            const remainingMonths = Math.floor(remainingDays / 30);
            const finalDays = remainingDays % 30;
            alertIcon = 'ℹ️';
            
            if (remainingMonths > 0 && finalDays > 0) {
                statusMessage = `Expires in ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''}, ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''} and ${finalDays} day${finalDays !== 1 ? 's' : ''}`;
            } else if (remainingMonths > 0) {
                statusMessage = `Expires in ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''} and ${remainingMonths} month${remainingMonths !== 1 ? 's' : ''}`;
            } else if (finalDays > 0) {
                statusMessage = `Expires in ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''} and ${finalDays} day${finalDays !== 1 ? 's' : ''}`;
            } else {
                statusMessage = `Expires in ${yearsLeft} year${yearsLeft !== 1 ? 's' : ''}`;
            }
        }

        const message = `${alertIcon} *Expiry Alert*

Product: ${product.name}
Category: ${product.category}
Description: ${product.description || 'N/A'}
Batch: ${product.batchNumber}
Expiry Date: ${new Date(product.expiryDate).toLocaleDateString()}
Quantity: ${product.quantity}

Status: ${statusMessage}

⚠️ Please check your stock immediately!`;

        const user = await User.findById(userId);
        const phoneNumber = user?.phoneNumber;

        await sendWhatsApp(message, phoneNumber);

        res.status(200).json({ 
            message: 'Expiry alert sent to WhatsApp',
            status: statusMessage,
            daysRemaining: daysDiff
        });
    } catch (err) {
        console.error('Error sending expiry alert:', err);
        res.status(500).json({ error: 'Error sending alert: ' + err.message });
    }
};

// Controller function to update a product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, batchNumber, expiryDate, quantity, unit, category, description, image } = req.body;
    const userId = req.user?.userId;

    // Basic validation
    if (!name || !batchNumber || !expiryDate || quantity === undefined) {
        return res.status(400).json({ error: 'All fields are required: name, batchNumber, expiryDate, quantity' });
    }

    try {
        const updateData = {
            name,
            batchNumber,
            expiryDate,
            quantity,
            unit: unit || 'units',
            category: category || 'Uncategorized',
            description: description || ''
        };
        
        if (image) {
            updateData.image = image;
        }

        const updated = await Product.findOneAndUpdate(
            { _id: id, userId },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updated) {
            return res.status(404).json({ error: 'Product not found or not owned by user' });
        }

        res.status(200).json(updated);
    } catch (err) {
        console.error('Error updating product:', err);
        res.status(400).json({ error: err.message || 'Error updating product' });
    }
};

module.exports = {
    createProduct,
    getProducts,
    sendExpiryAlert,
    deleteProduct,
    updateProduct
};
    