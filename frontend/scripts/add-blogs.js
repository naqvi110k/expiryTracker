const fs = require('fs');
const path = require('path');

const newBlogs = [
  {
    id: "8",
    title: "How to Track Food Expiry Dates in a Small Grocery Store (Free Methods)",
    slug: "track-food-expiry-dates-grocery-store",
    date: "2026-07-02",
    author: "Inventa Team",
    readTime: "5 min read",
    tags: ["Grocery Stores", "Food Waste", "Inventory Management"],
    coverImage: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800",
    description: "Learn how small grocery stores can track food expiry dates for free using their smartphone camera, reducing food waste and improving profits without expensive hardware.",
    content: [
      "Running a small grocery store comes with an endless list of challenges, but managing perishable goods is easily one of the most stressful. Food spoilage directly eats into your profit margins, and relying on memory or messy paper logbooks almost guarantees that products will expire unnoticed on the back of your shelves.",
      "## The Problem with Manual Expiry Tracking",
      "Most small retailers try to manage their expiry dates using Excel spreadsheets or pen and paper. While these methods are cheap, they are incredibly labor-intensive. Worse, they rely entirely on you remembering to check the list every single day. A spreadsheet does not send you a WhatsApp message when a batch of dairy is about to expire; it simply sits silently on your computer.",
      "## Free Methods That Actually Work",
      "The best free method for tracking food expiry dates is leveraging the technology you already have in your pocket: your smartphone. By using AI-powered apps like Inventa, you can turn your phone's camera into a powerful expiry date tracker. Simply snap a picture of a product, and the AI automatically extracts the name, batch number, and expiration date. No manual data entry required.",
      "## Setting Up Automated Alerts",
      "Once your inventory is digitized, the key is automation. Set up automated WhatsApp alerts that notify you 7 days, 3 days, and 1 day before an item expires. This gives you a clear window of time to apply markdowns, run promotions, or return the stock to your supplier if permitted. Stop relying on memory and start letting software do the heavy lifting for free!"
    ]
  },
  {
    id: "9",
    title: "FIFO vs. FEFO: Which Inventory Method is Best for Perishable Goods?",
    slug: "fefo-inventory-management",
    date: "2026-07-02",
    author: "Inventa Experts",
    readTime: "6 min read",
    tags: ["FEFO", "FIFO", "Warehouse Management"],
    coverImage: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800",
    description: "A complete guide to understanding First-In-First-Out (FIFO) vs First-Expired-First-Out (FEFO) inventory management, and why FEFO is crucial for perishable goods.",
    content: [
      "In the world of inventory management, two acronyms dominate the conversation: FIFO and FEFO. While they sound similar, choosing the wrong method for your retail store or pharmacy can lead to significant financial losses due to expired stock.",
      "## What is FIFO?",
      "FIFO stands for **First-In, First-Out**. This method assumes that the oldest inventory items (the ones you received first) are sold first. This is a great, simple method for non-perishable goods like clothing or hardware. If you buy a batch of t-shirts in January and another batch in March, you try to sell the January batch first.",
      "## What is FEFO?",
      "FEFO stands for **First-Expired, First-Out**. This method completely ignores when you received the item and instead focuses entirely on the expiration date. The product that expires soonest is pushed to the front of the shelf to be sold first, regardless of whether it arrived in the store yesterday or last month.",
      "## Why Perishable Goods Require FEFO",
      "For pharmacies, grocery stores, and bakeries, FEFO is not just recommended; it is essential. Suppliers do not always send products with sequential expiration dates. You might receive a delivery today that actually expires *before* the delivery you received last week. If you blindly follow FIFO, you will end up holding onto the products that expire first, leading to massive write-offs.",
      "Implementing FEFO manually is difficult, which is why utilizing software like Inventa to automatically track exact expiry dates and guide your stocking strategy is the most profitable decision a small business can make."
    ]
  },
  {
    id: "10",
    title: "The Best Free Expiry Date Tracking Software for Small Pharmacies",
    slug: "free-pharmacy-expiry-date-tracking-software",
    date: "2026-07-02",
    author: "Inventa Team",
    readTime: "7 min read",
    tags: ["Pharmacies", "Compliance", "Medical Stores"],
    coverImage: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800",
    description: "Discover why small pharmacies need specialized expiry date tracking software to maintain compliance, and how to start tracking medicines for free.",
    content: [
      "Managing a small pharmacy involves navigating strict regulations, tight margins, and the constant risk of holding expired medicines. Selling an expired drug is not just a financial loss; it is a serious compliance violation that can risk a patient's health and your business license.",
      "## The High Cost of Manual Tracking",
      "Many independent pharmacies still rely on manual shelf audits. Staff members spend hours walking the aisles, checking thousands of individual boxes, and writing down dates. This process is highly prone to human error. A single misplaced decimal or misread label can result in expired medication slipping through the cracks.",
      "## What to Look for in Pharmacy Tracking Software",
      "When evaluating expiry tracking software, small pharmacies need three core features: \n1. **Batch Number Tracking:** The software must be able to link expiration dates to specific manufacturer batch numbers for recall purposes. \n2. **Automated Reminders:** It should actively notify staff well before the expiry date so medicines can be returned to suppliers for credit. \n3. **Accessibility:** It should be usable by all staff members without requiring expensive proprietary scanners.",
      "## The Free Solution: Inventa",
      "For small pharmacies with limited budgets, Inventa provides a powerful, 100% free solution. By leveraging AI photo recognition and barcode scanning via any smartphone, pharmacy staff can digitize inventory in seconds. Inventa’s automated WhatsApp alerts ensure that the pharmacist-in-charge is notified of upcoming expirations 30 days in advance, allowing plenty of time to process supplier returns and maintain total compliance."
    ]
  }
];

// 1. Update blogData.js
const blogDataPath = path.join(__dirname, '../utils/blogData.js');
let blogDataContent = fs.readFileSync(blogDataPath, 'utf8');

// We will construct the new array elements as a string
const newBlogsString = newBlogs.map(b => JSON.stringify(b, null, 2)).join(',\n');

// Find the last array element bracket
const lastIndex = blogDataContent.lastIndexOf('];');
if (lastIndex !== -1) {
  blogDataContent = blogDataContent.substring(0, lastIndex) + ',\n' + newBlogsString + '\n];' + blogDataContent.substring(lastIndex + 2);
  fs.writeFileSync(blogDataPath, blogDataContent);
  console.log('Updated blogData.js');
}

// 2. Update generate-seo.js
const seoPath = path.join(__dirname, 'generate-seo.js');
let seoContent = fs.readFileSync(seoPath, 'utf8');

const seoNewEntries = newBlogs.map(b => {
  return `  {
    slug: '${b.slug}',
    title: '${b.title} | Inventa',
    description: '${b.description.replace(/'/g, "\\'")}',
    coverImage: '${b.coverImage}',
  }`;
}).join(',\n');

const seoLastIndex = seoContent.indexOf('];', seoContent.indexOf('const blogArticles = ['));
if (seoLastIndex !== -1) {
  seoContent = seoContent.substring(0, seoLastIndex) + ',\n' + seoNewEntries + '\n' + seoContent.substring(seoLastIndex);
  fs.writeFileSync(seoPath, seoContent);
  console.log('Updated generate-seo.js');
}

// 3. Update sitemap.xml
const sitemapPath = path.join(__dirname, '../public/sitemap.xml');
if (fs.existsSync(sitemapPath)) {
  let sitemapContent = fs.readFileSync(sitemapPath, 'utf8');
  
  const sitemapEntries = newBlogs.map(b => {
    return `  <url>
    <loc>https://expiry-tracker.live/blog/${b.slug}</loc>
    <lastmod>${b.date}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  }).join('\n');

  const sitemapLastIndex = sitemapContent.lastIndexOf('</urlset>');
  if (sitemapLastIndex !== -1) {
    sitemapContent = sitemapContent.substring(0, sitemapLastIndex) + sitemapEntries + '\n</urlset>';
    fs.writeFileSync(sitemapPath, sitemapContent);
    console.log('Updated sitemap.xml');
  }
} else {
  console.log('sitemap.xml not found at', sitemapPath);
}
