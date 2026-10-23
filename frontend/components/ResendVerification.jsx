import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import Input from './ui/Input';
import { resendVerification } from '../services/authService';
import { Mail, CheckCircle2 } from 'lucide-react';
import ErrorMessage from './ui/ErrorMessage';
import { pageSEO } from '../utils/seoConfig';

const ResendVerification = () => {
  const [searchParams] = useSearchParams();
  const [email, setEmail] = useState(searchParams.get('email') || '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resendVerification(email);
      setSuccess(true);
    } catch (err) {
      setError(
        err?.response?.data?.error || 'Failed to resend verification email. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{pageSEO.resendVerification.title}</title>
        <meta name="description" content={pageSEO.resendVerification.description} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="w-full max-w-md">
        <div
          className={`rounded-xl p-7 sm:p-9 border shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] ${
            darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
          }`}
        >
          {success ? (
            <div className="text-center space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-2">Verification Sent</h2>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  We&rsquo;ve sent a new verification link to <strong className="text-[#111111] dark:text-[#F5F5F3]">{email}</strong>.
                </p>
              </div>
              <Link to="/login" className="block pt-2">
                <Button variant="accent" className="w-full h-11 text-sm font-semibold">
                  Back to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] mb-5">
                  <Mail size={19} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Resend Verification</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Enter your email address to receive a new verification link
                </p>
              </div>

              {error && (
                <div className="mb-5">
                  <ErrorMessage message={error} type="error" title="Error" />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="manager@store.com"
                  darkMode={darkMode}
                  required
                />

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-11 text-sm font-semibold"
                  isLoading={loading}
                >
                  {loading ? 'Sending...' : 'Resend Verification Email'}
                </Button>
              </form>

              <div className={`mt-6 pt-5 border-t text-center ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'}`}>
                <p className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Already verified?{' '}
                  <Link to="/login" className="font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ResendVerification;
