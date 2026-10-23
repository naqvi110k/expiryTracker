const Product = require('../models/productModel');
const PendingProduct = require('../models/pendingProduct');
const { sendTelegramMessage, sendWhatsApp } = require('../config/twilio');
const User = require('../models/userModel');
const logger = require('../config/logger');
const csvParser = require('csv-parser');
const readXlsxFile = require('read-excel-file/node');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const axios = require('axios');

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
    const { name, batchNumber, manufacturingDate, expiryDate, quantity, unit, category, description, storageLocation, image, barcode } = req.body;
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
            manufacturingDate: manufacturingDate || null,
            expiryDate,
            quantity,
            unit: unit || 'units',
            category: category || 'Uncategorized',
            description: description || '',
            storageLocation: storageLocation || '',
            image: image || null,
            barcode: barcode || null,
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

// Controller function to get pending product for current user (WhatsApp workflow)
const getPendingProduct = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(401).json({ error: 'Unauthorized' });
        }

        const pending = await PendingProduct.findOne({ userId }).lean();

        if (!pending) {
            logger.debug('No pending product found', { userId });
            return res.status(200).json({ pending: null, message: 'No pending product' });
        }

        logger.debug('Pending product retrieved', { userId, pendingId: pending._id });

        const response = {
            pending: {
                _id: pending._id,
                name: pending.name,
                batchNumber: pending.batchNumber,
                expiryDate: pending.expiryDate,
                quantity: pending.quantity,
                unit: pending.unit,
                category: pending.category,
                description: pending.description,
                createdAt: pending.createdAt,
                expiresAt: pending.expiresAt
            }
        };

        res.status(200).json(response);
    } catch (err) {
        logger.error('Error retrieving pending product', err, { userId: req.user?.userId });
        res.status(500).json({ error: err.message || 'Error retrieving pending product' });
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
        const telegramUserId = user?.telegramUserId;

        // Send both WhatsApp and Telegram messages
        if (phoneNumber) {
            await sendWhatsApp(message, phoneNumber);
        }
        if (telegramUserId) {
            await sendTelegramMessage(message, telegramUserId);
        }

        res.status(200).json({
            message: 'Expiry alert sent successfully',
            status: statusMessage,
            daysRemaining: daysDiff,
            channels: {
                whatsapp: !!phoneNumber,
                telegram: !!telegramUserId
            }
        });
    } catch (err) {
        console.error('Error sending expiry alert:', err);
        res.status(500).json({ error: 'Error sending alert: ' + err.message });
    }
};

// Controller function to send Telegram expiry alert only
const sendTelegramAlert = async (req, res) => {
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
        const telegramUserId = user?.telegramUserId;
        await sendTelegramMessage(message, telegramUserId);

        res.status(200).json({
            message: 'Telegram expiry alert sent successfully',
            status: statusMessage,
            daysRemaining: daysDiff,
            channel: 'telegram'
        });
    } catch (err) {
        console.error('Error sending Telegram expiry alert:', err);
        res.status(500).json({ error: 'Error sending Telegram alert: ' + err.message });
    }
};

// Controller function to update a product by ID
const updateProduct = async (req, res) => {
    const { id } = req.params;
    const { name, batchNumber, manufacturingDate, expiryDate, quantity, unit, category, description, storageLocation, image, barcode } = req.body;
    const userId = req.user?.userId;

    // Basic validation
    if (!name || !batchNumber || !expiryDate || quantity === undefined) {
        return res.status(400).json({ error: 'All fields are required: name, batchNumber, expiryDate, quantity' });
    }

    try {
        const updateData = {
            name,
            batchNumber,
            manufacturingDate: manufacturingDate || null,
            expiryDate,
            quantity,
            unit: unit || 'units',
            category: category || 'Uncategorized',
            description: description || '',
            storageLocation: storageLocation || ''
        };

        if (image) {
            updateData.image = image;
        }

        if (barcode !== undefined) {
            updateData.barcode = barcode;
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

// Controller function to lookup product details by barcode
const lookupProductByBarcode = async (req, res) => {
    const { barcode } = req.query;
    const userId = req.user?.userId;

    if (!barcode) {
        return res.status(400).json({ error: 'Barcode is required' });
    }

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated for product lookup' });
    }

    try {
        // First, try Open Food Facts API for food products
        if (barcode.length === 12 || barcode.length === 13) { // UPC or EAN
            try {
                const response = await fetch(`https://world.openfoodfacts.org/api/v0/product/${barcode}.json`);
                const data = await response.json();

                if (data.status === 1 && data.product) {
                    const product = data.product;
                    return res.status(200).json({
                        name: product.product_name || product.generic_name || `Product ${barcode}`,
                        category: product.categories || '',
                        brand: product.brands || '',
                        description: product.ingredients_text || product.description || '',
                        barcode: barcode
                    });
                }
            } catch (error) {
                console.error('Error fetching from Open Food Facts:', error);
            }
        }

        // Second, try Open Beauty Facts API for cosmetics/beauty products
        try {
            const beautyResponse = await fetch(`https://world.openbeautyfacts.org/api/v0/product/${barcode}.json`);
            const beautyData = await beautyResponse.json();

            if (beautyData.status === 1 && beautyData.product) {
                const product = beautyData.product;
                return res.status(200).json({
                    name: product.product_name || product.generic_name || `Product ${barcode}`,
                    category: product.categories || 'Beauty/Cosmetics',
                    brand: product.brands || '',
                    description: product.ingredients_text || product.description || '',
                    barcode: barcode
                });
            }
        } catch (error) {
            console.error('Error fetching from Open Beauty Facts:', error);
        }

        // Third, try Open Pet Food Facts API for pet products
        try {
            const petResponse = await fetch(`https://world.openpetfoodfacts.org/api/v0/product/${barcode}.json`);
            const petData = await petResponse.json();

            if (petData.status === 1 && petData.product) {
                const product = petData.product;
                return res.status(200).json({
                    name: product.product_name || product.generic_name || `Product ${barcode}`,
                    category: product.categories || 'Pet Food',
                    brand: product.brands || '',
                    description: product.ingredients_text || product.description || '',
                    barcode: barcode
                });
            }
        } catch (error) {
            console.error('Error fetching from Open Pet Food Facts:', error);
        }

        // Fourth, try Google Books API for books (ISBN)
        // ISBN-10 or ISBN-13 barcodes are typically 978 or 979 prefixed
        if ((barcode.startsWith('978') || barcode.startsWith('979')) && (barcode.length === 13)) {
            try {
                const bookResponse = await fetch(`https://www.googleapis.com/books/v1/volumes?q=isbn:${barcode}`);
                const bookData = await bookResponse.json();

                if (bookData.totalItems > 0 && bookData.items && bookData.items[0]) {
                    const volumeInfo = bookData.items[0].volumeInfo;
                    return res.status(200).json({
                        name: volumeInfo.title || `Book ${barcode}`,
                        category: volumeInfo.categories ? volumeInfo.categories.join(', ') : 'Books',
                        brand: volumeInfo.publisher || '',
                        description: volumeInfo.description || '',
                        barcode: barcode
                    });
                }
            } catch (error) {
                console.error('Error fetching from Google Books API:', error);
            }
        }

        // If no product found in any database, return a default response
        res.status(200).json({
            name: `Product ${barcode}`,
            category: '',
            brand: '',
            description: '',
            barcode: barcode
        });
    } catch (err) {
        console.error('Error looking up product by barcode:', err);
        res.status(500).json({ error: err.message || 'Error looking up product by barcode' });
    }
};

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, '../uploads');
        // Create uploads directory if it doesn't exist
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `bulk-import-${Date.now()}${path.extname(file.originalname)}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for bulk import files
    fileFilter: (req, file, cb) => {
        const allowedExtensions = ['.csv', '.xlsx', '.xls'];
        const ext = path.extname(file.originalname).toLowerCase();
        if (allowedExtensions.includes(ext)) {
            cb(null, true);
        } else {
            cb(new Error('Only CSV and Excel files (.csv, .xlsx, .xls) are allowed'));
        }
    }
});

// Configure multer for temporary file handling in webhook
const webhookStorage = multer.memoryStorage();
const webhookUpload = multer({
    storage: webhookStorage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit for incoming media
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image/')) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed for webhook upload'));
        }
    }
});

// Controller function to bulk import products from CSV/Excel file
const bulkImportProducts = async (req, res) => {
    const userId = req.user?.userId;

    if (!userId) {
        return res.status(401).json({ error: 'User not authenticated' });
    }

    if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const filePath = req.file.path;
    const fileExtension = path.extname(req.file.originalname).toLowerCase();

    try {
        let products = [];

        if (fileExtension === '.csv') {
            // Parse CSV file
            products = await parseCSVFile(filePath);
        } else if (['.xlsx', '.xls'].includes(fileExtension)) {
            // Parse Excel file
            products = await parseExcelFile(filePath);
        } else {
            return res.status(400).json({ error: 'Invalid file format. Only CSV, XLSX, and XLS files are supported.' });
        }

        // Validate and process each product
        const processedProducts = [];
        const errors = [];

        for (let i = 0; i < products.length; i++) {
            const product = products[i];

            try {
                // Validate required fields
                if (!product.name || !product.batchNumber || !product.expiryDate || product.quantity === undefined) {
                    errors.push({
                        row: i + 1,
                        error: 'Missing required fields: name, batchNumber, expiryDate, quantity'
                    });
                    continue;
                }

                // Validate and format dates
                let formattedExpiryDate = null;
                let formattedManufacturingDate = null;

                if (product.expiryDate) {
                    formattedExpiryDate = new Date(product.expiryDate);
                    if (isNaN(formattedExpiryDate.getTime())) {
                        // Try different date formats
                        formattedExpiryDate = parseDate(product.expiryDate);
                        if (!formattedExpiryDate) {
                            errors.push({
                                row: i + 1,
                                error: 'Invalid expiry date format'
                            });
                            continue;
                        }
                    }
                }

                if (product.manufacturingDate) {
                    formattedManufacturingDate = new Date(product.manufacturingDate);
                    if (isNaN(formattedManufacturingDate.getTime())) {
                        // Try different date formats
                        formattedManufacturingDate = parseDate(product.manufacturingDate);
                        if (!formattedManufacturingDate) {
                            errors.push({
                                row: i + 1,
                                error: 'Invalid manufacturing date format'
                            });
                            continue;
                        }
                    }
                }

                // Check for duplicate product for this user
                const existingProduct = await Product.findOne({
                    name: product.name,
                    batchNumber: product.batchNumber,
                    userId
                });

                if (existingProduct) {
                    errors.push({
                        row: i + 1,
                        error: `Product with name '${product.name}' and batch number '${product.batchNumber}' already exists.`
                    });
                    continue;
                }

                // Create new product object
                const newProduct = {
                    name: product.name,
                    batchNumber: product.batchNumber,
                    manufacturingDate: formattedManufacturingDate,
                    expiryDate: formattedExpiryDate,
                    quantity: parseInt(product.quantity) || 0,
                    unit: product.unit || 'units',
                    category: product.category || 'Uncategorized',
                    description: product.description || '',
                    storageLocation: product.storageLocation || '',
                    image: product.image || null,
                    barcode: product.barcode || null,
                    userId
                };

                // Save to database
                const savedProduct = await new Product(newProduct).save();
                processedProducts.push(savedProduct);

            } catch (error) {
                errors.push({
                    row: i + 1,
                    error: error.message || 'Error processing product'
                });
            }
        }

        // Clean up uploaded file
        fs.unlinkSync(filePath);

        res.status(200).json({
            message: `Successfully imported ${processedProducts.length} products`,
            imported: processedProducts.length,
            errors: errors.length,
            total: products.length,
            errors: errors
        });

    } catch (err) {
        // Clean up uploaded file
        if (filePath && fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        console.error('Error importing products:', err);
        res.status(500).json({ error: err.message || 'Error importing products' });
    }
};

// Helper function to parse CSV file
async function parseCSVFile(filePath) {
    return new Promise((resolve, reject) => {
        const results = [];
        fs.createReadStream(filePath)
            .pipe(csvParser())
            .on('data', (data) => results.push(data))
            .on('end', () => {
                resolve(results);
            })
            .on('error', (error) => {
                reject(error);
            });
    });
}

// Helper function to parse Excel file
function parseExcelFile(filePath) {
    return new Promise((resolve, reject) => {
        try {
            const workbook = XLSX.readFile(filePath);
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const data = XLSX.utils.sheet_to_json(worksheet);
            resolve(data);
        } catch (error) {
            reject(error);
        }
    });
}

// Helper function to parse various date formats
function parseDate(dateStr) {
    if (!dateStr) return null;

    // Convert to string if it's not already
    dateStr = String(dateStr);

    // Remove common prefixes
    let cleanDate = dateStr.replace(/^(exp|exp\.?|expiry|expiry date|exp date)[\s:.-]*/i, '').trim();

    // Try different date patterns
    const patterns = [
        // DD/MM/YYYY or DD-MM-YYYY
        { regex: /(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/, parse: (m) => `${m[3]}-${String(m[2]).padStart(2, '0')}-${String(m[1]).padStart(2, '0')}` },
        // YYYY-MM-DD
        { regex: /(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})/, parse: (m) => `${m[1]}-${String(m[2]).padStart(2, '0')}-${String(m[3]).padStart(2, '0')}` },
        // MM/YYYY or MM-YYYY (use first day of month)
        {
            regex: /(\d{1,2})[\/\-](\d{4})/, parse: (m) => {
                const month = String(m[1]).padStart(2, '0');
                const year = m[2];
                return `${year}-${month}-01`;
            }
        },
        // Month Year format like "December 2025" (use first day of month)
        {
            regex: /(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*[\s\-]*(\d{4})/i, parse: (m) => {
                const months = { jan: 1, feb: 2, mar: 3, apr: 4, may: 5, jun: 6, jul: 7, aug: 8, sep: 9, oct: 10, nov: 11, dec: 12 };
                const month = String(months[m[1].toLowerCase().substring(0, 3)]).padStart(2, '0');
                const year = m[2];
                return `${year}-${month}-01`;
            }
        },
    ];

    for (const { regex, parse } of patterns) {
        const match = cleanDate.match(regex);
        if (match) {
            const parsedDate = parse(match);
            const date = new Date(parsedDate);
            if (!isNaN(date.getTime())) {
                return date;
            }
        }
    }

    // Try standard date parsing
    const date = new Date(cleanDate);
    if (!isNaN(date.getTime())) {
        return date;
    }

    return null;
}

// Import the gemini service
const { extractProductDetails } = require('../services/geminiService');

// New function to handle WhatsApp webhook using Gemini
const handleWhatsAppWebhook = async (req, res) => {
    try {
        console.log('Received WhatsApp webhook:', req.body);

        // Extract message details from Twilio webhook
        const {
            From: fromNumber,
            Body: messageBody,
            NumMedia: numMedia,
            'MediaUrl0': mediaUrl,
            'MediaContentType0': mediaType
        } = req.body;

        console.log('From:', fromNumber);
        console.log('Message:', messageBody);
        console.log('Number of media:', numMedia);

        const phoneNumber = fromNumber?.includes(':') ? fromNumber.split(':')[1] : fromNumber;

        // Process media if present
        if (numMedia > 0 && mediaUrl && mediaType && mediaType.startsWith('image/')) {
            console.log('Processing image attachment with Gemini...');

            // Extract user from phone number - Twilio format is 'whatsapp:+1234567890'
            console.log('Searching for user with phone number:', phoneNumber);

            const user = await User.findOne({ phoneNumber: phoneNumber });
            if (!user) {
                console.error('User not found for phone number:', phoneNumber);
                return res.status(404).send('User not found. Please ensure your WhatsApp number matches your profile number.');
            }

            // Download the image from Twilio
            console.log('Downloading image from:', mediaUrl);
            const imageBuffer = await downloadImage(mediaUrl);
            console.log('Image downloaded successfully, size:', imageBuffer.length);

            // Convert buffer to base64 for MongoDB storage (removes Twilio auth dependency)
            const base64DataUri = `data:${mediaType};base64,${imageBuffer.toString('base64')}`;

            // Extract product details using Gemini
            console.log('Starting Gemini analysis with MIME type:', mediaType);
            const productDetails = await extractProductDetails(imageBuffer.toString('base64'), mediaType);
            console.log('Product details extracted by Gemini:', productDetails);

            // Validate that we have essential product information
            if (!productDetails.productName || productDetails.productName === 'Not found') {
                productDetails.productName = 'Unknown Product';
            }

            if (!productDetails.batchNumber || productDetails.batchNumber === 'Not found') {
                productDetails.batchNumber = generateBatchNumber();
            }

            // Handle Expiry Date - provide a default if not found since it's required in model
            let expiryDate = null;
            if (productDetails.expiryDate && productDetails.expiryDate !== 'Not found') {
                expiryDate = parseDate(productDetails.expiryDate);
            }

            if (!expiryDate) {
                console.log('Expiry date not found or invalid, setting default to 30 days from now');
                expiryDate = new Date();
                expiryDate.setDate(expiryDate.getDate() + 30); // Default to 30 days
            }

            // Check if product with same name and batch already exists for this user
            const existingProduct = await Product.findOne({
                name: productDetails.productName,
                batchNumber: productDetails.batchNumber,
                userId: user._id
            });

            if (existingProduct) {
                console.log('Product already exists, skipping addition:', existingProduct._id);
                const duplicateMessage = `ℹ️ This product (${productDetails.productName}, Batch: ${productDetails.batchNumber}) is already in your inventory.`;
                await sendWhatsApp(duplicateMessage, phoneNumber);
                return res.status(200).send('Product already exists');
            }

            // Create a new product
            const newProduct = new Product({
                name: productDetails.productName,
                batchNumber: productDetails.batchNumber,
                manufacturingDate: null,
                expiryDate: expiryDate,
                quantity: productDetails.quantity !== 'Not found' ? parseInt(productDetails.quantity) || 1 : 1,
                unit: productDetails.quantity !== 'Not found' ? extractUnit(productDetails.quantity) || 'units' : 'units',
                category: productDetails.category !== 'Not found' ? productDetails.category : 'Uncategorized',
                description: productDetails.description !== 'Not found' ? productDetails.description : 'Added via WhatsApp',
                storageLocation: '',
                image: base64DataUri,
                barcode: null,
                userId: user._id
            });

            const savedProduct = await newProduct.save();
            console.log('Product added via WhatsApp:', savedProduct);

            // Send confirmation message back to WhatsApp
            const confirmationMessage = `✅ Product added successfully!

Name: ${savedProduct.name}
Batch: ${savedProduct.batchNumber}
Expiry: ${savedProduct.expiryDate ? new Date(savedProduct.expiryDate).toLocaleDateString() : 'N/A'}
Qty: ${savedProduct.quantity}`;

            // Send WhatsApp message back to confirm
            await sendWhatsApp(confirmationMessage, phoneNumber);

            res.status(200).send('Product added successfully');
        } else if (messageBody && messageBody.trim()) {
            // Handle text-only messages
            console.log('Processing text message:', messageBody);

            // You could parse text commands here, e.g., "ADD: Milk, batch123, 2023-12-31"
            if (messageBody.toLowerCase().startsWith('add:')) {
                // Parse command to add a product
                const productData = parseAddCommand(messageBody);

                // Find user by phone number - Twilio format is 'whatsapp:+1234567890'
                console.log('Searching for user with phone number:', phoneNumber);

                const user = await User.findOne({ phoneNumber: phoneNumber });
                if (!user) {
                    console.error('User not found for phone number:', phoneNumber);
                    return res.status(404).send('User not found. Please ensure your WhatsApp number matches your profile number.');
                }

                // Check for duplicate product
                const existingProduct = await Product.findOne({
                    name: productData.name,
                    batchNumber: productData.batchNumber,
                    userId: user._id
                });

                if (existingProduct) {
                    console.log('Product already exists (text command), skipping:', existingProduct._id);
                    const duplicateMessage = `ℹ️ This product (${productData.name}, Batch: ${productData.batchNumber}) is already in your inventory.`;
                    await sendWhatsApp(duplicateMessage, phoneNumber);
                    return res.status(200).send('Product already exists');
                }

                const newProduct = new Product({
                    name: productData.name,
                    batchNumber: productData.batchNumber,
                    manufacturingDate: productData.manufacturingDate || null,
                    expiryDate: productData.expiryDate,
                    quantity: productData.quantity || 1,
                    unit: productData.unit || 'units',
                    category: productData.category || 'Uncategorized',
                    description: productData.description || 'Added via WhatsApp',
                    storageLocation: productData.storageLocation || '',
                    image: null,
                    barcode: productData.barcode || null,
                    userId: user._id
                });

                const savedProduct = await newProduct.save();
                console.log('Product added via text command:', savedProduct);

                // Send confirmation message
                const confirmationMessage = `✅ Product added successfully!

Name: ${savedProduct.name}
Batch: ${savedProduct.batchNumber}
Expiry: ${savedProduct.expiryDate ? new Date(savedProduct.expiryDate).toLocaleDateString() : 'N/A'}
Qty: ${savedProduct.quantity}`;

                await sendWhatsApp(confirmationMessage, phoneNumber);

                res.status(200).send('Product added successfully');
            } else {
                // Send help message
                const helpMessage = '📸 To add a product, send an image of the product/package showing name and expiry date.\n\n📝 Or use command: ADD: Product Name, Batch Number, Expiry Date, Quantity';
                await sendWhatsApp(helpMessage, phoneNumber);
                res.status(200).send('Help message sent');
            }
        } else {
            // No media or meaningful text
            const helpMessage = '📸 To add a product, send an image of the product/package showing name and expiry date.\n\n📝 Or use command: ADD: Product Name, Batch Number, Expiry Date, Quantity';
            await sendWhatsApp(helpMessage, phoneNumber);
            res.status(200).send('Help message sent');
        }
    } catch (error) {
        console.error('Error handling WhatsApp webhook:', error);

        // Send error message to user
        try {
            const phoneNumber = req.body.From.includes(':') ? req.body.From.split(':')[1] : req.body.From;
            // Send longer error message to see the full Google error
            const errorMessage = `❌ AI Error: ${error.message.substring(0, 200)}${error.message.length > 200 ? '...' : ''}`;
            await sendWhatsApp(errorMessage, phoneNumber);
        } catch (sendError) {
            console.error('Error sending error message to user:', sendError);
        }

        res.status(500).send('Error processing message');
    }
};

// Helper function to download image from URL
async function downloadImage(url) {
    try {
        const config = {
            responseType: 'arraybuffer',
            timeout: 10000 // 10 second timeout for download
        };

        // Add Twilio Basic Auth if it's a Twilio URL and we have credentials
        if (url.includes('twilio.com') && process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN) {
            config.auth = {
                username: process.env.TWILIO_ACCOUNT_SID,
                password: process.env.TWILIO_AUTH_TOKEN
            };
        }

        const response = await axios.get(url, config);
        return Buffer.from(response.data, 'binary');
    } catch (error) {
        console.error('Error downloading image:', {
            message: error.message,
            url: url,
            status: error.response?.status,
            data: error.response?.data?.toString()
        });
        throw new Error(`Failed to download image from WhatsApp: ${error.message}`);
    }
}

// Helper function to extract unit from quantity string
function extractUnit(quantityStr) {
    if (!quantityStr || typeof quantityStr !== 'string') return null;

    // Look for common units
    const unitPatterns = [
        /g$/, // grams
        /kg$/, // kilograms
        /ml$/, // milliliters
        /l$/, // liters
        /pieces?$/, // pieces
        /units?$/, // units
        /boxes?$/, // boxes
        /packs?$/ // packs
    ];

    for (const pattern of unitPatterns) {
        const match = quantityStr.match(pattern);
        if (match) {
            return match[0];
        }
    }

    return null;
}

// Helper function to parse ADD command
function parseAddCommand(command) {
    // Example: "ADD: Milk, batch123, 2023-12-31, 10"
    const parts = command.substring(4).split(',').map(p => p.trim()); // Remove "ADD:" prefix

    return {
        name: parts[0] || 'Unknown Product',
        batchNumber: parts[1] || generateBatchNumber(),
        expiryDate: parts[2] ? parseDate(parts[2]) : null,
        quantity: parts[3] ? parseInt(parts[3]) : 1
    };
}

// Helper function to generate a random batch number
function generateBatchNumber() {
    return 'BATCH-' + Date.now().toString(36).toUpperCase();
}

// Extract product details from image using Gemini AI
const extractProductFromImage = async (req, res) => {
    try {
        const { image, mimeType } = req.body;
        if (!image) {
            return res.status(400).json({ success: false, message: 'Image data is required' });
        }

        // Detect mimeType if included in data URL (e.g. data:image/png;base64,...)
        let detectedMimeType = mimeType || 'image/jpeg';
        if (typeof image === 'string' && image.startsWith('data:')) {
            const matches = image.match(/^data:([^;]+);base64,/);
            if (matches && matches[1]) {
                detectedMimeType = matches[1];
            }
        }

        const productDetails = await extractProductDetails(image, detectedMimeType);
        return res.status(200).json(productDetails);
    } catch (error) {
        console.error('Error extracting product details from image:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Failed to extract product details from image'
        });
    }
};

module.exports = {
    createProduct,
    getProducts,
    getPendingProduct,
    sendExpiryAlert,
    sendTelegramAlert,
    deleteProduct,
    updateProduct,
    lookupProductByBarcode,
    bulkImportProducts,
    extractProductFromImage,
    upload, // Export multer middleware
    handleWhatsAppWebhook, // Export the new webhook handler
    webhookUpload // Export the webhook multer middleware
};
