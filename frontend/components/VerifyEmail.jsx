import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { verifyEmail } from '../services/authService';
import Button from './ui/Button';
import { CheckCircle2, XCircle, Loader, Boxes } from 'lucide-react';
import { pageSEO } from '../utils/seoConfig';

const VerifyEmail = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState('verifying');
  const [message, setMessage] = useState('');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  useEffect(() => {
    const verify = async () => {
      try {
        const response = await verifyEmail(token);
        setStatus('success');
        setMessage(response.message || 'Email verified successfully!');
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } catch (error) {
        setStatus('error');
        setMessage(
          error?.response?.data?.error || 'Verification failed. The link may be expired or invalid.'
        );
      }
    };

    if (token) {
      verify();
    }
  }, [token, navigate]);

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-colors duration-200 ${
        darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'
      }`}
    >
      <Helmet>
        <title>{pageSEO.verifyEmail.title}</title>
        <meta name="description" content={pageSEO.verifyEmail.description} />
        <meta name="robots" content="noindex, nofollow" />
        <link rel="canonical" href={`https://expiry-tracker.live${pageSEO.verifyEmail.path}`} />
      </Helmet>

      <div className="w-full max-w-md">
        <div
          className={`rounded-xl p-7 sm:p-9 border shadow-[0_8px_24px_-6px_rgba(0,0,0,0.05)] text-center ${
            darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
          }`}
        >
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#111111] dark:bg-[#F5F5F3] text-[#FAF9F6] dark:text-[#0A0A0A] mb-5">
            <Boxes size={20} />
          </div>
          <h1 className="text-2xl font-bold tracking-tight mb-6">Email Verification</h1>

          {status === 'verifying' && (
            <div className="space-y-4 py-4">
              <Loader className="h-10 w-10 text-[#15803D] animate-spin mx-auto" />
              <p className={`text-sm ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
                Verifying your email address...
              </p>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                <CheckCircle2 size={26} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">Verified</h2>
                <p className={`text-sm ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>{message}</p>
              </div>
              <Link to="/login" className="block">
                <Button variant="accent" className="w-full h-11 text-sm font-semibold">
                  Continue to Sign In
                </Button>
              </Link>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-5">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#FEF2F2] text-[#B91C1C] dark:bg-[#2A1212] dark:text-[#F87171]">
                <XCircle size={26} />
              </div>
              <div>
                <h2 className="text-lg font-bold mb-1">Verification Failed</h2>
                <p className={`text-sm ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>{message}</p>
              </div>
              <div className="space-y-2.5">
                <Link to="/login" className="block">
                  <Button variant="accent" className="w-full h-11 text-sm font-semibold">
                    Back to Sign In
                  </Button>
                </Link>
                <Link to="/register" className="block">
                  <Button variant="outline" className="w-full h-11 text-sm font-semibold">
                    Register Again
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
