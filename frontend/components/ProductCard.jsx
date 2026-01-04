import React from 'react';
import Badge from './ui/Badge';
import { Package, Calendar } from 'lucide-react';

const ProductCard = ({ product, onClick }) => {
  const getExpiryStatus = (dateString) => {
    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', variant: 'destructive', days: diffDays };
    if (diffDays <= 30) return { label: 'Expiring Soon', variant: 'warning', days: diffDays };
    return { label: 'Good', variant: 'success', days: diffDays };
  };

  const status = getExpiryStatus(product.expiryDate);

  return (
    <div 
      onClick={() => onClick(product)}
      className="group relative bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden hover:-translate-y-1 flex flex-col h-full"
    >
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-400 to-cyan-300 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left z-10"></div>

      {product.imageUrl && (
        <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
          <img 
            src={product.imageUrl} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      )}

      {product.image && (
        <div className="relative w-full h-40 bg-slate-100 overflow-hidden">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent"></div>
        </div>
      )}

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-3">
          <Badge variant="secondary" className="font-medium text-xs tracking-wide uppercase text-slate-600 bg-slate-100">
            {product.category}
          </Badge>
          {status.variant !== 'success' && (
             <Badge variant={status.variant} className="animate-pulse">
               {status.label}
             </Badge>
          )}
        </div>

        <h3 className="font-bold text-lg text-slate-900 mb-1 group-hover:text-blue-700 transition-colors">
          {product.name}
        </h3>
        <p className="text-sm text-slate-500 mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
          <div className="flex items-center text-slate-600 text-sm">
            <Package size={16} className="mr-2 text-blue-500" />
            <span className="font-semibold mr-1">{product.quantity}</span> {product.unit}
          </div>
          <div className="flex items-center text-slate-500 text-xs">
            <Calendar size={14} className={`mr-1.5 ${status.variant === 'destructive' ? 'text-red-500' : 'text-slate-400'}`} />
            <span className={`${status.variant === 'destructive' ? 'text-red-600 font-medium' : ''}`}>
               {new Date(product.expiryDate).toLocaleDateString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;