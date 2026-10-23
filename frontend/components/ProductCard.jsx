import React from 'react';
import Badge from './ui/Badge';
import {
  Calendar,
  ChevronRight,
  Edit2,
  Package2,
  Trash2
} from 'lucide-react';

const ProductCard = ({ product, onClick, onEdit, onDelete, isOnline, darkMode = false }) => {
  const [isEditing, setIsEditing] = React.useState(false);

  const getExpiryStatus = (dateString) => {
    if (!dateString) return { label: 'No Date', variant: 'secondary', days: null, tone: 'neutral' };

    const today = new Date();
    const expiry = new Date(dateString);
    const diffTime = expiry.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return { label: 'Expired', variant: 'destructive', days: diffDays, tone: 'critical' };
    if (diffDays <= 7) return { label: 'Critical', variant: 'destructive', days: diffDays, tone: 'critical' };
    if (diffDays <= 30) return { label: 'Expiring Soon', variant: 'warning', days: diffDays, tone: 'warning' };
    return { label: 'Healthy', variant: 'success', days: diffDays, tone: 'good' };
  };

  const status = getExpiryStatus(product.expiryDate);
  const expiryDate = product.expiryDate ? new Date(product.expiryDate) : null;

  const handleCardClick = () => {
    if (onClick && !isEditing) onClick(product);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    onEdit();
    setTimeout(() => setIsEditing(false), 300);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    setIsEditing(true);
    onDelete();
    setTimeout(() => setIsEditing(false), 300);
  };

  const imageSrc = product.imageUrl || product.image;

  return (
    <div
      onClick={handleCardClick}
      className={`group relative flex h-full cursor-pointer flex-col overflow-hidden rounded-xl border transition-all duration-150 ${
        darkMode
          ? 'bg-[#141414] border-[#262626] hover:border-[#383838]'
          : 'bg-white border-[#E4E4E0] hover:border-[#CFCFC8] shadow-[0_1px_2px_rgba(0,0,0,0.03)]'
      }`}
    >
      <div className="p-4 flex-1 flex flex-col">
        {/* Product Thumbnail Container */}
        <div
          className={`relative aspect-[4/3] overflow-hidden rounded-lg border ${
            darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
          }`}
        >
          {imageSrc ? (
            <img
              src={imageSrc}
              alt={product.name}
              width="400"
              height="300"
              className="h-full w-full object-contain p-3 transition-transform duration-300 group-hover:scale-[1.02]"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package2 size={44} className={darkMode ? 'text-[#383838]' : 'text-[#CFCFC8]'} />
            </div>
          )}

          {/* Top Left Status Pill */}
          <div className="absolute left-2.5 top-2.5 flex items-center gap-1.5">
            <Badge variant={status.variant} darkMode={darkMode}>
              <span>{status.label}</span>
              {status.days !== null && status.days > 0 && status.days <= 30 && (
                <span className="opacity-80">· {status.days}d</span>
              )}
            </Badge>
            {!isOnline && (
              <Badge variant="secondary" darkMode={darkMode}>
                Offline
              </Badge>
            )}
          </div>

          {/* Top Right Quick Actions */}
          <div className="absolute right-2.5 top-2.5 flex gap-1.5">
            <button
              onClick={handleEdit}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                darkMode
                  ? 'border-[#262626] bg-[#141414]/95 text-[#F5F5F3] hover:bg-[#222222]'
                  : 'border-[#E4E4E0] bg-white/95 text-[#111111] hover:bg-[#F3F2EE]'
              }`}
              aria-label="Edit product"
              disabled={isEditing}
            >
              <Edit2 size={13} />
            </button>
            <button
              onClick={handleDelete}
              className={`flex h-8 w-8 items-center justify-center rounded-md border transition-colors cursor-pointer ${
                darkMode
                  ? 'border-[#5E1A1A] bg-[#2A1212]/95 text-[#F87171] hover:bg-[#3B1818]'
                  : 'border-[#FECACA] bg-[#FEF2F2]/95 text-[#B91C1C] hover:bg-[#FEE2E2]'
              }`}
              aria-label="Delete product"
              disabled={isEditing}
            >
              <Trash2 size={13} />
            </button>
          </div>
        </div>

        {/* Metadata & Title */}
        <div className="mt-3.5 flex-1 flex flex-col justify-between space-y-3">
          <div>
            <div className="flex items-center justify-between gap-2 text-[11px] font-mono">
              <span className={darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}>
                {product.category || 'Uncategorized'}
              </span>
              {product.batchNumber && (
                <span
                  className={`px-1.5 py-0.5 rounded border ${
                    darkMode
                      ? 'border-[#262626] bg-[#1A1A1A] text-[#F5F5F3]'
                      : 'border-[#E4E4E0] bg-[#F3F2EE] text-[#111111]'
                  }`}
                >
                  {product.batchNumber}
                </span>
              )}
            </div>

            <h3 className="mt-1.5 line-clamp-2 text-base font-bold leading-snug">
              {product.name}
            </h3>

            {product.description && (
              <p
                className={`mt-1 line-clamp-2 text-xs leading-relaxed ${
                  darkMode ? 'text-[#A3A39E]' : 'text-[#4A4A46]'
                }`}
              >
                {product.description}
              </p>
            )}
          </div>

          {/* Stock & Expiry Row */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <div
              className={`rounded-lg border p-2.5 ${
                darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
              }`}
            >
              <div className={`text-[10px] font-mono uppercase ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
                Quantity
              </div>
              <div className="mt-0.5 flex items-baseline gap-1">
                <span className="tabular-data text-base font-bold">
                  {product.quantity || 0}
                </span>
                <span className={`text-xs ${darkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
                  {product.unit || 'units'}
                </span>
              </div>
            </div>

            <div
              className={`rounded-lg border p-2.5 ${
                darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
              }`}
            >
              <div className={`text-[10px] font-mono uppercase ${darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}`}>
                Expires
              </div>
              <div className="mt-0.5 tabular-data text-xs font-semibold truncate flex items-center gap-1">
                <Calendar size={11} className="shrink-0 opacity-70" />
                <span>
                  {expiryDate
                    ? expiryDate.toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })
                    : 'Not set'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Card Footer */}
      <div
        className={`flex items-center justify-between border-t px-4 py-2.5 text-xs ${
          darkMode ? 'border-[#262626] bg-[#0A0A0A]' : 'border-[#E4E4E0] bg-[#FAF9F6]'
        }`}
      >
        <span className={darkMode ? 'text-[#6E6E68]' : 'text-[#767670]'}>
          Inspect record
        </span>
        <span className="inline-flex items-center gap-1 font-semibold text-[#15803D] dark:text-[#4ADE80]">
          Details
          <ChevronRight size={13} />
        </span>
      </div>
    </div>
  );
};

export default ProductCard;
