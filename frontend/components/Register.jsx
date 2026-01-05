import React, { useState } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { register as registerUser } from '../services/authService';

const Register = ({ onSuccess, onSwitchToLogin }) => {
  const [form, setForm] = useState({
    username: '',
    phoneNumber: '',
    password: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

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
      const user = await registerUser(
        form.username,
        form.password,
        form.phoneNumber
      );
      if (onSuccess) onSuccess(user);
    } catch (err) {
      const message =
        err?.response?.data?.error || 'Registration failed. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white shadow-xl rounded-2xl p-8 border border-slate-200">
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          Create an account
        </h1>
        <p className="text-sm text-slate-500 mb-6">
          Register with your phone number to receive expiry alerts on WhatsApp.
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
            placeholder="Choose a username"
            required
          />

          <Input
            label="WhatsApp Phone Number"
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={handleChange}
            placeholder="+92333xxxxxxx"
            required
          />

          <Input
            label="Password"
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Create a password"
            required
          />

          <Input
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Re-enter your password"
            required
          />

          <Button
            type="submit"
            className="w-full mt-2"
            isLoading={loading}
          >
            Register
          </Button>
        </form>

        <p className="mt-4 text-xs text-slate-500 text-center">
          Already have an account?{' '}
          <button
            type="button"
            className="text-blue-600 hover:underline font-medium"
            onClick={onSwitchToLogin}
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
};

export default Register;


