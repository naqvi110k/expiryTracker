import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import Input from './ui/Input';
import { register as registerUser } from '../services/authService';
import { Sun, Moon, Boxes, ArrowLeft, CheckCircle2 } from 'lucide-react';
import ErrorMessage from './ui/ErrorMessage';
import { pageSEO } from '../utils/seoConfig';

const Register = ({ onSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const navigate = useNavigate();

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

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!form.phoneNumber.startsWith('+')) {
      setError('Phone number must start with + and country code');
      return;
    }

    setLoading(true);
    try {
      await registerUser(form.username, form.email, form.password, form.phoneNumber);
      setSuccess(true);
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
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
        <title>{pageSEO.register.title}</title>
        <meta name="description" content={pageSEO.register.description} />
        <meta name="keywords" content={pageSEO.register.keywords.join(', ')} />
        <link rel="canonical" href={`https://expiry-tracker.live${pageSEO.register.path}`} />
        <meta property="og:title" content={pageSEO.register.title} />
        <meta property="og:description" content={pageSEO.register.description} />
        <meta property="og:url" content={`https://expiry-tracker.live${pageSEO.register.path}`} />
        <meta name="twitter:title" content={pageSEO.register.title} />
        <meta name="twitter:description" content={pageSEO.register.description} />
      </Helmet>

      {/* Top Navigation */}
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
      <div className="w-full max-w-md mx-auto my-6">
        <div
          className={`rounded-xl p-7 sm:p-9 border shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] ${
            darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
          }`}
        >
          {success ? (
            <div className="text-center space-y-5 py-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight mb-2">
                  Verify Your Email
                </h1>
                <p className={`text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  We&rsquo;ve sent a verification link to <strong className="text-[#111111] dark:text-[#F5F5F3]">{form.email}</strong>. Click the link in your inbox to activate your store workspace.
                </p>
              </div>
              <Link to="/login" className="block pt-2">
                <Button variant="accent" className="w-full h-11 text-sm font-semibold">
                  Proceed to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <Link
                  to="/"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] mb-5"
                >
                  <Boxes size={20} strokeWidth={2.2} />
                </Link>
                <h1 className="text-2xl font-bold tracking-tight">
                  Create Store Account
                </h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Connect your WhatsApp number and start tracking shelf expiry for free
                </p>
              </div>

              {error && (
                <div className="mb-5">
                  <ErrorMessage message={error} type="error" title="Registration Error" />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  value={form.username}
                  onChange={handleChange}
                  placeholder="e.g. greenleaf_pharmacy"
                  darkMode={darkMode}
                  required
                  validateOnBlur={true}
                  validateOnChange={false}
                  validator={(value) => {
                    if (!value) return 'Username is required';
                    if (value.length < 3) return 'Username must be at least 3 characters';
                    return true;
                  }}
                />

                <Input
                  label="Email Address"
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="manager@store.com"
                  darkMode={darkMode}
                  required
                  validateOnBlur={true}
                  validateOnChange={false}
                  validator={(value) => {
                    if (!value) return 'Email is required';
                    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
                    return true;
                  }}
                />

                <Input
                  label="WhatsApp Phone Number"
                  name="phoneNumber"
                  value={form.phoneNumber}
                  onChange={handleChange}
                  placeholder="+14155550199"
                  darkMode={darkMode}
                  required
                  validateOnBlur={true}
                  validateOnChange={false}
                  validator={(value) => {
                    if (!value) return 'Phone number is required';
                    if (!value.startsWith('+')) return 'Must start with + and country code';
                    return true;
                  }}
                  helperText="Include + and country code (e.g. +1 or +92)"
                />

                <div className="grid grid-cols-2 gap-3">
                  <Input
                    label="Password"
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="••••••••"
                    darkMode={darkMode}
                    required
                    helperText="Min 6 chars"
                  />

                  <Input
                    label="Confirm"
                    type="password"
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="••••••••"
                    darkMode={darkMode}
                    required
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-11 text-sm font-semibold mt-2"
                  isLoading={loading}
                >
                  {loading ? 'Creating account...' : 'Create Free Account'}
                </Button>
              </form>

              <div className={`mt-6 pt-5 border-t text-center ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'}`}>
                <p className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Already have an account?{' '}
                  <button
                    type="button"
                    className="font-semibold text-[#15803D] dark:text-[#4ADE80] hover:underline cursor-pointer"
                    onClick={() => (onSwitchToLogin ? onSwitchToLogin() : navigate('/login'))}
                  >
                    Sign in
                  </button>
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <p className={`text-center text-xs py-2 ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
        &copy; {new Date().getFullYear()} Inventa · 100% Free Retail Shelf Control
      </p>
    </div>
  );
};

export default Register;
