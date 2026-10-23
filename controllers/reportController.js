const Product = require('../models/productModel');
const PDFDocument = require('pdfkit');

const generateExpiryReport = async (req, res) => {
    const userId = req.user?.userId;

    try {
        const products = await Product.find({ userId }).sort({ expiryDate: 1 });

        if (!products || products.length === 0) {
            return res.status(404).json({ error: 'No products found for this user' });
        }

        // Categorize products
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        let expiredProducts = [];
        let criticalProducts = [];
        let warningProducts = [];
        let safeProducts = [];

        products.forEach(product => {
            const expiryDate = new Date(product.expiryDate);
            expiryDate.setHours(0, 0, 0, 0);
            const daysDiff = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));

            if (daysDiff < 0) {
                expiredProducts.push({ ...product._doc, daysDiff });
            } else if (daysDiff <= 7) {
                criticalProducts.push({ ...product._doc, daysDiff });
            } else if (daysDiff <= 30) {
                warningProducts.push({ ...product._doc, daysDiff });
            } else {
                safeProducts.push({ ...product._doc, daysDiff });
            }
        });

        const doc = new PDFDocument({
            margin: 50,
            size: 'A4',
            bufferPages: true
        });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=inventa-report-${Date.now()}.pdf`);
        doc.pipe(res);

        // ========================================
        // PROFESSIONAL HEADER WITH GRADIENT
        // ========================================

        // Gradient header background
        const gradient = doc.linearGradient(0, 0, 595, 100);
        gradient.stop(0, '#3B82F6')
            .stop(0.5, '#2563EB')
            .stop(1, '#1D4ED8');

        doc.rect(0, 0, 595, 140).fill(gradient);

        // Company name/logo text (since we can't easily embed PNG in PDFKit without additional setup)
        doc.fontSize(36)
            .fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .text('INVENTA', 50, 40);

        doc.fontSize(11)
            .fillColor('#BFDBFE')
            .font('Helvetica')
            .text('Smart Inventory Management', 50, 80);

        // Report title on the right
        doc.fontSize(24)
            .fillColor('#FFFFFF')
            .font('Helvetica-Bold')
            .text('Inventory Health Report', 280, 45, { align: 'right', width: 265 });

        const dateText = new Date().toLocaleDateString('en-US', {
            month: 'long',
            day: 'numeric',
            year: 'numeric',
            weekday: 'long'
        });

        doc.fontSize(9)
            .fillColor('#BFDBFE')
            .font('Helvetica')
            .text(`Generated: ${dateText}`, 280, 85, { align: 'right', width: 265 });

        // ========================================
        // EXECUTIVE SUMMARY SECTION
        // ========================================

        let currentY = 165;

        // Summary box with light background
        doc.roundedRect(50, currentY, 495, 80, 8)
            .fillAndStroke('#F8FAFC', '#E2E8F0');

        doc.fontSize(12)
            .fillColor('#1E293B')
            .font('Helvetica-Bold')
            .text('Executive Summary', 65, currentY + 15);

        const totalProducts = products.length;
        const healthScore = Math.round((safeProducts.length / totalProducts) * 100);

        doc.fontSize(9)
            .fillColor('#475569')
            .font('Helvetica')
            .text(`This report provides a comprehensive overview of ${totalProducts} products in your inventory. `, 65, currentY + 35, { width: 465, lineGap: 3 })
            .text(`Current inventory health score: ${healthScore}%. ${expiredProducts.length > 0 ? `URGENT: ${expiredProducts.length} products have expired and require immediate attention.` : 'No expired products detected.'} ${criticalProducts.length > 0 ? `${criticalProducts.length} products are expiring within 7 days.` : ''}`, { width: 465, lineGap: 3 });

        currentY += 105;

        // ========================================
        // STATISTICS CARDS WITH MODERN DESIGN
        // ========================================

        doc.fontSize(16)
            .fillColor('#0F172A')
            .font('Helvetica-Bold')
            .text('Inventory Status Overview', 50, currentY);

        currentY += 35;

        const statWidth = 115;
        const statHeight = 95;
        const statGap = 10;

        const stats = [
            { label: 'EXPIRED', value: expiredProducts.length, color: '#EF4444', bg: '#FEE2E2', textColor: '#991B1B' },
            { label: 'CRITICAL', value: criticalProducts.length, color: '#F97316', bg: '#FFEDD5', textColor: '#9A3412' },
            { label: 'WARNING', value: warningProducts.length, color: '#F59E0B', bg: '#FEF3C7', textColor: '#92400E' },
            { label: 'SAFE', value: safeProducts.length, color: '#10B981', bg: '#D1FAE5', textColor: '#065F46' }
        ];

        stats.forEach((stat, index) => {
            const x = 50 + (statWidth + statGap) * index;

            // Outer card with shadow effect (simulated with slight offset)
            doc.roundedRect(x + 1, currentY + 1, statWidth, statHeight, 10)
                .fill('#E2E8F0');

            // Main card with gradient
            const cardGradient = doc.linearGradient(x, currentY, x, currentY + statHeight);
            cardGradient.stop(0, '#FFFFFF')
                .stop(1, stat.bg);

            doc.roundedRect(x, currentY, statWidth, statHeight, 10)
                .fill(cardGradient);

            // Colored accent bar at top
            doc.roundedRect(x, currentY, statWidth, 6, 10)
                .fill(stat.color);

            // Label
            doc.fontSize(9)
                .fillColor('#64748B')
                .font('Helvetica-Bold')
                .text(stat.label, x + 12, currentY + 20, { width: statWidth - 24, lineBreak: false });

            // Large value
            doc.fontSize(36)
                .fillColor(stat.textColor)
                .font('Helvetica-Bold')
                .text(stat.value.toString(), x + 12, currentY + 38, { width: statWidth - 24, lineBreak: false });

            // Percentage of total
            const percentage = Math.round((stat.value / totalProducts) * 100) || 0;
            doc.fontSize(8)
                .fillColor('#94A3B8')
                .font('Helvetica')
                .text(`${percentage}% of total`, x + 12, currentY + 78, { width: statWidth - 24, lineBreak: false });
        });

        currentY += statHeight + 40;

        // ========================================
        // VISUAL DATA CHART - Distribution Bar
        // ========================================

        if (currentY > 650) {
            doc.addPage();
            currentY = 50;
        }

        doc.fontSize(16)
            .fillColor('#0F172A')
            .font('Helvetica-Bold')
            .text('Status Distribution', 50, currentY);

        currentY += 30;

        // Draw horizontal stacked bar chart
        const chartWidth = 495;
        const chartHeight = 40;
        const chartX = 50;

        // Background
        doc.roundedRect(chartX, currentY, chartWidth, chartHeight, 20)
            .fill('#F1F5F9');

        // Calculate proportions
        let currentOffset = 0;
        stats.forEach((stat, index) => {
            const proportion = stat.value / totalProducts;
            const segmentWidth = chartWidth * proportion;

            if (segmentWidth > 0) {
                // Determine corner radius based on position
                if (index === 0) {
                    // First segment - rounded left
                    doc.roundedRect(chartX + currentOffset, currentY, segmentWidth, chartHeight, 20)
                        .fill(stat.color);
                } else if (index === stats.length - 1 || stats.slice(index + 1).every(s => s.value === 0)) {
                    // Last segment - rounded right
                    doc.rect(chartX + currentOffset, currentY, segmentWidth, chartHeight)
                        .fill(stat.color);
                } else {
                    // Middle segments - no rounding
                    doc.rect(chartX + currentOffset, currentY, segmentWidth, chartHeight)
                        .fill(stat.color);
                }

                currentOffset += segmentWidth;
            }
        });

        // Add legend below
        currentY += chartHeight + 15;
        let legendX = 50;

        stats.forEach((stat) => {
            // Color dot
            doc.circle(legendX + 5, currentY + 5, 4)
                .fill(stat.color);

            // Label
            doc.fontSize(8)
                .fillColor('#475569')
                .font('Helvetica')
                .text(`${stat.label} (${stat.value})`, legendX + 15, currentY + 1);

            legendX += 100;
        });

        currentY += 35;

        // ========================================
        // PRODUCT LISTINGS WITH ENHANCED TABLES
        // ========================================

        const drawProductSection = (title, items, color, bgColor) => {
            if (items.length === 0) return;

            // Check if we need new page for section header
            if (currentY > 700) {
                doc.addPage();
                currentY = 50;
            }

            // Section header with colored background
            doc.roundedRect(50, currentY, 495, 32, 8)
                .fill(bgColor);

            doc.fontSize(14)
                .fillColor('#FFFFFF')
                .font('Helvetica-Bold')
                .text(title, 60, currentY + 10);

            // Item count badge
            doc.circle(520, currentY + 16, 12)
                .fill('#FFFFFF');

            doc.fontSize(10)
                .fillColor(color)
                .font('Helvetica-Bold')
                .text(items.length.toString(), 520, currentY + 11, { width: 20, align: 'center' });

            currentY += 42;

            // Table header
            if (currentY > 720) {
                doc.addPage();
                currentY = 50;
            }

            doc.roundedRect(50, currentY, 495, 24, 4)
                .fill('#F8FAFC');

            doc.fontSize(8)
                .fillColor('#64748B')
                .font('Helvetica-Bold')
                .text('PRODUCT NAME', 60, currentY + 8, { width: 180 })
                .text('BATCH', 245, currentY + 8, { width: 70 })
                .text('QUANTITY', 320, currentY + 8, { width: 60 })
                .text('EXPIRY DATE', 385, currentY + 8, { width: 70 })
                .text('STATUS', 460, currentY + 8, { width: 75, align: 'center' });

            currentY += 30;

            items.forEach((product, index) => {
                const rowHeight = 45;

                // Check if card fits on current page
                if (currentY + rowHeight > 750) {
                    doc.addPage();
                    currentY = 50;
                }

                // Alternating row background (zebra striping)
                if (index % 2 === 0) {
                    doc.rect(50, currentY, 495, rowHeight).fill('#FAFAFA');
                }

                // Left accent border
                doc.rect(50, currentY, 4, rowHeight).fill(color);

                // Product name with icon
                doc.fontSize(11)
                    .fillColor('#0F172A')
                    .font('Helvetica-Bold')
                    .text(product.name || 'N/A', 60, currentY + 10, { width: 175, ellipsis: true, lineBreak: false });

                // Category (smaller, below name)
                doc.fontSize(8)
                    .fillColor('#64748B')
                    .font('Helvetica')
                    .text(product.category || 'Uncategorized', 60, currentY + 26, { width: 175, ellipsis: true, lineBreak: false });

                // Batch number
                doc.fontSize(9)
                    .fillColor('#475569')
                    .font('Helvetica')
                    .text(product.batchNumber || 'N/A', 245, currentY + 16, { width: 70, ellipsis: true });

                // Quantity with unit
                doc.fontSize(10)
                    .fillColor('#0F172A')
                    .font('Helvetica-Bold')
                    .text(`${product.quantity}`, 320, currentY + 16, { width: 30, align: 'right' });

                doc.fontSize(8)
                    .fillColor('#64748B')
                    .font('Helvetica')
                    .text(product.unit || '', 352, currentY + 17, { width: 25 });

                // Expiry date
                const expiryText = new Date(product.expiryDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric'
                });

                doc.fontSize(9)
                    .fillColor('#0F172A')
                    .font('Helvetica-Bold')
                    .text(expiryText, 385, currentY + 16, { width: 70 });

                // Status badge with days remaining
                const badgeX = 465;
                const badgeY = currentY + 12;

                if (product.daysDiff !== undefined) {
                    const daysText = product.daysDiff < 0
                        ? `${Math.abs(product.daysDiff)}d ago`
                        : `${product.daysDiff}d left`;

                    // Status badge
                    doc.roundedRect(badgeX, badgeY, 70, 20, 10)
                        .fill(bgColor);

                    doc.fontSize(8)
                        .fillColor('#FFFFFF')
                        .font('Helvetica-Bold')
                        .text(daysText, badgeX, badgeY + 6, { width: 70, align: 'center' });
                }

                currentY += rowHeight + 2;
            });

            // Add spacing after section
            currentY += 15;
        };

        // Draw all sections with enhanced styling
        drawProductSection('🚨 Expired Products - Immediate Action Required', expiredProducts, '#DC2626', '#EF4444');
        drawProductSection('⚠️ Critical Alert - Expiring Within 7 Days', criticalProducts, '#EA580C', '#F97316');
        drawProductSection('⚡ Warning - Expiring Within 30 Days', warningProducts, '#D97706', '#F59E0B');
        drawProductSection('✓ Safe Products - No Immediate Action Needed', safeProducts, '#059669', '#10B981');

        // ========================================
        // PROFESSIONAL FOOTER ON ALL PAGES
        // ========================================

        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);

            const footerY = doc.page.height - 50;

            // Footer separator line
            doc.moveTo(50, footerY - 10)
                .lineTo(545, footerY - 10)
                .strokeColor('#E2E8F0')
                .lineWidth(1)
                .stroke();

            // Left: Company info
            doc.fontSize(8)
                .fillColor('#64748B')
                .font('Helvetica-Bold')
                .text('INVENTA', 50, footerY, { lineBreak: false });

            doc.fontSize(7)
                .font('Helvetica')
                .text('Smart Inventory Management', 50, footerY + 10, { lineBreak: false });

            // Center: Page number
            doc.fontSize(8)
                .fillColor('#94A3B8')
                .font('Helvetica')
                .text(`Page ${i + 1} of ${pages.count}`, 0, footerY + 5, { align: 'center', width: doc.page.width });

            // Right: Generation date and disclaimer
            doc.fontSize(7)
                .fillColor('#94A3B8')
                .font('Helvetica')
                .text(dateText, 50, footerY, { align: 'right', width: 495 });

            doc.fontSize(6)
                .fillColor('#CBD5E1')
                .text('Confidential - For Internal Use Only', 50, footerY + 10, { align: 'right', width: 495 });
        }

        doc.end();

    } catch (err) {
        console.error('Error generating report:', err);
        res.status(500).json({ error: 'Error generating report: ' + err.message });
    }
};

module.exports = {
    generateExpiryReport
};