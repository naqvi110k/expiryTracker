import React, { useState, useEffect } from 'react';
import Button from './ui/Button';
import Input from './ui/Input';
import { getProfile, updateProfile, deleteAccount, changePassword } from '../services/userService';
import { getCurrentUser, logout } from '../services/authService';
import { getProducts } from '../services/productService';
import {
  User,
  Mail,
  Phone,
  Calendar,
  Package,
  Shield,
  Trash2,
  Edit3,
  Save,
  X,
  Key,
  AlertTriangle,
  CheckCircle,
  Eye,
  EyeOff
} from 'lucide-react';

const Profile = ({ onClose, onProfileUpdate, darkMode = false }) => {
  const [activeTab, setActiveTab] = useState('profile');
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Edit states
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: '',
    email: '',
    phoneNumber: ''
  });

  // Password change states
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

  // Stats
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
        phoneNumber: profileData.phoneNumber || ''
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
    setEditForm(prev => ({ ...prev, [name]: value }));
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
      if (onProfileUpdate) {
        onProfileUpdate(updatedProfile);
      }
      showMessage('success', 'Profile updated successfully');
    } catch (err) {
      setError(err?.response?.data?.error || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordFormChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
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

    const confirm2 = window.prompt(
      'Type "DELETE" to confirm account deletion:'
    );

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
    setShowPasswords(prev => ({ ...prev, [field]: !prev[field] }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${darkMode ? 'border-cyan-500' : 'border-blue-500'}`}></div>
        <span className={`ml-2 ${darkMode ? 'text-slate-300' : 'text-slate-600'}`}>Loading profile...</span>
      </div>
    );
  }

  return (
    <div className={`max-w-4xl mx-auto rounded-xl shadow-lg border overflow-hidden ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-cyan-500 px-6 py-4 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-white/20 p-2 rounded-lg">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-xl font-bold">Account Profile</h1>
              <p className="text-blue-100 text-sm">Manage your account settings</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white hover:bg-white/20"
          >
            <X size={20} />
          </Button>
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg px-4 py-3 flex items-center">
          <AlertTriangle size={16} className="text-red-500 mr-2 flex-shrink-0" />
          <span className="text-red-700 text-sm">{error}</span>
        </div>
      )}

      {success && (
        <div className="mx-6 mt-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3 flex items-center">
          <CheckCircle size={16} className="text-emerald-500 mr-2 flex-shrink-0" />
          <span className="text-emerald-700 text-sm">{success}</span>
        </div>
      )}

      {/* Tabs */}
      <div className={`border-b ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
        <nav className="flex">
          <button
            onClick={() => setActiveTab('profile')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'profile'
                ? darkMode ? 'border-cyan-500 text-cyan-400' : 'border-blue-500 text-blue-600'
                : darkMode ? 'border-transparent text-slate-400 hover:text-slate-300' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Profile Information
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'security'
                ? darkMode ? 'border-cyan-500 text-cyan-400' : 'border-blue-500 text-blue-600'
                : darkMode ? 'border-transparent text-slate-400 hover:text-slate-300' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Security
          </button>
          <button
            onClick={() => setActiveTab('stats')}
            className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === 'stats'
                ? darkMode ? 'border-cyan-500 text-cyan-400' : 'border-blue-500 text-blue-600'
                : darkMode ? 'border-transparent text-slate-400 hover:text-slate-300' : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Account Stats
          </button>
        </nav>
      </div>

      {/* Tab Content */}
      <div className="p-6">
        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Profile Information</h2>
              {!isEditing && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(true)}
                >
                  <Edit3 size={16} className="mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input
                    label="Username"
                    name="username"
                    value={editForm.username}
                    onChange={handleEditFormChange}
                    placeholder="Your username"
                    required
                  />
                  <Input
                    label="Email (optional)"
                    type="email"
                    name="email"
                    value={editForm.email}
                    onChange={handleEditFormChange}
                    placeholder="you@example.com"
                  />
                </div>
                <Input
                  label="WhatsApp Phone Number"
                  name="phoneNumber"
                  value={editForm.phoneNumber}
                  onChange={handleEditFormChange}
                  placeholder="+92333xxxxxxx"
                  required
                />
                <div className="flex gap-3 pt-2">
                  <Button type="submit" isLoading={saving}>
                    <Save size={16} className="mr-2" />
                    Save Changes
                  </Button>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => {
                      setIsEditing(false);
                      setEditForm({
                        username: profile.username || '',
                        email: profile.email || '',
                        phoneNumber: profile.phoneNumber || ''
                      });
                    }}
                  >
                    <X size={16} className="mr-2" />
                    Cancel
                  </Button>
                </div>
              </form>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-lg">
                    <User size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Username</p>
                    <p className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{profile.username}</p>
                  </div>
                </div>

                {profile.email && (
                  <div className="flex items-center space-x-3">
                    <div className="bg-emerald-100 p-2 rounded-lg">
                      <Mail size={20} className="text-emerald-600" />
                    </div>
                    <div>
                      <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Email</p>
                      <p className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{profile.email}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-2 rounded-lg">
                    <Phone size={20} className="text-purple-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Phone Number</p>
                    <p className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{profile.phoneNumber}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="bg-orange-100 p-2 rounded-lg">
                    <Calendar size={20} className="text-orange-600" />
                  </div>
                  <div>
                    <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Member Since</p>
                    <p className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>
                      {new Date(stats.accountCreated).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'security' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Change Password</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Update your password to keep your account secure.</p>
            </div>

            <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
              <div className="relative">
                <Input
                  label="Current Password"
                  type={showPasswords.current ? "text" : "password"}
                  name="currentPassword"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordFormChange}
                  placeholder="Enter current password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('current')}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.current ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="New Password"
                  type={showPasswords.new ? "text" : "password"}
                  name="newPassword"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordFormChange}
                  placeholder="Enter new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('new')}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="relative">
                <Input
                  label="Confirm New Password"
                  type={showPasswords.confirm ? "text" : "password"}
                  name="confirmPassword"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordFormChange}
                  placeholder="Confirm new password"
                  required
                />
                <button
                  type="button"
                  onClick={() => togglePasswordVisibility('confirm')}
                  className="absolute right-3 top-9 text-slate-400 hover:text-slate-600"
                >
                  {showPasswords.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <Button type="submit" isLoading={changingPassword}>
                <Key size={16} className="mr-2" />
                Change Password
              </Button>
            </form>
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="space-y-6">
            <div>
              <h2 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>Account Statistics</h2>
              <p className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>Overview of your account activity.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Package size={24} className="text-blue-600" />
                  <h3 className="font-semibold text-slate-900">Total Products</h3>
                </div>
                <p className="text-3xl font-bold text-blue-700">{stats.totalProducts}</p>
                <p className="text-sm text-blue-600 mt-1">Products in inventory</p>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 p-6 rounded-xl border border-emerald-200">
                <div className="flex items-center space-x-3 mb-3">
                  <Calendar size={24} className="text-emerald-600" />
                  <h3 className="font-semibold text-slate-900">Account Age</h3>
                </div>
                <p className="text-3xl font-bold text-emerald-700">
                  {stats.accountCreated ?
                    Math.floor((new Date() - new Date(stats.accountCreated)) / (1000 * 60 * 60 * 24)) : 0
                  }
                </p>
                <p className="text-sm text-emerald-600 mt-1">Days since registration</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="border-t border-slate-200 bg-red-50 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-red-900 flex items-center">
              <Trash2 size={16} className="mr-2" />
              Danger Zone
            </h3>
            <p className="text-sm text-red-700 mt-1">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={handleDeleteAccount}
            className="bg-red-600 hover:bg-red-700"
          >
            <Trash2 size={16} className="mr-2" />
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
