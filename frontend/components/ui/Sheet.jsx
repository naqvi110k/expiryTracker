import React, { useEffect, useRef, useCallback } from 'react';
import { X } from 'lucide-react';
import { trapFocus } from '../../utils/keyboardNavigation';

const Sheet = ({ isOpen, onClose, children, title, darkMode = false, fullScreen = false }) => {
  const sheetRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';

      if (sheetRef.current) {
        sheetRef.current.focus({ preventScroll: true });
      }

      const cleanupTrapFocus = trapFocus(sheetRef.current);

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

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, onClose]);

  const isDarkMode = darkMode || (typeof document !== 'undefined' && document.documentElement.classList.contains('dark'));

  const handleBackdropClick = useCallback((e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end"
      onClick={handleBackdropClick}
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 transition-opacity duration-200"
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={sheetRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'sheet-title' : undefined}
        className={`relative h-full shadow-2xl transform transition-transform duration-200 ease-in-out border-l flex flex-col ${
          isDarkMode
            ? 'bg-[#141414] border-[#262626] text-[#F5F5F3]'
            : 'bg-[#FAF9F6] border-[#E4E4E0] text-[#111111]'
        } ${fullScreen ? 'w-full' : 'w-full sm:max-w-md'}`}
      >
        <div className={`flex items-center justify-between px-6 py-4 border-b ${
          isDarkMode ? 'border-[#262626] bg-[#141414]' : 'border-[#E4E4E0] bg-white'
        }`}>
          {title && (
            <h2 id="sheet-title" className={`text-base font-bold tracking-tight ${isDarkMode ? 'text-[#F5F5F3]' : 'text-[#111111]'}`}>
              {title}
            </h2>
          )}
          <button
            onClick={onClose}
            className={`rounded-md p-1.5 border transition-colors ${
              isDarkMode
                ? 'border-[#262626] text-[#A3A39E] hover:bg-[#1A1A1A] hover:text-white'
                : 'border-[#E4E4E0] text-[#4A4A46] hover:bg-[#F3F2EE] hover:text-[#111111]'
            }`}
            aria-label="Close panel"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 hide-scrollbar">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Sheet;
