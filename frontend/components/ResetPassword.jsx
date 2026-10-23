import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Button from './ui/Button';
import Input from './ui/Input';
import { resetPassword } from '../services/authService';
import { Lock, CheckCircle2 } from 'lucide-react';
import ErrorMessage from './ui/ErrorMessage';
import { pageSEO } from '../utils/seoConfig';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    password: '',
    confirmPassword: ''
  });
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

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);
    try {
      await resetPassword(token, form.password);
      setSuccess(true);
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(
        err?.response?.data?.error || 'Failed to reset password. The link may be expired or invalid.'
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
        <title>{pageSEO.resetPassword.title}</title>
        <meta name="description" content={pageSEO.resetPassword.description} />
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
                <h2 className="text-2xl font-bold tracking-tight mb-2">Password Updated</h2>
                <p className={`text-sm ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Your password has been changed. Redirecting to Sign In...
                </p>
              </div>
              <Link to="/login" className="block pt-2">
                <Button variant="accent" className="w-full h-11 text-sm font-semibold">
                  Go to Sign In
                </Button>
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] mb-5">
                  <Lock size={19} />
                </div>
                <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
                <p className={`text-sm mt-1 ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Choose a strong new password for your store account
                </p>
              </div>

              {error && (
                <div className="mb-5">
                  <ErrorMessage message={error} type="error" title="Error" />
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <Input
                  label="New Password"
                  type="password"
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Enter new password"
                  darkMode={darkMode}
                  required
                  helperText="Minimum 6 characters"
                />

                <Input
                  label="Confirm Password"
                  type="password"
                  name="confirmPassword"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm new password"
                  darkMode={darkMode}
                  required
                />

                <Button
                  type="submit"
                  variant="accent"
                  className="w-full h-11 text-sm font-semibold mt-2"
                  isLoading={loading}
                >
                  {loading ? 'Updating...' : 'Reset Password'}
                </Button>
              </form>

              <div className={`mt-6 pt-5 border-t text-center ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'}`}>
                <p className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                  Remember your password?{' '}
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

export default ResetPassword;
