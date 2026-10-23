import React from 'react';

const LoadingSpinner = ({ size = 'md', variant = 'default', label = null, className = '' }) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
    xl: 'h-16 w-16'
  };

  const spinnerClasses = {
    default: 'animate-spin text-[#111111] dark:text-[#F5F5F2]',
    primary: 'animate-spin text-[#15803D] dark:text-[#4ADE80]',
    secondary: 'animate-spin text-[#52524E] dark:text-[#A1A19A]',
    success: 'animate-spin text-[#15803D] dark:text-[#4ADE80]',
    danger: 'animate-spin text-[#DC2626] dark:text-[#F87171]',
    warning: 'animate-spin text-[#D97706] dark:text-[#FBBF24]'
  };

  const spinnerClass = `${sizeClasses[size]} ${spinnerClasses[variant]} ${className}`;

  return (
    <div className="flex flex-col items-center justify-center">
      <svg 
        className={spinnerClass} 
        xmlns="http://www.w3.org/2000/svg" 
        fill="none" 
        viewBox="0 0 24 24"
        role="status"
        aria-label={label || "Loading"}
      >
        <circle 
          className="opacity-25" 
          cx="12" 
          cy="12" 
          r="10" 
          stroke="currentColor" 
          strokeWidth="4"
        ></circle>
        <path 
          className="opacity-75" 
          fill="currentColor" 
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        ></path>
      </svg>
      {label && (
        <span className="mt-2 text-sm text-[#52524E] dark:text-[#A1A19A]">
          {label}
        </span>
      )}
    </div>
  );
};

export default LoadingSpinner;
