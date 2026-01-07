const cron = require('node-cron');
const Product = require('../models/productModel');
const User = require('../models/userModel');
const { sendWhatsApp } = require('../config/twilio');

// Function to send expiry alerts to all users
const sendDailyExpiryAlerts = async () => {
    console.log('🔔 Running daily expiry alert check...');
    
    try {
        // Get all users
        const users = await User.find({});
        
        for (const user of users) {
            // Get all products for this user
            const products = await Product.find({ userId: user._id });
            
            if (products.length === 0) continue;
            
            // Categorize products by expiry status
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            let expiredProducts = [];
            let criticalProducts = []; // expires in 0-7 days
            let warningProducts = [];  // expires in 8-30 days
            
            products.forEach(product => {
                const expiryDate = new Date(product.expiryDate);
                expiryDate.setHours(0, 0, 0, 0);
                const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
                
                if (daysDiff < 0) {
                    expiredProducts.push({ ...product.toObject(), daysDiff });
                } else if (daysDiff <= 7) {
                    criticalProducts.push({ ...product.toObject(), daysDiff });
                } else if (daysDiff <= 30) {
                    warningProducts.push({ ...product.toObject(), daysDiff });
                }
            });
            
            // Only send message if there are expired or critical products
            const totalAlerts = expiredProducts.length + criticalProducts.length + warningProducts.length;
            
            if (totalAlerts === 0) {
                console.log(`✓ No alerts needed for user: ${user.username}`);
                continue;
            }
            
            // Build message
            let message = `🔔 *Daily Expiry Alert - ${new Date().toLocaleDateString()}*\n\n`;
            message += `Hello ${user.username}! Here's your daily inventory update:\n\n`;
            
            // Expired Products
            if (expiredProducts.length > 0) {
                message += `❌ *EXPIRED PRODUCTS (${expiredProducts.length})*\n`;
                expiredProducts.slice(0, 5).forEach(p => {
                    message += `• ${p.name} (Batch: ${p.batchNumber}) - Expired ${Math.abs(p.daysDiff)} days ago\n`;
                });
                if (expiredProducts.length > 5) {
                    message += `  ... and ${expiredProducts.length - 5} more\n`;
                }
                message += `\n`;
            }
            
            // Critical Products
            if (criticalProducts.length > 0) {
                message += `🚨 *CRITICAL - EXPIRES SOON (${criticalProducts.length})*\n`;
                criticalProducts.slice(0, 5).forEach(p => {
                    message += `• ${p.name} (Batch: ${p.batchNumber}) - ${p.daysDiff} day${p.daysDiff !== 1 ? 's' : ''} left\n`;
                });
                if (criticalProducts.length > 5) {
                    message += `  ... and ${criticalProducts.length - 5} more\n`;
                }
                message += `\n`;
            }
            
            // Warning Products
            if (warningProducts.length > 0) {
                message += `⚠️ *WARNING - EXPIRING IN 30 DAYS (${warningProducts.length})*\n`;
                warningProducts.slice(0, 3).forEach(p => {
                    message += `• ${p.name} (Batch: ${p.batchNumber}) - ${p.daysDiff} days left\n`;
                });
                if (warningProducts.length > 3) {
                    message += `  ... and ${warningProducts.length - 3} more\n`;
                }
                message += `\n`;
            }
            
            message += `📊 *Summary:*\n`;
            message += `Total Products: ${products.length}\n`;
            message += `Expired: ${expiredProducts.length}\n`;
            message += `Critical: ${criticalProducts.length}\n`;
            message += `Warning: ${warningProducts.length}\n\n`;
            message += `⚡ Check your inventory app for full details!`;
            
            // Send WhatsApp message
            if (user.phoneNumber) {
                await sendWhatsApp(message, user.phoneNumber);
                console.log(`✓ Alert sent to ${user.username} (${user.phoneNumber})`);
            } else {
                console.log(`⚠ No phone number for user: ${user.username}`);
            }
            
            // Add delay between messages to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        console.log('✅ Daily expiry alert check completed');
        
    } catch (error) {
        console.error('❌ Error in daily expiry alert:', error);
    }
};

// Schedule job to run every day at 9:00 AM
const startNotificationScheduler = () => {
    // Cron format: minute hour day month weekday
    // '0 9 * * *' means: At 9:00 AM every day
    cron.schedule('0 9 * * *', () => {
        console.log('\n📅 Scheduled task triggered at:', new Date().toLocaleString());
        sendDailyExpiryAlerts();
    }, {
        timezone: "Asia/Karachi" // Adjust to your timezone
    });
    
    console.log('✅ Notification scheduler started - Daily alerts at 9:00 AM');
};

// Manual trigger function for testing
const triggerManualAlert = async () => {
    console.log('🔧 Manual alert triggered');
    await sendDailyExpiryAlerts();
};

module.exports = {
    startNotificationScheduler,
    triggerManualAlert
};
