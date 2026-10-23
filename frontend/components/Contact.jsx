import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Boxes, Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, Loader2, Sun, Moon } from 'lucide-react';
import axios from 'axios';

const Contact = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
    window.scrollTo(0, 0);
  }, []);

  const toggleDarkMode = () => {
    const next = !darkMode;
    setDarkMode(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  const bg = darkMode ? 'bg-[#0A0A0A] text-[#F5F5F2]' : 'bg-[#FAF9F6] text-[#111111]';
  const headingClass = darkMode ? 'text-[#F5F5F2]' : 'text-[#111111]';
  const textClass = darkMode ? 'text-[#A1A19A]' : 'text-[#52524E]';
  const cardClass = darkMode
    ? 'bg-[#141414] border-[#262626]'
    : 'bg-white border-[#E4E4E0] shadow-xs';
  const navClass = darkMode ? 'bg-[#0A0A0A]/95 border-[#262626]' : 'bg-[#FAF9F6]/95 border-[#E4E4E0]';
  const inputClass = darkMode
    ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F2] focus:border-[#22C55E] focus:ring-[#22C55E]/15'
    : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#111111] focus:border-[#15803D] focus:ring-[#15803D]/15';

  const validate = () => {
    const tempErrors = {};
    if (!formData.name.trim()) tempErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      tempErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = 'Please enter a valid email address';
    }
    if (!formData.subject.trim()) tempErrors.subject = 'Subject is required';
    if (!formData.message.trim()) {
      tempErrors.message = 'Message is required';
    } else if (formData.message.trim().length < 10) {
      tempErrors.message = 'Message must be at least 10 characters long';
    }
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      const res = await axios.post('/api/contact', formData);
      if (res.data.success) {
        setSubmitSuccess(true);
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        setSubmitError(res.data.message || 'Something went wrong. Please try again.');
      }
    } catch (err) {
      setSubmitError(
        err.response?.data?.error || 
        'Could not connect to the server. Please check your network and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`min-h-screen font-sans ${bg}`}>
      <Helmet>
        <title>Contact Us | Inventa Expiry & Inventory Support</title>
        <meta name="description" content="Get in touch with the Inventa support team. Send us a message, ask questions, or request assistance with our AI-powered WhatsApp inventory tracker." />
        <link rel="canonical" href="https://expiry-tracker.live/contact" />
        <meta property="og:title" content="Contact Us | Inventa Expiry & Inventory Support" />
        <meta property="og:description" content="Get in touch with the Inventa support team. Send us a message, ask questions, or request assistance with our AI-powered WhatsApp inventory tracker." />
        <meta property="og:url" content="https://expiry-tracker.live/contact" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="https://expiry-tracker.live/og-image.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Contact Us | Inventa" />
        <meta name="twitter:description" content="Get in touch with the Inventa support team. Send us a message, ask questions, or request assistance with our AI-powered WhatsApp inventory tracker." />
        <meta name="twitter:image" content="https://expiry-tracker.live/twitter-image.png" />
      </Helmet>

      {/* Navbar */}
      <nav className={`fixed inset-x-0 top-0 z-50 border-b backdrop-blur-md ${navClass}`}>
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <Link to={'/'} className="flex items-center gap-3 text-left">
            <div className={`flex h-9 w-9 items-center justify-center rounded-md border ${darkMode ? 'bg-[#141414] border-[#262626] text-[#F5F5F2]' : 'bg-[#111111] border-[#111111] text-[#FAF9F6]'}`}>
              <Boxes size={18} />
            </div>
            <div>
              <div className={`text-base font-bold tracking-tight leading-none ${headingClass}`}>Inventa</div>
              <div className={`text-[10px] font-mono uppercase tracking-[0.16em] mt-1 ${textClass}`}>Support Desk</div>
            </div>
          </Link>
          <div className="flex items-center gap-4">
            <Link to={'/'} className={`hidden sm:block text-sm font-medium transition-colors hover:opacity-80 ${textClass}`}>
              Home
            </Link>
            <Link to={'/about'} className={`hidden sm:block text-sm font-medium transition-colors hover:opacity-80 ${textClass}`}>
              About
            </Link>
            <Link to={'/blog'} className={`hidden sm:block text-sm font-medium transition-colors hover:opacity-80 ${textClass}`}>
              Guides
            </Link>
            <Link to={'/expiry-calculator'} className={`hidden sm:block text-sm font-medium transition-colors hover:opacity-80 ${textClass}`}>
              Calculator
            </Link>
            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-md border transition-colors ${darkMode ? 'border-[#262626] text-[#A1A19A] hover:text-[#F5F5F2]' : 'border-[#E4E4E0] text-[#52524E] hover:text-[#111111]'}`}
              aria-label="Toggle theme"
            >
              {darkMode ? <Sun size={16} /> : <Moon size={16} />}
            </button>
            <Link to={'/login'} className={`rounded-md px-4 py-2 text-xs font-semibold transition-colors ${darkMode ? 'bg-[#F5F5F2] text-[#111111] hover:bg-white' : 'bg-[#111111] text-[#FAF9F6] hover:bg-[#262626]'}`}>
              Get Started
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Body */}
      <div className="pt-28 pb-24 mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 max-w-2xl">
          <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-[#15803D] dark:text-[#4ADE80] mb-3">
            Support & Inquiries
          </div>
          <h1
            className={`text-3xl sm:text-5xl font-normal tracking-tight mb-4 ${headingClass}`}
            style={{ fontFamily: "'Instrument Serif', Georgia, serif" }}
          >
            Get in Touch
          </h1>
          <p className={`text-base sm:text-lg ${textClass}`}>
            Have questions about WhatsApp label scanning, CSV imports, or store setup? Reach out to our team directly and we will respond within one business day.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details Card (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className={`rounded-lg border p-6 sm:p-8 ${cardClass}`}>
              <h2 className={`text-lg font-bold tracking-tight mb-6 ${headingClass}`}>Contact Channels</h2>
              <div className="space-y-6">
                
                {/* Email Item */}
                <div className="flex gap-3.5 items-start">
                  <div className="rounded-md bg-[#DCFCE7] dark:bg-[#052E16] border border-[#86EFAC] dark:border-[#166534] p-2.5 text-[#15803D] dark:text-[#4ADE80] shrink-0">
                    <Mail size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${headingClass}`}>Email Support</h3>
                    <a href="mailto:support@inventa.app" className="text-sm font-medium text-[#15803D] dark:text-[#4ADE80] hover:underline break-all">
                      support@inventa.app
                    </a>
                    <p className={`text-xs mt-1 ${textClass}`}>Response SLA: Within 24 hours.</p>
                  </div>
                </div>

                {/* Phone Item */}
                <div className="flex gap-3.5 items-start">
                  <div className="rounded-md bg-[#F2F1ED] dark:bg-[#1C1C1C] border border-[#E4E4E0] dark:border-[#262626] p-2.5 text-[#111111] dark:text-[#F5F5F2] shrink-0">
                    <Phone size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${headingClass}`}>Phone Workspace</h3>
                    <p className={`text-sm font-mono tabular-data ${headingClass}`}>
                      +1 (800) 555-0199
                    </p>
                    <p className={`text-xs mt-1 ${textClass}`}>Mon–Fri, 9:00 AM – 6:00 PM EST.</p>
                  </div>
                </div>

                {/* Address Item */}
                <div className="flex gap-3.5 items-start">
                  <div className="rounded-md bg-[#F2F1ED] dark:bg-[#1C1C1C] border border-[#E4E4E0] dark:border-[#262626] p-2.5 text-[#111111] dark:text-[#F5F5F2] shrink-0">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <h3 className={`text-sm font-semibold ${headingClass}`}>Headquarters</h3>
                    <p className={`text-sm leading-6 ${textClass}`}>
                      Inventa Software Corp.<br />
                      100 Pine Street, Suite 1250<br />
                      San Francisco, CA 94111<br />
                      United States
                    </p>
                  </div>
                </div>

              </div>
            </div>

            {/* Quick Note */}
            <div className={`rounded-lg border p-5 text-xs leading-relaxed ${darkMode ? 'border-[#262626] bg-[#141414] text-[#A1A19A]' : 'border-[#E4E4E0] bg-[#F2F1ED] text-[#52524E]'}`}>
              <p>
                <strong className={headingClass}>Looking for WhatsApp setup?</strong> Once you create an account, you can link your phone number in Profile Settings and immediately start sending product label photos to the bot.
              </p>
            </div>
          </div>

          {/* Contact Form Card (8 cols) */}
          <div className="lg:col-span-8">
            <div className={`rounded-lg border p-6 sm:p-10 relative ${cardClass}`}>
              
              {submitSuccess ? (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="rounded-full bg-[#DCFCE7] dark:bg-[#052E16] border border-[#86EFAC] dark:border-[#166534] p-4 text-[#15803D] dark:text-[#4ADE80] mb-5">
                    <CheckCircle size={36} />
                  </div>
                  <h2 className={`text-2xl font-bold tracking-tight mb-3 ${headingClass}`}>Message Sent Successfully</h2>
                  <p className={`max-w-md text-sm leading-relaxed mb-8 ${textClass}`}>
                    Thank you for reaching out. Your inquiry has been logged with our support desk and we will reply to your email shortly.
                  </p>
                  <button
                    onClick={() => setSubmitSuccess(false)}
                    className={`inline-flex items-center gap-2 rounded-md px-5 py-2.5 text-sm font-semibold transition-colors ${darkMode ? 'bg-[#F5F5F2] text-[#111111] hover:bg-white' : 'bg-[#111111] text-[#FAF9F6] hover:bg-[#262626]'}`}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-5">
                  <h2 className={`text-lg font-bold tracking-tight mb-2 ${headingClass}`}>Send a Direct Message</h2>
                  
                  {submitError && (
                    <div className="rounded-md bg-[#FEE2E2] dark:bg-[#450A0A] p-3.5 border border-[#FCA5A5] dark:border-[#991B1B] flex gap-3 text-[#991B1B] dark:text-[#F87171] text-sm">
                      <AlertCircle className="shrink-0 mt-0.5" size={16} />
                      <div>{submitError}</div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Name Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="name" className={`block text-xs font-semibold uppercase tracking-wider ${textClass}`}>
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 ${inputClass} ${errors.name ? 'border-[#DC2626] focus:border-[#DC2626]' : ''}`}
                        placeholder="John Doe"
                      />
                      {errors.name && <p className="text-xs text-[#DC2626] dark:text-[#F87171] mt-1">{errors.name}</p>}
                    </div>

                    {/* Email Input */}
                    <div className="space-y-1.5">
                      <label htmlFor="email" className={`block text-xs font-semibold uppercase tracking-wider ${textClass}`}>
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 ${inputClass} ${errors.email ? 'border-[#DC2626] focus:border-[#DC2626]' : ''}`}
                        placeholder="john@pharmacy.com"
                      />
                      {errors.email && <p className="text-xs text-[#DC2626] dark:text-[#F87171] mt-1">{errors.email}</p>}
                    </div>
                  </div>

                  {/* Subject Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="subject" className={`block text-xs font-semibold uppercase tracking-wider ${textClass}`}>
                      Subject
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 ${inputClass} ${errors.subject ? 'border-[#DC2626] focus:border-[#DC2626]' : ''}`}
                      placeholder="How can we help your store?"
                    />
                    {errors.subject && <p className="text-xs text-[#DC2626] dark:text-[#F87171] mt-1">{errors.subject}</p>}
                  </div>

                  {/* Message Input */}
                  <div className="space-y-1.5">
                    <label htmlFor="message" className={`block text-xs font-semibold uppercase tracking-wider ${textClass}`}>
                      Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows="5"
                      value={formData.message}
                      onChange={handleChange}
                      className={`w-full rounded-md border px-3.5 py-2.5 text-sm outline-none transition-all focus:ring-2 ${inputClass} ${errors.message ? 'border-[#DC2626] focus:border-[#DC2626]' : ''}`}
                      placeholder="Describe your question or request in detail..."
                    />
                    {errors.message && <p className="text-xs text-[#DC2626] dark:text-[#F87171] mt-1">{errors.message}</p>}
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full flex items-center justify-center gap-2 rounded-md py-3 text-sm font-semibold transition-colors disabled:opacity-60 cursor-pointer min-h-[42px] ${darkMode ? 'bg-[#F5F5F2] text-[#111111] hover:bg-white' : 'bg-[#111111] text-[#FAF9F6] hover:bg-[#262626]'}`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <Loader2 size={16} className="animate-spin" /> Sending Message...
                      </span>
                    ) : (
                      <>
                        <Send size={15} /> Send Message
                      </>
                    )}
                  </button>

                </form>
              )}

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
