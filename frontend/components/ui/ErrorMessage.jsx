import React from 'react';
import { AlertCircle, Info, XCircle, CheckCircle } from 'lucide-react';

const ErrorMessage = ({ 
  message, 
  type = 'error', 
  title = null, 
  onDismiss = null, 
  actionButton = null,
  className = '' 
}) => {
  const icons = {
    error: <XCircle className="w-5 h-5 flex-shrink-0" />,
    warning: <AlertCircle className="w-5 h-5 flex-shrink-0" />,
    info: <Info className="w-5 h-5 flex-shrink-0" />,
    success: <CheckCircle className="w-5 h-5 flex-shrink-0" />
  };

  const icon = icons[type];

  const bgColors = {
    error: 'bg-[#FEE2E2] dark:bg-[#450A0A] border-[#FCA5A5] dark:border-[#991B1B] text-[#991B1B] dark:text-[#F87171]',
    warning: 'bg-[#FEF3C7] dark:bg-[#451A03] border-[#FCD34D] dark:border-[#92400E] text-[#92400E] dark:text-[#FBBF24]',
    info: 'bg-[#F2F1ED] dark:bg-[#1C1C1C] border-[#E4E4E0] dark:border-[#262626] text-[#111111] dark:text-[#F5F5F2]',
    success: 'bg-[#DCFCE7] dark:bg-[#052E16] border-[#86EFAC] dark:border-[#166534] text-[#166534] dark:text-[#4ADE80]'
  };

  return (
    <div 
      className={`border rounded-md p-4 mb-4 ${bgColors[type]} ${className}`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="mr-3 mt-0.5 text-current">
          {icon}
        </div>
        <div className="flex-1">
          {title && (
            <h4 className="font-semibold text-sm mb-1">{title}</h4>
          )}
          <p className="text-sm">{message}</p>
        </div>
        {onDismiss && (
          <button
            type="button"
            onClick={onDismiss}
            className="ml-4 text-current hover:opacity-70 transition-opacity"
            aria-label="Dismiss message"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      {actionButton && (
        <div className="mt-3 flex justify-end">
          {actionButton}
        </div>
      )}
    </div>
  );
};

export default ErrorMessage;
