import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, ArrowLeft, Clock, ChevronRight, Sun, Moon } from 'lucide-react';
import { getArticleBySlug, getAllArticles } from '../utils/blogData';

const renderInlineStyles = (text, darkMode) => {
  const regex = /(\*\*.*?\*\*|\[.*?\]\(.*?\))/g;
  const parts = text.split(regex);
  return parts.map((part, i) => {
    if (part.startsWith('**') && part.endsWith('**')) {
      return (
        <strong key={i} className={`font-bold ${darkMode ? 'text-[#F5F5F3]' : 'text-[#111111]'}`}>
          {part.slice(2, -2)}
        </strong>
      );
    }
    const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/);
    if (linkMatch) {
      const [, linkText, url] = linkMatch;
      if (url.startsWith('/')) {
        return (
          <Link key={i} to={url} className="text-[#15803D] dark:text-[#4ADE80] hover:underline font-semibold">
            {linkText}
          </Link>
        );
      }
      return (
        <a
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#15803D] dark:text-[#4ADE80] hover:underline font-semibold"
        >
          {linkText}
        </a>
      );
    }
    return part;
  });
};

const BlogPost = () => {
  const { slug } = useParams();
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
    window.scrollTo(0, 0);
  }, [slug]);

  const toggleTheme = () => {
    const nextMode = !darkMode;
    setDarkMode(nextMode);
    document.documentElement.classList.toggle('dark', nextMode);
    localStorage.setItem('theme', nextMode ? 'dark' : 'light');
  };

  const article = getArticleBySlug(slug);
  const allArticles = getAllArticles();
  const related = allArticles.filter((a) => a.slug !== slug).slice(0, 2);

  if (!article) {
    return (
      <div
        className={`min-h-screen flex flex-col items-center justify-center p-4 ${
          darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
        }`}
      >
        <Helmet>
          <title>Article Not Found | Inventa Blog</title>
        </Helmet>
        <h1 className="text-2xl font-bold mb-2">Article Not Found</h1>
        <p className="mb-6 text-sm text-[#767670]">This guide doesn&rsquo;t exist or may have been moved.</p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 rounded-lg bg-[#15803D] px-5 py-2.5 text-xs font-semibold text-white"
        >
          <ArrowLeft size={15} /> Back to Guides
        </Link>
      </div>
    );
  }

  const seoTitle = article.title;
  const seoDescription = article.description;

  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.description,
    image: article.coverImage,
    author: {
      '@type': 'Person',
      name: article.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Inventa',
      logo: {
        '@type': 'ImageObject',
        url: 'https://expiry-tracker.live/Untitled%20design.png'
      }
    },
    datePublished: article.date,
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://expiry-tracker.live/blog/${article.slug}`
    }
  };

  return (
    <div
      className={`min-h-screen font-sans transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{seoTitle} | Inventa</title>
        <meta name="description" content={seoDescription} />
        <link rel="canonical" href={`https://expiry-tracker.live/blog/${article.slug}`} />
        <meta property="og:title" content={`${seoTitle} | Inventa`} />
        <meta property="og:description" content={seoDescription} />
        <meta property="og:image" content={article.coverImage} />
        <meta property="og:type" content="article" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${seoTitle} | Inventa`} />
        <meta name="twitter:description" content={seoDescription} />
        <meta name="twitter:image" content={article.coverImage} />
        <script type="application/ld+json">{JSON.stringify(articleSchema)}</script>
      </Helmet>

      {/* Navbar */}
      <header
        className={`sticky top-0 z-50 border-b backdrop-blur-sm ${
          darkMode ? 'bg-[#0A0A0A]/95 border-[#262626]' : 'bg-[#FAF9F6]/95 border-[#E4E4E0]'
        }`}
      >
        <div className="mx-auto flex max-w-4xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A]">
              <Boxes size={18} strokeWidth={2.2} />
            </div>
            <div>
              <div className="text-base font-bold tracking-tight leading-none">Inventa</div>
              <div className="text-[11px] text-[#767670] mt-1 leading-none">Editorial Guides</div>
            </div>
          </Link>
          <div className="flex items-center gap-2.5">
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
              to="/blog"
              className={`inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-xs font-semibold transition-colors ${
                darkMode
                  ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
                  : 'border-[#CFCFC8] bg-white text-[#111111] hover:bg-[#F3F2EE]'
              }`}
            >
              <ArrowLeft size={14} />
              <span>All Guides</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="pt-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <nav className="flex items-center gap-1.5 text-xs text-[#767670]" aria-label="Breadcrumb">
            <Link to="/" className="hover:underline">
              Home
            </Link>
            <ChevronRight size={12} />
            <Link to="/blog" className="hover:underline">
              Guides
            </Link>
            <ChevronRight size={12} />
            <span className="text-[#15803D] dark:text-[#4ADE80] font-medium truncate max-w-[220px]">
              {article.title}
            </span>
          </nav>
        </div>
      </div>

      {/* Article Header */}
      <header className="pt-6 pb-8">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="mb-4 flex flex-wrap gap-1.5">
            {article.tags.map((tag) => (
              <span
                key={tag}
                className={`rounded px-2.5 py-0.5 text-xs font-mono font-medium border ${
                  darkMode
                    ? 'border-[#262626] bg-[#141414] text-[#4ADE80]'
                    : 'border-[#E4E4E0] bg-[#F3F2EE] text-[#15803D]'
                }`}
              >
                {tag}
              </span>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-[-0.03em] leading-tight mb-5">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs text-[#767670] font-mono">
            <div className="flex items-center gap-2 font-sans font-medium text-[#111111] dark:text-[#F5F5F3]">
              <div className="h-7 w-7 rounded-md bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] flex items-center justify-center text-xs font-bold">
                {article.author.charAt(0)}
              </div>
              <span>{article.author}</span>
            </div>
            <span>·</span>
            <div className="flex items-center gap-1">
              <Clock size={13} />
              <span>{article.readTime}</span>
            </div>
            <span>·</span>
            <span>
              {new Date(article.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
        </div>
      </header>

      {/* Cover Image */}
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 mb-10">
        <div className="relative h-64 sm:h-80 lg:h-96 rounded-xl overflow-hidden border border-[#E4E4E0] dark:border-[#262626]">
          <img
            src={article.coverImage}
            alt={article.title}
            width="800"
            height="450"
            className="h-full w-full object-cover"
            loading="eager"
          />
        </div>
      </div>

      {/* Article Body */}
      <div className="pb-16">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div
            className={`rounded-xl border p-6 sm:p-10 ${
              darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
            }`}
          >
            <div className="max-w-none">
              {article.content.map((paragraph, idx) => {
                const codeMatch = paragraph.match(/```(\w+)?\n([\s\S]+?)```/);
                if (codeMatch) {
                  const [, , code] = codeMatch;
                  const beforeCode = paragraph.split('```')[0];
                  return (
                    <div key={idx}>
                      {beforeCode && (
                        <p className={`mb-4 text-base leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                          {renderInlineStyles(beforeCode, darkMode)}
                        </p>
                      )}
                      <pre
                        className={`rounded-lg border p-4 text-xs font-mono overflow-x-auto mb-6 ${
                          darkMode
                            ? 'bg-[#0A0A0A] border-[#262626] text-[#4ADE80]'
                            : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#111111]'
                        }`}
                      >
                        <code>{code}</code>
                      </pre>
                    </div>
                  );
                }
                if (paragraph.startsWith('## ')) {
                  return (
                    <h2 key={idx} className="text-2xl font-bold tracking-tight mt-8 mb-3">
                      {paragraph.replace('## ', '')}
                    </h2>
                  );
                }
                if (paragraph.startsWith('### ')) {
                  return (
                    <h3 key={idx} className="text-xl font-bold tracking-tight mt-6 mb-2.5">
                      {paragraph.replace('### ', '')}
                    </h3>
                  );
                }
                if (paragraph.trim().startsWith('|')) {
                  const lines = paragraph
                    .split('\n')
                    .map((line) => line.trim())
                    .filter((line) => line.length > 0);
                  const headerLine = lines[0];
                  const rowsLines = lines
                    .slice(1)
                    .filter(
                      (line) =>
                        !line.match(/^\|?\s*:-*|-*:\s*\|/i) &&
                        !line.includes('|---|') &&
                        !line.includes('| --- |')
                    );

                  const parseCells = (line) => {
                    const cells = line.split('|').map((cell) => cell.trim());
                    if (cells[0] === '') cells.shift();
                    if (cells[cells.length - 1] === '') cells.pop();
                    return cells;
                  };

                  const headers = parseCells(headerLine);
                  const rows = rowsLines.map(parseCells);

                  return (
                    <div
                      key={idx}
                      className="overflow-x-auto my-8 rounded-lg border border-[#E4E4E0] dark:border-[#262626]"
                    >
                      <table className="min-w-full divide-y divide-[#E4E4E0] dark:divide-[#262626] text-xs sm:text-sm">
                        <thead className={darkMode ? 'bg-[#1A1A1A]' : 'bg-[#F3F2EE]'}>
                          <tr>
                            {headers.map((h, hIdx) => (
                              <th key={hIdx} className="px-4 py-3 text-left font-semibold">
                                {renderInlineStyles(h, darkMode)}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#E4E4E0] dark:divide-[#262626]">
                          {rows.map((row, rIdx) => (
                            <tr key={rIdx}>
                              {row.map((cell, cIdx) => (
                                <td key={cIdx} className="px-4 py-3 whitespace-nowrap">
                                  {renderInlineStyles(cell, darkMode)}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                }
                return (
                  <p
                    key={idx}
                    className={`mb-5 text-base leading-relaxed ${
                      darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'
                    }`}
                  >
                    {renderInlineStyles(paragraph, darkMode)}
                  </p>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Related Articles */}
      {related.length > 0 && (
        <section className="border-t border-[#E4E4E0] dark:border-[#262626] py-14">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
            <h2 className="mb-6 text-xl font-bold tracking-tight">Related Guides</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {related.map((rel) => (
                <Link
                  to={`/blog/${rel.slug}`}
                  key={rel.id}
                  className={`group block rounded-xl border p-5 transition-colors ${
                    darkMode
                      ? 'bg-[#141414] border-[#262626] hover:border-[#383838]'
                      : 'bg-white border-[#E4E4E0] hover:border-[#CFCFC8]'
                  }`}
                >
                  <h3 className="font-bold leading-snug group-hover:text-[#15803D] dark:group-hover:text-[#4ADE80] transition-colors">
                    {rel.title}
                  </h3>
                  <p className={`mt-2 text-xs leading-relaxed line-clamp-2 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                    {rel.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default BlogPost;
