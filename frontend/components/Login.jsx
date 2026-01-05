import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { login } from '../services/authService';

const Login = ({ onSuccess, onSwitchToRegister }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Welcome back
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Login to view and manage your products.
        </p>

        {error && (
          <div className="mb-4 text-sm text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
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
            className="w-full mt-2"
            isLoading={loading}
          >
            Login
          </Button>
        </form>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={onSwitchToRegister}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;


