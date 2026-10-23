import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import ErrorMessage from './ui/ErrorMessage';
import { getProfile, updateProfile, deleteAccount, changePassword } from '../services/userService';
import { logout } from '../services/authService';
import { getProducts } from '../services/productService';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Shield,
  Trash2,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = ({ onClose, onProfileUpdate, onUpdate, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phoneNumber: '',
    telegramUserId: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [changingPassword, setChangingPassword] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const [stats, setStats] = useState({
    totalProducts: 0,
    accountCreated: null
  });

  useEffect(() => {
    loadProfileData();
  }, []);

  const loadProfileData = async () => {
    setLoading(true);
    setError('');
    try {
      const [profileData, productsData] = await Promise.all([
        getProfile(),
        getProducts()
      ]);

      setProfile(profileData);
      setEditForm({
        username: profileData.username || '',
        email: profileData.email || '',
        phoneNumber: profileData.phoneNumber || '',
        telegramUserId: profileData.telegramUserId || ''
      });

      setStats({
        totalProducts: productsData.length,
        accountCreated: profileData.createdAt
      });
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, message) => {
    if (type === 'success') {
      setSuccess(message);
      setError('');
    } else {
      setError(message);
      setSuccess('');
    }
    setTimeout(() => {
      setSuccess('');
      setError('');
    }, 5000);
  };

  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setError('');

    if (!editForm.username.trim()) {
      setError('Username is required');
      return;
    }

    if (!editForm.phoneNumber.startsWith('+')) {
      setError('Phone number must start with + and country code');
      return;
    }

    setSaving(true);
    try {
      const updatedProfile = await updateProfile(editForm);
      setProfile(updatedProfile);
      setIsEditing(false);
      if (onProfileUpdate) onProfileUpdate(updatedProfile);
      if (onUpdate) onUpdate(updatedProfile);
      showMessage('success', 'Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setError('');

    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      setError('All password fields are required');
      return;
    }

    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    setChangingPassword(true);
    try {
      await changePassword({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });

      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });

      showMessage('success', 'Password changed successfully');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to change password');
    } finally {
      setChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    const confirm1 = window.confirm(
      'Are you sure you want to delete your account? This will permanently delete all your products and cannot be undone.'
    );
    if (!confirm1) return;

    const confirm2 = window.prompt('Type "DELETE" to confirm account deletion:');
    if (confirm2 !== 'DELETE') {
      setError('Account deletion cancelled');
      return;
    }

    try {
      await deleteAccount();
      showMessage('success', 'Account deleted successfully');
      setTimeout(() => {
        logout();
        window.location.reload();
      }, 2000);
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to delete account');
    }
  };

  const togglePasswordVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#15803D]" />
        <span className="ml-2.5 text-xs font-medium">Loading profile...</span>
      </div>
    );
  }

  return (
    <div className="h-full">
      {/* Tabs */}
      <div className={`flex border-b ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'} mb-6`}>
        {['profile', 'security', 'stats'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 pb-3 text-xs font-semibold uppercase tracking-wider transition-all relative cursor-pointer ${
              activeTab === tab
                ? 'text-[#15803D] dark:text-[#4ADE80]'
                : darkMode
                ? 'text-[#A3A39E] hover:text-white'
                : 'text-[#767670] hover:text-[#111111]'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#15803D] dark:bg-[#4ADE80]" />
            )}
          </button>
        ))}
      </div>

      {error && <ErrorMessage message={error} type="error" className="mb-5" />}
      {success && <ErrorMessage message={success} type="success" className="mb-5" />}

      <div>
        {activeTab === 'profile' && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold">Store Operator Details</h3>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <Input
                  label="Username"
                  name="username"
                  value={editForm.username}
                  onChange={handleEditFormChange}
                  darkMode={darkMode}
                  required
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={editForm.email}
                  onChange={handleEditFormChange}
                  darkMode={darkMode}
                />
                <Input
                  label="WhatsApp Number"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleEditFormChange}
                  darkMode={darkMode}
                  required
                />
                <Input
                  label="Telegram ID"
                  name="telegramUserId"
                  value={editForm.telegramUserId}
                  onChange={handleEditFormChange}
                  darkMode={darkMode}
                />

                <div className="flex gap-2.5 pt-2">
                  <Button type="submit" variant="accent" isLoading={saving} className="flex-1">
                    Save Changes
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setIsEditing(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="space-y-3">
                <InfoItem icon={User} label="Username" value={profile.username} darkMode={darkMode} />
                <InfoItem icon={Mail} label="Email" value={profile.email || 'Not set'} darkMode={darkMode} />
                <InfoItem icon={Phone} label="WhatsApp" value={profile.phoneNumber} darkMode={darkMode} />
                <InfoItem icon={Shield} label="Telegram ID" value={profile.telegramUserId || 'Not linked'} darkMode={darkMode} />
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-sm font-bold">Change Password</h3>
              <p className={`text-xs mt-0.5 ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
                Update your workspace credentials
              </p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4">
              <PasswordInput
                label="Current Password"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordFormChange}
                isVisible={showPasswords.current}
                onToggle={() => togglePasswordVisibility('current')}
                darkMode={darkMode}
              />
              <PasswordInput
                label="New Password"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordFormChange}
                isVisible={showPasswords.new}
                onToggle={() => togglePasswordVisibility('new')}
                darkMode={darkMode}
              />
              <PasswordInput
                label="Confirm Password"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordFormChange}
                isVisible={showPasswords.confirm}
                onToggle={() => togglePasswordVisibility('confirm')}
                darkMode={darkMode}
              />
              <Button type="submit" variant="accent" isLoading={changingPassword} className="w-full mt-2">
                Update Password
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-3">
            <h3 className="text-sm font-bold mb-3">Workspace Activity</h3>
            <div
              className={`p-4 rounded-xl border flex items-center gap-4 ${
                darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div className="p-3 rounded-lg bg-[#F0FDF4] text-[#15803D] dark:bg-[#0D2116] dark:text-[#4ADE80]">
                <Package size={20} />
              </div>
              <div>
                <p className="tabular-data text-2xl font-bold">{stats.totalProducts}</p>
                <p className="text-xs text-[#767670]">Tracked Inventory Batches</p>
              </div>
            </div>

            <div
              className={`p-4 rounded-xl border flex items-center gap-4 ${
                darkMode ? 'bg-[#0A0A0A] border-[#262626]' : 'bg-white border-[#E4E4E0]'
              }`}
            >
              <div className="p-3 rounded-lg bg-[#F3F2EE] text-[#111111] dark:bg-[#1A1A1A] dark:text-[#F5F5F3]">
                <Calendar size={20} />
              </div>
              <div>
                <p className="tabular-data text-2xl font-bold">
                  {stats.accountCreated
                    ? Math.floor((new Date() - new Date(stats.accountCreated)) / (1000 * 60 * 60 * 24))
                    : 0}
                </p>
                <p className="text-xs text-[#767670]">Days Active</p>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-[#262626]' : 'border-[#E4E4E0]'}`}>
        <button
          onClick={handleDeleteAccount}
          className="flex items-center text-[#DC2626] hover:underline text-xs font-semibold cursor-pointer"
        >
          <Trash2 size={14} className="mr-1.5" />
          Permanently Delete Account
        </button>
      </div>
    </div>
  );
};

const InfoItem = ({ icon: Icon, label, value, darkMode }) => (
  <div
    className={`flex items-center p-3.5 rounded-lg border ${
      darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-white'
    }`}
  >
    <div className="mr-3 text-[#767670]">
      <Icon size={16} />
    </div>
    <div>
      <p className="text-[10px] font-mono uppercase tracking-wider text-[#767670]">{label}</p>
      <p className="text-xs sm:text-sm font-semibold mt-0.5">{value}</p>
    </div>
  </div>
);

const PasswordInput = ({ label, name, value, onChange, isVisible, onToggle, darkMode }) => (
  <div className="relative">
    <Input
      label={label}
      type={isVisible ? 'text' : 'password'}
      name={name}
      value={value}
      onChange={onChange}
      darkMode={darkMode}
      required
    />
    <button
      type="button"
      onClick={onToggle}
      className="absolute right-3 top-8 text-[#767670] hover:text-current cursor-pointer"
    >
      {isVisible ? <EyeOff size={15} /> : <Eye size={15} />}
    </button>
  </div>
);

export default Profile;
