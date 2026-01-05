import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { login } from '../services/authService';
import { Sun, Moon, LogIn } from 'lucide-react';

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);

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
    setLoading(true);
    try {
      const user = await login(form.username, form.password);
      if (onSuccess) onSuccess(user);
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Login failed. Please check your credentials.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900' : 'bg-gradient-to-br from-blue-50 via-slate-50 to-cyan-50'}`}>
      {/* Theme Toggle */}
      <div className="absolute top-4 right-4 z-10">
        <button
          onClick={toggleTheme}
          className={`p-2 rounded-lg transition-all duration-300 ${darkMode ? 'bg-slate-700 text-yellow-400 hover:bg-slate-600' : 'bg-white text-slate-700 hover:bg-slate-100'} shadow-lg`}
          title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
        >
          {darkMode ? <Sun size={24} /> : <Moon size={24} />}
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className={`max-w-md w-full ${darkMode ? 'bg-slate-800' : 'bg-white'} shadow-2xl rounded-3xl p-8 border ${darkMode ? 'border-slate-700' : 'border-slate-200'} backdrop-blur-xl`}>
          {/* Header Icon */}
          <div className="flex justify-center mb-6">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-4 rounded-2xl text-white shadow-lg">
              <LogIn size={32} />
            </div>
          </div>

          <h1 className={`text-3xl font-bold text-center mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
            Welcome Back
          </h1>
          <p className={`text-sm text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Login to your Inventa account
          </p>

          {error && (
            <div className={`mb-4 text-sm border rounded-xl px-4 py-3 ${darkMode ? 'text-red-400 bg-red-900/20 border-red-700' : 'text-red-700 bg-red-50 border-red-200'}`}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="Enter your username"
              required
            />

            <Input
              label="Password"
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
            />

            <Button
              type="submit"
              className="w-full mt-6"
              isLoading={loading}
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </Button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center">
            <div className={`flex-1 h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
            <span className={`px-3 text-xs ${darkMode ? 'text-slate-500' : 'text-slate-400'}`}>OR</span>
            <div className={`flex-1 h-px ${darkMode ? 'bg-slate-700' : 'bg-slate-300'}`}></div>
          </div>

          <p className={`text-sm text-center ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
            Don&apos;t have an account?{' '}
            <button
              type="button"
              className="font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all"
              onClick={onSwitchToRegister}
            >
              Create account
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
