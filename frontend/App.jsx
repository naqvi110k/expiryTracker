import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct, generateExpiryReport } from './services/productService';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import Sheet from './components/ui/Sheet';
import Dialog from './components/ui/Dialog';
import Button from './components/ui/Button';
import Input from './components/ui/Input';
import { Search, Plus, Boxes, RefreshCw, LogOut, User as UserIcon, Sun, Moon, FileText } from 'lucide-react';
import Login from './components/Login';
import Register from './components/Register';
import Profile from './components/Profile';
import Landing from './components/Landing';
import { getCurrentUser, logout as logoutUser } from './services/authService';
import { getProfile, updateProfile, deleteAccount } from './services/userService';

const App = () => {
  // Auth state
  const [authUser, setAuthUser] = useState(null);
  const [authView, setAuthView] = useState('login'); // 'login' | 'register' | 'landing'
  const [showLanding, setShowLanding] = useState(true);

  // State
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selection & Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  
  // Toast State
  const [toast, setToast] = useState(null);

  // Profile state
  const [showProfile, setShowProfile] = useState(false);

  // Theme state
  const [darkMode, setDarkMode] = useState(false);

  // Toggle theme
  const toggleTheme = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    document.documentElement.classList.toggle('dark', newMode);
    localStorage.setItem('theme', newMode ? 'dark' : 'light');
  };

  // Initialize theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

  // Get user initials for circular avatar
  const getUserInitials = (username) => {
    if (!username) return '';
    const names = username.split(' ');
    if (names.length > 1) {
      return (names[0][0] + names[names.length - 1][0]).toUpperCase();
    }
    return username.substring(0, 2).toUpperCase();
  };

  // Initialize auth + data
  useEffect(() => {
    const user = getCurrentUser();
    if (user) {
      setAuthUser(user);
      fetchData();
    } else {
      setLoading(false);
    }
  }, []);

  // Toast Auto-dismiss
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
    } catch (error) {
      showToast('error', 'Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const showToast = (type, message) => {
    setToast({ id: Date.now().toString(), type, message });
  };

  const handleAuthSuccess = (user) => {
    setAuthUser(user);
    setAuthView('login');
    fetchData();
  };

  const handleLogout = () => {
    logoutUser();
    setAuthUser(null);
    setProducts([]);
  };

  const openProfile = () => {
    setShowProfile(true);
  };

  const closeProfile = () => {
    setShowProfile(false);
  };

  const handleProfileUpdate = (updatedUser) => {
    setAuthUser((prev) => ({
      ...(prev || {}),
      username: updatedUser.username,
      phoneNumber: updatedUser.phoneNumber,
    }));
  };

  // Filter Logic
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.batchNumber.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [products, searchQuery]);

  // Handlers
  const handleProductClick = (product) => {
    setSelectedProduct(product);
  };

  const handleEditClick = () => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = () => {
    setIsDeleteModalOpen(true);
  };
  
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateProduct = async (data) => {
    setActionLoading(true);
    try {
      const newProduct = await createProduct(data);
      const normalizedProduct = {
        ...newProduct,
        id: newProduct._id || newProduct.id
      };
      setProducts(prev => [normalizedProduct, ...prev]);
      setIsAddModalOpen(false);
      showToast('success', 'Product created successfully');
    } catch (error) {
      showToast('error', 'Failed to create product');
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
      
      setProducts(prev => prev.map(p => p.id === normalizedProduct.id ? normalizedProduct : p));
      setSelectedProduct(normalizedProduct);
      setIsEditModalOpen(false);
      showToast('success', 'Product updated successfully');
    } catch (error) {
      showToast('error', 'Failed to update product');
    } finally {
      setActionLoading(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedProduct) return;

    setActionLoading(true);
    try {
      await deleteProduct(selectedProduct.id);
      
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setSelectedProduct(null);
      setIsDeleteModalOpen(false);
      showToast('success', 'Product deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete product');
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

  // If not authenticated, show auth screens or landing
  if (!authUser) {
    if (showLanding) {
      return <Landing onGetStarted={() => setShowLanding(false)} />;
    }
    return authView === 'login' ? (
      <Login
        onSuccess={handleAuthSuccess}
        onSwitchToRegister={() => setAuthView('register')}
      />
    ) : (
      <Register
        onSuccess={handleAuthSuccess}
        onSwitchToLogin={() => setAuthView('login')}
      />
    );
  }

  return (
    <div className={`min-h-screen ${darkMode ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-900'}`}>
      {/* Navbar */}
      <header className={`sticky top-0 z-30 backdrop-blur-lg border-b shadow-lg ${darkMode ? 'bg-slate-800/80 border-slate-700/50' : 'bg-white/80 border-slate-200/50'}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-3 sm:py-4 flex items-center justify-between gap-2">
          <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-shrink">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-500 p-2 sm:p-3 rounded-xl text-white flex-shrink-0 shadow-lg">
              <Boxes size={24} className="sm:w-7 sm:h-7" />
            </div>
            <div className="min-w-0 hidden xs:block">
              <h1 className={`text-base sm:text-xl font-bold bg-clip-text text-transparent whitespace-nowrap ${darkMode ? 'bg-gradient-to-r from-cyan-400 to-blue-400' : 'bg-gradient-to-r from-slate-900 to-slate-600'}`}>
                Inventa
              </h1>
              <p className={`text-xs sm:text-sm font-medium whitespace-nowrap hidden sm:block ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Smart Inventory Management
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            {/* Theme Toggle Button */}
            <Button
              variant="outline"
              size="sm"
              className={`transition-colors p-2 sm:px-3 ${darkMode ? 'text-yellow-400 hover:bg-slate-700 border-slate-600 hover:border-slate-500' : 'text-slate-600 hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}
              onClick={toggleTheme}
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun size={18} /> : <Moon size={18} />}
              <span className="hidden lg:inline ml-2">{darkMode ? 'Light' : 'Dark'}</span>
            </Button>

            {/* Mobile User Icon */}
            <button
              type="button"
              onClick={openProfile}
              className={`sm:hidden p-2 rounded-lg transition-all duration-200 ${darkMode ? 'hover:bg-slate-700' : 'hover:bg-slate-50'}`}
              title="Profile"
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 rounded-full text-white">
                <span className="text-xs font-bold">{getUserInitials(authUser?.username)}</span>
              </div>
            </button>

            {/* Desktop User Profile Section */}
            <button
              type="button"
              onClick={openProfile}
              className={`hidden sm:flex items-center space-x-2 sm:space-x-3 rounded-xl px-3 sm:px-4 py-2 sm:py-2.5 transition-all duration-200 border ${darkMode ? 'hover:bg-slate-700 border-transparent hover:border-slate-600' : 'hover:bg-slate-50 border-transparent hover:border-slate-200'}`}
            >
              <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-1.5 sm:p-2 rounded-full text-white">
                <span className="text-xs sm:text-sm font-bold">{getUserInitials(authUser?.username)}</span>
              </div>
              <div className="text-left hidden md:block">
                <p className={`text-xs font-medium ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Hello,</p>
                <p className={`text-sm font-semibold ${darkMode ? 'text-slate-200' : 'text-slate-800'}`}>{authUser?.username}</p>
              </div>
            </button>

            <Button
              variant="outline"
              size="sm"
              className={`transition-colors p-2 sm:px-3 ${darkMode ? 'text-yellow-400 hover:bg-slate-700 border-slate-600 hover:border-slate-500' : 'text-slate-600 hover:bg-slate-50 border-slate-200 hover:border-slate-300'}`}
              onClick={handleLogout}
              title="Sign out"
            >
              <LogOut size={18} className="sm:mr-2" />
              <span className="hidden lg:inline">Sign out</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Dashboard Header */}
        <div className="mb-6 sm:mb-8">
          <h2 className={`text-xl sm:text-2xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Dashboard Overview</h2>
          <p className={darkMode ? 'text-slate-400 text-sm' : 'text-slate-600 text-sm'}>Manage your inventory and track product expiry dates</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4 sm:p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-xs sm:text-sm font-medium">Total Products</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">{products.length}</p>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <Boxes size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-emerald-500 to-green-500 p-4 sm:p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-emerald-100 text-xs sm:text-sm font-medium">Active Items</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {products.filter(p => new Date(p.expiryDate) > new Date()).length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <Plus size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 sm:p-6 rounded-xl text-white shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-xs sm:text-sm font-medium">Expiring Soon</p>
                <p className="text-2xl sm:text-3xl font-bold mt-1">
                  {products.filter(p => {
                    const expiry = new Date(p.expiryDate);
                    const now = new Date();
                    const diffDays = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24));
                    return diffDays >= 0 && diffDays <= 7;
                  }).length}
                </p>
              </div>
              <div className="bg-white/20 p-2 sm:p-3 rounded-lg">
                <RefreshCw size={20} className="sm:w-6 sm:h-6" />
              </div>
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className={`rounded-xl shadow-sm border p-4 sm:p-6 mb-6 sm:mb-8 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col gap-4">
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                <Search className={`h-4 w-4 sm:h-5 sm:w-5 transition-colors ${darkMode ? 'text-slate-500 group-focus-within:text-cyan-400' : 'text-slate-400 group-focus-within:text-blue-500'}`} />
              </div>
              <input
                type="text"
                placeholder="Search products by name, batch, or category..."
                className={`block w-full pl-10 pr-4 py-2 sm:py-3 border rounded-lg leading-5 placeholder-slate-400 focus:outline-none focus:ring-2 text-sm shadow-sm transition-all ${darkMode ? 'bg-slate-700 border-slate-600 text-slate-100 focus:ring-cyan-400 focus:border-cyan-400' : 'bg-white border-slate-200 text-slate-900 focus:ring-blue-400 focus:border-blue-400'}`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex flex-wrap gap-3 flex-shrink-0">
              <Button
                variant="outline"
                onClick={fetchData}
                title="Refresh Data"
                size="md"
                className={`flex-1 ${darkMode ? 'hover:bg-slate-700 border-slate-600 text-slate-300' : 'hover:bg-slate-50'}`}
              >
                <RefreshCw
                  size={18}
                  className={`mr-2 ${loading ? 'animate-spin' : ''} ${darkMode ? 'text-slate-300' : ''}`}
                />
                <span>Refresh</span>
              </Button>
              <Button
                variant="outline"
                onClick={handleGenerateReport}
                title="Generate PDF Report"
                size="md"
                disabled={actionLoading || products.length === 0}
                className={`flex-1 whitespace-nowrap ${darkMode ? 'hover:bg-slate-700 border-slate-600 text-slate-300' : 'hover:bg-slate-50'}`}
              >
                <FileText size={18} className={`mr-2 ${darkMode ? 'text-slate-300' : ''}`} />
                <span>Report</span>
              </Button>
              <Button
                size="md"
                onClick={handleAddClick}
                className="flex-1 whitespace-nowrap shadow-sm"
              >
                <Plus size={18} className="mr-2" />
                <span>Add Product</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className={`rounded-xl shadow-sm border p-8 sm:p-12 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col items-center justify-center">
              <div className="relative">
                <div className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 animate-spin ${darkMode ? 'border-slate-700 border-t-cyan-500' : 'border-slate-200 border-t-blue-500'}`}></div>
                <div className={`absolute inset-0 rounded-full border-4 border-t-transparent animate-spin ${darkMode ? 'border-cyan-900' : 'border-blue-100'}`} style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
              </div>
              <h3 className={`text-lg font-semibold mt-4 sm:mt-6 mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>Loading Your Inventory</h3>
              <p className={`text-center text-sm sm:text-base animate-pulse ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                Fetching your products and expiry information...
              </p>
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className={`rounded-xl shadow-sm border p-6 sm:p-12 ${darkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
            <div className="flex flex-col items-center justify-center text-center">
              <div className={`p-4 sm:p-6 rounded-full mb-4 sm:mb-6 ${darkMode ? 'bg-gradient-to-br from-slate-700 to-slate-600' : 'bg-gradient-to-br from-slate-100 to-slate-200'}`}>
                <Search className={`h-8 w-8 sm:h-12 sm:w-12 ${darkMode ? 'text-slate-500' : 'text-slate-400'}`} />
              </div>
              <h3 className={`text-lg sm:text-xl font-semibold mb-2 ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                {searchQuery ? 'No products found' : 'No products yet'}
              </h3>
              <p className={`text-sm sm:text-base text-center mb-6 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
                {searchQuery
                  ? 'We couldn\'t find any products matching your search criteria. Try adjusting your search terms.'
                  : 'Get started by adding your first product to the inventory. Track expiry dates and manage your stock efficiently.'
                }
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                {searchQuery && (
                  <Button
                    variant="outline"
                    onClick={() => setSearchQuery('')}
                  >
                    Clear Search
                  </Button>
                )}
                <Button
                  onClick={handleAddClick}
                  className="shadow-sm"
                >
                  <Plus size={18} className="mr-2" />
                  Add Your First Product
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-slate-900'}`}>
                Your Products ({filteredProducts.length})
              </h3>
              <div className={`text-sm ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>
                {searchQuery && `Showing results for "${searchQuery}"`}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="animate-in fade-in slide-in-from-bottom-4"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <ProductCard
                    product={product}
                    onClick={handleProductClick}
                    darkMode={darkMode}
                  />
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Detail Slide-over */}
      <Sheet
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        title="Product Details"
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

      {/* Edit Dialog */}
      <Dialog
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        description="Make changes to the product inventory details below."
        darkMode={darkMode}
      >
        {selectedProduct && (
          <ProductForm
            initialData={selectedProduct}
            onSave={handleUpdateProduct}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={actionLoading}
            darkMode={darkMode}
          />
        )}
      </Dialog>
      
      {/* Add Dialog */}
      <Dialog
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        description="Enter the details for the new product to add to inventory."
        darkMode={darkMode}
      >
        <ProductForm
          onSave={handleCreateProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={actionLoading}
          darkMode={darkMode}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
        darkMode={darkMode}
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button
            variant="secondary"
            onClick={() => setIsDeleteModalOpen(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={handleConfirmDelete}
            isLoading={actionLoading}
          >
            Delete Product
          </Button>
        </div>
      </Dialog>

      {/* Profile Page */}
      {showProfile && (
        <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="max-h-[90vh] overflow-y-auto">
            <Profile
              onClose={closeProfile}
              onProfileUpdate={handleProfileUpdate}
              darkMode={darkMode}
            />
          </div>
        </div>
      )}

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div
            className={`flex items-center px-4 py-3 rounded-lg shadow-lg border ${
              toast.type === 'success'
                ? 'bg-white border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-white border-red-200 text-red-800'
                : 'bg-white border-blue-200 text-blue-800'
            }`}
          >
            <div
              className={`mr-3 rounded-full p-1 ${
                toast.type === 'success'
                  ? 'bg-emerald-100'
                  : toast.type === 'error'
                  ? 'bg-red-100'
                  : 'bg-blue-100'
              }`}
            >
              {toast.type === 'success' ? (
                <div className="h-2 w-2 rounded-full bg-emerald-500" />
              ) : toast.type === 'error' ? (
                <div className="h-2 w-2 rounded-full bg-red-500" />
              ) : (
                <div className="h-2 w-2 rounded-full bg-blue-500" />
              )}
            </div>
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
