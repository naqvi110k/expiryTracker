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
        res.setHeader('Content-Disposition', `attachment; filename=inventory-expiry-${Date.now()}.pdf`);
        doc.pipe(res);

        // Header
        doc.fontSize(32)
           .fillColor('#0F172A')
           .font('Helvetica-Bold')
           .text('Inventory Health', 50, 50);

        doc.fontSize(14)
           .fillColor('#64748B')
           .font('Helvetica')
           .text('Product Expiry Analysis', 50, 90);

        const dateText = new Date().toLocaleDateString('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric' 
        });
        doc.fontSize(10)
           .fillColor('#94A3B8')
           .text(dateText, 50, 115);

        doc.moveTo(50, 145)
           .lineTo(545, 145)
           .strokeColor('#E2E8F0')
           .lineWidth(1)
           .stroke();

        // Stats Grid - Fixed positioning
        const statsY = 170;
        const statWidth = 115;
        const statHeight = 80;
        const statGap = 10;
        
        const stats = [
            { label: 'EXPIRED', value: expiredProducts.length, color: '#DC2626', bg: '#FEE2E2' },
            { label: 'CRITICAL', value: criticalProducts.length, color: '#EA580C', bg: '#FFEDD5' },
            { label: 'WARNING', value: warningProducts.length, color: '#F59E0B', bg: '#FEF3C7' },
            { label: 'SAFE', value: safeProducts.length, color: '#10B981', bg: '#D1FAE5' }
        ];

        stats.forEach((stat, index) => {
            const x = 50 + (statWidth + statGap) * index;

            // Card background with border
            doc.roundedRect(x, statsY, statWidth, statHeight, 8)
               .fillAndStroke(stat.bg, stat.color);
            
            // Label
            doc.fontSize(9)
               .fillColor('#64748B')
               .font('Helvetica')
               .text(stat.label, x + 10, statsY + 15, { width: statWidth - 20, lineBreak: false });
            
            // Value
            doc.fontSize(32)
               .fillColor(stat.color)
               .font('Helvetica-Bold')
               .text(stat.value.toString(), x + 10, statsY + 32, { width: statWidth - 20, lineBreak: false });
        });

        // Set Y position after stats
        doc.y = statsY + statHeight + 40;

        // Product listing function with fixed spacing
        const drawProductSection = (title, items, color) => {
            if (items.length === 0) return;

            // Check if we need new page for section header
            if (doc.y > 700) {
                doc.addPage();
                doc.y = 50;
            }

            const sectionStartY = doc.y;

            // Section title - prevent wrapping with enough width
            doc.fontSize(15)
               .fillColor('#0F172A')
               .font('Helvetica-Bold')
               .text(title, 50, sectionStartY, { continued: false });

            doc.y = sectionStartY + 28;

            items.forEach((product) => {
                const rowHeight = 55;
                const rowY = doc.y;

                // Check if card fits on current page
                if (rowY + rowHeight > 750) {
                    doc.addPage();
                    doc.y = 50;
                }

                const currentY = doc.y;

                // Card background
                doc.roundedRect(50, currentY, 495, rowHeight, 6).fill('#FFFFFF');
                doc.rect(50, currentY, 4, rowHeight).fill(color);
                doc.roundedRect(50, currentY, 495, rowHeight, 6).strokeColor('#E2E8F0').lineWidth(1).stroke();

                // Product name
                doc.fontSize(11)
                   .fillColor('#0F172A')
                   .font('Helvetica-Bold')
                   .text(product.name || 'N/A', 65, currentY + 12, { width: 270, ellipsis: true, lineBreak: false });

                // Batch number
                doc.fontSize(9)
                   .fillColor('#64748B')
                   .font('Helvetica')
                   .text(`Batch: ${product.batchNumber || 'N/A'}`, 65, currentY + 30, { lineBreak: false });

                // Quantity badge
                doc.roundedRect(350, currentY + 12, 75, 22, 4).fill('#F1F5F9');
                doc.fontSize(9)
                   .fillColor('#475569')
                   .font('Helvetica-Bold')
                   .text(`${product.quantity} ${product.unit}`, 350, currentY + 17, { width: 75, align: 'center', lineBreak: false });

                // Expiry date
                const expiryText = new Date(product.expiryDate).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                });
                
                doc.fontSize(10)
                   .fillColor(color)
                   .font('Helvetica-Bold')
                   .text(expiryText, 435, currentY + 12, { width: 100, align: 'right', lineBreak: false });

                // Days remaining
                if (product.daysDiff !== undefined) {
                    const daysText = product.daysDiff < 0 
                        ? `${Math.abs(product.daysDiff)}d overdue`
                        : `${product.daysDiff}d left`;
                    
                    doc.fontSize(8)
                       .fillColor('#94A3B8')
                       .font('Helvetica')
                       .text(daysText, 435, currentY + 30, { width: 100, align: 'right', lineBreak: false });
                }

                // Move Y position for next card
                doc.y = currentY + rowHeight + 10;
            });

            // Add spacing after section
            doc.y += 10;
        };

        // Draw all sections
        drawProductSection('Expired Products', expiredProducts, '#DC2626');
        drawProductSection('Critical (Expires in 7 days)', criticalProducts, '#EA580C');
        drawProductSection('Warning (Expires in 30 days)', warningProducts, '#F59E0B');
        drawProductSection('Safe Products', safeProducts, '#10B981');

        // Footer on all pages
        const pages = doc.bufferedPageRange();
        for (let i = 0; i < pages.count; i++) {
            doc.switchToPage(i);
            
            const footerY = doc.page.height - 40;
            
            doc.moveTo(50, footerY - 15)
               .lineTo(545, footerY - 15)
               .strokeColor('#E2E8F0')
               .lineWidth(0.5)
               .stroke();

            doc.fontSize(8)
               .fillColor('#94A3B8')
               .font('Helvetica')
               .text(`Page ${i + 1} of ${pages.count}`, 50, footerY, { align: 'left', lineBreak: false });
            
            doc.text('INVENTA', 0, footerY, { align: 'center', width: doc.page.width, lineBreak: false });
            
            doc.text(dateText, 50, footerY, { align: 'right', width: 495, lineBreak: false });
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