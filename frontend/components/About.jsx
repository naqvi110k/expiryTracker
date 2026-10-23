import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, Target, Users, ShieldCheck, ArrowRight, Sun, Moon } from 'lucide-react';

const About = () => {
  const [darkMode, setDarkMode] = useState(false);

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

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>About Us | Inventa Expiry &amp; Inventory Tracker</title>
        <meta
          name="description"
          content="Discover the story behind Inventa. Our mission is to help pharmacies, grocery stores, and retailers eliminate expired inventory waste with AI-powered WhatsApp tracking."
        />
        <link rel="canonical" href="https://expiry-tracker.live/about" />
        <meta property="og:title" content="About Us | Inventa Expiry & Inventory Tracker" />
        <meta
          property="og:description"
          content="Discover the story behind Inventa. Our mission is to help pharmacies, grocery stores, and retailers eliminate expired inventory waste with AI-powered WhatsApp tracking."
        />
        <meta property="og:url" content="https://expiry-tracker.live/about" />
        <meta property="og:type" content="website" />
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
              <div className="text-[11px] text-[#767670] mt-1 leading-none">About Our Mission</div>
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
            <Link
              to="/expiry-calculator"
              className={`hidden sm:block text-sm font-medium ${
                darkMode ? 'text-[#A3A39E] hover:text-white' : 'text-[#4A4A46] hover:text-[#111111]'
              }`}
            >
              Calculator
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

      {/* Hero */}
      <section className="pt-14 pb-14 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-3.5 py-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
            <span>Our Mission</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] leading-tight">
            Empowering independent retailers to eliminate shelf expiry waste.
          </h1>
          <p className={`mt-4 max-w-2xl text-base sm:text-lg leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Inventa builds practical, WhatsApp-native inventory tools for pharmacies, grocery stores, and local merchants—so professional FEFO stock rotation never requires complex software or staff training.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-xl border p-7 sm:p-10 space-y-5 text-sm sm:text-base leading-relaxed ${
              darkMode
                ? 'bg-[#141414] border-[#262626] text-[#A3A39E]'
                : 'bg-white border-[#E4E4E0] text-[#4A4A46]'
            }`}
          >
            <h2 className="text-2xl font-bold tracking-tight text-[#111111] dark:text-[#F5F5F3]">
              Why We Built Inventa
            </h2>
            <p>
              Every year, independent pharmacies, neighborhood grocers, and specialty retailers lose between 2% and 5% of their gross margin to unnoticed product expiration. Beyond the financial loss, essential medicines and wholesome food are discarded simply because a near-dated carton sat behind a newer delivery.
            </p>
            <p>
              Working alongside local pharmacy and supermarket operators, we saw why traditional inventory software fails on the shop floor: busy store clerks rarely have time to type 12-digit batch codes and expiration dates into a desktop spreadsheet when unloading supplier deliveries.
            </p>
            <p>
              We built <strong className="text-[#111111] dark:text-[#F5F5F3]">Inventa</strong> to meet store teams where they already work—on <strong className="text-[#111111] dark:text-[#F5F5F3]">WhatsApp</strong>. By pairing optical label recognition with automated 9:00 AM daily digests, any shopkeeper can snap a photo of a product label, confirm the extracted date with a single reply, and protect their shelves effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* Core Commitments */}
      <section
        className={`py-16 border-b ${
          darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-[#F3F2EE] border-[#E4E4E0]'
        }`}
      >
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight mb-8">Our Core Commitments</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                icon: Target,
                title: 'Zero Unnoticed Waste',
                desc: 'We surface near-expiry items 30, 14, and 7 days early so operators can claim distributor return credit or run timely clearance markdowns.'
              },
              {
                icon: Users,
                title: 'Built for Independent Shops',
                desc: 'Enterprise ERP tools are expensive and slow. We provide a fast, 100% free workspace with a zero-learning-curve WhatsApp workflow.'
              },
              {
                icon: ShieldCheck,
                title: 'Audit & Safety Compliance',
                desc: 'We help pharmacies and food retailers stay inspection-ready with one-click PDF batch logs and strict FEFO stock prioritization.'
              }
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className={`rounded-xl border p-6 ${
                    darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-white border-[#E4E4E0]'
                  }`}
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                    <Icon size={20} />
                  </div>
                  <h3 className="text-base font-bold mb-2">{item.title}</h3>
                  <p className={`text-xs sm:text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 text-center">
        <div className="mx-auto max-w-xl px-4">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">Have questions for our team?</h2>
          <p className={`mb-6 text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Reach out to our support desk or create your free store account in under two minutes.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-3">
            <Link
              to="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#14532D] px-6 py-3 text-xs font-semibold text-white transition-colors"
            >
              <span>Contact Support</span>
              <ArrowRight size={14} />
            </Link>
            <Link
              to="/register"
              className={`inline-flex items-center justify-center rounded-lg border px-6 py-3 text-xs font-semibold transition-colors ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                  : 'border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE]'
              }`}
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
