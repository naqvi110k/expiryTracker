/**
 * SEO Configuration for Inventa
 * Centralized SEO settings for easy management and consistency
 */

// Base URL - Update this for production
export const BASE_URL = 'https://expiry-tracker.live';

// Default SEO configuration
export const defaultSEO = {
    title: 'Inventa - AI-Powered Inventory & Expiry Management System',
    description: 'Inventa is a free AI-powered inventory and expiry management system for small businesses. Track product expiry dates and get automated WhatsApp alerts.',
    keywords: [
        // --- Existing core keywords ---
        'free inventory tracker',
        'expiry date tracker',
        'prevent expired products',
        'stop inventory waste',
        'small business inventory software',
        'free stock management app',
        'WhatsApp inventory alerts',
        'AI product expiry tracker',
        'shopkeeper inventory tool',
        'reduce product losses',
        'free small business inventory tracker',
        'retail expiry date tracking software',
        'retail inventory loss prevention',
        'pharmacy expiry date tracking software',
        'FEFO inventory management pharmacy',
        'grocery store expiry tracker',
        'supermarket shelf life tracker',
        'grocery store waste reduction software',
        'reduce food waste in supermarkets',
        'prevent stock write-offs retail',
        'FIFO stock rotation app',
        'free expiry alert system',
        'small shop inventory',
        'pharmacy expiry tracker',
        'FEFO inventory management',
        'shelf life tracking',
        'batch number tracking',
        'retail inventory tracker free',
        'smart inventory control',
        'barcode scanner app',
        'barcode inventory tracking',
        'barcode expiry scanner',
        'WhatsApp inventory tracker',
        'WhatsApp stock manager',
        'AI inventory management',
        'AI stock management',
        'food waste tracker',
        'prevent stock wastage',
        // --- NEW: High-priority missing keywords ---
        'expiry date app',
        'food expiry tracker app',
        'expiration date reminder app',
        'medicine expiry reminder app',
        'expiry date barcode scanner',
        'inventory management software',
        'perishable goods inventory software',
        'automated shelf-life monitoring software',
        'how to reduce food waste in inventory',
        'best before date app',
        // --- NEW: Medium-priority missing keywords ---
        'inventory tracking for small business',
        'pantry inventory app with expiry dates',
        'barcode scanner app with expiration alerts',
        'prevent expired stock inventory software',
        'inventory software to track shelf life',
        'manage perishable inventory for small business',
        'expiry date management',
        'food inventory management with notifications',
        // --- NEW: Niche / long-tail keywords ---
        'expiry date tracking for bakeries',
        'inventory tracking for pharmaceutical compliance',
        'small business inventory system for fresh produce',
        'FEFO vs FIFO inventory software',
        // --- NEW: US English "expiration" variants ---
        'expiration date tracker',
        'expiration date reminder',
        'expiration date management app',
        'food expiration date tracker',
        'expiration date tracking software',
        'product expiration management system',
        // --- NEW: Keywords from screenshot ---
        'whatsapp expiry date alerts',
        'product expiration notifications whatsapp',
        'set up whatsapp expiry alerts',
        'how to track expiry dates free',
        'whatsapp inventory management',
        'manage stock on whatsapp',
        'expired inventory losses',
        'reduce product waste small business',
        'food tracking',
        'best free inventory apps',
        'no cost stock tracker',
        'free inventory management app',
        'expiry tracker vs excel',
        'inventory spreadsheet alternative',
        'best tools for food pantry inventory',
        'ai inventory tracking',
        'photo stock management',
        'ai photo inventory tracking',
        'inventa review for small retail',
        'inventa app review',
        'whatsapp inventory tracker review',
        'expiry date tracker free',
        'inventory expiration tracking',
    ],
    author: 'Inventa - Smart Inventory Solutions',
    ogImage: `${BASE_URL}/og-image.png`,
    twitterImage: `${BASE_URL}/twitter-image.png`,
};

// Page-specific SEO configurations
export const pageSEO = {
    home: {
        title: 'Inventa | Free WhatsApp Inventory & Expiry Tracker',
        description: 'Stop losing money on expired inventory. Track stock with AI by sending product photos via WhatsApp. Get daily alerts and reports. 100% free, no app required.',
        keywords: [...defaultSEO.keywords, 'free expiry alert system', 'inventory dashboard', 'smart inventory'],
        path: '/',
    },
    login: {
        title: 'Login - Inventa | Free Expiry Date Tracking Software',
        description: 'Log in to your Inventa account to manage stock, track product expiration dates, and configure your automated WhatsApp expiry alerts today.',
        keywords: ['login', 'sign in', 'inventory access', 'free inventory tracker login'],
        path: '/login',
    },
    register: {
        title: 'Register on Inventa | Free Expiry & Inventory Tracker',
        description: 'Create your free Inventa account today. Start tracking expiry dates and managing retail inventory using our smart AI-powered WhatsApp tool.',
        keywords: ['register', 'sign up', 'create account', 'get started', 'free stock manager sign up'],
        path: '/register',
    },
    forgotPassword: {
        title: 'Reset Password | Recover Your Inventa Stock Account',
        description: 'Recover your Inventa account credentials. Enter your registered email address to receive password reset instructions and regain inventory access.',
        keywords: ['forgot password', 'reset password', 'account recovery'],
        path: '/forgot-password',
        noIndex: true, // Transactional page — should not be indexed
    },
    resetPassword: {
        title: 'Set New Password | Secure Your Inventa Stock Manager',
        description: 'Create and confirm a new secure password for your Inventa inventory tracker account to keep your stock and expiry data protected.',
        keywords: ['reset password', 'new password', 'account security'],
        path: '/reset-password',
        noIndex: true, // Transactional page — should not be indexed
    },
    verifyEmail: {
        title: 'Verify Email Address | Activate Your Inventa Account',
        description: 'Verify your email address to activate your free Inventa account and unlock automated WhatsApp alerts and AI-powered product expiry tracking.',
        keywords: ['verify email', 'email activation', 'account verification'],
        path: '/verify-email',
        noIndex: true, // Transactional page — should not be indexed
    },
    resendVerification: {
        title: 'Resend Email Verification Link | Inventa Expiry App',
        description: 'Request a new verification link for your email to activate your free Inventa account and start tracking product shelf-life and expiry dates.',
        keywords: ['resend verification', 'email verification link', 'account activation'],
        path: '/resend-verification',
        noIndex: true, // Transactional page — should not be indexed
    },
    dashboard: {
        title: 'Dashboard - Inventa Inventory Management',
        description: 'View and manage your complete inventory, track expiring products, and generate reports.',
        keywords: ['dashboard', 'inventory overview', 'product management'],
        path: '/dashboard',
        noIndex: true, // Private page
    },
    profile: {
        title: 'My Profile - Inventa',
        description: 'Manage your Inventa account settings and preferences.',
        keywords: ['profile', 'account settings', 'user preferences'],
        path: '/profile',
        noIndex: true, // Private page
    },
    expiryCalculator: {
        title: 'Free Expiry Date & Shelf Life Calculator | Inventa',
        description: 'Calculate product expiry dates, shelf life, and days remaining instantly. Get FEFO recommendations for pharmacy, grocery, and retail store owners.',
        keywords: [...defaultSEO.keywords, 'expiry calculator', 'shelf life calculator', 'expiration date calculator', 'calculate expiry date', 'days remaining calculator', 'FEFO calculator'],
        path: '/expiry-calculator',
    },
    about: {
        title: 'About Us | Inventa Expiry & Inventory Tracker',
        description: 'Discover the story behind Inventa. Our mission is to help pharmacies, grocery stores, and retailers eliminate expired inventory waste with AI-powered WhatsApp tracking.',
        keywords: [...defaultSEO.keywords, 'about us', 'about inventa', 'inventory tracking team', 'waste reduction company'],
        path: '/about',
    },
    contact: {
        title: 'Contact Us | Inventa Expiry & Inventory Support',
        description: 'Get in touch with the Inventa support team. Send us a message, ask questions, or request assistance with our AI-powered WhatsApp inventory tracker.',
        keywords: [...defaultSEO.keywords, 'contact us', 'support', 'customer service', 'contact support', 'inventa email', 'office address'],
        path: '/contact',
    },
};

// Structured Data Templates
export const structuredData = {
    organization: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'Inventa',
        url: BASE_URL,
        logo: `${BASE_URL}/Untitled design.png`,
        description: 'Smart inventory management solutions for small businesses',
        sameAs: [
            'https://facebook.com/inventa',
            'https://twitter.com/inventa',
            'https://linkedin.com/company/inventa',
        ],
        contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Support',
            email: 'support@inventa.app',
        },
    },

    breadcrumb: (items) => ({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: items.map((item, index) => ({
            '@type': 'ListItem',
            position: index + 1,
            name: item.name,
            item: `${BASE_URL}${item.path}`,
        })),
    }),

    faq: (questions) => ({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: questions.map(q => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: {
                '@type': 'Answer',
                text: q.answer,
            },
        })),
    }),
};

// Common FAQ questions
export const commonFAQs = [
    {
        question: 'What is Inventa?',
        answer: 'Inventa is a free small business inventory tracker, expiry date app, and AI-powered inventory management software designed for small shopkeepers. It helps you track product expiry dates (and expiration dates), receive automated WhatsApp alerts, and manage your stock efficiently — all at zero cost.',
    },
    {
        question: 'How does the expiry tracking work?',
        answer: 'Simply add your products with their expiry dates to Inventa — either manually, via barcode scanner, or by sending a photo on WhatsApp. Our automated shelf-life monitoring software tracks these dates and sends you timely WhatsApp notifications when products are about to expire, helping you reduce food waste and prevent stock write-offs.',
    },
    {
        question: 'Is Inventa free to use?',
        answer: 'Yes! Inventa is a completely free expiry date app and FIFO stock rotation app. You get inventory tracking for small business, expiration date reminders, retail inventory loss prevention, PDF reports, and AI-powered product recognition — all at no cost.',
    },
    {
        question: 'How do I receive WhatsApp notifications?',
        answer: 'After setting up your account and adding products, Inventa automatically sends daily WhatsApp messages with summaries of expired and expiring products. This food inventory management with notifications feature works like an expiration date reminder app — delivering alerts every morning so you never miss an expiry.',
    },
    {
        question: 'Can I use Inventa on my mobile phone?',
        answer: 'Absolutely! Inventa is fully responsive and works seamlessly on mobile devices, tablets, and desktops. You can also install it as a Progressive Web App (PWA) for a native app-like experience — making it the perfect pantry inventory app with expiry dates or a best before date app you always have on hand.',
    },
    {
        question: 'What kind of products can I track?',
        answer: 'You can track any products with expiry dates — groceries, medicines, cosmetics, food items, fresh produce, or any perishable goods. Inventa works as a medicine expiry reminder app for pharmacies, a grocery store expiry tracker for retail, expiry date tracking for bakeries, and a small business inventory system for fresh produce.',
    },
    {
        question: 'Does Inventa have a barcode scanner?',
        answer: 'Yes! Inventa includes a built-in expiry date barcode scanner. Simply scan a product barcode to auto-fill product details — name, batch number, and category. It functions as a barcode scanner app with expiration alerts, meaning scanned products are automatically tracked and you receive reminders before they expire.',
    },
    {
        question: 'How can Inventa help reduce food waste in my store?',
        answer: 'Inventa helps you prevent expired stock by providing daily expiration date reminders, organized FEFO inventory management, and real-time dashboards showing which products expire first. This grocery store waste reduction software approach helps you manage perishable inventory for small business operations, take timely markdowns, and prevent stock write-offs — so less food goes to waste.',
    },
    {
        question: 'What is the difference between FEFO and FIFO inventory management?',
        answer: 'FIFO (First-In, First-Out) sells the oldest stock first, while FEFO (First-Expired, First-Out) sells the product with the nearest expiry date first. For perishable goods inventory, FEFO is superior because it minimizes expired stock. Inventa supports both FEFO vs FIFO inventory software approaches, giving you full control over your inventory rotation strategy.',
    },
    {
        question: 'Can I use Inventa for my bakery or restaurant?',
        answer: 'Absolutely! Inventa offers purpose-built expiry date tracking for bakeries, restaurants, and food service businesses. Track best before dates on ingredients, manage your small business inventory system for fresh produce, and receive automated food inventory management with notifications — all tailored for perishable goods operations.',
    },
    {
        question: 'Is Inventa available for pharmacies and medical stores?',
        answer: 'Yes! Inventa is the ideal pharmacy expiry date tracking software and medicine expiry reminder app. It provides inventory tracking for pharmaceutical compliance with batch-level monitoring, automated expiration date reminders, and full FEFO inventory management pharmacy support to ensure no expired medicines ever reach a customer.',
    },
];

// Helper function to generate meta tags
export const generateMetaTags = (pageKey) => {
    const config = pageSEO[pageKey] || defaultSEO;
    return {
        title: config.title,
        description: config.description,
        keywords: config.keywords?.join(', ') || defaultSEO.keywords.join(', '),
        canonical: `${BASE_URL}${config.path || '/'}`,
        noIndex: config.noIndex || false,
    };
};

// Helper function to update document title
export const updatePageTitle = (pageKey) => {
    const config = pageSEO[pageKey] || defaultSEO;
    document.title = config.title;
};

// Helper function to create Open Graph tags
export const generateOGTags = (pageKey, customImage = null) => {
    const config = pageSEO[pageKey] || defaultSEO;
    return {
        'og:title': config.title,
        'og:description': config.description,
        'og:url': `${BASE_URL}${config.path || '/'}`,
        'og:image': customImage || defaultSEO.ogImage,
        'og:type': 'website',
    };
};

export default {
    BASE_URL,
    defaultSEO,
    pageSEO,
    structuredData,
    commonFAQs,
    generateMetaTags,
    updatePageTitle,
    generateOGTags,
};
