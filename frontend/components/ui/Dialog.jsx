import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { trapFocus } from '../../utils/keyboardNavigation';

const Dialog = ({ isOpen, onClose, children, title, description, darkMode }) => {
  const isDarkMode = darkMode !== undefined ? darkMode : (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));
  const dialogRef = useRef(null);
  
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      
      if (dialogRef.current) {
        dialogRef.current.focus({ preventScroll: true });
      }
      
      const cleanupTrapFocus = trapFocus(dialogRef.current);
      
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      document.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = 'unset';
        cleanupTrapFocus();
        document.removeEventListener('keydown', handleEsc);
      };
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen, onClose]);

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity"
        aria-hidden="true"
      />
      
      {/* Modal Content */}
      <div 
        ref={dialogRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? undefined : 'dialog-title'}
        aria-describedby={description ? undefined : 'dialog-description'}
        className={`relative w-full max-w-2xl max-h-[90vh] rounded-xl shadow-xl border transform transition-all flex flex-col ${
          isDarkMode ? 'bg-[#141414] border-[#262626] text-[#F5F5F3]' : 'bg-white border-[#E4E4E0] text-[#111111]'
        }`}
      >
        {/* Header */}
        <div className={`sticky top-0 px-6 py-4 border-b rounded-t-xl ${
          isDarkMode ? 'bg-[#141414] border-[#262626]' : 'bg-white border-[#E4E4E0]'
        }`}>
          <div className="flex flex-col space-y-1 text-left">
            <div className="flex items-center justify-between">
              {title && (
                <h2 id="dialog-title" className={`text-base font-bold leading-none tracking-tight ${isDarkMode ? 'text-[#F5F5F3]' : 'text-[#111111]'}`}>
                  {title}
                </h2>
              )}
              <button 
                onClick={onClose}
                className={`ml-auto rounded-md p-1.5 border transition-colors ${
                  isDarkMode ? 'border-[#262626] text-[#A3A39E] hover:bg-[#1A1A1A]' : 'border-[#E4E4E0] text-[#4A4A46] hover:bg-[#F3F2EE]'
                }`}
                aria-label="Close dialog"
              >
                <X size={16} />
                <span className="sr-only">Close</span>
              </button>
            </div>
            {description && (
              <p id="dialog-description" className={`text-xs ${isDarkMode ? 'text-[#A3A39E]' : 'text-[#767670]'}`}>
                {description}
              </p>
            )}
          </div>
        </div>
        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Dialog;
