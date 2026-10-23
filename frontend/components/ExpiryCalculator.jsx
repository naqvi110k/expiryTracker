import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Boxes,
  ArrowRight,
  Calendar,
  Clock,
  ShieldCheck,
  AlertCircle,
  ChevronDown,
  Info,
  CheckCircle2,
  Trash2,
  RotateCcw,
  Settings,
  Sun,
  Moon
} from 'lucide-react';
import { pageSEO } from '../utils/seoConfig';

const ExpiryCalculator = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [activeTab, setActiveTab] = useState('calculate-date');

  // Mode 1: Calculate Expiry Date state
  const [mfgDate, setMfgDate] = useState(new Date().toISOString().split('T')[0]);
  const [shelfLifeValue, setShelfLifeValue] = useState(6);
  const [shelfLifeUnit, setShelfLifeUnit] = useState('months');
  const [calculatedExpiry, setCalculatedExpiry] = useState('');
  const [daysFromToday, setDaysFromToday] = useState(0);

  // Mode 2: Calculate Days Remaining state
  const [expiryInputDate, setExpiryInputDate] = useState(() => {
    const defaultDate = new Date();
    defaultDate.setMonth(defaultDate.getMonth() + 3);
    return defaultDate.toISOString().split('T')[0];
  });
  const [productCategory, setProductCategory] = useState('food');
  const [openFaqIdx, setOpenFaqIdx] = useState(0);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    window.scrollTo(0, 0);
  }, []);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  useEffect(() => {
    if (!mfgDate || !shelfLifeValue) return;
    const mfg = new Date(mfgDate);
    const val = parseInt(shelfLifeValue, 10);
    if (isNaN(val)) return;

    const expiry = new Date(mfg);
    if (shelfLifeUnit === 'days') expiry.setDate(expiry.getDate() + val);
    else if (shelfLifeUnit === 'weeks') expiry.setDate(expiry.getDate() + val * 7);
    else if (shelfLifeUnit === 'months') expiry.setMonth(expiry.getMonth() + val);
    else if (shelfLifeUnit === 'years') expiry.setFullYear(expiry.getFullYear() + val);

    setCalculatedExpiry(expiry.toISOString().split('T')[0]);

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    expiry.setHours(0, 0, 0, 0);
    const diffTime = expiry - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));
    setDaysFromToday(diffDays);
  }, [mfgDate, shelfLifeValue, shelfLifeUnit]);

  const getDaysRemainingData = () => {
    if (!expiryInputDate) return null;

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryInputDate);
    expiry.setHours(0, 0, 0, 0);

    const diffTime = expiry - today;
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    let status = 'safe';
    let percent = 100;

    if (diffDays < 0) {
      status = 'expired';
      percent = 0;
    } else if (diffDays <= 7) {
      status = 'critical';
      percent = Math.max(5, Math.round((diffDays / 7) * 15));
    } else if (diffDays <= 30) {
      status = 'warning';
      percent = Math.round(15 + ((diffDays - 7) / 23) * 25);
    } else if (diffDays <= 90) {
      status = 'near';
      percent = Math.round(40 + ((diffDays - 30) / 60) * 40);
    } else {
      status = 'safe';
      percent = 100;
    }

    let recommendation = '';
    if (status === 'expired') {
      recommendation =
        'Pull this batch from shelves immediately and log it as an expired write-off in accordance with local safety regulations.';
    } else if (status === 'critical') {
      if (productCategory === 'medicine') {
        recommendation =
          'CRITICAL PHARMACY COMPLIANCE: Immediately quarantine this batch from active dispensing. Do not dispense to patients.';
      } else if (productCategory === 'food') {
        recommendation =
          'IMMEDIATE CLEARANCE: Move to the front clearance bin today and apply a 50%–70% markdown to recover cost of goods.';
      } else {
        recommendation =
          'URGENT MARKDOWN: Apply a 50%+ clearance discount and position at point-of-sale to clear immediately.';
      }
    } else if (status === 'warning') {
      if (productCategory === 'medicine') {
        recommendation =
          'DISTRIBUTOR RETURN WINDOW: Most pharmaceutical wholesalers accept return credit requests 30 days prior to expiration. Generate a return manifest now.';
      } else if (productCategory === 'food') {
        recommendation =
          'FEFO MARKDOWN: Pull all units to the front row and apply a 25%–35% promotional tag to accelerate turnover.';
      } else {
        recommendation =
          'PROMOTIONAL ROTATION: Bundle with fast-moving items or apply a 25% discount tag to clear before the 7-day critical window.';
      }
    } else if (status === 'near') {
      recommendation =
        'FEFO ROTATION: Practice strict First-Expired, First-Out rotation. Place this batch in front of newer deliveries. No markdown needed yet.';
    } else {
      recommendation =
        'HEALTHY STOCK: Batch has ample shelf life remaining. Keep in standard storage and monitor via automated daily digests.';
    }

    return { diffDays, status, recommendation, percent };
  };

  const daysRemainingData = getDaysRemainingData();

  const formatDateFriendly = (dateStr) => {
    if (!dateStr) return '';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const schemaMarkup = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: pageSEO.expiryCalculator.title,
    url: `https://expiry-tracker.live${pageSEO.expiryCalculator.path}`,
    description: pageSEO.expiryCalculator.description,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    offers: {
      '@type': 'Offer',
      price: '0.00',
      priceCurrency: 'USD'
    }
  };

  const inputClass = darkMode
    ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F3] focus:border-[#22C55E]'
    : 'bg-white border-[#CFCFC8] text-[#111111] focus:border-[#15803D]';

  const faqData = [
    {
      q: 'How do you calculate the expiration date of a product?',
      a: 'The expiration date is calculated by adding the manufacturer-specified shelf life duration to the manufacturing date. For example, if a product is manufactured on January 1, 2026, and has a shelf life of 6 months, its calculated expiry date is July 1, 2026.'
    },
    {
      q: 'What is the difference between Expiry Date and Best Before Date?',
      a: 'An Expiry Date indicates when a product is no longer safe for consumption or medical use (such as pharmaceuticals, infant formula, or fresh dairy) and must be pulled from shelves. A Best Before date indicates peak quality rather than a strict safety cutoff.'
    },
    {
      q: 'Why is FEFO superior to FIFO for retail inventory?',
      a: 'FIFO (First-In, First-Out) rotates stock by delivery date. FEFO (First-Expired, First-Out) rotates stock by actual expiration date. Because distributor shipments can occasionally carry older lot codes, FEFO guarantees the earliest-expiring batch always sells first.'
    },
    {
      q: 'Can this tool calculate expiry for pharmaceuticals and groceries?',
      a: 'Yes. Select your product category in the Days Remaining tab to receive tailored FEFO action prompts—such as 30-day pharmaceutical distributor return alerts or grocery markdown schedules.'
    }
  ];

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{pageSEO.expiryCalculator.title}</title>
        <meta name="description" content={pageSEO.expiryCalculator.description} />
        <meta name="keywords" content={pageSEO.expiryCalculator.keywords.join(', ')} />
        <link rel="canonical" href={`https://expiry-tracker.live${pageSEO.expiryCalculator.path}`} />
        <meta property="og:title" content={pageSEO.expiryCalculator.title} />
        <meta property="og:description" content={pageSEO.expiryCalculator.description} />
        <meta property="og:url" content={`https://expiry-tracker.live${pageSEO.expiryCalculator.path}`} />
        <meta name="twitter:title" content={pageSEO.expiryCalculator.title} />
        <meta name="twitter:description" content={pageSEO.expiryCalculator.description} />
        <script type="application/ld+json">{JSON.stringify(schemaMarkup)}</script>
      </Helmet>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
          darkMode ? 'bg-[#0A0A0A]/95 border-[#262626]' : 'bg-[#FAF9F6]/95 border-[#E4E4E0]'
        }`}
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A]">
              <Boxes size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight leading-none">Inventa</div>
              <div className="text-[11px] text-[#767670] mt-1 leading-none">Shelf-Life Calculator</div>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className={`hidden sm:block text-sm font-medium ${
                darkMode ? 'text-[#A3A39E] hover:text-white' : 'text-[#4A4A46] hover:text-[#111111]'
              }`}
            >
              Home
            </Link>
            <Link
              to="/blog"
              className={`hidden sm:block text-sm font-medium ${
                darkMode ? 'text-[#A3A39E] hover:text-white' : 'text-[#4A4A46] hover:text-[#111111]'
              }`}
            >
              Guides
            </Link>
            <button
              onClick={toggleTheme}
              aria-label="Toggle color theme"
              className={`flex h-9 w-9 items-center justify-center rounded-lg border cursor-pointer ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3]'
                  : 'border-[#E4E4E0] bg-white text-[#4A4A46]'
              }`}
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <Link
              to="/register"
              className="rounded-lg bg-[#15803D] hover:bg-[#14532D] px-4 py-2 text-xs font-semibold text-white transition-colors"
            >
              Start Free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Header */}
      <section className="pt-12 pb-10 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-3.5 py-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
            <Calendar size={13} />
            <span>Free Retail &amp; Pharmacy Utility</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] mb-3">
            Expiry Date &amp; Shelf-Life Calculator
          </h1>
          <p className={`mx-auto max-w-2xl text-sm sm:text-base leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Calculate exact expiration dates from manufacturing timestamps, check remaining shelf-life days, and get instant FEFO stock rotation recommendations.
          </p>
        </div>
      </section>

      {/* Main Calculator Workspace */}
      <main className="py-12 sm:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          {/* Segmented Mode Selector */}
          <div className="flex justify-center mb-8">
            <div
              className={`grid grid-cols-2 p-1 rounded-xl border max-w-md w-full ${
                darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
              }`}
            >
              <button
                onClick={() => setActiveTab('calculate-date')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'calculate-date'
                    ? 'bg-[#111111] text-white dark:bg-[#F5F5F3] dark:text-[#0A0A0A] shadow-xs'
                    : darkMode
                    ? 'text-[#A3A39E] hover:text-white'
                    : 'text-[#4A4A46] hover:text-[#111111]'
                }`}
              >
                <Calendar size={14} />
                <span>Calculate Expiry Date</span>
              </button>
              <button
                onClick={() => setActiveTab('days-remaining')}
                className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  activeTab === 'days-remaining'
                    ? 'bg-[#111111] text-white dark:bg-[#F5F5F3] dark:text-[#0A0A0A] shadow-xs'
                    : darkMode
                    ? 'text-[#A3A39E] hover:text-white'
                    : 'text-[#4A4A46] hover:text-[#111111]'
                }`}
              >
                <Clock size={14} />
                <span>Days Remaining &amp; FEFO</span>
              </button>
            </div>
          </div>

          {/* Calculator Split Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            {/* Input Column (6 Cols) */}
            <div className="md:col-span-6">
              <div
                className={`rounded-xl border p-6 ${
                  darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                }`}
              >
                <h2 className="text-sm font-bold uppercase tracking-wider mb-5 pb-3 border-b border-[#E4E4E0] dark:border-[#262626] flex items-center gap-2">
                  <Settings size={15} className="text-[#15803D] dark:text-[#4ADE80]" />
                  <span>Batch Parameters</span>
                </h2>

                {activeTab === 'calculate-date' ? (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="mfg-date" className="block text-xs font-semibold mb-1.5">
                        Manufacturing / Packing Date
                      </label>
                      <input
                        type="date"
                        id="mfg-date"
                        value={mfgDate}
                        onChange={(e) => setMfgDate(e.target.value)}
                        className={`w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none border transition-colors ${inputClass}`}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="shelf-life-qty" className="block text-xs font-semibold mb-1.5">
                          Shelf-Life Duration
                        </label>
                        <input
                          type="number"
                          id="shelf-life-qty"
                          min="1"
                          value={shelfLifeValue}
                          onChange={(e) => setShelfLifeValue(Math.max(1, parseInt(e.target.value) || ''))}
                          className={`w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none border transition-colors ${inputClass}`}
                        />
                      </div>
                      <div>
                        <label htmlFor="shelf-life-unit" className="block text-xs font-semibold mb-1.5">
                          Duration Unit
                        </label>
                        <select
                          id="shelf-life-unit"
                          value={shelfLifeUnit}
                          onChange={(e) => setShelfLifeUnit(e.target.value)}
                          className={`w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none border transition-colors ${inputClass}`}
                        >
                          <option value="days">Days</option>
                          <option value="weeks">Weeks</option>
                          <option value="months">Months</option>
                          <option value="years">Years</option>
                        </select>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setMfgDate(new Date().toISOString().split('T')[0]);
                        setShelfLifeValue(6);
                        setShelfLifeUnit('months');
                      }}
                      className={`mt-2 flex items-center justify-center gap-1.5 w-full py-2 px-4 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                        darkMode
                          ? 'border-[#262626] text-[#A3A39E] hover:bg-[#1A1A1A]'
                          : 'border-[#E4E4E0] text-[#4A4A46] hover:bg-[#F3F2EE]'
                      }`}
                    >
                      <RotateCcw size={12} />
                      <span>Reset to Default</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="expiry-date" className="block text-xs font-semibold mb-1.5">
                        Stamped Expiry Date
                      </label>
                      <input
                        type="date"
                        id="expiry-date"
                        value={expiryInputDate}
                        onChange={(e) => setExpiryInputDate(e.target.value)}
                        className={`w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none border transition-colors ${inputClass}`}
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-xs font-semibold mb-1.5">
                        Product Sector
                      </label>
                      <select
                        id="category"
                        value={productCategory}
                        onChange={(e) => setProductCategory(e.target.value)}
                        className={`w-full rounded-lg px-3.5 py-2.5 text-sm focus:outline-none border transition-colors ${inputClass}`}
                      >
                        <option value="food">Grocery / Food &amp; Dairy</option>
                        <option value="medicine">Pharmacy / Medicine (Rx &amp; OTC)</option>
                        <option value="cosmetics">Cosmetics &amp; Personal Care</option>
                        <option value="household">Household &amp; Chemicals</option>
                        <option value="other">Other Perishables</option>
                      </select>
                    </div>

                    <div className="flex gap-2 pt-1">
                      {[
                        { label: '+15 Days', days: 15 },
                        { label: '+1 Month', days: 30 },
                        { label: '+6 Months', days: 180 }
                      ].map((item) => (
                        <button
                          key={item.label}
                          type="button"
                          onClick={() => {
                            const d = new Date();
                            d.setDate(d.getDate() + item.days);
                            setExpiryInputDate(d.toISOString().split('T')[0]);
                          }}
                          className={`flex-1 py-2 px-3 rounded-lg border text-xs font-mono font-medium transition-colors cursor-pointer ${
                            darkMode
                              ? 'border-[#262626] bg-[#0A0A0A] text-[#A3A39E] hover:border-[#383838]'
                              : 'border-[#E4E4E0] bg-[#FAF9F6] text-[#4A4A46] hover:border-[#CFCFC8]'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Output Column (6 Cols) */}
            <div className="md:col-span-6">
              {activeTab === 'calculate-date' ? (
                <div
                  className={`rounded-xl border p-6 space-y-5 ${
                    darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                  }`}
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider pb-3 border-b border-[#E4E4E0] dark:border-[#262626]">
                    Calculated Expiration Result
                  </h2>

                  <div>
                    <div className="text-xs text-[#767670] font-medium">Expiration Date</div>
                    <div className="tabular-data text-2xl sm:text-3xl font-bold text-[#15803D] dark:text-[#4ADE80] mt-1">
                      {formatDateFriendly(calculatedExpiry)}
                    </div>
                    <div className="text-xs font-mono text-[#767670] mt-1">
                      ISO Stamp: {calculatedExpiry}
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#E4E4E0] dark:border-[#262626]">
                    <div className="text-xs text-[#767670] font-medium mb-2">Shelf Status Today</div>
                    {daysFromToday < 0 ? (
                      <div className="inline-flex items-center gap-2 rounded-md border border-[#FECACA] bg-[#FEF2F2] dark:border-[#5E1A1A] dark:bg-[#2A1212] px-3 py-1.5 text-xs font-mono font-semibold text-[#B91C1C] dark:text-[#F87171]">
                        <Trash2 size={14} />
                        <span>Expired {Math.abs(daysFromToday)} days ago</span>
                      </div>
                    ) : daysFromToday === 0 ? (
                      <div className="inline-flex items-center gap-2 rounded-md border border-[#FDE68A] bg-[#FFFBEB] dark:border-[#543813] dark:bg-[#271A0B] px-3 py-1.5 text-xs font-mono font-semibold text-[#B45309] dark:text-[#FBBF24]">
                        <Clock size={14} />
                        <span>Expires Today</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-2 rounded-md border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-3 py-1.5 text-xs font-mono font-semibold text-[#15803D] dark:text-[#4ADE80]">
                        <CheckCircle2 size={14} />
                        <span>{daysFromToday} days remaining</span>
                      </div>
                    )}
                  </div>

                  <div
                    className={`rounded-lg border p-4 text-xs leading-relaxed ${
                      darkMode ? 'bg-[#0A0A0A] border-[#262626] text-[#A3A39E]' : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#4A4A46]'
                    }`}
                  >
                    <div className="flex gap-2.5">
                      <Info size={16} className="text-[#15803D] dark:text-[#4ADE80] shrink-0 mt-0.5" />
                      <div>
                        <strong>Storage Note:</strong> Based on a shelf life of{' '}
                        <strong>
                          {shelfLifeValue} {shelfLifeUnit}
                        </strong>{' '}
                        from {formatDateFriendly(mfgDate)}. Always verify ambient temperature compliance.
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  className={`rounded-xl border p-6 space-y-5 ${
                    darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                  }`}
                >
                  <h2 className="text-sm font-bold uppercase tracking-wider pb-3 border-b border-[#E4E4E0] dark:border-[#262626]">
                    FEFO Health Assessment
                  </h2>

                  {daysRemainingData && (
                    <>
                      <div
                        className={`rounded-lg border p-4 flex items-center gap-3.5 ${
                          daysRemainingData.status === 'expired' || daysRemainingData.status === 'critical'
                            ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] dark:bg-[#2A1212] dark:border-[#5E1A1A] dark:text-[#F87171]'
                            : daysRemainingData.status === 'warning'
                            ? 'bg-[#FFFBEB] border-[#FDE68A] text-[#B45309] dark:bg-[#271A0B] dark:border-[#543813] dark:text-[#FBBF24]'
                            : 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] dark:bg-[#0D2116] dark:border-[#19422B] dark:text-[#4ADE80]'
                        }`}
                      >
                        {daysRemainingData.status === 'expired' || daysRemainingData.status === 'critical' ? (
                          <AlertCircle size={24} className="shrink-0" />
                        ) : daysRemainingData.status === 'warning' ? (
                          <Clock size={24} className="shrink-0" />
                        ) : (
                          <CheckCircle2 size={24} className="shrink-0" />
                        )}
                        <div>
                          <div className="text-xs font-mono uppercase font-bold">
                            {daysRemainingData.status === 'expired'
                              ? 'Expired Batch'
                              : daysRemainingData.status === 'critical'
                              ? 'Critical Window (≤ 7 Days)'
                              : daysRemainingData.status === 'warning'
                              ? 'Action Window (≤ 30 Days)'
                              : 'Healthy Shelf Life'}
                          </div>
                          <div className="tabular-data text-2xl font-bold mt-0.5">
                            {daysRemainingData.diffDays < 0
                              ? `${Math.abs(daysRemainingData.diffDays)} Days Past Expiry`
                              : `${daysRemainingData.diffDays} Days Remaining`}
                          </div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-mono text-[#767670] mb-1.5">
                          <span>Remaining Shelf-Life Index</span>
                          <span>{daysRemainingData.percent}%</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-[#E4E4E0] dark:bg-[#262626] overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-300 ${
                              daysRemainingData.status === 'expired' || daysRemainingData.status === 'critical'
                                ? 'bg-[#DC2626]'
                                : daysRemainingData.status === 'warning'
                                ? 'bg-[#D97706]'
                                : 'bg-[#15803D]'
                            }`}
                            style={{ width: `${daysRemainingData.percent}%` }}
                          />
                        </div>
                      </div>

                      <div className="pt-2">
                        <div className="text-xs font-semibold uppercase tracking-wider text-[#767670] mb-2 flex items-center gap-1.5">
                          <ShieldCheck size={14} className="text-[#15803D] dark:text-[#4ADE80]" />
                          <span>Recommended FEFO Action</span>
                        </div>
                        <div
                          className={`p-4 rounded-lg border text-xs sm:text-sm leading-relaxed ${
                            darkMode
                              ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F3]'
                              : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#111111]'
                          }`}
                        >
                          {daysRemainingData.recommendation}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Conversion Callout */}
          <section className="mt-14">
            <div className="rounded-xl bg-[#111111] dark:bg-[#141414] border border-[#262626] text-[#FAF9F6] p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="max-w-xl">
                <div className="text-xs font-mono uppercase tracking-wider text-[#4ADE80] mb-2">
                  Automated WhatsApp Tracking
                </div>
                <h3 className="text-2xl font-bold tracking-tight">
                  Stop checking expiration dates one by one.
                </h3>
                <p className="text-sm text-[#A3A39E] mt-2 leading-relaxed">
                  Snap a photo of any product label on WhatsApp when shipments arrive. Inventa logs the batch number and sends daily 9:00 AM reminders before stock expires.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#16A34A] px-5 py-3 text-xs font-semibold text-white transition-colors"
                >
                  <span>Start Free Account</span>
                  <ArrowRight size={14} />
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-lg border border-white/20 bg-white/5 hover:bg-white/10 px-5 py-3 text-xs font-semibold text-white transition-colors"
                >
                  Sign In
                </Link>
              </div>
            </div>
          </section>

          {/* FAQ Section */}
          <section className="mt-16">
            <h2 className="text-2xl font-bold tracking-tight mb-6">
              Frequently Asked Questions
            </h2>
            <div className="space-y-3">
              {faqData.map((item, idx) => {
                const isOpen = openFaqIdx === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-xl border transition-colors ${
                      darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                    }`}
                  >
                    <button
                      onClick={() => setOpenFaqIdx(isOpen ? null : idx)}
                      className="w-full flex items-center justify-between p-5 text-left text-sm sm:text-base font-semibold cursor-pointer"
                    >
                      <span>{item.q}</span>
                      <ChevronDown
                        size={16}
                        className={`shrink-0 transition-transform duration-200 ${
                          isOpen ? 'rotate-180 text-[#15803D] dark:text-[#4ADE80]' : 'text-[#767670]'
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div
                        className={`px-5 pb-5 text-sm leading-relaxed border-t pt-3.5 ${
                          darkMode ? 'border-[#262626] text-[#A3A39E]' : 'border-[#E4E4E0] text-[#4A4A46]'
                        }`}
                      >
                        {item.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer
        className={`border-t py-10 text-xs ${
          darkMode ? 'border-[#262626] bg-[#0A0A0A] text-[#6E6E68]' : 'border-[#E4E4E0] bg-[#FAF9F6] text-[#767670]'
        }`}
      >
        <div className="mx-auto max-w-5xl px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} Inventa. All rights reserved.</p>
          <div className="flex gap-5">
            <Link to="/privacy-policy" className="hover:underline">
              Privacy Policy
            </Link>
            <Link to="/terms-of-service" className="hover:underline">
              Terms of Service
            </Link>
            <Link to="/contact" className="hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ExpiryCalculator;
