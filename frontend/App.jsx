import { useEffect, useState, useMemo, lazy, Suspense } from 'react';
import { Helmet } from 'react-helmet-async';
import SwUpdateToast from './components/SwUpdateToast';
import { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { getProducts, updateProduct, deleteProduct, createProduct, generateExpiryReport } from './services/productService';
const ProductCard = lazy(() => import('./components/ProductCard'));
const ProductDetails = lazy(() => import('./components/ProductDetails'));
const ProductForm = lazy(() => import('./components/ProductForm'));
const BulkImport = lazy(() => import('./components/BulkImport'));
import Sheet from './components/ui/Sheet';
import Dialog from './components/ui/Dialog';
import Button from './components/ui/Button';
import LoadingSpinner from './components/ui/LoadingSpinner';
import {
  Search,
  Plus,
  Boxes,
  RefreshCw,
  FileText,
  Upload,
  XCircle,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import UnprotectedRoute from './components/UnprotectedRoute';
import Profile from './components/Profile';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { getCurrentUser, logout as logoutUser } from './services/authService';

const Login = lazy(() => import('./components/Login'));
const Register = lazy(() => import('./components/Register'));
const VerifyEmail = lazy(() => import('./components/VerifyEmail'));
const ForgotPassword = lazy(() => import('./components/ForgotPassword'));
const ResetPassword = lazy(() => import('./components/ResetPassword'));
const ResendVerification = lazy(() => import('./components/ResendVerification'));
const Landing = lazy(() => import('./components/Landing'));
const Analytics = lazy(() => import('./components/Analytics'));
const PrivacyPolicy = lazy(() => import('./components/PrivacyPolicy'));
const TermsOfService = lazy(() => import('./components/TermsOfService'));
const BlogList = lazy(() => import('./components/BlogList'));
const BlogPost = lazy(() => import('./components/BlogPost'));
const ExpiryCalculator = lazy(() => import('./components/ExpiryCalculator'));
const About = lazy(() => import('./components/About'));
const Contact = lazy(() => import('./components/Contact'));

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handler = () => setWidth(window.innerWidth);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  return width;
};

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Auth state
  const [authUser, setAuthUser] = useState(null);

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Selection & Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBulkImportModalOpen, setIsBulkImportModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Toast State
  const [toast, setToast] = useState(null);

  // Profile state
  const [showProfile, setShowProfile] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Sync locally-saved products to server when connectivity is restored
  useEffect(() => {
    if (!isOnline) return;
    const syncLocalProducts = async () => {
      const localProducts = products.filter(p => p._isLocal);
      if (localProducts.length === 0) return;
      let synced = 0;
      const updatedList = [...products];
      for (const p of localProducts) {
        try {
          const { _isLocal, id, ...data } = p;
          const saved = await createProduct(data);
          const idx = updatedList.findIndex(x => x.id === p.id);
          if (idx !== -1) updatedList[idx] = { ...saved, id: saved._id || saved.id };
          synced++;
        } catch (_) { /* leave as local if still failing */ }
      }
      if (synced > 0) {
        setProducts(updatedList);
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        showToast('success', `Synced ${synced} offline product${synced !== 1 ? 's' : ''} to server`);
      }
    };
    syncLocalProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOnline]);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const getUserInitials = (username) => {
    if (!username) return '';
    const names = username.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const data = await getProducts();
      const normalizedData = data.map(product => ({
        ...product,
        id: product._id || product.id
      }));
      setProducts(normalizedData);
      localStorage.setItem('cachedProducts', JSON.stringify(normalizedData));
    } catch (error) {
      const cachedProducts = localStorage.getItem('cachedProducts');
      if (cachedProducts) {
        try {
          const parsedProducts = JSON.parse(cachedProducts);
          setProducts(parsedProducts);
          showToast('info', 'Showing cached data (offline mode)');
        } catch (parseError) {
          console.error('Failed to parse cached data:', parseError);
        }
      } else {
        showToast('error', 'Failed to fetch products');
      }
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ id: Date.now().toString(), type, message });
  };

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      await deferredPrompt.userChoice;
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  const openProfile = () => setShowProfile(true);
  const closeProfile = () => setShowProfile(false);

  const handleProfileUpdate = (updatedUser) => {
    setAuthUser((prev) => ({
      ...(prev || {}),
      username: updatedUser.username,
      phoneNumber: updatedUser.phoneNumber,
    }));
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product =>
      (product.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.batchNumber || '').toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  const handleProductClick = (product) => setSelectedProduct(product);
  const handleEditClick = () => setIsEditModalOpen(true);
  const handleDeleteClick = () => setIsDeleteModalOpen(true);
  const handleAddClick = () => setIsAddModalOpen(true);
  const handleBulkImportClick = () => setIsBulkImportModalOpen(true);

  const handleCreateProduct = async (data) => {
    setActionLoading(true);
    try {
      const newProduct = await createProduct(data);
      const normalizedProduct = {
        ...newProduct,
        id: newProduct._id || newProduct.id
      };
      setProducts(prev => {
        const updatedList = [normalizedProduct, ...prev];
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setIsAddModalOpen(false);
      showToast('success', 'Product created successfully');
    } catch (error) {
      const newLocalProduct = {
        ...data,
        id: Date.now().toString(),
        createdAt: new Date().toISOString(),
        _isLocal: true
      };
      setProducts(prev => {
        const updatedList = [newLocalProduct, ...prev];
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setIsAddModalOpen(false);
      showToast('info', 'Product saved locally (will sync when online)');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateProduct = async (data) => {
    if (!selectedProduct) return;

    setActionLoading(true);
    try {
      const updated = await updateProduct(selectedProduct.id, data);
      const normalizedProduct = {
        ...updated,
        id: updated._id || updated.id
      };

      setProducts(prev => {
        const updatedList = prev.map(p => p.id === normalizedProduct.id ? normalizedProduct : p);
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setSelectedProduct(normalizedProduct);
      setIsEditModalOpen(false);
      showToast('success', 'Product updated successfully');
    } catch (error) {
      setProducts(prev => {
        const updatedList = prev.map(p => {
          if (p.id === selectedProduct.id) {
            return { ...p, ...data, _isLocal: true, updatedAt: new Date().toISOString() };
          }
          return p;
        });
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setSelectedProduct({ ...selectedProduct, ...data, _isLocal: true, updatedAt: new Date().toISOString() });
      setIsEditModalOpen(false);
      showToast('info', 'Product updated locally (will sync when online)');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    setActionLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      setProducts(prev => {
        const updatedList = prev.filter(p => p.id !== selectedProduct.id);
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setSelectedProduct(null);
      setIsDeleteModalOpen(false);
      showToast('success', 'Product deleted successfully');
    } catch (error) {
      setProducts(prev => {
        const updatedList = prev.filter(p => p.id !== selectedProduct.id);
        localStorage.setItem('cachedProducts', JSON.stringify(updatedList));
        return updatedList;
      });
      setSelectedProduct(null);
      setIsDeleteModalOpen(false);
      showToast('info', 'Product marked for deletion (will sync when online)');
    } finally {
      setActionLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    setActionLoading(true);
    try {
      await generateExpiryReport();
      showToast('success', 'Report downloaded successfully');
    } catch (error) {
      showToast('error', 'Failed to generate report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    fetchData();
    navigate('/dashboard');
  };

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
    setProducts([]);
    navigate('/login');
  };

  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthUser(user);
      fetchData();
    } else {
      setLoading(false);
      const publicRoutes = ['/login', '/register', '/', '/forgot-password', '/verify-email', '/reset-password', '/resend-verification', '/privacy-policy', '/terms-of-service', '/blog', '/expiry-calculator', '/about', '/contact'];
      const isPublicRoute = publicRoutes.some(route =>
        location.pathname === route || location.pathname.startsWith(route + '/')
      );

      if (!isPublicRoute) {
        navigate('/');
      }
    }
  }, [location.pathname, navigate]);

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-[#0A0A0A] text-[#F5F5F3]' : 'bg-[#FAF9F6] text-[#111111]'}`}>
      <SwUpdateToast />
      <Suspense fallback={<div className="flex h-screen w-full items-center justify-center"><LoadingSpinner size="lg" variant="primary" /></div>}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing onGetStarted={() => navigate('/login')} />} />
          <Route
            path="/login"
            element={
              <UnprotectedRoute redirectTo="/dashboard">
                <Login onSuccess={handleAuthSuccess} onSwitchToRegister={() => navigate('/register')} />
              </UnprotectedRoute>
            }
          />
          <Route
            path="/register"
            element={
              <UnprotectedRoute redirectTo="/dashboard">
                <Register onSuccess={handleAuthSuccess} onSwitchToLogin={() => navigate('/login')} />
              </UnprotectedRoute>
            }
          />
          <Route path="/verify-email/:token" element={<VerifyEmail />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/blog" element={<BlogList />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/expiry-calculator" element={<ExpiryCalculator />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute redirectTo="/login">
                <Dashboard
                  products={products}
                  loading={loading}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  isOnline={isOnline}
                  darkMode={darkMode}
                  toggleTheme={toggleTheme}
                  fetchData={fetchData}
                  handleAddClick={handleAddClick}
                  handleBulkImportClick={handleBulkImportClick}
                  handleGenerateReport={handleGenerateReport}
                  handleProductClick={handleProductClick}
                  handleLogout={handleLogout}
                  openProfile={openProfile}
                  getUserInitials={getUserInitials}
                  authUser={authUser}
                  filteredProducts={filteredProducts}
                  selectedProduct={selectedProduct}
                  setSelectedProduct={setSelectedProduct}
                  isEditModalOpen={isEditModalOpen}
                  setIsEditModalOpen={setIsEditModalOpen}
                  isAddModalOpen={isAddModalOpen}
                  setIsAddModalOpen={setIsAddModalOpen}
                  isDeleteModalOpen={isDeleteModalOpen}
                  setIsDeleteModalOpen={setIsDeleteModalOpen}
                  isBulkImportModalOpen={isBulkImportModalOpen}
                  setIsBulkImportModalOpen={setIsBulkImportModalOpen}
                  actionLoading={actionLoading}
                  handleEditClick={handleEditClick}
                  handleDeleteClick={handleDeleteClick}
                  handleUpdateProduct={handleUpdateProduct}
                  handleCreateProduct={handleCreateProduct}
                  handleConfirmDelete={handleConfirmDelete}
                  showToast={showToast}
                  toast={toast}
                  showProfile={showProfile}
                  closeProfile={closeProfile}
                  handleProfileUpdate={handleProfileUpdate}
                  showInstallBanner={showInstallBanner}
                  setShowInstallBanner={setShowInstallBanner}
                  deferredPrompt={deferredPrompt}
                  handleInstallClick={handleInstallClick}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="/analytics"
            element={
              <ProtectedRoute redirectTo="/login">
                <Analytics
                  darkMode={darkMode}
                  user={authUser}
                  onLogout={handleLogout}
                  toggleTheme={toggleTheme}
                  onOpenProfile={openProfile}
                />
              </ProtectedRoute>
            }
          />

          <Route
            path="*"
            element={authUser ? <Navigate to="/dashboard" replace /> : <Navigate to="/" replace />}
          />
        </Routes>
      </Suspense>
    </div>
  );
};

const Dashboard = ({
  products, loading, searchQuery, setSearchQuery, isOnline, darkMode, toggleTheme,
  fetchData, handleAddClick, handleBulkImportClick, handleGenerateReport, handleProductClick, handleLogout,
  openProfile, authUser, filteredProducts, selectedProduct, setSelectedProduct,
  isEditModalOpen, setIsEditModalOpen, isAddModalOpen, setIsAddModalOpen, isDeleteModalOpen,
  setIsDeleteModalOpen, isBulkImportModalOpen, setIsBulkImportModalOpen,
  actionLoading, handleEditClick, handleDeleteClick, handleUpdateProduct,
  handleCreateProduct, handleConfirmDelete, showToast, toast, showProfile, closeProfile,
  handleProfileUpdate, showInstallBanner, setShowInstallBanner, handleInstallClick
}) => {
  const windowWidth = useWindowSize();
  const isDesktop = windowWidth > 1024;

  const stats = {
    total: products.length,
    active: products.filter(p => new Date(p.expiryDate) > new Date()).length,
    expiringMsg: products.filter(p => {
      const expiry = new Date(p.expiryDate);
      const now = new Date();
      const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
      return diffDays >= 0 && diffDays <= 7;
    }).length,
    expired: products.filter(p => {
      const expiry = new Date(p.expiryDate);
      const now = new Date();
      return expiry < now;
    }).length
  };

  return (
    <Layout
      user={authUser}
      onLogout={handleLogout}
      toggleTheme={toggleTheme}
      darkMode={darkMode}
      title="Inventory Ledger"
      onOpenProfile={openProfile}
    >
      <Helmet>
        <title>Dashboard | Inventa Inventory Management</title>
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      {/* Top Editorial Banner */}
      <div
        className={`mb-6 rounded-xl border p-5 sm:p-6 ${
          darkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
        }`}
      >
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#BBF7D0] bg-[#F0FDF4] dark:border-[#19422B] dark:bg-[#0D2116] px-3 py-1 text-xs font-semibold text-[#15803D] dark:text-[#4ADE80]">
              <MessageCircle size={13} />
              <span>WhatsApp Shelf Automation</span>
            </div>
            <h2 className="mt-3 text-xl sm:text-2xl font-bold tracking-tight">
              Track batches, verify label scans, and prevent expiry write-offs.
            </h2>
            <p className={`mt-1.5 text-sm leading-relaxed ${darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}`}>
              Send a photo on WhatsApp or upload a label below to automatically extract batch codes and expiration dates.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-2.5 sm:min-w-[340px]">
            {[
              ['01. Capture', 'Photo to SKU'],
              ['02. Verify', 'Human check'],
              ['03. Alert', 'Daily 09:00 AM']
            ].map(([label, value]) => (
              <div
                key={label}
                className={`rounded-lg border px-3.5 py-2.5 ${
                  darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
                }`}
              >
                <div className="text-[10px] font-mono uppercase tracking-wider text-[#15803D] dark:text-[#4ADE80] font-semibold">
                  {label}
                </div>
                <div className="mt-1 text-xs font-semibold">{value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
        <StatCard
          title="Total SKUs"
          value={stats.total}
          icon={Boxes}
          tone="neutral"
          darkMode={darkMode}
        />
        <StatCard
          title="Healthy Stock"
          value={stats.active}
          icon={CheckCircle2}
          tone="good"
          darkMode={darkMode}
        />
        <StatCard
          title="Expiring (≤7d)"
          value={stats.expiringMsg}
          icon={AlertTriangle}
          tone="warning"
          darkMode={darkMode}
        />
        <StatCard
          title="Expired Items"
          value={stats.expired}
          icon={XCircle}
          tone="critical"
          darkMode={darkMode}
        />
      </div>

      {/* Search & Action Toolbar */}
      <div
        className={`rounded-xl border p-4 mb-6 ${
          darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Search className={`h-4 w-4 ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`} />
            </div>
            <input
              type="text"
              placeholder="Search by product name, category, or batch number..."
              className={`block w-full pl-10 pr-4 py-2.5 border rounded-lg text-sm focus:outline-none transition-colors min-h-[42px] ${
                darkMode
                  ? 'bg-[#0A0A0A] border-[#262626] text-[#F5F5F3] placeholder-[#6E6E68] focus:border-[#22C55E]'
                  : 'bg-[#FAF9F6] border-[#CFCFC8] text-[#111111] placeholder-[#767670] focus:border-[#15803D]'
              }`}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 sm:flex items-center gap-2">
            <Button
              variant="outline"
              onClick={fetchData}
              title="Refresh Data"
              className="justify-center text-xs"
            >
              <RefreshCw size={15} className={`mr-1.5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button
              variant="outline"
              onClick={handleGenerateReport}
              disabled={actionLoading || products.length === 0}
              className="justify-center text-xs"
            >
              <FileText size={15} className="mr-1.5" />
              Audit PDF
            </Button>
            <Button
              variant="outline"
              onClick={handleBulkImportClick}
              className="justify-center text-xs"
            >
              <Upload size={15} className="mr-1.5" />
              Import CSV
            </Button>
            <Button
              variant="accent"
              onClick={handleAddClick}
              className="justify-center text-xs font-semibold"
            >
              <Plus size={15} className="mr-1.5" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20">
          <LoadingSpinner size="lg" variant="primary" />
          <p className={`mt-4 text-sm font-medium ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
            Loading inventory ledger...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <EmptyState
          darkMode={darkMode}
          searchQuery={searchQuery}
          onClearSearch={() => setSearchQuery('')}
          onAdd={handleAddClick}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 pb-16">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onClick={() => handleProductClick(product)}
              onEdit={() => {
                handleProductClick(product);
                handleEditClick();
              }}
              onDelete={() => {
                handleProductClick(product);
                handleDeleteClick();
              }}
              isOnline={isOnline}
              darkMode={darkMode}
            />
          ))}
        </div>
      )}

      {/* Sheets & Dialogs */}
      <Sheet
        isOpen={!!selectedProduct && !isEditModalOpen && !isDeleteModalOpen}
        onClose={() => setSelectedProduct(null)}
        title="Product Inventory Details"
        darkMode={darkMode}
        fullScreen={isDesktop}
      >
        {selectedProduct && (
          <ProductDetails
            product={selectedProduct}
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
            onAlertSent={showToast}
            darkMode={darkMode}
          />
        )}
      </Sheet>

      <Sheet isOpen={showProfile} onClose={closeProfile} position="right" title="Store Profile" darkMode={darkMode}>
        <Profile user={authUser} onUpdate={handleProfileUpdate} onClose={closeProfile} darkMode={darkMode} />
      </Sheet>

      <Sheet
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product Details"
        darkMode={darkMode}
        fullScreen={isDesktop}
      >
        <ProductForm
          initialData={selectedProduct}
          onSubmit={handleUpdateProduct}
          onCancel={() => setIsEditModalOpen(false)}
          isLoading={actionLoading}
          darkMode={darkMode}
        />
      </Sheet>

      <Sheet
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Inventory Item"
        darkMode={darkMode}
        fullScreen={isDesktop}
      >
        <ProductForm
          onSubmit={handleCreateProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={actionLoading}
          darkMode={darkMode}
        />
      </Sheet>

      <Dialog isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Product" darkMode={darkMode}>
        <div className="space-y-4">
          <p className={darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'}>
            Are you sure you want to delete <span className="font-bold text-[#111111] dark:text-[#F5F5F3]">{selectedProduct?.name}</span>? This action cannot be undone.
          </p>
          <div className="flex justify-end gap-3 mt-6">
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)} darkMode={darkMode}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmDelete} isLoading={actionLoading}>
              Delete Product
            </Button>
          </div>
        </div>
      </Dialog>

      <Dialog isOpen={isBulkImportModalOpen} onClose={() => setIsBulkImportModalOpen(false)} title="Bulk Import CSV / Excel" darkMode={darkMode}>
        <BulkImport
          onSuccess={() => {
            setIsBulkImportModalOpen(false);
            showToast('success', 'Products imported successfully');
            fetchData();
          }}
          onImportSuccess={() => {
            setIsBulkImportModalOpen(false);
            showToast('success', 'Products imported successfully');
            fetchData();
          }}
          onClose={() => setIsBulkImportModalOpen(false)}
          darkMode={darkMode}
        />
      </Dialog>

      {/* PWA Install Banner */}
      {showInstallBanner && (
        <div
          className={`fixed bottom-0 left-0 right-0 p-4 border-t z-50 ${
            darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
          }`}
        >
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <p className="font-semibold text-sm">Install Inventa Workspace</p>
              <p className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
                Add to your device for offline inventory access
              </p>
            </div>
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" onClick={() => setShowInstallBanner(false)} className="flex-1 sm:flex-none">
                Not Now
              </Button>
              <Button variant="accent" size="sm" onClick={handleInstallClick} className="flex-1 sm:flex-none">
                Install
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg border shadow-lg flex items-center gap-2.5 z-50 text-xs font-medium ${
            toast.type === 'success'
              ? 'bg-[#F0FDF4] border-[#BBF7D0] text-[#15803D] dark:bg-[#0D2116] dark:border-[#19422B] dark:text-[#4ADE80]'
              : toast.type === 'error'
              ? 'bg-[#FEF2F2] border-[#FECACA] text-[#B91C1C] dark:bg-[#2A1212] dark:border-[#5E1A1A] dark:text-[#F87171]'
              : 'bg-[#111111] border-[#262626] text-white'
          }`}
        >
          <span>{toast.message}</span>
        </div>
      )}
    </Layout>
  );
};

const StatCard = ({ title, value, icon: Icon, tone, darkMode }) => {
  const toneColors = {
    neutral: darkMode ? 'text-[#F5F5F3] bg-[#1A1A1A] border-[#262626]' : 'text-[#111111] bg-[#F3F2EE] border-[#E4E4E0]',
    good: darkMode ? 'text-[#4ADE80] bg-[#0D2116] border-[#19422B]' : 'text-[#15803D] bg-[#F0FDF4] border-[#BBF7D0]',
    warning: darkMode ? 'text-[#FBBF24] bg-[#271A0B] border-[#543813]' : 'text-[#B45309] bg-[#FFFBEB] border-[#FDE68A]',
    critical: darkMode ? 'text-[#F87171] bg-[#2A1212] border-[#5E1A1A]' : 'text-[#B91C1C] bg-[#FEF2F2] border-[#FECACA]'
  };

  return (
    <div
      className={`p-4 sm:p-5 rounded-xl border transition-colors ${
        darkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className={`text-xs font-medium ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
            {title}
          </p>
          <h3 className="tabular-data text-2xl sm:text-3xl font-bold tracking-tight mt-1.5">
            {value}
          </h3>
        </div>
        <div className={`p-2 rounded-lg border ${toneColors[tone] || toneColors.neutral}`}>
          <Icon size={18} />
        </div>
      </div>
    </div>
  );
};

const EmptyState = ({ darkMode, searchQuery, onClearSearch, onAdd }) => (
  <div
    className={`flex flex-col items-center justify-center py-16 px-4 text-center rounded-xl border border-dashed ${
      darkMode ? 'border-[#262626] bg-[#141414]/50' : 'border-[#CFCFC8] bg-white'
    }`}
  >
    <div
      className={`p-4 rounded-xl border mb-4 ${
        darkMode ? 'bg-[#1A1A1A] border-[#262626] text-[#A3A39E]' : 'bg-[#F3F2EE] border-[#E4E4E0] text-[#4A4A46]'
      }`}
    >
      <Search size={28} />
    </div>
    <h3 className="text-lg font-bold mb-1.5">
      {searchQuery ? 'No matching products found' : 'Your inventory ledger is empty'}
    </h3>
    <p className={`max-w-md mx-auto mb-6 text-sm ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
      {searchQuery
        ? "We couldn't find any batches matching your search query. Try another keyword or batch number."
        : 'Add your first product by uploading a label photo, scanning a barcode, or sending an image on WhatsApp.'}
    </p>
    <div className="flex gap-3">
      {searchQuery && (
        <Button variant="outline" onClick={onClearSearch}>
          Clear Search
        </Button>
      )}
      <Button variant="accent" onClick={onAdd}>
        <Plus size={16} className="mr-1.5" />
        Add First Product
      </Button>
    </div>
  </div>
);

export default App;
