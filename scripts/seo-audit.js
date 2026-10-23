const fs = require('fs');
const path = require('path');
const vm = require('vm');

const rootDir = path.resolve(__dirname, '..');

// Helper to resolve paths from root
function getPath(relPath) {
    return path.join(rootDir, relPath);
}

const targetKeywords = [
  "free small business inventory tracker",
  "retail expiry date tracking software",
  "retail inventory loss prevention",
  "pharmacy expiry date tracking software",
  "FEFO inventory management pharmacy",
  "grocery store expiry tracker",
  "supermarket shelf life tracker",
  "grocery store waste reduction software",
  "reduce food waste in supermarkets",
  "prevent stock write-offs retail",
  "FIFO stock rotation app"
];

function runAudit() {
    console.log("Starting SEO Audit...\n");

    const indexHtmlPath = getPath('frontend/index.html');
    const seoConfigPath = getPath('frontend/utils/seoConfig.js');
    const landingPath = getPath('frontend/components/Landing.jsx');
    const blogDataPath = getPath('frontend/utils/blogData.js');

    // 1. Verify existence of files
    const files = [indexHtmlPath, seoConfigPath, landingPath, blogDataPath];
    for (const f of files) {
        if (!fs.existsSync(f)) {
            console.error(`ERROR: File does not exist at ${f}`);
            process.exit(1);
        }
    }
    console.log("✔ All affected files exist.");

    // 2. Character counts check in index.html
    const htmlContent = fs.readFileSync(indexHtmlPath, 'utf8');
    const htmlTitleMatch = htmlContent.match(/<title>(.*?)<\/title>/i);
    if (!htmlTitleMatch) {
        console.error("ERROR: index.html is missing a <title> tag");
        process.exit(1);
    }
    const htmlTitle = htmlTitleMatch[1];
    if (htmlTitle.length < 50 || htmlTitle.length > 60) {
        console.error(`ERROR: index.html title "${htmlTitle}" length is ${htmlTitle.length}, expected 50-60`);
        process.exit(1);
    }
    console.log(`✔ index.html title length is valid (${htmlTitle.length} chars).`);

    const htmlDescMatch = htmlContent.match(/<meta\s+name="description"\s+content="(.*?)"\s*\/?>/i) || 
                          htmlContent.match(/<meta\s+content="(.*?)"\s+name="description"\s*\/?>/i);
    if (!htmlDescMatch) {
        console.error("ERROR: index.html is missing a meta description tag");
        process.exit(1);
    }
    const htmlDesc = htmlDescMatch[1];
    if (htmlDesc.length < 120 || htmlDesc.length > 160) {
        console.error(`ERROR: index.html description length is ${htmlDesc.length}, expected 120-160`);
        process.exit(1);
    }
    console.log(`✔ index.html description length is valid (${htmlDesc.length} chars).`);

    // 3. Character counts check in seoConfig.js
    const seoContentRaw = fs.readFileSync(seoConfigPath, 'utf8');
    const cleanSeoContent = seoContentRaw
        .replace(/export\s+default\s+/g, 'const defaultExport = ')
        .replace(/export\s+/g, '') + '\n;this.defaultSEO = defaultSEO;\nthis.pageSEO = pageSEO;';
    const seoContext = {
        document: { title: '' }
    };
    vm.createContext(seoContext);
    try {
        vm.runInContext(cleanSeoContent, seoContext);
    } catch (err) {
        console.error("ERROR: Failed to evaluate seoConfig.js content.", err);
        process.exit(1);
    }

    const defaultSEO = seoContext.defaultSEO;
    const pageSEO = seoContext.pageSEO;

    if (!defaultSEO || !pageSEO) {
        console.error("ERROR: defaultSEO or pageSEO could not be parsed from seoConfig.js");
        process.exit(1);
    }

    if (defaultSEO.title.length < 50 || defaultSEO.title.length > 60) {
        console.error(`ERROR: defaultSEO title "${defaultSEO.title}" length is ${defaultSEO.title.length}, expected 50-60`);
        process.exit(1);
    }
    if (defaultSEO.description.length < 120 || defaultSEO.description.length > 160) {
        console.error(`ERROR: defaultSEO description length is ${defaultSEO.description.length}, expected 120-160`);
        process.exit(1);
    }
    console.log("✔ defaultSEO title & description lengths are valid.");

    const pagesToCheck = ['home', 'login', 'register', 'forgotPassword', 'resetPassword', 'verifyEmail', 'resendVerification'];
    for (const page of pagesToCheck) {
        const pageConfig = pageSEO[page];
        if (!pageConfig) {
            console.error(`ERROR: Missing page config for ${page} in pageSEO`);
            process.exit(1);
        }
        if (pageConfig.title.length < 50 || pageConfig.title.length > 60) {
            console.error(`ERROR: pageSEO.${page} title "${pageConfig.title}" length is ${pageConfig.title.length}, expected 50-60`);
            process.exit(1);
        }
        if (pageConfig.description.length < 120 || pageConfig.description.length > 160) {
            console.error(`ERROR: pageSEO.${page} description length is ${pageConfig.description.length}, expected 120-160`);
            process.exit(1);
        }
    }
    console.log("✔ All target pages in pageSEO have compliant title and description lengths.");

    // 4. Keyword presence check in Landing.jsx (headings and paragraphs/text blocks)
    const landingContent = fs.readFileSync(landingPath, 'utf8');

    // Extract headings
    const headingRegex = /<h[1-3][\s\S]*?>([\s\S]*?)<\/h[1-3]>/gi;
    let headingMatch;
    const matchingHeadings = [];
    while ((headingMatch = headingRegex.exec(landingContent)) !== null) {
        const headingText = headingMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        const hasKeyword = targetKeywords.some(kw => headingText.toLowerCase().includes(kw.toLowerCase()));
        if (hasKeyword) {
            matchingHeadings.push(headingText);
        }
    }

    console.log(`Found ${matchingHeadings.length} matching headings with target keywords:`);
    for (const h of matchingHeadings) {
        console.log(`  - Heading: "${h}"`);
    }

    if (matchingHeadings.length < 3) {
        console.error(`ERROR: Expected at least 3 headings with target keywords, found ${matchingHeadings.length}`);
        process.exit(1);
    }
    console.log("✔ Heading keyword density requirement satisfied.");

    // Extract paragraphs/text blocks
    const matchingParagraphs = [];

    const pRegex = /<p\b[\s\S]*?>([\s\S]*?)<\/p>/gi;
    let pMatch;
    while ((pMatch = pRegex.exec(landingContent)) !== null) {
        const text = pMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (targetKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
            matchingParagraphs.push(text);
        }
    }

    const liRegex = /<li\b[\s\S]*?>([\s\S]*?)<\/li>/gi;
    let liMatch;
    while ((liMatch = liRegex.exec(landingContent)) !== null) {
        const text = liMatch[1].replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();
        if (targetKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
            matchingParagraphs.push(text);
        }
    }

    const stepsRegex = /const steps = \[[^\]]*?\]/gs;
    const stepsMatch = landingContent.match(stepsRegex);
    if (stepsMatch) {
        const stepsStr = stepsMatch[0];
        const stringRegex = /'(.*?)'/g;
        let strMatch;
        while ((strMatch = stringRegex.exec(stepsStr)) !== null) {
            const text = strMatch[1];
            if (targetKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
                matchingParagraphs.push(text);
            }
        }
    }

    // Include FAQ answers from seoConfig as they are rendered on Landing
    const faqAnswersRegex = /answer:\s*'(.*?)'/g;
    let faqMatch;
    while ((faqMatch = faqAnswersRegex.exec(seoContentRaw)) !== null) {
        const text = faqMatch[1];
        if (targetKeywords.some(kw => text.toLowerCase().includes(kw.toLowerCase()))) {
            matchingParagraphs.push(text);
        }
    }

    console.log(`Found ${matchingParagraphs.length} matching paragraphs/text blocks with target keywords:`);
    for (const p of matchingParagraphs) {
        console.log(`  - Text Block: "${p}"`);
    }

    if (matchingParagraphs.length < 5) {
        console.error(`ERROR: Expected at least 5 paragraphs/text blocks with target keywords, found ${matchingParagraphs.length}`);
        process.exit(1);
    }
    console.log("✔ Paragraphs/text blocks keyword density requirement satisfied.");

    // 5. Image alt tags presence check on landing page
    const imgRegex = /<img[\s\S]*?>/gi;
    const imgs = landingContent.match(imgRegex) || [];
    for (const img of imgs) {
        const altMatch = img.match(/alt=["'](.*?)["']/i);
        if (!altMatch || !altMatch[1].trim()) {
            console.error(`ERROR: Image tag missing or empty alt attribute: ${img}`);
            process.exit(1);
        }
    }
    console.log(`✔ Verified ${imgs.length} image tags for alt attributes.`);

    // 6. Blog array validation in blogData.js
    const blogContentRaw = fs.readFileSync(blogDataPath, 'utf8');
    const cleanBlogContent = blogContentRaw
        .replace(/export\s+default\s+/g, 'const defaultExport = ')
        .replace(/export\s+/g, '') + '\n;this.blogArticles = blogArticles;';
    const blogContext = {};
    vm.createContext(blogContext);
    try {
        vm.runInContext(cleanBlogContent, blogContext);
    } catch (err) {
        console.error("ERROR: Failed to evaluate blogData.js content.", err);
        process.exit(1);
    }

    const articles = blogContext.blogArticles;
    if (!Array.isArray(articles)) {
        console.error("ERROR: blogArticles is not an array");
        process.exit(1);
    }
    if (articles.length < 6) {
        console.error(`ERROR: Expected at least 6 blog articles, found ${articles.length}`);
        process.exit(1);
    }
    console.log(`✔ Found ${articles.length} blog articles.`);

    const seenIds = new Set();
    const seenSlugs = new Set();

    for (const post of articles) {
        const requiredKeys = ['id', 'title', 'slug', 'date', 'author', 'readTime', 'tags', 'coverImage', 'description', 'content'];
        for (const key of requiredKeys) {
            if (post[key] === undefined) {
                console.error(`ERROR: Article ID ${post.id || 'unknown'} is missing key: ${key}`);
                process.exit(1);
            }
        }
        
        if (!Array.isArray(post.tags)) {
            console.error(`ERROR: Article ID ${post.id} tags is not an array`);
            process.exit(1);
        }
        if (!Array.isArray(post.content)) {
            console.error(`ERROR: Article ID ${post.id} content is not an array`);
            process.exit(1);
        }
        
        if (seenIds.has(post.id)) {
            console.error(`ERROR: Duplicate article ID found: ${post.id}`);
            process.exit(1);
        }
        seenIds.add(post.id);
        
        if (seenSlugs.has(post.slug)) {
            console.error(`ERROR: Duplicate article slug found: ${post.slug}`);
            process.exit(1);
        }
        seenSlugs.add(post.slug);
        
        let wordCount = 0;
        for (const paragraph of post.content) {
            if (typeof paragraph !== 'string') {
                console.error(`ERROR: Article ID ${post.id} content paragraph is not a string`);
                process.exit(1);
            }
            const words = paragraph.trim().split(/\s+/).filter(w => w.length > 0);
            wordCount += words.length;
        }
        
        if (wordCount <= 300) {
            console.error(`ERROR: Article ID ${post.id} ("${post.title}") has only ${wordCount} words, expected >300`);
            process.exit(1);
        }
        console.log(`✔ Article ID ${post.id} ("${post.slug}") schema and word count (${wordCount} words) valid.`);
    }

    console.log("\n✔ All SEO optimization requirements audited successfully. PASS.");
    process.exit(0);
}

runAudit();
