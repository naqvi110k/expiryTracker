import React, { useState } from 'react';
import Button from './ui/Button';
import { Package, Hash, Layers, AlertTriangle, CheckCircle, XCircle, Trash2, Edit, MessageCircle } from 'lucide-react';
import { sendExpiryAlert } from '../services/productService';

const ProductDetails = ({ product, onEdit, onDelete, onAlertSent, darkMode = false }) => {
  const [alertLoading, setAlertLoading] = useState(false);
  const [alertSent, setAlertSent] = useState(false);
  
  const handleSendAlert = async () => {
    setAlertLoading(true);
    try {
      const response = await sendExpiryAlert(product.id);
      setAlertSent(true);
      if (onAlertSent) {
        onAlertSent(`✓ Alert sent successfully to WhatsApp!\n${product.name} - ${response.status || 'Expiry alert sent'}`, 'success');
      }
      // Reset success state after 3 seconds
      setTimeout(() => setAlertSent(false), 3000);
    } catch (error) {
      if (onAlertSent) {
        onAlertSent(`✗ Failed to send alert: ${error.message}`, 'error');
      }
    } finally {
      setAlertLoading(false);
    }
  };

  const getStatusDetails = (dateString) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { 
      label: 'Expired', 
      color: darkMode ? 'text-red-400 bg-red-900/30 border-red-700' : 'text-red-700 bg-red-50 border-red-200', 
      icon: <XCircle className={`w-5 h-5 ${darkMode ? 'text-red-400' : 'text-red-600'}`} />,
      msg: `Expired ${Math.abs(diffDays)} days ago`
    };
    if (diffDays <= 30) return { 
      label: 'Expiring Soon', 
      color: darkMode ? 'text-amber-400 bg-amber-900/30 border-amber-700' : 'text-amber-700 bg-amber-50 border-amber-200', 
      icon: <AlertTriangle className={`w-5 h-5 ${darkMode ? 'text-amber-400' : 'text-amber-600'}`} />,
      msg: `Expires in ${diffDays} days`
    };
    return { 
      label: 'Valid', 
      color: darkMode ? 'text-emerald-400 bg-emerald-900/30 border-emerald-700' : 'text-emerald-700 bg-emerald-50 border-emerald-200', 
      icon: <CheckCircle className={`w-5 h-5 ${darkMode ? 'text-emerald-400' : 'text-emerald-600'}`} />,
      msg: `Valid for ${diffDays} days`
    };
  };

  const status = getStatusDetails(product.expiryDate);

  return (
    <div className="flex flex-col h-full">
      <div className={`flex-1 overflow-y-auto ${darkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
        {product.imageUrl && (
          <div className={`mb-6 rounded-lg overflow-hidden border shadow-sm ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <img src={product.imageUrl} alt={product.name} className="w-full h-auto object-cover max-h-64" />
          </div>
        )}

        {product.image && (
          <div className={`mb-6 rounded-lg overflow-hidden border shadow-sm ${darkMode ? 'border-slate-700' : 'border-slate-200'}`}>
            <img src={product.image} alt={product.name} className="w-full h-auto object-cover max-h-64" />
          </div>
        )}

        <div className="space-y-6">
          {/* Status Banner */}
          <div className={`p-4 rounded-lg border flex items-start space-x-3 ${status.color}`}>
            <div className="mt-0.5">{status.icon}</div>
            <div>
              <h4 className={`font-semibold text-sm uppercase tracking-wide opacity-90 ${darkMode ? 'text-current' : ''}`}>{status.label}</h4>
              <p className={`text-sm mt-1 opacity-90 ${darkMode ? 'text-current' : ''}`}>{status.msg} ({new Date(product.expiryDate).toLocaleDateString()})</p>
            </div>
          </div>

          {/* Basic Info */}
          <div>
            <h3 className={`text-sm font-medium uppercase tracking-wider mb-3 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Product Information</h3>
            <div className="space-y-4">
              <div className="grid grid-cols-1 gap-4">
                 <div className={`p-3 rounded-md border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-xs block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Product Name</span>
                    <span className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{product.name}</span>
                 </div>
                 
                 <div className="grid grid-cols-2 gap-4">
                   <div className={`p-3 rounded-md border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`text-xs block mb-1 flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Layers size={12}/> Category</span>
                      <span className={`font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{product.category}</span>
                   </div>
                   <div className={`p-3 rounded-md border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                      <span className={`text-xs block mb-1 flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Hash size={12}/> Batch No.</span>
                      <span className={`font-mono text-sm font-medium ${darkMode ? 'text-slate-100' : 'text-slate-900'}`}>{product.batchNumber}</span>
                   </div>
                 </div>

                 <div className={`p-3 rounded-md border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-xs block mb-1 flex items-center gap-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}><Package size={12}/> Stock Level</span>
                    <div className="flex items-baseline">
                      <span className="text-2xl font-bold text-blue-600 mr-2">{product.quantity}</span>
                      <span className={darkMode ? 'text-slate-300' : 'text-slate-600'}>{product.unit}</span>
                    </div>
                 </div>

                 <div className={`p-3 rounded-md border ${darkMode ? 'bg-slate-700 border-slate-600' : 'bg-slate-50 border-slate-100'}`}>
                    <span className={`text-xs block mb-1 ${darkMode ? 'text-slate-400' : 'text-slate-500'}`}>Description</span>
                    <p className={`text-sm leading-relaxed ${darkMode ? 'text-slate-300' : 'text-slate-700'}`}>{product.description}</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actions Footer */}
      <div className={`pt-6 border-t mt-4 grid grid-cols-2 gap-3 ${darkMode ? 'border-slate-700 bg-slate-800' : 'border-slate-100 bg-white'}`}>
        <Button 
          variant="outline" 
          onClick={handleSendAlert}
          isLoading={alertLoading}
          disabled={alertSent}
          className={`w-full flex items-center justify-center gap-2 ${
            alertSent 
              ? '!border-emerald-300 !bg-emerald-50 !text-emerald-600' 
              : '!border-green-300 hover:!bg-green-50 hover:!border-green-400 !text-green-600'
          }`}
        >
          {alertSent ? (
            <>
              <CheckCircle size={16} /> Sent
            </>
          ) : (
            <>
              <MessageCircle size={16} /> Send Alert
            </>
          )}
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onEdit(product)}
          className="w-full flex items-center justify-center gap-2"
        >
          <Edit size={16} /> Edit
        </Button>
        <Button 
          variant="outline" 
          onClick={() => onDelete(product)}
          className="w-full flex items-center justify-center gap-2 !text-red-600 !border-red-300 hover:!bg-red-50 hover:!border-red-400"
        >
          <Trash2 size={16} /> Delete
        </Button>
      </div>
    </div>
  );
};

export default ProductDetails;
