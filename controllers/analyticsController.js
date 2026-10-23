const Product = require('../models/productModel');

/**
 * Get expiry trends - aggregate products by expiry date ranges
 */
const getExpiryTrends = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const trends = {
            expired: 0,
            expiringThisWeek: 0,
            expiringThisMonth: 0,
            expiringNext3Months: 0,
            expiringNext6Months: 0,
            healthy: 0
        };

        products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);

            const diffTime = expiryDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                trends.expired++;
            } else if (diffDays <= 7) {
                trends.expiringThisWeek++;
            } else if (diffDays <= 30) {
                trends.expiringThisMonth++;
            } else if (diffDays <= 90) {
                trends.expiringNext3Months++;
            } else if (diffDays <= 180) {
                trends.expiringNext6Months++;
            } else {
                trends.healthy++;
            }
        });

        res.status(200).json(trends);
    } catch (err) {
        console.error('Error fetching expiry trends:', err);
        res.status(500).json({ error: 'Error fetching expiry trends' });
    }
};

/**
 * Get category distribution - count products by category
 */
const getCategoryDistribution = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId });

        const categoryMap = {};
        let total = products.length;

        products.forEach(product => {
            const category = product.category || 'Uncategorized';
            if (!categoryMap[category]) {
                categoryMap[category] = { count: 0, percentage: 0 };
            }
            categoryMap[category].count++;
        });

        // Calculate percentages
        Object.keys(categoryMap).forEach(category => {
            categoryMap[category].percentage = total > 0
                ? Math.round((categoryMap[category].count / total) * 100)
                : 0;
        });

        // Convert to array format for easier charting
        const distribution = Object.keys(categoryMap).map(category => ({
            category,
            count: categoryMap[category].count,
            percentage: categoryMap[category].percentage
        }));

        // Sort by count descending
        distribution.sort((a, b) => b.count - a.count);

        res.status(200).json({
            total,
            distribution
        });
    } catch (err) {
        console.error('Error fetching category distribution:', err);
        res.status(500).json({ error: 'Error fetching category distribution' });
    }
};

/**
 * Get waste metrics - calculate expired products over time
 */
const getWasteMetrics = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        // Calculate waste for different time periods
        const last7Days = new Date(now);
        last7Days.setDate(last7Days.getDate() - 7);

        const last30Days = new Date(now);
        last30Days.setDate(last30Days.getDate() - 30);

        const last90Days = new Date(now);
        last90Days.setDate(last90Days.getDate() - 90);

        const metrics = {
            totalExpired: 0,
            expiredLast7Days: 0,
            expiredLast30Days: 0,
            expiredLast90Days: 0,
            totalExpiredQuantity: 0,
            expiredByCategory: {}
        };

        products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);

            if (expiryDate < now) {
                metrics.totalExpired++;
                metrics.totalExpiredQuantity += product.quantity || 0;

                // Track by category
                const category = product.category || 'Uncategorized';
                if (!metrics.expiredByCategory[category]) {
                    metrics.expiredByCategory[category] = 0;
                }
                metrics.expiredByCategory[category]++;

                // Time-based tracking
                if (expiryDate >= last7Days) {
                    metrics.expiredLast7Days++;
                }
                if (expiryDate >= last30Days) {
                    metrics.expiredLast30Days++;
                }
                if (expiryDate >= last90Days) {
                    metrics.expiredLast90Days++;
                }
            }
        });

        res.status(200).json(metrics);
    } catch (err) {
        console.error('Error fetching waste metrics:', err);
        res.status(500).json({ error: 'Error fetching waste metrics' });
    }
};

/**
 * Get comprehensive inventory statistics
 */
const getInventoryStats = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId });
        const now = new Date();
        now.setHours(0, 0, 0, 0);

        const stats = {
            totalProducts: products.length,
            totalQuantity: 0,
            activeProducts: 0,
            expiredProducts: 0,
            expiringThisWeek: 0,
            expiringThisMonth: 0,
            categories: new Set(),
            averageDaysToExpiry: 0,
            healthScore: 0
        };

        let totalDaysToExpiry = 0;
        let activeCount = 0;

        products.forEach(product => {
            stats.totalQuantity += product.quantity || 0;
            stats.categories.add(product.category || 'Uncategorized');

            const expiryDate = new Date(product.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);

            const diffTime = expiryDate - now;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays < 0) {
                stats.expiredProducts++;
            } else {
                stats.activeProducts++;
                totalDaysToExpiry += diffDays;
                activeCount++;

                if (diffDays <= 7) {
                    stats.expiringThisWeek++;
                } else if (diffDays <= 30) {
                    stats.expiringThisMonth++;
                }
            }
        });

        stats.categories = stats.categories.size;
        stats.averageDaysToExpiry = activeCount > 0
            ? Math.round(totalDaysToExpiry / activeCount)
            : 0;

        // Calculate health score (0-100)
        // Based on: active products ratio, average days to expiry, expiring soon ratio
        const activeRatio = stats.totalProducts > 0
            ? (stats.activeProducts / stats.totalProducts) * 100
            : 100;
        const expiringRatio = stats.activeProducts > 0
            ? ((stats.expiringThisWeek + stats.expiringThisMonth) / stats.activeProducts) * 100
            : 0;
        const daysScore = Math.min((stats.averageDaysToExpiry / 180) * 100, 100);

        stats.healthScore = Math.round(
            (activeRatio * 0.4) +
            ((100 - expiringRatio) * 0.3) +
            (daysScore * 0.3)
        );

        res.status(200).json(stats);
    } catch (err) {
        console.error('Error fetching inventory stats:', err);
        res.status(500).json({ error: 'Error fetching inventory stats' });
    }
};

/**
 * Get monthly expiry forecast for next 12 months
 */
const getMonthlyExpiryForecast = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId });
        const now = new Date();

        // Create array for next 12 months
        const forecast = [];
        for (let i = 0; i < 12; i++) {
            const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
            forecast.push({
                month: monthDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
                monthIndex: i,
                expiring: 0,
                quantity: 0
            });
        }

        products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            const monthsDiff = (expiryDate.getFullYear() - now.getFullYear()) * 12 +
                (expiryDate.getMonth() - now.getMonth());

            if (monthsDiff >= 0 && monthsDiff < 12) {
                forecast[monthsDiff].expiring++;
                forecast[monthsDiff].quantity += product.quantity || 0;
            }
        });

        res.status(200).json(forecast);
    } catch (err) {
        console.error('Error fetching monthly forecast:', err);
        res.status(500).json({ error: 'Error fetching monthly forecast' });
    }
};

module.exports = {
    getExpiryTrends,
    getCategoryDistribution,
    getWasteMetrics,
    getInventoryStats,
    getMonthlyExpiryForecast
};
