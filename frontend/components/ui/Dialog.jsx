import React, { useEffect } from 'react';
import { X } from 'lucide-react';

const Dialog = ({ isOpen, onClose, children, title, description, darkMode }) => {
  const isDarkMode = darkMode !== undefined ? darkMode : document.documentElement.classList.contains('dark');
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl shadow-2xl border transform transition-all animate-in zoom-in-95 duration-200 flex flex-col ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-100'}`}>
        {/* Header */}
        <div className={`sticky top-0 p-6 border-b rounded-t-xl ${isDarkMode ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex flex-col space-y-1.5 text-center sm:text-left">
            <div className="flex items-center justify-between">
              {title && <h2 className={`text-lg font-semibold leading-none tracking-tight ${isDarkMode ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h2>}
              <button 
                onClick={onClose}
                className={`ml-auto rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none ${isDarkMode ? 'ring-offset-slate-800 focus:ring-slate-500 text-slate-400' : 'ring-offset-white focus:ring-slate-400'}`}
              >
                <X size={18} />
                <span className="sr-only">Close</span>
              </button>
            </div>
            {description && <p className={`text-sm ${isDarkMode ? 'text-slate-400' : 'text-slate-500'}`}>{description}</p>}
          </div>
        </div>
        {/* Content Area with Scroll */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;