import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { blogArticles as contentArticles } from '../utils/blogData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SITE = 'https://expiry-tracker.live';

// Commit 8: Static pages pre-rendering — expanded to cover all public routes
// including legal pages and blog index. Each gets a unique index.html with
// correct title, description, and canonical URL baked in for crawlers.
const pages = [
  {
    path: '/expiry-calculator',
    title: 'Expiry Date & Shelf Life Calculator | Inventa',
    description: 'Calculate product expiry dates, shelf life, and days remaining. Perfect for pharmacy, grocery, and retail owners. Get FEFO recommendations instantly.',
    h1: 'Expiry Date & Shelf Life Calculator',
    canonical: 'https://expiry-tracker.live/expiry-calculator',
  },
  {
    path: '/blog',
    title: 'Inventory & Expiry Management Blog | Inventa',
    description: 'Expert articles on inventory management, expiry date tracking, and reducing waste for pharmacies, grocery stores, and retail shops.',
    h1: 'Inventory Management Tips',
    canonical: 'https://expiry-tracker.live/blog',
  },
  {
    // Auth pages must not be indexed: they carry no search value and were
    // previously served with "index, follow" and listed in the sitemap.
    path: '/login',
    title: 'Login | Inventa Free Expiry Date Tracking',
    description: 'Log in to your Inventa account to manage stock, track product expiration dates, and configure automated WhatsApp expiry alerts.',
    h1: 'Login to Inventa',
    canonical: 'https://expiry-tracker.live/login',
    noIndex: true,
    stripSchema: true,
  },
  {
    path: '/register',
    title: 'Register | Inventa Free Expiry & Inventory Tracker',
    description: 'Create your free Inventa account. Start tracking expiry dates and managing retail inventory using our AI-powered WhatsApp tool.',
    h1: 'Create your free Inventa account',
    canonical: 'https://expiry-tracker.live/register',
    noIndex: true,
    stripSchema: true,
  },
  // Commit 8: Legal pages now get their own static HTML for bots
  {
    path: '/privacy-policy',
    title: 'Privacy Policy | Inventa',
    description: 'Read how Inventa collects, uses, and protects your personal data. Our privacy policy explains your rights and our data practices.',
    h1: 'Privacy Policy',
    canonical: 'https://expiry-tracker.live/privacy-policy',
  },
  {
    path: '/terms-of-service',
    title: 'Terms of Service | Inventa',
    description: 'Review the terms and conditions governing your use of Inventa, the free AI-powered inventory and expiry date tracking platform.',
    h1: 'Terms of Service',
    canonical: 'https://expiry-tracker.live/terms-of-service',
  },
  {
    path: '/about',
    title: 'About Us | Inventa Expiry & Inventory Tracker',
    description: 'Discover the story behind Inventa. Our mission is to help pharmacies, grocery stores, and retailers eliminate expired inventory waste with AI-powered WhatsApp tracking.',
    h1: 'About Inventa',
    canonical: 'https://expiry-tracker.live/about',
  },
  {
    path: '/contact',
    title: 'Contact Us | Inventa Expiry & Inventory Support',
    description: 'Get in touch with the Inventa support team. Send us a message, ask questions, or request assistance with our AI-powered WhatsApp inventory tracker.',
    h1: 'Contact Inventa Support',
    canonical: 'https://expiry-tracker.live/contact',
  },
];

// Commit 9: Individual blog article pre-rendering
// Each blog slug gets its own /blog/[slug]/index.html with article-specific
// title, description, og:image, and canonical — so link-scrapers (Slack,
// Discord, Twitter) and search engines receive the correct metadata without
// executing JavaScript.
//
// 2026-10-23: The meta list is now aligned with the articles that actually
// exist in utils/blogData.js. Removed three ghost entries that had no
// article (food-waste-statistics, best-inventory-apps,
// whatsapp-inventory-alerts) and added the three real articles that were
// missing here and therefore served the homepage title to crawlers
// (ultimate-guide-expiry-tracking-food-retailers,
// supermarket-food-waste-reduction-us-eu-retailers,
// free-expiry-date-tracking-software-small-business-guide).
const blogArticles = [
  {
    slug: 'how-to-track-expiry',
    title: 'Pharmacy Expiry Date Tracking: The Complete Guide | Inventa',
    description: 'Learn the exact system pharmacy owners use for precise expiry tracking, batch number monitoring, and regulatory compliance. FEFO guide included.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'mastering-fifo-method-modern-warehousing',
    title: 'FIFO Method: Warehousing & Grocery Store Restock Guide',
    description: 'Master First-In, First-Out (FIFO) inventory in warehouses & grocery stores. Learn how to restock food, maintain FIFO storage, & eliminate product waste.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'reducing-expiry-losses',
    title: '7-Step Action Plan to Reduce Expiry Losses in Retail',
    description: 'Stop retail inventory write-offs! Discover proven strategies for expiry management, stock audits, smart markdowns, & food waste reduction.',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'ultimate-guide-expiry-tracking-food-retailers',
    title: 'Stock Audits & Expiry Loss Prevention Guide',
    description: 'Step-by-step stock audit guide for food retailers. Cover cycle counts, FEFO rotation, and using digital tools to stop inventory losses.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'supermarket-food-waste-reduction-us-eu-retailers',
    title: 'Supermarket Food Waste Reduction Guide',
    description: 'Learn how supermarkets use smart expiry tracking to reduce food waste, meet compliance targets, and protect profitability.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'free-expiry-date-tracking-software-small-business-guide',
    title: 'Free Expiry Tracking Software: Small Business Guide',
    description: 'A complete guide for small businesses on using free expiry tracking software to eliminate stock losses and protect profit margins.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'track-food-expiry-dates-grocery-store',
    title: 'How Grocery Stores Track Expiration Dates: Free Spoilage Guide',
    description: 'Learn how grocery stores use FEFO rotation & smart tracking to monitor food expiration dates, reduce spoilage, & automate date checks.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'fefo-inventory-management',
    title: 'FEFO Meaning & FEFO vs FIFO Inventory Management Guide',
    description: 'What is FEFO meaning? Compare FEFO vs FIFO inventory systems for grocery stores, food retail, & pharmacies. Stop product write-offs with FEFO rotation.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'free-pharmacy-expiry-date-tracking-software',
    title: 'Free Expiry Date Tracking Software for Small Pharmacies',
    description: 'Discover why small pharmacies need specialized pharmacy expiry date tracking software for FDA compliance, batch tracking, & automated alerts.',
    coverImage: 'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'excel-expiry-date-tracking-template',
    title: 'How to Track Expiry Dates in Excel: Free Template vs. App Guide',
    description: 'Learn how to build an Excel expiry date tracker using formulas, conditional formatting, and macro-free alerts. Compare Excel vs. automated WhatsApp tracking.',
    coverImage: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'pharmacy-expiry-date-log-sheet-pdf',
    title: 'Pharmacy Expiry Date Log Sheet & Digital Compliance Guide',
    description: 'Free pharmacy expiry date log sheet format guide for drugstores. Learn FDA batch number compliance, automated expiry tracking, and digital registers.',
    coverImage: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&q=80&w=800',
  },
  {
    slug: 'fefo-vs-lifo-vs-fifo-comparison-chart',
    title: 'FEFO vs. LIFO vs. FIFO: Inventory Rotation Comparison Chart',
    description: 'Compare FEFO vs LIFO vs FIFO inventory rotation methods with our visual chart. Learn which stock management system prevents food waste and write-offs.',
    coverImage: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&q=80&w=800',
  }
];

const distPath = path.join(__dirname, '../dist');
const indexPath = path.join(distPath, 'index.html');

if (!fs.existsSync(indexPath)) {
  console.error('index.html not found in dist. Run build first.');
  process.exit(1);
}

const indexContent = fs.readFileSync(indexPath, 'utf-8');

// ---------------------------------------------------------------------------
// 2026-10-23: Pre-render the article BODY, not just meta tags.
// Previously the generated HTML contained ~18 visible words (title + h1);
// the full article only existed after React executed. The converter below
// renders the same markdown-lite strings used by blogData.js content arrays
// (## / ### headings, **bold**, [text](/path) links, pipe tables, lists).
// ---------------------------------------------------------------------------
function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function inlineHtml(s) {
  let t = escapeHtml(s);
  t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
  t = t.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  return t;
}

function blockToHtml(block) {
  const text = (block || '').trim();
  if (!text) return '';
  if (text.startsWith('### ')) return `<h3>${inlineHtml(text.slice(4))}</h3>`;
  if (text.startsWith('## ')) return `<h2>${inlineHtml(text.slice(3))}</h2>`;
  if (text.startsWith('# ')) return `<h2>${inlineHtml(text.slice(2))}</h2>`;

  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);
  const isSeparator = l => /^\|?[\s:|-]+\|?$/.test(l) && l.includes('-');

  // Pipe table (header row, separator row, body rows)
  if (lines.length > 2 && lines[0].includes('|') && isSeparator(lines[1])) {
    const cells = r => r.replace(/^\||\|$/g, '').split('|').map(c => inlineHtml(c.trim()));
    const head = cells(lines[0]);
    const bodyRows = lines.slice(2).map(cells);
    return `<table><thead><tr>${head.map(c => `<th>${c}</th>`).join('')}</tr></thead><tbody>${bodyRows.map(r => `<tr>${r.map(c => `<td>${c}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
  }
  if (lines.length > 1 && lines.every(l => /^[-•*]\s+/.test(l))) {
    return `<ul>${lines.map(l => `<li>${inlineHtml(l.replace(/^[-•*]\s+/, ''))}</li>`).join('')}</ul>`;
  }
  if (lines.length > 1 && lines.every(l => /^\d+[.)]\s+/.test(l))) {
    return `<ol>${lines.map(l => `<li>${inlineHtml(l.replace(/^\d+[.)]\s+/, ''))}</li>`).join('')}</ol>`;
  }
  return `<p>${lines.map(inlineHtml).join('<br>')}</p>`;
}

// Related-guides footer appended to each pre-rendered article. It guarantees
// crawlable links to the highest-value pages from every article — notably
// /blog/reducing-expiry-losses, which previously had zero inbound article
// links despite having the most Search Console impressions.
function relatedLinksHtml(currentSlug) {
  const links = [
    { href: '/blog/reducing-expiry-losses', text: '7-Step Action Plan to Reduce Expiry Losses in Retail' },
    { href: '/blog/fefo-inventory-management', text: 'FEFO Meaning & FEFO vs FIFO Inventory Management Guide' },
    { href: '/expiry-calculator', text: 'Expiry Date & Shelf Life Calculator' },
    { href: '/blog/how-to-track-expiry', text: 'Pharmacy Expiry Date Tracking: The Complete Guide' },
  ].filter(l => l.href !== `/blog/${currentSlug}`);
  return `<nav aria-label="Related guides"><h2>Related guides</h2><ul>${links.map(l => `<li><a href="${l.href}">${l.text}</a></li>`).join('')}</ul></nav>`;
}

function articleBodyHtml(article, currentSlug) {
  const blocks = (article.content || []).map(blockToHtml).join('\n');
  return `<main id="seo-prerender"><article>\n${blocks}\n</article>\n${relatedLinksHtml(currentSlug)}\n</main>`;
}

function blogIndexBodyHtml() {
  const items = contentArticles.map(a => `<li><a href="/blog/${a.slug}">${escapeHtml(a.title)}</a> — ${escapeHtml(a.description)}</li>`).join('');
  return `<main id="seo-prerender"><h2>Expiry & inventory management guides</h2><ul>${items}</ul><p>Free tool: <a href="/expiry-calculator">Expiry Date & Shelf Life Calculator</a></p></main>`;
}

function homeGuidesHtml() {
  const picks = [
    { href: '/blog/how-to-track-expiry', text: 'Pharmacy Expiry Date Tracking: The Complete Guide' },
    { href: '/blog/reducing-expiry-losses', text: '7-Step Action Plan to Reduce Expiry Losses in Retail' },
    { href: '/blog/fefo-inventory-management', text: 'FEFO Meaning & FEFO vs FIFO Inventory Management Guide' },
    { href: '/blog/mastering-fifo-method-modern-warehousing', text: 'FIFO Method: Warehousing & Grocery Store Restock Guide' },
    { href: '/blog/track-food-expiry-dates-grocery-store', text: 'How Grocery Stores Track Expiration Dates' },
    { href: '/expiry-calculator', text: 'Expiry Date & Shelf Life Calculator' },
  ];
  return `<nav id="seo-guides" aria-label="Popular guides"><h2>Popular expiry tracking guides</h2><ul>${picks.map(l => `<li><a href="${l.href}">${l.text}</a></li>`).join('')}</ul></nav>`;
}


// 2026-10-23 (Phase 2): Build a page-specific FAQPage schema from the
// "**Q: ...**" entries that already exist inside article content, so the
// structured data matches questions visibly answered on the page.
function faqSchemaFromArticle(article) {
  const items = [];
  for (const block of article.content || []) {
    const m = block.trim().match(/^\*\*Q:\s*(.+?)\*\*\n([\s\S]+)$/);
    if (m) {
      const answer = m[2].replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/\*\*/g, '').trim();
      items.push({ '@type': 'Question', name: m[1].trim(), acceptedAnswer: { '@type': 'Answer', text: answer } });
    }
  }
  return items.length >= 2 ? { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items } : null;
}

// 2026-10-23 (Phase 2): Real crawlable content for the calculator page.
// Previously its pre-rendered HTML had ~14 visible words — no formula, no
// example, nothing matching "shelf life calculator" / "expiry date
// calculator" searches. This block mirrors what the tool does.
const calculatorFaqs = [
  { q: 'How do you calculate an expiry date from the manufacturing date?', a: 'Add the shelf life to the manufacturing (production) date: Expiry Date = Manufacturing Date + Shelf Life. For example, a product manufactured on 1 January with a 24-month shelf life expires on 1 January two years later.' },
  { q: 'What is the shelf life formula?', a: 'Total Shelf Life = Expiry Date − Manufacturing Date. Remaining Shelf Life = Expiry Date − Today. Remaining Shelf Life % = (Remaining Shelf Life / Total Shelf Life) × 100.' },
  { q: 'What does remaining shelf life percentage mean?', a: 'It shows how much of a product\'s usable life is left. Above 50% is healthy stock; 25–50% should be monitored and prioritised for sale; under 25% needs action — markdown, transfer, or use first under FEFO rotation.' },
  { q: 'Is the expiry date the same as the best before date?', a: 'No. An expiry (use by) date is a safety limit — do not sell or use the product after it. A best before date is a quality guide; the product may still be usable afterwards, but taste, texture, or potency can decline.' },
];

function calculatorBodyHtml() {
  return `<main id="seo-prerender"><article>
<h2>Expiry Date & Shelf Life Calculator</h2>
<p>Enter a product's manufacturing date and its shelf life, and this free calculator works out the expiry date, the total shelf life in days, how many days remain, and the remaining shelf life percentage — the numbers retailers, pharmacies, and grocery stores need for FEFO rotation and near-expiry decisions.</p>
<h2>The Expiry Date Formula</h2>
<p><strong>Expiry Date = Manufacturing Date + Shelf Life.</strong> If a product was manufactured on 1 January 2026 with a shelf life of 6 months, its expiry date is 1 July 2026. The reverse formulas are just as useful: <strong>Total Shelf Life = Expiry Date − Manufacturing Date</strong>, and <strong>Remaining Shelf Life % = (Days Remaining / Total Shelf Life) × 100</strong>.</p>
<h2>How It Works</h2>
<ol>
<li>Find the manufacturing (production) date printed on the label — often marked MFG, MFD, or Packed On.</li>
<li>Find the shelf life on the label or specification (for example, "use within 12 months of manufacture").</li>
<li>Enter both values above and press Calculate.</li>
<li>Read the expiry date, days remaining, and remaining shelf life percentage, then act on it: sell first, mark down, or remove.</li>
</ol>
<h2>Worked Example</h2>
<p>A pharmacy receives a vitamin batch manufactured on <strong>1 March 2026</strong> with a shelf life of <strong>18 months</strong>. Expiry date = 1 March 2026 + 18 months = <strong>1 September 2027</strong>. If today were 1 March 2027, the batch would have 184 days remaining out of 549 total — a remaining shelf life of about <strong>34%</strong>, so it should be prioritised for sale under <a href="/blog/fefo-inventory-management">FEFO rotation</a> rather than left behind newer stock.</p>
<h2>What the Remaining Shelf Life Percentage Means</h2>
<ul>
<li><strong>Above 50%</strong> — healthy stock, no action needed.</li>
<li><strong>25–50%</strong> — monitor it, sell before fresher batches, plan promotions.</li>
<li><strong>Under 25%</strong> — act now: markdown, transfer between branches, or supplier return.</li>
<li><strong>0% or negative</strong> — expired. Remove from sale and record the write-off.</li>
</ul>
<p>Checking one product at a time is a start; tracking every batch automatically — with alerts before dates pass — is what prevents losses at scale. See how in the guide to <a href="/blog/free-expiry-date-tracking-software-small-business-guide">free expiry tracking software for small businesses</a> and the <a href="/blog/reducing-expiry-losses">7-step plan to reduce expiry losses in retail</a>.</p>
<h2>Frequently Asked Questions</h2>
${calculatorFaqs.map(f => `<p><strong>Q: ${f.q}</strong><br>${f.a}</p>`).join(' ')}
</article></main>`;
}

function calculatorSchemas() {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Expiry Date & Shelf Life Calculator',
      url: 'https://expiry-tracker.live/expiry-calculator',
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
    },
    {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: calculatorFaqs.map(f => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })),
    },
  ];
}

// Per-article structured data. Replaces the generic sitewide blob
// (SoftwareApplication + AggregateRating + homepage FAQPage) that was
// previously copy-pasted into every page's raw HTML, articles included.
function blogPostingSchema(article, meta, canonical) {
  const graph = [
    {
      '@type': 'BlogPosting',
      headline: meta.title,
      description: meta.description,
      image: meta.coverImage,
      author: { '@type': 'Person', name: article.author || 'Inventa Team' },
      publisher: { '@type': 'Organization', name: 'Inventa', url: SITE },
      datePublished: article.date,
      dateModified: article.date,
      mainEntityOfPage: canonical,
    },
    {
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE}/blog` },
        { '@type': 'ListItem', position: 3, name: meta.title, item: canonical },
      ],
    },
  ];
  return { '@context': 'https://schema.org', '@graph': graph };
}

function schemaScriptTag(schemaObj) {
  return `<script type="application/ld+json">\n${JSON.stringify(schemaObj, null, 2)}\n</script>`;
}

function stripGenericSchema(html) {
  return html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/g, '');
}

/**
 * Generates a pre-rendered static HTML file for a given path with
 * overridden title, description, canonical, og tags, and h1.
 * Extra options:
 *  - bodyHtml: crawlable content injected inside #root after the h1
 *  - schemas: array of JSON-LD objects to embed in <head>
 *  - stripSchema: remove the generic sitewide JSON-LD blocks first
 */
function generatePage({ path: pagePath, title, description, h1, canonical, ogImage, noIndex, bodyHtml, schemas, stripSchema }) {
  const pageDir = path.join(distPath, pagePath.substring(1));
  if (!fs.existsSync(pageDir)) {
    fs.mkdirSync(pageDir, { recursive: true });
  }

  let newHtml = indexContent;

  if (stripSchema) {
    newHtml = stripGenericSchema(newHtml);
  }

  // Replace title
  newHtml = newHtml.replace(
    /<title data-react-helmet="true">.*?<\/title>/,
    `<title data-react-helmet="true">${title}</title>`
  );

  // Replace description
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" name="description"\s*content="[^"]*"\s*\/>/g,
    `<meta data-react-helmet="true" name="description" content="${description}" />`
  );

  // Replace og:title
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" property="og:title" content="[^"]*" \/>/g,
    `<meta data-react-helmet="true" property="og:title" content="${title}" />`
  );

  // Replace og:description
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" property="og:description"\s*content="[^"]*"\s*\/>/g,
    `<meta data-react-helmet="true" property="og:description" content="${description}" />`
  );

  // Replace og:url
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" property="og:url" content="[^"]*" \/>/g,
    `<meta data-react-helmet="true" property="og:url" content="${canonical}" />`
  );

  // Replace og:image if custom image provided
  if (ogImage) {
    newHtml = newHtml.replace(
      /<meta data-react-helmet="true" property="og:image" content="[^"]*" \/>/g,
      `<meta data-react-helmet="true" property="og:image" content="${ogImage}" />`
    );
  }

  // Replace twitter:title
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" name="twitter:title" content="[^"]*" \/>/g,
    `<meta data-react-helmet="true" name="twitter:title" content="${title}" />`
  );

  // Replace twitter:description
  newHtml = newHtml.replace(
    /<meta data-react-helmet="true" name="twitter:description"\s*content="[^"]*"\s*\/>/g,
    `<meta data-react-helmet="true" name="twitter:description" content="${description}" />`
  );

  // Replace twitter:image if custom image provided
  if (ogImage) {
    newHtml = newHtml.replace(
      /<meta data-react-helmet="true" name="twitter:image" content="[^"]*" \/>/g,
      `<meta data-react-helmet="true" name="twitter:image" content="${ogImage}" />`
    );
  }

  // Update canonical
  newHtml = newHtml.replace(
    /<link data-react-helmet="true" rel="canonical" href="[^"]*" \/>/g,
    `<link data-react-helmet="true" rel="canonical" href="${canonical}" />`
  );

  // Inject noindex robots meta if needed
  if (noIndex) {
    newHtml = newHtml.replace(
      '<meta name="robots" content="index, follow',
      '<meta name="robots" content="noindex, nofollow'
    );
  }

  // Update H1 tag — plain and visible. Pre-rendered headings must never be
  // visually hidden: hidden text is a Google spam-policy violation.
  if (h1) {
    newHtml = newHtml.replace(
      /<h1[^>]*>.*?<\/h1>/,
      `<h1>${h1}</h1>`
    );
  }

  // Inject page-specific structured data before </head>
  if (schemas && schemas.length) {
    newHtml = newHtml.replace('</head>', `${schemas.map(schemaScriptTag).join('\n')}\n</head>`);
  }

  // Inject crawlable pre-rendered body inside #root, right after the h1.
  // React replaces #root children on mount, so users see the app as before;
  // crawlers and no-JS clients get the real content immediately.
  if (bodyHtml) {
    if (/<div id="root">[\s\S]*?<\/h1>/.test(newHtml)) {
      newHtml = newHtml.replace(/(<div id="root">[\s\S]*?<\/h1>)/, `$1\n${bodyHtml}`);
    } else {
      newHtml = newHtml.replace('</body>', `${bodyHtml}\n</body>`);
    }
  }

  fs.writeFileSync(path.join(pageDir, 'index.html'), newHtml);
  console.log(`✓ Generated SEO HTML for ${pagePath}`);
}

// Commit 8: Generate static pages
pages.forEach(page => {
  if (page.path === '/blog') {
    generatePage({ ...page, bodyHtml: blogIndexBodyHtml(), stripSchema: true });
  } else if (page.path === '/expiry-calculator') {
    generatePage({ ...page, bodyHtml: calculatorBodyHtml(), stripSchema: true, schemas: calculatorSchemas() });
  } else {
    generatePage(page);
  }
});

// Commit 9 + 2026-10-23: Generate individual blog article pages with
// pre-rendered article body and BlogPosting/BreadcrumbList schema.
blogArticles.forEach(meta => {
  const article = contentArticles.find(a => a.slug === meta.slug);
  if (!article) {
    console.warn(`⚠ No article content found in blogData.js for slug: ${meta.slug} — skipping`);
    return;
  }
  const canonical = `https://expiry-tracker.live/blog/${meta.slug}`;
  generatePage({
    path: `/blog/${meta.slug}`,
    title: meta.title,
    description: meta.description,
    h1: meta.title,
    canonical,
    ogImage: meta.coverImage,
    stripSchema: true,
    schemas: [blogPostingSchema(article, meta, canonical), faqSchemaFromArticle(article)].filter(Boolean),
    bodyHtml: articleBodyHtml(article, meta.slug),
  });
});

// 2026-10-23: Give the homepage crawlable links to the top guides.
// dist/index.html is the homepage; other pages were generated above from the
// pristine template read earlier, so this only affects "/".
const homeHtml = indexContent.replace(/(<div id="root">[\s\S]*?<\/h1>)/, `$1\n${homeGuidesHtml()}`);
if (homeHtml !== indexContent) {
  fs.writeFileSync(indexPath, homeHtml);
  console.log('✓ Injected crawlable guide links into homepage HTML');
}

console.log(`\n✅ Pre-rendering complete: ${pages.length} static pages + ${blogArticles.length} blog articles`);
