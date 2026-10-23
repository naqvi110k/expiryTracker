import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, ArrowRight, Clock, BookOpen, Sun, Moon } from 'lucide-react';
import { getAllArticles } from '../utils/blogData';

const BlogList = () => {
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

  const articles = getAllArticles();

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>Inventory &amp; Expiry Management Blog | Inventa</title>
        <meta
          name="description"
          content="Expert articles on inventory management, expiry date tracking, and reducing waste for US and EU pharmacies, grocery stores, and retail shops."
        />
        <link rel="canonical" href="https://expiry-tracker.live/blog" />
        <meta property="og:title" content="Inventory & Expiry Management Blog | Inventa" />
        <meta
          property="og:description"
          content="Expert articles on inventory management, expiry date tracking, and reducing waste for US and EU pharmacies, grocery stores, and retail shops."
        />
        <meta property="og:url" content="https://expiry-tracker.live/blog" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://expiry-tracker.live/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Inventory & Expiry Management Blog | Inventa" />
        <meta
          name="twitter:description"
          content="Expert articles on inventory management, expiry date tracking, and reducing waste for US and EU pharmacies, grocery stores, and retail shops."
        />
        <meta name="twitter:image" content="https://expiry-tracker.live/twitter-image.png" />
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
              <div className="text-[11px] text-[#767670] mt-1 leading-none">Editorial Guides</div>
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

      {/* Editorial Header */}
      <section className="pt-14 pb-12 border-b border-[#E4E4E0] dark:border-[#262626]">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-3.5 py-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
            <BookOpen size={13} />
            <span>Retail Operations &amp; Compliance Library</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-[-0.03em] max-w-3xl">
            Practical guides on FEFO rotation, pharmacy compliance, and waste prevention.
          </h1>
          <p className={`mt-3 max-w-2xl text-sm sm:text-base leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Field-tested playbooks for independent pharmacies, grocery operators, and retail managers across the US, UK, EU, and South Asia.
          </p>
        </div>
      </section>

      {/* Articles Grid */}
      <main className="py-14">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
            {articles.map((article, index) => (
              <Link
                to={`/blog/${article.slug}`}
                key={article.id}
                className={`group rounded-xl border overflow-hidden flex flex-col justify-between transition-colors ${
                  darkMode
                    ? 'bg-[#141414] border-[#262626] hover:border-[#383838]'
                    : 'bg-white border-[#E4E4E0] hover:border-[#CFCFC8]'
                }`}
              >
                <div>
                  <div className="relative h-52 overflow-hidden border-b border-[#E4E4E0] dark:border-[#262626]">
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      width="800"
                      height="450"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                      loading={index === 0 ? 'eager' : 'lazy'}
                    />
                  </div>

                  <div className="p-6">
                    <div className="mb-3 flex flex-wrap gap-1.5">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className={`rounded px-2 py-0.5 text-[11px] font-mono font-medium border ${
                            darkMode
                              ? 'border-[#262626] bg-[#1A1A1A] text-[#4ADE80]'
                              : 'border-[#E4E4E0] bg-[#F3F2EE] text-[#15803D]'
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <h2 className="text-lg sm:text-xl font-bold tracking-tight leading-snug group-hover:text-[#15803D] dark:group-hover:text-[#4ADE80] transition-colors">
                      {article.title}
                    </h2>
                    <p className={`mt-2.5 text-sm leading-relaxed line-clamp-3 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                      {article.description}
                    </p>
                  </div>
                </div>

                <div
                  className={`px-6 py-3.5 border-t flex items-center justify-between text-xs ${
                    darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
                  }`}
                >
                  <div className="flex items-center gap-1.5 font-mono text-[#767670]">
                    <Clock size={13} />
                    <span>{article.readTime}</span>
                  </div>
                  <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
                    Read guide <ArrowRight size={13} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>

      {/* Footer CTA */}
      <section className={`border-t py-16 ${darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-[#F3F2EE]'}`}>
        <div className="mx-auto max-w-xl px-4 text-center">
          <h2 className="mb-2 text-2xl font-bold tracking-tight">
            Automate your store&rsquo;s expiry tracking today
          </h2>
          <p className={`mb-6 text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
            Inventa is 100% free. Snap label photos on WhatsApp, receive daily 9:00 AM expiry digests, and export PDF audit logs.
          </p>
          <Link
            to="/register"
            className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] hover:bg-[#14532D] px-6 py-3 text-xs font-semibold text-white transition-colors"
          >
            <span>Create Free Store Account</span>
            <ArrowRight size={15} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BlogList;
