import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import Input from './ui/Input';
import { login } from '../services/authService';
import { Sun, Moon, Boxes, ArrowLeft } from 'lucide-react';
import ErrorMessage from './ui/ErrorMessage';
import { pageSEO } from '../utils/seoConfig';

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setNeedsVerification(false);
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      if (onSuccess) onSuccess(user);
      const redirectTo = location.state?.from || '/dashboard';
      if (!onSuccess) navigate(redirectTo, { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(message);

      if (err?.response?.data?.needsVerification) {
        setNeedsVerification(true);
        setUserEmail(err?.response?.data?.email || '');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className={`min-h-screen flex flex-col justify-between p-4 sm:p-6 transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{pageSEO.login.title}</title>
        <meta name="description" content={pageSEO.login.description} />
        <meta name="keywords" content={pageSEO.login.keywords.join(', ')} />
        <link rel="canonical" href={`https://expiry-tracker.live${pageSEO.login.path}`} />
        <meta property="og:title" content={pageSEO.login.title} />
        <meta property="og:description" content={pageSEO.login.description} />
        <meta property="og:url" content={`https://expiry-tracker.live${pageSEO.login.path}`} />
        <meta name="twitter:title" content={pageSEO.login.title} />
        <meta name="twitter:description" content={pageSEO.login.description} />
      </Helmet>

      {/* Top Navigation Bar */}
      <div className="mx-auto w-full max-w-6xl flex items-center justify-between py-2">
        <Link
          to="/"
          className={`inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-lg border transition-colors ${
            darkMode
              ? 'border-[#262626] bg-[#141414] text-[#A3A39E] hover:text-white'
              : 'border-[#E4E4E0] bg-white text-[#4A4A46] hover:text-[#111111]'
          }`}
        >
          <ArrowLeft size={14} />
          <span>Back to Home</span>
        </Link>

        <button
          onClick={toggleTheme}
          aria-label="Toggle color theme"
          className={`p-2 rounded-lg border transition-colors cursor-pointer ${
            darkMode
              ? 'border-[#262626] bg-[#141414] text-[#F5F5F3] hover:bg-[#1A1A1A]'
              : 'border-[#E4E4E0] bg-white text-[#4A4A46] hover:bg-[#F3F2EE]'
          }`}
        >
          {darkMode ? <Sun size={16} /> : <Moon size={16} />}
        </button>
      </div>

      {/* Main Card */}
      <div className="w-full max-w-md mx-auto my-8">
        <div
          className={`rounded-xl p-7 sm:p-9 border shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] ${
            darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
          }`}
        >
          {/* Brand Header */}
          <div className="mb-7">
            <Link
              to="/"
              className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] mb-5"
            >
              <Boxes size={20} strokeWidth={2.2} />
            </Link>
            <h1 className="text-2xl font-bold tracking-tight">
              Sign in to Inventa
            </h1>
            <p className={`text-sm mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
              Access your store&rsquo;s inventory ledger and WhatsApp alerts
            </p>
          </div>

          {error && (
            <div className="mb-5">
              <ErrorMessage message={error} type="error" title="Authentication Error" />
              {needsVerification && (
                <div className="mt-3">
                  <Button
                    variant="outline"
                    onClick={() => navigate(`/resend-verification?email=${encodeURIComponent(userEmail)}`)}
                    className="w-full text-xs"
                  >
                    Resend Verification Email
                  </Button>
                </div>
              )}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              darkMode={darkMode}
              required
            />

            <div className="space-y-1.5">
              <Input
                label="Password"
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                darkMode={darkMode}
                required
              />
              <div className="flex justify-end pt-1">
                <Link
                  to="/forgot-password"
                  className="text-xs font-medium text-[#15803D] dark:text-[#4ADE80] hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <Button
              type="submit"
              variant="accent"
              className="w-full h-11 text-sm font-semibold mt-2"
              isLoading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Footer Switch */}
          <div className={`mt-6 pt-5 border-t text-center ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'}`}>
            <p className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
              Don&rsquo;t have a store account?{' '}
              <button
                type="button"
                className="font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline cursor-pointer"
                onClick={() => (onSwitchToRegister ? onSwitchToRegister() : navigate('/register'))}
              >
                Create free account
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Bottom Legal */}
      <p className={`text-center text-xs py-2 ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
        &copy; {new Date().getFullYear()} Inventa · Encrypted Store Workspace
      </p>
    </div>
  );
};

export default Login;
