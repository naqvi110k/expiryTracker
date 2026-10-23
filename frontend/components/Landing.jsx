import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  ArrowRight,
  ArrowUpRight,
  Bell,
  BookOpen,
  Boxes,
  Calendar,
  Camera,
  Check,
  CheckCircle2,
  ChevronDown,
  Clock,
  Download,
  FileText,
  Layers,
  Menu,
  MessageCircle,
  Moon,
  Package,
  Pill,
  Scan,
  ShieldCheck,
  ShoppingCart,
  Store,
  Sun,
  UtensilsCrossed,
  X,
  AlertTriangle
} from 'lucide-react';
import { commonFAQs, pageSEO } from '../utils/seoConfig';

const SAMPLE_LEDGER_ITEMS = [
  {
    name: 'Amoxicillin 500mg Capsules',
    category: 'Pharmacy · Rx',
    batch: 'LOT-8941A',
    qty: '48 boxes',
    expiry: 'Nov 02, 2026',
    daysLeft: '5d left',
    action: 'Pull to Front',
    tone: 'critical'
  },
  {
    name: ' Chobani Greek Yogurt 500g',
    category: 'Dairy & Chilled',
    batch: 'BT-2049C',
    qty: '18 tubs',
    expiry: 'Nov 16, 2026',
    daysLeft: '19d left',
    action: '25% Markdown',
    tone: 'warning'
  },
  {
    name: 'Similac Infant Formula Stage 1',
    category: 'Pediatric Nutrition',
    batch: 'LOT-4410B',
    qty: '32 tins',
    expiry: 'Nov 24, 2026',
    daysLeft: '27d left',
    action: 'Supplier Return',
    tone: 'warning'
  },
  {
    name: 'Oatly Barista Oat Milk 1L',
    category: 'Beverages',
    batch: 'OAT-9921X',
    qty: '120 cartons',
    expiry: 'Mar 18, 2027',
    daysLeft: '142d left',
    action: 'Healthy Stock',
    tone: 'good'
  }
];

const FEATURED_GUIDES = [
  {
    title: 'FIFO vs FEFO: Why Expiry-First Rotation Saves 4.2% in Retail Margin',
    slug: 'fifo-vs-fefo-inventory-rotation-guide',
    tag: 'Stock Rotation',
    readTime: '6 min read'
  },
  {
    title: 'Pharmacy Expiry Management: FDA & State Board Compliance Checklist',
    slug: 'pharmacy-expiry-date-tracking-guide',
    tag: 'Pharmacy Compliance',
    readTime: '8 min read'
  },
  {
    title: 'How to Reduce Grocery Shrinkage with Automated Markdown Schedules',
    slug: 'reduce-food-waste-grocery-stores',
    tag: 'Grocery Operations',
    readTime: '7 min read'
  }
];

const Landing = ({ onGetStarted }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeFaqIndex, setActiveFaqIndex] = useState(0);
  const [previewFilter, setPreviewFilter] = useState('all');

  // Interactive ROI & Shrinkage Simulator state
  const [monthlyTurnover, setMonthlyTurnover] = useState(25000);
  const [estimatedSpoilage, setEstimatedSpoilage] = useState(3.5);

  const navigate = useNavigate();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  const scrollToSection = (id) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const filteredLedger = SAMPLE_LEDGER_ITEMS.filter((item) => {
    if (previewFilter === 'expiring') return item.tone === 'critical' || item.tone === 'warning';
    if (previewFilter === 'healthy') return item.tone === 'good';
    return true;
  });

  // Calculations for interactive shrinkage calculator
  const annualLoss = Math.round(monthlyTurnover * (estimatedSpoilage / 100) * 12);
  const annualRecovered = Math.round(annualLoss * 0.78);
  const monthlyRecovered = Math.round(annualRecovered / 12);

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{pageSEO.home.title}</title>
        <meta name="description" content={pageSEO.home.description} />
        <meta name="keywords" content={pageSEO.home.keywords.join(', ')} />
        <link rel="canonical" href={`https://expiry-tracker.live${pageSEO.home.path}`} />
        <meta property="og:title" content={pageSEO.home.title} />
        <meta property="og:description" content={pageSEO.home.description} />
        <meta property="og:url" content={`https://expiry-tracker.live${pageSEO.home.path}`} />
        <meta name="twitter:title" content={pageSEO.home.title} />
        <meta name="twitter:description" content={pageSEO.home.description} />
      </Helmet>

      {/* ===== TOP NAVIGATION BAR ===== */}
      <header
        className={`sticky top-0 z-50 border-b transition-colors duration-150 ${
          darkMode
            ? 'bg-[#0A0A0A]/95 border-[#262626]'
            : 'bg-[#FAF9F6]/95 border-[#E4E4E0]'
        } backdrop-blur-sm`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          {/* Brand Mark */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] transition-transform duration-150 group-hover:scale-[1.02]">
              <Boxes size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-base tracking-tight leading-none">
                  Inventa
                </span>
                <span
                  className={`rounded px-1.5 py-0.5 text-[10px] font-mono font-medium border ${
                    darkMode
                      ? 'border-[#262626] bg-[#141414] text-[#A3A39E]'
                      : 'border-[#E4E4E0] bg-[#F3F2EE] text-[#4A4A46]'
                  }`}
                >
                  FEFO
                </span>
              </div>
              <p
                className={`text-[11px] leading-none mt-1 ${
                  darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'
                }`}
              >
                Shelf-Life &amp; Expiry Control
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-7 md:flex" aria-label="Primary Navigation">
            {[
              ['Features', 'features'],
              ['How It Works', 'how-it-works'],
              ['ROI Simulator', 'calculator'],
              ['Industries', 'industries'],
              ['FAQ', 'faq']
            ].map(([label, id]) => (
              <button
                key={label}
                onClick={() => scrollToSection(id)}
                className={`text-sm font-medium transition-colors cursor-pointer ${
                  darkMode
                    ? 'text-[#A3A39E] hover:text-[#F5F5F3]'
                    : 'text-[#4A4A46] hover:text-[#111111]'
                }`}
              >
                {label}
              </button>
            ))}
            <Link
              to="/expiry-calculator"
              className={`text-sm font-medium transition-colors ${
                darkMode
                  ? 'text-[#A3A39E] hover:text-[#F5F5F3]'
                  : 'text-[#4A4A46] hover:text-[#111111]'
              }`}
            >
              Calculator
            </Link>
            <Link
              to="/blog"
              className={`text-sm font-medium transition-colors ${
                darkMode
                  ? 'text-[#A3A39E] hover:text-[#F5F5F3]'
                  : 'text-[#4A4A46] hover:text-[#111111]'
              }`}
            >
              Guides
            </Link>
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2.5">
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors cursor-pointer ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                  : 'border-[#E4E4E0] bg-white text-[#4A4A46] hover:bg-[#F3F2EE]'
              }`}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>

            <Link
              to="/login"
              className={`hidden sm:inline-flex items-center h-9 px-3.5 text-xs font-semibold rounded-lg border transition-colors ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                  : 'border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE]'
              }`}
            >
              Sign In
            </Link>

            <Link
              to="/register"
              className="inline-flex items-center gap-1.5 h-9 px-4 text-xs font-semibold rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white transition-all active:translate-y-[1px]"
            >
              <span>Start Free</span>
              <ArrowRight size={13} />
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle navigation menu"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border md:hidden ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3]'
                  : 'border-[#E4E4E0] bg-white text-[#111111]'
              }`}
            >
              {mobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div
            className={`border-t md:hidden px-4 py-4 space-y-1.5 ${
              darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
            }`}
          >
            {[
              ['Features', 'features'],
              ['How It Works', 'how-it-works'],
              ['ROI Simulator', 'calculator'],
              ['Industries', 'industries'],
              ['FAQ', 'faq']
            ].map(([label, id]) => (
              <button
                key={label}
                onClick={() => scrollToSection(id)}
                className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
              >
                {label}
              </button>
            ))}
            <Link
              to="/expiry-calculator"
              className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              Shelf-Life Calculator
            </Link>
            <Link
              to="/blog"
              className="block w-full text-left px-3 py-2 text-sm font-medium rounded-lg hover:bg-black/5 dark:hover:bg-white/5"
            >
              Inventory Guides &amp; Blog
            </Link>
            <div className="pt-3 mt-2 border-t border-[#E4E4E0] dark:border-[#262626] grid grid-cols-2 gap-2">
              <Link
                to="/login"
                className="py-2.5 text-center text-xs font-semibold rounded-lg border border-[#CFCFC8] dark:border-[#262626]"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="py-2.5 text-center text-xs font-semibold rounded-lg bg-[#15803D] text-white"
              >
                Start Free
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* ===== HERO SECTION: ASYMMETRIC SPLIT + LIVE PRODUCT WORKSPACE ===== */}
      <section className="relative pt-12 pb-20 sm:pt-20 sm:pb-28 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-12 lg:gap-10 items-start">
            {/* Left Column: Editorial Value Proposition (6 Cols) */}
            <div className="lg:col-span-6 space-y-6 pt-2">
              {/* Eyebrow Pill */}
              <div className="inline-flex items-center gap-2.5 rounded-full border border-[#E4E4E0] dark:border-[#262626] bg-white dark:bg-[#141414] px-3.5 py-1.5">
                <span className="h-2 w-2 rounded-full bg-[#15803D] dark:bg-[#22C55E]" />
                <span className="text-xs font-medium text-[#4A4A46] dark:text-[#A3A39E]">
                  WhatsApp-Native Inventory Control
                </span>
                <span className="text-[#CFCFC8] dark:text-[#383838]">·</span>
                <span className="text-xs font-mono font-semibold text-[#15803D] dark:text-[#4ADE80]">
                  100% Free
                </span>
              </div>

              {/* Editorial Display Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-bold tracking-[-0.03em] leading-[1.08] text-[#111111] dark:text-[#F5F5F3]">
                Stop writing off expired inventory.{' '}
                <span className="font-editorial italic font-normal text-[#15803D] dark:text-[#4ADE80]">
                  Track every batch from a WhatsApp photo.
                </span>
              </h1>

              {/* Body Copy */}
              <p className="text-base sm:text-lg leading-relaxed text-[#4A4A46] dark:text-[#A3A39E] max-w-xl">
                Built for independent pharmacies, grocery stores, and local retailers. Snap a photo of any product label on WhatsApp—Inventa reads the batch number and expiry date in seconds, logs it to your ledger, and sends daily 9:00 AM alerts before stock goes bad.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2.5 h-12 px-6 rounded-lg bg-[#111111] hover:bg-[#262626] dark:bg-[#F5F5F3] dark:hover:bg-[#E4E4E0] text-[#FAF9F6] dark:text-[#0A0A0A] font-semibold text-sm transition-all active:translate-y-[1px]"
                >
                  <MessageCircle size={17} />
                  <span>Create Free Store Account</span>
                  <ArrowRight size={15} />
                </Link>

                <Link
                  to="/expiry-calculator"
                  className={`inline-flex items-center justify-center gap-2 h-12 px-5 rounded-lg border text-sm font-semibold transition-all active:translate-y-[1px] ${
                    darkMode
                      ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                      : 'border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE]'
                  }`}
                >
                  <Calendar size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                  <span>Try Shelf-Life Calculator</span>
                </Link>
              </div>

              {/* Micro-guarantees */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-[#767670] dark:text-[#A3A39E] pt-1">
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#15803D] dark:text-[#4ADE80]" />
                  No app download for staff
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#15803D] dark:text-[#4ADE80]" />
                  Works with dot-matrix &amp; thermal stamps
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Check size={14} className="text-[#15803D] dark:text-[#4ADE80]" />
                  1-click audit PDFs
                </span>
              </div>

              {/* Tabular Metrics Bar */}
              <div className="pt-6 border-t border-[#E4E4E0] dark:border-[#262626] grid grid-cols-3 gap-6 max-w-lg">
                <div>
                  <div className="tabular-data text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#F5F5F3]">
                    10,480+
                  </div>
                  <div className="text-xs text-[#767670] dark:text-[#6E6E68] mt-1">
                    Batches monitored
                  </div>
                </div>
                <div>
                  <div className="tabular-data text-2xl sm:text-3xl font-bold text-[#111111] dark:text-[#F5F5F3]">
                    1.8 sec
                  </div>
                  <div className="text-xs text-[#767670] dark:text-[#6E6E68] mt-1">
                    Label OCR speed
                  </div>
                </div>
                <div>
                  <div className="tabular-data text-2xl sm:text-3xl font-bold text-[#15803D] dark:text-[#4ADE80]">
                    78%
                  </div>
                  <div className="text-xs text-[#767670] dark:text-[#6E6E68] mt-1">
                    Waste reduction
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Authentic Product Workspace + WhatsApp Intake Card (6 Cols) */}
            <div className="lg:col-span-6 space-y-4">
              {/* Main Card: Live Inventory Ledger Preview */}
              <div
                className={`rounded-xl border overflow-hidden shadow-[0_12px_32px_-8px_rgba(17,17,17,0.07)] ${
                  darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                }`}
              >
                {/* Workspace Window Topbar */}
                <div
                  className={`flex flex-wrap items-center justify-between gap-2 px-4 py-3 border-b ${
                    darkMode ? 'bg-[#1A1A1A] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <div className="flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-full bg-[#CFCFC8] dark:bg-[#383838]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#CFCFC8] dark:bg-[#383838]" />
                      <span className="h-2.5 w-2.5 rounded-full bg-[#CFCFC8] dark:bg-[#383838]" />
                    </div>
                    <span className="text-xs font-semibold tracking-tight ml-1">
                      Inventa Shelf Ledger — GreenLeaf Pharmacy
                    </span>
                  </div>

                  {/* Interactive Filter Pills */}
                  <div className="flex items-center gap-1">
                    {[
                      ['all', 'All (4)'],
                      ['expiring', 'Action Needed (3)'],
                      ['healthy', 'Healthy (1)']
                    ].map(([key, label]) => (
                      <button
                        key={key}
                        onClick={() => setPreviewFilter(key)}
                        className={`px-2 py-1 rounded text-[11px] font-medium transition-colors cursor-pointer ${
                          previewFilter === key
                            ? 'bg-[#111111] text-white dark:bg-[#F5F5F3] dark:text-[#0A0A0A]'
                            : darkMode
                            ? 'text-[#A3A39E] hover:bg-[#222222]'
                            : 'text-[#4A4A46] hover:bg-[#EAE8E1]'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Ledger Table Rows */}
                <div className="divide-y divide-[#E4E4E0] dark:divide-[#262626]">
                  {filteredLedger.map((item) => {
                    const pillStyle =
                      item.tone === 'critical'
                        ? 'bg-[#FEF2F2] text-[#B91C1C] border-[#FECACA] dark:bg-[#2A1212] dark:text-[#F87171] dark:border-[#5E1A1A]'
                        : item.tone === 'warning'
                        ? 'bg-[#FFFBEB] text-[#B45309] border-[#FDE68A] dark:bg-[#271A0B] dark:text-[#FBBF24] dark:border-[#543813]'
                        : 'bg-[#F0FDF4] text-[#15803D] border-[#BBF7D0] dark:bg-[#0D2116] dark:text-[#4ADE80] dark:border-[#19422B]';

                    return (
                      <div
                        key={item.batch}
                        className="px-4 py-3.5 flex items-center justify-between gap-3 hover:bg-[#FAF9F6] dark:hover:bg-[#1A1A1A]/60 transition-colors"
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold truncate">{item.name}</p>
                          </div>
                          <div className="flex items-center gap-2 mt-1 text-xs text-[#767670] dark:text-[#A3A39E]">
                            <span>{item.category}</span>
                            <span>·</span>
                            <span className="font-mono text-[11px] px-1.5 py-0.5 rounded bg-[#F3F2EE] dark:bg-[#1A1A1A] text-[#111111] dark:text-[#F5F5F3]">
                              {item.batch}
                            </span>
                            <span>·</span>
                            <span className="tabular-data">{item.qty}</span>
                          </div>
                        </div>

                        <div className="text-right shrink-0">
                          <span
                            className={`inline-flex items-center gap-1.5 rounded-md border px-2.5 py-0.5 text-[11px] font-mono font-medium ${pillStyle}`}
                          >
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                item.tone === 'critical'
                                  ? 'bg-[#DC2626]'
                                  : item.tone === 'warning'
                                  ? 'bg-[#D97706]'
                                  : 'bg-[#16A34A]'
                              }`}
                            />
                            {item.action} · {item.daysLeft}
                          </span>
                          <div className="text-[11px] font-mono text-[#767670] dark:text-[#6E6E68] mt-1">
                            Exp: {item.expiry}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Ledger Footer */}
                <div
                  className={`px-4 py-2.5 border-t flex items-center justify-between text-xs ${
                    darkMode
                      ? 'bg-[#1A1A1A] border-[#262626] text-[#A3A39E]'
                      : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#4A4A46]'
                  }`}
                >
                  <span className="inline-flex items-center gap-1.5">
                    <Bell size={13} className="text-[#15803D] dark:text-[#4ADE80]" />
                    Next WhatsApp Digest: Tomorrow at 09:00 AM
                  </span>
                  <span className="font-mono text-[11px] font-medium text-[#111111] dark:text-[#F5F5F3]">
                    FEFO Sorted
                  </span>
                </div>
              </div>

              {/* Secondary Card: Realistic WhatsApp Label Capture Flow */}
              <div
                className={`rounded-xl border p-4 sm:p-5 ${
                  darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                }`}
              >
                <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-[#E4E4E0] dark:border-[#262626]">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#15803D] text-white">
                      <Camera size={15} />
                    </div>
                    <div>
                      <div className="text-xs font-bold">Instant WhatsApp Label Intake</div>
                      <div className="text-[11px] text-[#767670] dark:text-[#A3A39E]">
                        Staff sends a photo · AI extracts batch &amp; expiry in 1.8s
                      </div>
                    </div>
                  </div>
                  <span className="rounded-md border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-2 py-0.5 text-[11px] font-mono font-medium text-[#15803D] dark:text-[#4ADE80]">
                    99.4% OCR Match
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                  {/* Simulated Stamped Package Label */}
                  <div
                    className={`sm:col-span-5 rounded-lg border p-3 ${
                      darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
                    }`}
                  >
                    <div className="text-[10px] font-mono uppercase tracking-wider text-[#767670] dark:text-[#6E6E68] mb-1">
                      Label Photo Sent
                    </div>
                    <div className="rounded border border-dashed border-[#CFCFC8] dark:border-[#383838] bg-white dark:bg-[#141414] p-2.5 font-mono text-xs space-y-1">
                      <div className="font-bold text-[#111111] dark:text-[#F5F5F3]">
                        AMOXICILLIN 500MG
                      </div>
                      <div className="text-[11px] text-[#4A4A46] dark:text-[#A3A39E]">
                        LOT: 8941A
                      </div>
                      <div className="text-[11px] font-semibold text-[#B91C1C] dark:text-[#F87171]">
                        EXP: 02 / 11 / 2026
                      </div>
                    </div>
                  </div>

                  {/* Extracted Reply Bubble */}
                  <div
                    className={`sm:col-span-7 rounded-lg border p-3 ${
                      darkMode
                        ? 'bg-[#0D2116]/60 border-[#19422B]'
                        : 'bg-[#F0FDF4]/80 border-[#BBF7D0]'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold text-[#15803D] dark:text-[#4ADE80] mb-1.5">
                      <span className="inline-flex items-center gap-1">
                        <CheckCircle2 size={13} />
                        Inventa Bot Reply
                      </span>
                      <span className="font-mono text-[10px]">09:14 AM</span>
                    </div>
                    <p className="text-xs leading-relaxed text-[#111111] dark:text-[#F5F5F3]">
                      Detected <strong>Amoxicillin 500mg</strong> · Batch{' '}
                      <code className="font-mono font-semibold">LOT-8941A</code> · Expires{' '}
                      <strong className="underline">Nov 2, 2026</strong>.
                    </p>
                    <div className="mt-2 flex items-center justify-between text-[11px] text-[#4A4A46] dark:text-[#A3A39E]">
                      <span>Reply &ldquo;YES&rdquo; to save to inventory</span>
                      <span className="font-mono font-bold text-[#15803D] dark:text-[#4ADE80]">
                        ✓ Confirmed
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ASYMMETRIC BENTO GRID: CORE CAPABILITIES ===== */}
      <section id="features" className="py-20 sm:py-24 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] mb-3">
              <Scan size={14} />
              <span>Purpose-Built Shelf Intelligence</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em] text-[#111111] dark:text-[#F5F5F3]">
              Everything your store needs to stop expiration write-offs.
            </h2>
            <p className="mt-3 text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
              Point-of-sale systems only track what sells at the register—they don&rsquo;t warn you when a case in the backroom is two weeks from expiring. Inventa closes that gap without adding paperwork.
            </p>
          </div>

          {/* 12-Column Asymmetric Bento Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Bento Card 1: Wide (7 Cols) */}
            <div
              className={`lg:col-span-7 rounded-xl border p-6 sm:p-8 flex flex-col justify-between ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0] dark:border-[#262626]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#767670] dark:text-[#A3A39E]">
                    01 · Vision OCR Engine
                  </span>
                  <span className="rounded-md border border-[#E4E4E0] dark:border-[#262626] bg-[#F3F2EE] dark:bg-[#1A1A1A] px-2.5 py-0.5 text-[11px] font-mono">
                    Gemini Vision AI
                  </span>
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-5">
                  Reads stamped lot codes, curved bottles, and pharmacy blisters
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                  Whether your suppliers use dot-matrix inkjets, embossed foil blisters, or thermal labels, Inventa extracts the product name, category, batch number, and exact expiry date from a single smartphone photo.
                </p>
              </div>

              {/* Visual UI Micro-Preview */}
              <div
                className={`mt-6 rounded-lg border p-4 ${
                  darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                }`}
              >
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#767670] dark:text-[#6E6E68]">
                      Extracted SKU
                    </div>
                    <div className="text-xs font-semibold mt-1">Panadol Extra 500mg</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#767670] dark:text-[#6E6E68]">
                      Batch / Lot
                    </div>
                    <div className="text-xs font-mono font-semibold mt-1">BN-40921X</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#767670] dark:text-[#6E6E68]">
                      Expiry Date
                    </div>
                    <div className="text-xs font-mono font-semibold text-[#B45309] dark:text-[#FBBF24] mt-1">
                      2026-11-30
                    </div>
                  </div>
                  <div>
                    <div className="text-[10px] font-mono uppercase text-[#767670] dark:text-[#6E6E68]">
                      Verification
                    </div>
                    <div className="text-xs font-semibold text-[#15803D] dark:text-[#4ADE80] mt-1">
                      Human Confirmed
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bento Card 2: Narrow (5 Cols) */}
            <div
              className={`lg:col-span-5 rounded-xl border p-6 sm:p-8 flex flex-col justify-between ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0] dark:border-[#262626]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#767670] dark:text-[#A3A39E]">
                    02 · Proactive Alerts
                  </span>
                  <Bell size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-5">
                  09:00 AM Daily WhatsApp Digest
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                  You don&rsquo;t need to remember to log into a dashboard. Every morning at 9:00 AM, receive a concise summary of batches hitting their 30-day, 14-day, and 7-day windows.
                </p>
              </div>

              <div
                className={`mt-6 rounded-lg border p-4 space-y-2.5 ${
                  darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                }`}
              >
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold">Morning Shelf Digest</span>
                  <span className="font-mono text-[11px] text-[#767670]">09:00 AM</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-[#FEF2F2] dark:bg-[#2A1212] text-[#B91C1C] dark:text-[#F87171]">
                  <span>Critical (&le; 7 days)</span>
                  <span className="font-mono font-bold">3 batches</span>
                </div>
                <div className="flex items-center justify-between text-xs py-1.5 px-2.5 rounded bg-[#FFFBEB] dark:bg-[#271A0B] text-[#B45309] dark:text-[#FBBF24]">
                  <span>Return Window (&le; 30 days)</span>
                  <span className="font-mono font-bold">8 batches</span>
                </div>
              </div>
            </div>

            {/* Bento Card 3: Narrow (5 Cols) */}
            <div
              className={`lg:col-span-5 rounded-xl border p-6 sm:p-8 flex flex-col justify-between ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0] dark:border-[#262626]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#767670] dark:text-[#A3A39E]">
                    03 · FEFO Stock Rotation
                  </span>
                  <Layers size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-5">
                  First-Expired, First-Out Priority
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                  Automatically ranks multiple shipments of the same SKU by expiration date so floor staff pull short-dated cartons to the front row first.
                </p>
              </div>

              <div className="mt-6 space-y-2">
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                    darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Lot #A19 · Expires in 8d</div>
                    <div className="text-[11px] text-[#767670]">14 units remaining</div>
                  </div>
                  <span className="rounded px-2 py-1 font-mono text-[11px] font-semibold bg-[#FFFBEB] text-[#B45309] dark:bg-[#271A0B] dark:text-[#FBBF24]">
                    FRONT SHELF
                  </span>
                </div>
                <div
                  className={`flex items-center justify-between p-3 rounded-lg border text-xs ${
                    darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                  }`}
                >
                  <div>
                    <div className="font-semibold">Lot #B04 · Expires in 92d</div>
                    <div className="text-[11px] text-[#767670]">40 units in reserve</div>
                  </div>
                  <span className="rounded px-2 py-1 font-mono text-[11px] font-semibold bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                    BACK STORAGE
                  </span>
                </div>
              </div>
            </div>

            {/* Bento Card 4: Wide (7 Cols) */}
            <div
              className={`lg:col-span-7 rounded-xl border p-6 sm:p-8 flex flex-col justify-between ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div>
                <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0] dark:border-[#262626]">
                  <span className="text-xs font-semibold uppercase tracking-wider text-[#767670] dark:text-[#A3A39E]">
                    04 · Compliance &amp; Supplier Credits
                  </span>
                  <FileText size={16} className="text-[#15803D] dark:text-[#4ADE80]" />
                </div>

                <h3 className="text-xl sm:text-2xl font-bold tracking-tight mt-5">
                  One-Click PDF Audit &amp; Distributor Return Reports
                </h3>
                <p className="mt-2.5 text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                  Pharmaceutical distributors and food wholesalers often issue full credit only when returns are submitted 30 days prior to expiry. Generate clean, itemized PDF manifests or bulk-import supplier CSVs in seconds.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-2.5 pt-4 border-t border-[#E4E4E0] dark:border-[#262626]">
                {[
                  'Supplier Return Manifests (PDF)',
                  'Bulk CSV & Excel Import',
                  'Inspection-Ready Batch Logs',
                  'Multi-Channel WhatsApp & Telegram'
                ].map((feature) => (
                  <span
                    key={feature}
                    className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium ${
                      darkMode
                        ? 'border-[#262626] bg-[#0A0A0A] text-[#F5F5F3]'
                        : 'border-[#E4E4E0] bg-[#FAF9F6] text-[#111111]'
                    }`}
                  >
                    <Check size={13} className="text-[#15803D] dark:text-[#4ADE80]" />
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SUNKEN TONAL SECTION: HOW IT WORKS IN 3 STEPS ===== */}
      <section
        id="how-it-works"
        className={`py-20 sm:py-24 border-b ${
          darkMode
            ? 'bg-[#141414] border-[#262626]'
            : 'bg-[#F3F2EE] border-[#E4E4E0]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-14">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] mb-3">
              <MessageCircle size={14} />
              <span>Zero Staff Training Required</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em]">
              From delivery carton to tracked inventory in three steps.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                step: '01',
                title: 'Snap a Photo on WhatsApp',
                desc: 'When a new shipment arrives, point your phone camera at the product label or expiry stamp and send it to our verified WhatsApp number.',
                meta: 'Takes ~3 seconds per item'
              },
              {
                step: '02',
                title: 'Confirm Extracted Details',
                desc: 'Inventa replies immediately with the parsed product name, batch code, and expiration date. Reply "YES" to confirm or type a quick edit.',
                meta: 'Human-in-the-loop accuracy'
              },
              {
                step: '03',
                title: 'Receive Morning Alerts',
                desc: 'Your item is now monitored 24/7. Get automated WhatsApp reminders 30, 14, and 7 days before expiry so you can discount or return stock.',
                meta: 'Automated daily at 09:00 AM'
              }
            ].map((item) => (
              <div
                key={item.step}
                className={`rounded-xl border p-6 sm:p-7 flex flex-col justify-between ${
                  darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between pb-4 border-b border-[#E4E4E0] dark:border-[#262626]">
                    <span className="font-mono text-2xl font-bold text-[#15803D] dark:text-[#4ADE80]">
                      {item.step}
                    </span>
                    <span className="text-xs font-mono text-[#767670] dark:text-[#6E6E68]">
                      STEP {item.step}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold tracking-tight mt-5">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-sm text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-[#E4E4E0] dark:border-[#262626] flex items-center gap-2 text-xs font-medium text-[#15803D] dark:text-[#4ADE80]">
                  <CheckCircle2 size={14} />
                  <span>{item.meta}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== INTERACTIVE ROI & SHRINKAGE SIMULATOR ===== */}
      <section id="calculator" className="py-20 sm:py-24 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-5 space-y-4">
              <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
                <span>Margin Recovery Estimator</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em]">
                See how much profit your shelves lose to silent expiry.
              </h2>
              <p className="text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                Retail industry benchmarks show independent pharmacies and grocers lose between 2% and 5% of inventory value annually to unnoticed expiration. Adjust the sliders to estimate your store&rsquo;s recoverable margin.
              </p>

              <div className="pt-2">
                <Link
                  to="/expiry-calculator"
                  className="inline-flex items-center gap-2 text-sm font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline"
                >
                  <span>Open Full Shelf-Life &amp; FEFO Date Calculator</span>
                  <ArrowUpRight size={15} />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div
                className={`rounded-xl border p-6 sm:p-8 space-y-6 ${
                  darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                }`}
              >
                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label
                      htmlFor="turnover-slider"
                      className="text-xs font-semibold uppercase tracking-wider text-[#4A4A46] dark:text-[#A3A39E]"
                    >
                      Monthly Perishable Inventory Value
                    </label>
                    <span className="tabular-data text-xl font-bold">
                      ${monthlyTurnover.toLocaleString()}
                    </span>
                  </div>
                  <input
                    id="turnover-slider"
                    type="range"
                    min="2000"
                    max="100000"
                    step="1000"
                    value={monthlyTurnover}
                    onChange={(e) => setMonthlyTurnover(Number(e.target.value))}
                    className="w-full h-2 bg-[#E4E4E0] dark:bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#767670]">
                    <span>$2,000 / mo</span>
                    <span>$50,000 / mo</span>
                    <span>$100,000 / mo</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <label
                      htmlFor="spoilage-slider"
                      className="text-xs font-semibold uppercase tracking-wider text-[#4A4A46] dark:text-[#A3A39E]"
                    >
                      Estimated Unsold Expiry Rate
                    </label>
                    <span className="tabular-data text-xl font-bold">
                      {estimatedSpoilage}%
                    </span>
                  </div>
                  <input
                    id="spoilage-slider"
                    type="range"
                    min="1"
                    max="8"
                    step="0.5"
                    value={estimatedSpoilage}
                    onChange={(e) => setEstimatedSpoilage(Number(e.target.value))}
                    className="w-full h-2 bg-[#E4E4E0] dark:bg-[#262626] rounded-lg appearance-none cursor-pointer accent-[#15803D]"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-[#767670]">
                    <span>1.0% (Dry Goods)</span>
                    <span>3.5% (Retail Avg)</span>
                    <span>8.0% (Fresh Dairy / Rx)</span>
                  </div>
                </div>

                {/* High-Contrast Results Ledger */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                  <div
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                    }`}
                  >
                    <span className="text-[11px] font-medium text-[#767670] block">
                      Annual Expiry Loss
                    </span>
                    <span className="tabular-data text-2xl font-bold text-[#DC2626] dark:text-[#F87171] mt-1 block">
                      -${annualLoss.toLocaleString()}
                    </span>
                  </div>

                  <div
                    className={`p-4 rounded-lg border ${
                      darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-[#FAF9F6] border-[#E4E4E0]'
                    }`}
                  >
                    <span className="text-[11px] font-medium text-[#767670] block">
                      Monthly Saved (~78%)
                    </span>
                    <span className="tabular-data text-2xl font-bold text-[#111111] dark:text-[#F5F5F3] mt-1 block">
                      +${monthlyRecovered.toLocaleString()}/mo
                    </span>
                  </div>

                  <div className="p-4 rounded-lg border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116]">
                    <span className="text-[11px] font-medium text-[#15803D] dark:text-[#4ADE80] block">
                      Annual Margin Recovered
                    </span>
                    <span className="tabular-data text-2xl font-bold text-[#15803D] dark:text-[#4ADE80] mt-1 block">
                      +${annualRecovered.toLocaleString()}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <p className="text-xs text-[#767670] dark:text-[#A3A39E]">
                    Based on early 30-day supplier returns &amp; timely 14-day clearance markdowns.
                  </p>
                  <Link
                    to="/register"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-10 px-5 rounded-lg bg-[#15803D] hover:bg-[#14532D] text-white text-xs font-semibold shrink-0 transition-colors"
                  >
                    <span>Start Saving Free</span>
                    <ArrowRight size={14} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== INDUSTRIES & EDITORIAL GUIDES ===== */}
      <section id="industries" className="py-20 sm:py-24 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] mb-3">
              <Store size={14} />
              <span>Built for Perishable &amp; Regulated Retail</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em]">
              Tailored workflows for every shelf environment.
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {[
              {
                icon: Pill,
                title: 'Pharmacies & Chemists',
                tag: 'Rx Lot Control',
                desc: 'Catch short-dated medicines 30 days early to claim full distributor return credit and maintain strict patient safety.'
              },
              {
                icon: ShoppingCart,
                title: 'Grocery & Supermarkets',
                tag: 'Fresh & Packaged',
                desc: 'Monitor dairy, beverages, infant formula, and packaged goods with automated 7-day clearance markdown prompts.'
              },
              {
                icon: UtensilsCrossed,
                title: 'Bakeries & Commercial Kitchens',
                tag: 'Ingredient Prep',
                desc: 'Track bulk flour, cream, sauces, and perishable prep batches from receiving date to consumption.'
              },
              {
                icon: Package,
                title: 'Wholesale Distributors',
                tag: 'Case & Pallet Lots',
                desc: 'Import supplier CSV manifests in bulk and generate formal expiration audit sheets across multiple storage zones.'
              }
            ].map((ind) => {
              const Icon = ind.icon;
              return (
                <div
                  key={ind.title}
                  className={`p-6 rounded-xl border flex flex-col justify-between ${
                    darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between pb-3.5 border-b border-[#E4E4E0] dark:border-[#262626]">
                      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F3F2EE] dark:bg-[#1A1A1A] text-[#15803D] dark:text-[#4ADE80]">
                        <Icon size={18} />
                      </div>
                      <span className="font-mono text-[10px] font-medium px-2 py-0.5 rounded border border-[#E4E4E0] dark:border-[#262626] text-[#767670] dark:text-[#A3A39E]">
                        {ind.tag}
                      </span>
                    </div>
                    <h3 className="text-base font-bold tracking-tight mt-4">
                      {ind.title}
                    </h3>
                    <p className="mt-2 text-xs sm:text-sm text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed">
                      {ind.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Editorial Guides Bar (Preserves SEO Internal Linking) */}
          <div
            className={`rounded-xl border p-6 sm:p-8 ${
              darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E4E4E0] dark:border-[#262626]">
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80]">
                  Editorial Resource Library
                </div>
                <h3 className="text-xl font-bold tracking-tight mt-1">
                  Guides on FEFO Rotation, Pharmacy Compliance &amp; Shrinkage Reduction
                </h3>
              </div>
              <Link
                to="/blog"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3.5 py-2 rounded-lg border border-[#CFCFC8] dark:border-[#383838] bg-white dark:bg-[#0A0A0A] hover:bg-[#FAF9F6] shrink-0"
              >
                <BookOpen size={14} />
                <span>View All 12 Guides</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-6">
              {FEATURED_GUIDES.map((guide) => (
                <Link
                  key={guide.slug}
                  to={`/blog/${guide.slug}`}
                  className={`group rounded-lg border p-4 transition-colors ${
                    darkMode
                      ? 'bg-[#0A0A0A] border-[#262626] hover:border-[#383838]'
                      : 'bg-white border-[#E4E4E0] hover:border-[#CFCFC8]'
                  }`}
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-[#767670] mb-2">
                    <span className="text-[#15803D] dark:text-[#4ADE80] font-medium">
                      {guide.tag}
                    </span>
                    <span>{guide.readTime}</span>
                  </div>
                  <h4 className="text-sm font-bold leading-snug group-hover:text-[#15803D] dark:group-hover:text-[#4ADE80] transition-colors">
                    {guide.title}
                  </h4>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== FREQUENTLY ASKED QUESTIONS ===== */}
      <section id="faq" className="py-20 sm:py-24 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mb-12">
            <div className="text-xs font-semibold uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] mb-2">
              Common Questions
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold tracking-[-0.025em]">
              Frequently Asked Questions
            </h2>
            <p className="mt-2 text-sm sm:text-base text-[#4A4A46] dark:text-[#A3A39E]">
              Everything you need to know about WhatsApp setup, data privacy, and how Inventa works.
            </p>
          </div>

          <div className="space-y-3" itemScope itemType="https://schema.org/FAQPage">
            {commonFAQs.map((faq, index) => {
              const isOpen = activeFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`border rounded-xl overflow-hidden transition-colors ${
                    darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                  }`}
                  itemProp="mainEntity"
                  itemScope
                  itemType="https://schema.org/Question"
                >
                  <button
                    onClick={() => setActiveFaqIndex(isOpen ? null : index)}
                    className="flex w-full items-center justify-between p-5 text-left focus:outline-none cursor-pointer"
                    aria-expanded={isOpen}
                  >
                    <span className="text-sm sm:text-base font-semibold pr-4" itemProp="name">
                      {faq.question}
                    </span>
                    <span
                      className={`shrink-0 rounded-md p-1 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-[#15803D] dark:text-[#4ADE80]' : 'text-[#767670]'
                      }`}
                    >
                      <ChevronDown size={16} />
                    </span>
                  </button>

                  <div
                    className={`accordion-content ${isOpen ? 'open' : ''}`}
                    itemProp="acceptedAnswer"
                    itemScope
                    itemType="https://schema.org/Answer"
                  >
                    <div
                      className="px-5 pb-5 text-sm text-[#4A4A46] dark:text-[#A3A39E] leading-relaxed border-t border-[#E4E4E0] dark:border-[#262626] pt-3.5"
                      itemProp="text"
                    >
                      {faq.answer}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== HIGH-CONTRAST EDITORIAL CTA SECTION ===== */}
      <section className="py-20 sm:py-24 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl bg-[#111111] dark:bg-[#141414] dark:border dark:border-[#262626] text-[#FAF9F6] p-8 sm:p-14 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3.5 py-1 text-xs font-mono text-[#4ADE80] mb-5">
              <span>Ready in under 2 minutes · No credit card required</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] max-w-2xl mx-auto leading-tight">
              Protect your shelf margin{' '}
              <span className="font-editorial italic font-normal text-[#4ADE80]">
                starting today.
              </span>
            </h2>
            <p className="mt-4 text-sm sm:text-base text-[#A3A39E] max-w-xl mx-auto leading-relaxed">
              Connect your store&rsquo;s WhatsApp number, snap your first product label, and let Inventa handle expiry tracking and daily alerts automatically.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row justify-center gap-3">
              <Link
                to="/register"
                className="inline-flex items-center justify-center gap-2 h-12 px-7 rounded-lg bg-[#15803D] hover:bg-[#16A34A] text-white text-sm font-semibold transition-all active:translate-y-[1px]"
              >
                <span>Create Free Account</span>
                <ArrowRight size={15} />
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center h-12 px-6 rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 text-white text-sm font-semibold transition-all"
              >
                Sign In to Dashboard
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== ARCHITECTURAL FOOTER ===== */}
      <footer
        className={`py-14 text-xs ${
          darkMode ? 'bg-[#0A0A0A] text-[#A3A39E]' : 'bg-[#FAF9F6] text-[#4A4A46]'
        }`}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-[#E4E4E0] dark:border-[#262626]">
            {/* Col 1: Brand */}
            <div className="space-y-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A]">
                  <Boxes size={15} />
                </div>
                <span className="font-bold text-sm tracking-tight text-[#111111] dark:text-[#F5F5F3]">
                  Inventa
                </span>
              </div>
              <p className="text-xs leading-relaxed text-[#767670] dark:text-[#6E6E68] max-w-xs">
                WhatsApp-powered expiry date tracking and FEFO stock rotation for pharmacies, grocery stores, and independent retailers.
              </p>
              <div className="pt-1 font-mono text-[11px] text-[#767670]">
                Support:{' '}
                <a
                  href="mailto:support@inventa.app"
                  className="text-[#15803D] dark:text-[#4ADE80] hover:underline"
                >
                  support@inventa.app
                </a>
              </div>
            </div>

            {/* Col 2: Product */}
            <div className="space-y-2.5">
              <div className="font-semibold uppercase tracking-wider text-[11px] text-[#111111] dark:text-[#F5F5F3]">
                Platform
              </div>
              <ul className="space-y-2">
                <li>
                  <button onClick={() => scrollToSection('features')} className="hover:underline cursor-pointer">
                    Features &amp; OCR
                  </button>
                </li>
                <li>
                  <button onClick={() => scrollToSection('how-it-works')} className="hover:underline cursor-pointer">
                    How It Works
                  </button>
                </li>
                <li>
                  <Link to="/expiry-calculator" className="hover:underline">
                    Shelf-Life Calculator
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection('industries')} className="hover:underline cursor-pointer">
                    Supported Industries
                  </button>
                </li>
                <li>
                  <Link to="/blog" className="hover:underline">
                    Inventory Guides &amp; Blog
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 3: Company & Legal */}
            <div className="space-y-2.5">
              <div className="font-semibold uppercase tracking-wider text-[11px] text-[#111111] dark:text-[#F5F5F3]">
                Company &amp; Legal
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to="/about" className="hover:underline">
                    About Inventa
                  </Link>
                </li>
                <li>
                  <Link to="/contact" className="hover:underline">
                    Contact Support
                  </Link>
                </li>
                <li>
                  <Link to="/privacy-policy" className="hover:underline">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link to="/terms-of-service" className="hover:underline">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>

            {/* Col 4: Account Access */}
            <div className="space-y-2.5">
              <div className="font-semibold uppercase tracking-wider text-[11px] text-[#111111] dark:text-[#F5F5F3]">
                Store Access
              </div>
              <ul className="space-y-2">
                <li>
                  <Link to="/login" className="hover:underline">
                    Sign In to Workspace
                  </Link>
                </li>
                <li>
                  <Link to="/register" className="hover:underline">
                    Register Store Account
                  </Link>
                </li>
              </ul>
              <div className="pt-2 flex items-center gap-2 text-[11px] font-mono text-[#15803D] dark:text-[#4ADE80]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#15803D] dark:bg-[#4ADE80]" />
                <span>WhatsApp Gateway Operational</span>
              </div>
            </div>
          </div>

          <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-[#767670]">
            <div>&copy; {new Date().getFullYear()} Inventa. All rights reserved.</div>
            <div className="flex items-center gap-4">
              <Link to="/about" className="hover:underline">
                About
              </Link>
              <span>·</span>
              <Link to="/contact" className="hover:underline">
                Contact
              </Link>
              <span>·</span>
              <Link to="/privacy-policy" className="hover:underline">
                Privacy
              </Link>
              <span>·</span>
              <Link to="/terms-of-service" className="hover:underline">
                Terms
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
