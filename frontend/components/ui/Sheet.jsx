import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Sheet = ({ isOpen, onClose, children, title, darkMode = false }) => {
  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  // Detect dark mode from document class
  const isDarkMode = darkMode || document.documentElement.classList.contains('dark');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity duration-300" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Panel */}
      <div className={`relative w-full max-w-md h-full shadow-2xl transform transition-transform duration-300 ease-in-out border-l flex flex-col animate-in slide-in-from-right duration-300 ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
        <div className={`flex items-center justify-between p-6 border-b ${isDarkMode ? 'border-slate-700' : 'border-slate-100'}`}>
          {title && <h2 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-slate-900'}`}>{title}</h2>}
          <button 
            onClick={onClose}
            className={`rounded-full p-2 transition-colors ${isDarkMode ? 'text-slate-400 hover:bg-slate-700 hover:text-slate-200' : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900'}`}
          >
            <X size={20} />
          </button>
        </div>
        
        <div className={`flex-1 overflow-y-auto p-6 ${isDarkMode ? 'scrollbar-dark' : 'scrollbar-light'}`}>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sheet;