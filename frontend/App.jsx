import React, { useEffect, useState, useMemo } from 'react';
import { getProducts, updateProduct, deleteProduct, createProduct } from './services/productService';
import ProductCard from './components/ProductCard';
import ProductDetails from './components/ProductDetails';
import ProductForm from './components/ProductForm';
import Sheet from './components/ui/Sheet';
import Dialog from './components/ui/Dialog';
import Button from './components/ui/Button';
import { Search, Plus, Boxes, RefreshCw } from 'lucide-react';

const App = () => {
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

  // Initial Data Fetch
  useEffect(() => {
    fetchData();
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
      // Normalize data to use 'id' field instead of '_id' from MongoDB
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

  const handleEditClick = (product) => {
    setIsEditModalOpen(true);
  };

  const handleDeleteClick = (product) => {
    setIsDeleteModalOpen(true);
  };
  
  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleCreateProduct = async (data) => {
    setActionLoading(true);
    try {
      const newProduct = await createProduct(data);
      // Normalize response
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
      // Normalize response
      const normalizedProduct = {
        ...updated,
        id: updated._id || updated.id
      };
      
      // Update local state
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
      
      // Update local state
      setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
      setSelectedProduct(null); // Close sheet
      setIsDeleteModalOpen(false); // Close dialog
      showToast('success', 'Product deleted successfully');
    } catch (error) {
      showToast('error', 'Failed to delete product');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pb-20">
      
      {/* Navbar */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2 min-w-0">
            <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-lg text-white flex-shrink-0">
              <Boxes size={24} />
            </div>
            <div className="min-w-0">
              <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 whitespace-nowrap">
                Inventa
              </h1>
              <p className="text-xs text-slate-500 font-medium whitespace-nowrap">Product Dashboard</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 flex-shrink-0 ml-4">
             <div className="bg-blue-50 px-3 py-1 rounded-full border border-blue-200 flex items-center whitespace-nowrap">
                <span className="text-xs font-semibold text-blue-700 uppercase tracking-wider mr-2">Total Items</span>
                <span className="text-lg font-bold text-blue-900">{products.length}</span>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-3 mb-8">
          <div className="relative flex-1 group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input
              type="text"
              placeholder="Search products, batches, categories..."
              className="block w-full pl-10 pr-3 py-2.5 border border-slate-200 rounded-lg leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 sm:text-sm shadow-sm transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          
          <div className="flex gap-3 flex-shrink-0">
             <Button variant="outline" onClick={fetchData} title="Refresh Data" size="md">
                <RefreshCw size={18} className={`${loading ? 'animate-spin' : ''}`} />
             </Button>
             <Button size="md" onClick={handleAddClick} className="whitespace-nowrap">
               <Plus size={18} className="mr-2" /> Add Product
             </Button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="relative">
              <div className="w-12 h-12 rounded-full border-4 border-slate-200 border-t-blue-500 animate-spin"></div>
            </div>
            <p className="mt-4 text-slate-500 font-medium animate-pulse">Loading inventory...</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredProducts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-200 border-dashed">
            <div className="bg-slate-50 p-4 rounded-full mb-4">
               <Search className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-medium text-slate-900">No products found</h3>
            <p className="text-slate-500 mt-1 max-w-sm text-center">
              We couldn't find any products matching your search criteria. Try adjusting your filters.
            </p>
            <Button variant="outline" className="mt-6" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Grid */}
        {!loading && filteredProducts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onClick={handleProductClick} 
              />
            ))}
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
          />
        )}
      </Sheet>

      {/* Edit Dialog */}
      <Dialog 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)}
        title="Edit Product"
        description="Make changes to the product inventory details below."
      >
        {selectedProduct && (
          <ProductForm 
            initialData={selectedProduct} 
            onSave={handleUpdateProduct}
            onCancel={() => setIsEditModalOpen(false)}
            isLoading={actionLoading}
          />
        )}
      </Dialog>
      
      {/* Add Dialog */}
      <Dialog 
        isOpen={isAddModalOpen} 
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Product"
        description="Enter the details for the new product to add to inventory."
      >
        <ProductForm 
          onSave={handleCreateProduct}
          onCancel={() => setIsAddModalOpen(false)}
          isLoading={actionLoading}
        />
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog 
        isOpen={isDeleteModalOpen} 
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete Product"
        description="Are you sure you want to delete this product? This action cannot be undone."
      >
        <div className="flex justify-end gap-3 mt-6">
          <Button variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
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

      {/* Toast Notifications */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' ? 'bg-white border-emerald-200 text-emerald-800' :
            toast.type === 'error' ? 'bg-white border-red-200 text-red-800' :
            'bg-white border-blue-200 text-blue-800'
          }`}>
             <div className={`mr-3 rounded-full p-1 ${
                toast.type === 'success' ? 'bg-emerald-100' :
                toast.type === 'error' ? 'bg-red-100' : 'bg-blue-100'
             }`}>
                {toast.type === 'success' ? <div className="h-2 w-2 rounded-full bg-emerald-500" /> :
                 toast.type === 'error' ? <div className="h-2 w-2 rounded-full bg-red-500" /> :
                 <div className="h-2 w-2 rounded-full bg-blue-500" />}
             </div>
             <p className="text-sm font-medium">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;